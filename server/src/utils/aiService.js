import OpenAI from 'openai';
import { logger } from '../config/logger.js';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate idea analysis
export const analyzeIdea = async (ideaData) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert business analyst and startup advisor. Analyze the provided idea and give structured feedback on:

1. Problem Validation (1-10 score)
2. Market Analysis (1-10 score) 
3. Feasibility Assessment (1-10 score)

Provide specific, actionable feedback and suggestions for each area.`,
        },
        {
          role: 'user',
          content: `Analyze this idea:

Title: ${ideaData.title}
Description: ${ideaData.description}
Type: ${ideaData.type}
Tags: ${ideaData.tags?.join(', ') || 'None'}

Please provide:
1. Problem validation score and feedback
2. Market analysis score and feedback  
3. Feasibility score and feedback
4. Top 3 actionable suggestions
5. Potential risks and mitigations`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const analysis = completion.choices[0].message.content;
    
    // Parse the response to extract structured data
    const insights = parseAnalysisResponse(analysis);
    
    return {
      success: true,
      insights,
      rawAnalysis: analysis,
      tokens: completion.usage?.total_tokens || 0,
    };
  } catch (error) {
    logger.error('AI idea analysis error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate field suggestions
export const generateFieldSuggestions = async (ideaType, ideaDescription) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert project management consultant. Generate relevant fields/sections for different types of ideas and projects. Each field should have:
- A clear title
- A description of what it covers
- AI-generated insights about why it's important
- Suggested tasks (3-5 tasks per field)

Focus on practical, actionable fields that help users structure their work.`,
        },
        {
          role: 'user',
          content: `Generate fields for a ${ideaType} idea:

Description: ${ideaDescription}

Provide 6-8 relevant fields with titles, descriptions, AI insights, and suggested tasks.`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const suggestions = completion.choices[0].message.content;
    const parsedFields = parseFieldSuggestions(suggestions);
    
    return {
      success: true,
      fields: parsedFields,
      rawSuggestions: suggestions,
      tokens: completion.usage?.total_tokens || 0,
    };
  } catch (error) {
    logger.error('AI field suggestions error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate task suggestions
export const generateTaskSuggestions = async (fieldTitle, fieldDescription, ideaContext) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a productivity expert. Generate specific, actionable tasks for project fields. Each task should have:
- A clear, actionable title
- A detailed description
- A weight/priority (1-10, where 10 is most important)
- A category (research, planning, development, testing, deployment, marketing, other)

Make tasks specific and measurable.`,
        },
        {
          role: 'user',
          content: `Generate 5-7 tasks for this field:

Field: ${fieldTitle}
Description: ${fieldDescription}

Idea Context:
Title: ${ideaContext.title}
Type: ${ideaContext.type}
Description: ${ideaContext.description}

Provide specific, actionable tasks with weights and categories.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const suggestions = completion.choices[0].message.content;
    const parsedTasks = parseTaskSuggestions(suggestions);
    
    return {
      success: true,
      tasks: parsedTasks,
      rawSuggestions: suggestions,
      tokens: completion.usage?.total_tokens || 0,
    };
  } catch (error) {
    logger.error('AI task suggestions error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate personal development suggestions
export const generatePersonalDevelopmentSuggestions = async (currentMetrics, goals) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a personal development coach. Analyze personal metrics and provide specific, actionable suggestions for improvement. Focus on:

1. Skills development
2. Knowledge building
3. Experience gaining
4. Health optimization
5. Discipline building
6. Network expansion

Provide concrete, measurable actions.`,
        },
        {
          role: 'user',
          content: `Analyze these personal development metrics and provide suggestions:

Current Metrics:
${Object.entries(currentMetrics).map(([key, value]) => `${key}: ${value}`).join('\n')}

Goals: ${goals || 'General personal development and growth'}

Provide specific suggestions for improvement in each area.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const suggestions = completion.choices[0].message.content;
    
    return {
      success: true,
      suggestions,
      tokens: completion.usage?.total_tokens || 0,
    };
  } catch (error) {
    logger.error('AI personal development suggestions error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate chat response
export const generateChatResponse = async (message, context) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant helping users develop their ideas and projects. You have access to their idea details, fields, and tasks. Provide helpful, actionable advice. You can suggest new tasks, modify existing ones, or provide insights about their idea development. Be concise but comprehensive.`,
        },
        {
          role: 'user',
          content: `Context:
${JSON.stringify(context, null, 2)}

User message: ${message}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    
    return {
      success: true,
      response,
      tokens: completion.usage?.total_tokens || 0,
    };
  } catch (error) {
    logger.error('AI chat response error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Helper function to parse analysis response
function parseAnalysisResponse(response) {
  const insights = {
    problemValidation: { score: 7, feedback: '', suggestions: [] },
    marketAnalysis: { score: 7, feedback: '', suggestions: [] },
    feasibility: { score: 7, feedback: '', suggestions: [] },
    overallSuggestions: [],
    risks: [],
  };

  // Simple parsing - in production, you'd want more sophisticated parsing
  const lines = response.split('\n');
  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.toLowerCase().includes('problem validation')) {
      currentSection = 'problemValidation';
    } else if (trimmed.toLowerCase().includes('market analysis')) {
      currentSection = 'marketAnalysis';
    } else if (trimmed.toLowerCase().includes('feasibility')) {
      currentSection = 'feasibility';
    } else if (trimmed.toLowerCase().includes('suggestion')) {
      currentSection = 'suggestions';
    } else if (trimmed.toLowerCase().includes('risk')) {
      currentSection = 'risks';
    }

    // Extract scores
    const scoreMatch = trimmed.match(/(\d+)\/10|score[:\s]*(\d+)/i);
    if (scoreMatch && currentSection !== 'suggestions' && currentSection !== 'risks') {
      insights[currentSection].score = parseInt(scoreMatch[1] || scoreMatch[2]);
    }

    // Extract content
    if (trimmed && !trimmed.match(/^\d+\.?\s*$/)) {
      if (currentSection === 'suggestions') {
        insights.overallSuggestions.push(trimmed);
      } else if (currentSection === 'risks') {
        insights.risks.push(trimmed);
      } else if (currentSection && insights[currentSection]) {
        insights[currentSection].feedback += trimmed + ' ';
      }
    }
  }

  return insights;
}

// Helper function to parse field suggestions
function parseFieldSuggestions(response) {
  const fields = [];
  const lines = response.split('\n');
  let currentField = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.match(/^\d+\.?\s*[A-Z]/)) {
      // New field
      if (currentField) {
        fields.push(currentField);
      }
      currentField = {
        title: trimmed.replace(/^\d+\.?\s*/, ''),
        description: '',
        aiGenerated: '',
        tasks: [],
      };
    } else if (currentField && trimmed) {
      if (trimmed.toLowerCase().includes('description:')) {
        currentField.description = trimmed.replace(/description:\s*/i, '');
      } else if (trimmed.toLowerCase().includes('insight:')) {
        currentField.aiGenerated = trimmed.replace(/insight:\s*/i, '');
      } else if (trimmed.match(/^[-•]\s*/)) {
        currentField.tasks.push({
          title: trimmed.replace(/^[-•]\s*/, ''),
          description: '',
          weight: 5,
          completed: false,
        });
      }
    }
  }

  if (currentField) {
    fields.push(currentField);
  }

  return fields;
}

// Helper function to parse task suggestions
function parseTaskSuggestions(response) {
  const tasks = [];
  const lines = response.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.match(/^\d+\.?\s*[A-Z]/)) {
      const taskText = trimmed.replace(/^\d+\.?\s*/, '');
      const weightMatch = taskText.match(/weight[:\s]*(\d+)/i);
      const categoryMatch = taskText.match(/category[:\s]*(\w+)/i);
      
      tasks.push({
        title: taskText.replace(/weight[:\s]*\d+.*$/i, '').replace(/category[:\s]*\w+.*$/i, '').trim(),
        description: '',
        weight: weightMatch ? parseInt(weightMatch[1]) : 5,
        category: categoryMatch ? categoryMatch[1].toLowerCase() : 'other',
        completed: false,
      });
    }
  }

  return tasks;
}

export default {
  analyzeIdea,
  generateFieldSuggestions,
  generateTaskSuggestions,
  generatePersonalDevelopmentSuggestions,
  generateChatResponse,
};