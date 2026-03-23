import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GlassCard from "@/components/GlassCard";
import {
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertCircle,
  ArrowRight,
  Target,
  Users,
  Lightbulb,
  Play,
  Pause,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  weight: number;
  completed: boolean;
  suggested?: boolean;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  startDate: string;
  endDate: string;
  progress: number;
  dependencies: string[];
  assignee: string;
}

interface ExecutionRoadmapProps {
  title: string;
  description: string;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
}

export default function ExecutionRoadmap({
  title,
  description,
  tasks,
  onTasksUpdate,
}: ExecutionRoadmapProps) {
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

  const handleGenerateAI = () => console.log("AI generating new milestone for:", title);
  const handleAskAI = () => {
    setIsAsking(true);
    setTimeout(() => {
      console.log("AI answered about:", title);
      setIsAsking(false);
    }, 1200);
  };

  // Mock milestones data
  const milestones: Milestone[] = [
    {
      id: '1',
      name: 'MVP Launch',
      description: 'Core features and basic functionality',
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      progress: 100,
      dependencies: [],
      assignee: 'Dev Team'
    },
    {
      id: '2',
      name: 'User Onboarding',
      description: 'Improved UX and user acquisition',
      status: 'in-progress',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      progress: 65,
      dependencies: ['MVP Launch'],
      assignee: 'UX Team'
    },
    {
      id: '3',
      name: 'Scale Infrastructure',
      description: 'Performance optimization and scaling',
      status: 'pending',
      startDate: '2024-07-01',
      endDate: '2024-09-30',
      progress: 0,
      dependencies: ['User Onboarding'],
      assignee: 'DevOps Team'
    },
    {
      id: '4',
      name: 'Market Expansion',
      description: 'New markets and feature expansion',
      status: 'pending',
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      progress: 0,
      dependencies: ['Scale Infrastructure'],
      assignee: 'Growth Team'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'blocked': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Play;
      case 'pending': return Clock;
      case 'blocked': return Pause;
      default: return Clock;
    }
  };

  return (
    <GlassCard className="p-4 hover:shadow-glow transition-all duration-500">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">{title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{milestones.filter(m => m.status === 'completed').length}/{milestones.length} milestones</span>
              <span>•</span>
              <span>{progress}% overall progress</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-blue-200 bg-blue-50 text-blue-700">
            Tactical
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

      {/* Main Timeline */}
      <div className="space-y-4 mb-4">
        {/* Horizontal Timeline */}
        <div className="relative">
          <div className="flex items-center space-x-4 overflow-x-auto pb-4">
            {milestones.map((milestone, index) => {
              const StatusIcon = getStatusIcon(milestone.status);
              const isCompleted = milestone.status === 'completed';
              const isInProgress = milestone.status === 'in-progress';
              const isBlocked = milestone.status === 'blocked';
              
              return (
                <div key={milestone.id} className="flex flex-col items-center relative min-w-[200px]">
                  {/* Milestone Card */}
                  <Card className={`w-full ${isCompleted ? 'bg-green-50 border-green-200' : isInProgress ? 'bg-blue-50 border-blue-200' : isBlocked ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${isCompleted ? 'text-green-600' : isInProgress ? 'text-blue-600' : isBlocked ? 'text-red-600' : 'text-gray-400'}`} />
                          <h4 className="text-sm font-semibold text-gray-900">{milestone.name}</h4>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{milestone.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{milestone.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${
                              isCompleted ? 'bg-green-500' : isInProgress ? 'bg-blue-500' : isBlocked ? 'bg-red-500' : 'bg-gray-300'
                            }`}
                            style={{ width: `${milestone.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{milestone.startDate}</span>
                          <span>{milestone.endDate}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Assigned to: {milestone.assignee}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow */}
                  {index < milestones.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400 absolute -right-2 top-1/2 transform -translate-y-1/2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Suggestions */}
        {suggestedTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              AI Roadmap Suggestions
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-blue-800 mb-1">🔗 Field Impact</h4>
                <p className="text-xs text-blue-700">
                  <strong>Tactical driver</strong> - Based on ProductStrategy. 
                  Impacts: <span className="font-medium">NextSteps, ScalingImpact</span>.
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
              <Zap className="w-3 h-3" /> Generate Milestone
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