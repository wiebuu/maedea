import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import Idea from '../models/Idea.js';
import Task from '../models/Task.js';
import Field from '../models/Field.js';
import OpenAI from 'openai';
import { logger } from '../config/logger.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { validateChatMessage, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Get chat messages for an idea
// @route   GET /api/chat/idea/:ideaId
// @access  Private
router.get('/idea/:ideaId', validateObjectId('ideaId'), catchAsync(async (req, res) => {
  const idea = await Idea.findById(req.params.ideaId);

  if (!idea) {
    return res.status(404).json({
      success: false,
      message: 'Idea not found',
    });
  }

  // Check if user has access to the idea
  if (!idea.hasAccess(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const limit = parseInt(req.query.limit) || 50;
  const messages = await ChatMessage.getConversationSummary(req.params.ideaId, limit);

  res.json({
    success: true,
    data: {
      messages,
    },
  });
}));

// @desc    Send message to AI
// @route   POST /api/chat/send
// @access  Private
router.post('/send', validateChatMessage, catchAsync(async (req, res) => {
  const { idea: ideaId, content, context } = req.body;

  // Check if user has access to the idea
  const idea = await Idea.findById(ideaId);
  if (!idea) {
    return res.status(404).json({
      success: false,
      message: 'Idea not found',
    });
  }

  if (!idea.hasEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  // Create user message
  const userMessage = await ChatMessage.create({
    idea: ideaId,
    user: req.user._id,
    type: 'user',
    content: content.trim(),
    context,
  });

  // Get recent conversation context
  const recentMessages = await ChatMessage.getConversationSummary(ideaId, 10);
  
  // Get idea context
  const fields = await Field.findByIdea(ideaId);
  const tasks = await Task.findByIdea(ideaId);

  // Prepare context for AI
  const aiContext = {
    idea: {
      title: idea.title,
      description: idea.description,
      type: idea.type,
      status: idea.status,
      progress: idea.progress,
    },
    fields: fields.map(field => ({
      id: field.fieldId,
      title: field.title,
      description: field.description,
      progress: field.progress,
      isCompleted: field.isCompleted,
    })),
    tasks: tasks.map(task => ({
      id: task.taskId,
      title: task.title,
      description: task.description,
      status: task.status,
      completed: task.completed,
      weight: task.weight,
      priority: task.priority,
    })),
    recentMessages: recentMessages.slice(-5).map(msg => ({
      type: msg.type,
      content: msg.content,
      timestamp: msg.createdAt,
    })),
  };

  // Generate AI response
  const startTime = Date.now();
  let aiResponse;
  let tokens = { prompt: 0, completion: 0, total: 0 };

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant helping users develop their ideas and projects. You have access to their idea details, fields, and tasks. 

Idea: ${aiContext.idea.title}
Description: ${aiContext.idea.description}
Type: ${aiContext.idea.type}
Status: ${aiContext.idea.status}
Progress: ${aiContext.idea.progress}%

Available Fields:
${aiContext.fields.map(f => `- ${f.title}: ${f.description} (${f.progress.percentage}% complete)`).join('\n')}

Available Tasks:
${aiContext.tasks.map(t => `- ${t.title}: ${t.description} (${t.status}, weight: ${t.weight})`).join('\n')}

Recent conversation:
${aiContext.recentMessages.map(m => `${m.type}: ${m.content}`).join('\n')}

Provide helpful, actionable advice. You can suggest new tasks, modify existing ones, or provide insights about their idea development. Be concise but comprehensive.`,
        },
        {
          role: 'user',
          content: content.trim(),
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    aiResponse = completion.choices[0].message.content;
    tokens = {
      prompt: completion.usage?.prompt_tokens || 0,
      completion: completion.usage?.completion_tokens || 0,
      total: completion.usage?.total_tokens || 0,
    };
  } catch (error) {
    logger.error('OpenAI API error:', error);
    aiResponse = "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }

  const processingTime = Date.now() - startTime;

  // Create AI message
  const aiMessage = await ChatMessage.create({
    idea: ideaId,
    user: req.user._id,
    type: 'ai',
    content: aiResponse,
    aiResponse: {
      model: 'gpt-4',
      tokens,
      processingTime,
      confidence: 0.8,
    },
    context,
  });

  // Analyze if AI response suggests actions
  const actions = analyzeAIResponse(aiResponse, aiContext);
  if (actions.length > 0) {
    aiMessage.actions = actions;
    await aiMessage.save();
  }

  logger.info(`AI chat message sent for idea ${idea.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Message sent successfully',
    data: {
      userMessage,
      aiMessage,
    },
  });
}));

// @desc    Execute AI action
// @route   POST /api/chat/execute-action/:messageId/:actionId
// @access  Private
router.post('/execute-action/:messageId/:actionId', validateObjectId('messageId'), catchAsync(async (req, res) => {
  const { messageId, actionId } = req.params;

  const message = await ChatMessage.findById(messageId);
  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found',
    });
  }

  // Check if user has access to the idea
  const idea = await Idea.findById(message.idea);
  if (!idea || !idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const action = message.actions.id(actionId);
  if (!action) {
    return res.status(404).json({
      success: false,
      message: 'Action not found',
    });
  }

  if (action.executed) {
    return res.status(400).json({
      success: false,
      message: 'Action already executed',
    });
  }

  // Execute the action
  let result;
  try {
    result = await executeAction(action, message.idea, req.user._id);
    await message.executeAction(actionId);
  } catch (error) {
    logger.error('Action execution error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to execute action',
    });
  }

  logger.info(`AI action executed: ${action.type} for idea ${idea.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Action executed successfully',
    data: {
      action,
      result,
    },
  });
}));

// @desc    Get AI usage statistics
// @route   GET /api/chat/usage-stats
// @access  Private
router.get('/usage-stats', catchAsync(async (req, res) => {
  const timeRange = parseInt(req.query.days) || 30;
  const stats = await ChatMessage.getAIUsageStats(req.user._id, timeRange);

  res.json({
    success: true,
    data: {
      stats: stats[0] || {
        totalMessages: 0,
        totalTokens: 0,
        averageResponseTime: 0,
        totalProcessingTime: 0,
      },
      timeRange,
    },
  });
}));

// Helper function to analyze AI response for actions
function analyzeAIResponse(response, context) {
  const actions = [];
  const lowerResponse = response.toLowerCase();

  // Check for task-related suggestions
  if (lowerResponse.includes('add task') || lowerResponse.includes('create task') || lowerResponse.includes('new task')) {
    actions.push({
      type: 'add-task',
      details: {
        suggested: true,
        source: 'ai-response',
      },
    });
  }

  if (lowerResponse.includes('update task') || lowerResponse.includes('modify task')) {
    actions.push({
      type: 'update-task',
      details: {
        suggested: true,
        source: 'ai-response',
      },
    });
  }

  if (lowerResponse.includes('delete task') || lowerResponse.includes('remove task')) {
    actions.push({
      type: 'delete-task',
      details: {
        suggested: true,
        source: 'ai-response',
      },
    });
  }

  // Check for field-related suggestions
  if (lowerResponse.includes('add field') || lowerResponse.includes('new field')) {
    actions.push({
      type: 'add-field',
      details: {
        suggested: true,
        source: 'ai-response',
      },
    });
  }

  if (lowerResponse.includes('update field') || lowerResponse.includes('modify field')) {
    actions.push({
      type: 'update-field',
      details: {
        suggested: true,
        source: 'ai-response',
      },
    });
  }

  return actions;
}

// Helper function to execute AI actions
async function executeAction(action, ideaId, userId) {
  switch (action.type) {
    case 'add-task':
      // This would typically create a new task based on AI suggestions
      // For now, we'll just return a success response
      return { message: 'Task creation suggested' };

    case 'update-task':
      return { message: 'Task update suggested' };

    case 'delete-task':
      return { message: 'Task deletion suggested' };

    case 'add-field':
      return { message: 'Field creation suggested' };

    case 'update-field':
      return { message: 'Field update suggested' };

    case 'analyze':
      return { message: 'Analysis completed' };

    case 'suggest':
      return { message: 'Suggestions provided' };

    default:
      throw new Error('Unknown action type');
  }
}

export default router;