import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GlassCard from "@/components/GlassCard";
import {
  ListChecks,
  CheckCircle,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertCircle,
  Users,
  Lightbulb,
  Target,
  ArrowRight,
  Calendar,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  weight: number;
  completed: boolean;
  suggested?: boolean;
}

interface NextStep {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignee: string;
  dependencies: string[];
}

interface NextStepsProps {
  title: string;
  description: string;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
}

export default function NextSteps({
  title,
  description,
  tasks,
  onTasksUpdate,
}: NextStepsProps) {
  const [isAsking, setIsAsking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const completedTasks = tasks.filter((t) => t.completed);
  const suggestedTasks = tasks.filter((t) => t.suggested);
  const pendingTasks = tasks.filter((t) => !t.completed && !t.suggested);

  const totalWeight = tasks.reduce((sum, t) => sum + t.weight, 0);
  const completedWeight = completedTasks.reduce((sum, t) => sum + t.weight, 0);
  const progress = totalWeight ? Math.round((completedWeight / totalWeight) * 100) : 0;

  const completeTask = (taskId: string) => {
    onTasksUpdate(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: true, suggested: false } : t
      )
    );
  };

  const handleGenerateAI = () => console.log("AI generating new next steps for:", title);
  const handleAskAI = () => {
    setIsAsking(true);
    setTimeout(() => {
      console.log("AI answered about:", title);
      setIsAsking(false);
    }, 1200);
  };

  // Mock next steps data
  const nextSteps: NextStep[] = [
    {
      id: '1',
      title: 'Complete user research interviews',
      description: 'Conduct 10 user interviews to validate core assumptions',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-15',
      assignee: 'UX Team',
      dependencies: []
    },
    {
      id: '2',
      title: 'Set up analytics tracking',
      description: 'Implement comprehensive analytics for user behavior tracking',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-01-20',
      assignee: 'Dev Team',
      dependencies: ['Complete user research interviews']
    },
    {
      id: '3',
      title: 'Design MVP wireframes',
      description: 'Create low-fidelity wireframes for core user flows',
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-01-25',
      assignee: 'Design Team',
      dependencies: ['Complete user research interviews']
    },
    {
      id: '4',
      title: 'Prepare investor pitch deck',
      description: 'Create compelling presentation for seed funding round',
      priority: 'low',
      status: 'pending',
      dueDate: '2024-02-01',
      assignee: 'Founder',
      dependencies: ['Design MVP wireframes']
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'pending': return Target;
      default: return Target;
    }
  };

  const highPrioritySteps = nextSteps.filter(s => s.priority === 'high').length;
  const inProgressSteps = nextSteps.filter(s => s.status === 'in-progress').length;
  const completedSteps = nextSteps.filter(s => s.status === 'completed').length;

  return (
    <GlassCard className="p-4 hover:shadow-glow transition-all duration-500">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
            <ListChecks className="w-4 h-4 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">{title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{completedSteps}/{nextSteps.length} completed</span>
              <span>•</span>
              <span className="text-red-600 font-medium">{highPrioritySteps} high priority</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-cyan-200 bg-cyan-50 text-cyan-700">
            Execution
          </Badge>
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </div>

      {/* Main Next Steps List */}
      <div className="space-y-4 mb-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">High Priority</span>
              </div>
              <p className="text-xl font-bold text-red-600">{highPrioritySteps}</p>
              <p className="text-xs text-red-600">urgent tasks</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">In Progress</span>
              </div>
              <p className="text-xl font-bold text-blue-600">{inProgressSteps}</p>
              <p className="text-xs text-blue-600">active tasks</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Completed</span>
              </div>
              <p className="text-xl font-bold text-green-600">{completedSteps}</p>
              <p className="text-xs text-green-600">finished tasks</p>
            </CardContent>
          </Card>
        </div>

        {/* Numbered Steps List */}
        <div className="space-y-3">
          {nextSteps.map((step, index) => {
            const StatusIcon = getStatusIcon(step.status);
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in-progress';
            
            return (
              <Card key={step.id} className={`${isCompleted ? 'bg-green-50 border-green-200' : isInProgress ? 'bg-blue-50 border-blue-200' : 'hover:shadow-md'} transition-all`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Step Number */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCompleted ? 'bg-green-500 text-white' : 
                      isInProgress ? 'bg-blue-500 text-white' : 
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className={`text-lg font-semibold ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {step.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge className={`text-xs ${getPriorityColor(step.priority)}`}>
                            {step.priority}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(step.status)}`}>
                            {step.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {step.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{step.assignee}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`w-4 h-4 ${isCompleted ? 'text-green-600' : isInProgress ? 'text-blue-600' : 'text-gray-400'}`} />
                          <span className={isCompleted ? 'text-green-600' : isInProgress ? 'text-blue-600' : 'text-gray-500'}>
                            {step.status}
                          </span>
                        </div>
                      </div>
                      
                      {step.dependencies.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">Dependencies:</span> {step.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Suggestions */}
        {suggestedTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              AI Next Steps Suggestions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center gap-3 p-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                  onClick={() => completeTask(task.id)}
                >
                  <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-800">{task.title}</p>
                    <p className="text-xs text-blue-600 truncate">{task.description}</p>
                  </div>
                  <Badge className="text-xs bg-blue-100 text-blue-700">Click to add</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Collapsible Details */}
      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <CollapsibleContent className="space-y-4">
          {/* Field Relationship Note */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-cyan-800 mb-1">🔗 Field Impact</h4>
                <p className="text-xs text-cyan-700">
                  <strong>Downstream, execution-only</strong> - Tied to ExecutionRoadmap. 
                  Impacts: <span className="font-medium">Reflects progress, minimal upstream changes</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-1">Description</h4>
            <p className="text-xs text-gray-600">{description}</p>
          </div>

          {/* AI Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateAI}
              className="flex items-center gap-1 text-xs h-7"
            >
              <Zap className="w-3 h-3" /> Generate Steps
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isAsking}
              onClick={handleAskAI}
              className="flex items-center gap-1 text-xs h-7"
            >
              <MessageSquare className={`w-3 h-3 ${isAsking ? "animate-pulse" : ""}`} />
              {isAsking ? "Asking..." : "Ask AI"}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </GlassCard>
  );
}