import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GlassCard from "@/components/GlassCard";
import {
  Settings,
  CheckCircle,
  Layers,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertCircle,
  ArrowRight,
  Calendar,
  Users,
  Lightbulb,
  Target,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  weight: number;
  completed: boolean;
  suggested?: boolean;
}

interface ProductStrategyProps {
  title: string;
  description: string;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
}

export default function ProductStrategy({
  title,
  description,
  tasks,
  onTasksUpdate,
}: ProductStrategyProps) {
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

  const handleGenerateAI = () => console.log("AI generating new strategy for:", title);
  const handleAskAI = () => {
    setIsAsking(true);
    setTimeout(() => {
      console.log("AI answered about:", title);
      setIsAsking(false);
    }, 1200);
  };

  // Mock strategy phases data
  const strategyPhases = [
    {
      id: '1',
      name: 'Foundation',
      description: 'Core infrastructure and MVP',
      status: 'completed',
      tasks: 3,
      completed: 3,
      color: 'green',
      icon: Target
    },
    {
      id: '2',
      name: 'Growth',
      description: 'User acquisition and features',
      status: 'in-progress',
      tasks: 4,
      completed: 2,
      color: 'blue',
      icon: Users
    },
    {
      id: '3',
      name: 'Scale',
      description: 'Market expansion and optimization',
      status: 'pending',
      tasks: 3,
      completed: 0,
      color: 'purple',
      icon: Layers
    }
  ];

  return (
    <GlassCard className="p-4 hover:shadow-glow transition-all duration-500">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <Settings className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">{title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{completedTasks.length}/{tasks.length} completed</span>
              <span>•</span>
              <span>{progress}% done</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-orange-200 bg-orange-50 text-orange-700">
            Structural
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

      {/* Main Strategy Roadmap */}
      <div className="space-y-4 mb-4">
        {/* Strategy Phases Timeline */}
        <div className="relative">
          <div className="flex items-center justify-between">
            {strategyPhases.map((phase, index) => {
              const Icon = phase.icon;
              const isCompleted = phase.status === 'completed';
              const isInProgress = phase.status === 'in-progress';
              const isPending = phase.status === 'pending';
              
              return (
                <div key={phase.id} className="flex flex-col items-center relative">
                  {/* Phase Card */}
                  <Card className={`w-32 ${isCompleted ? 'bg-green-50 border-green-200' : isInProgress ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <CardContent className="p-3 text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        isCompleted ? 'bg-green-100' : isInProgress ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          isCompleted ? 'text-green-600' : isInProgress ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">{phase.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{phase.description}</p>
                      <div className="mt-2">
                        <div className="text-xs text-gray-500">
                          {phase.completed}/{phase.tasks} tasks
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className={`h-1 rounded-full ${
                              isCompleted ? 'bg-green-500' : isInProgress ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                            style={{ width: `${(phase.completed / phase.tasks) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow */}
                  {index < strategyPhases.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400 absolute -right-8 top-1/2 transform -translate-y-1/2" />
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
              AI Strategy Suggestions
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
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-orange-800 mb-1">🔗 Field Impact</h4>
                <p className="text-xs text-orange-700">
                  <strong>Structural driver</strong> - Converts ProblemSolution + ValueProposition into roadmap. 
                  Impacts: <span className="font-medium">ExecutionRoadmap, RisksChallenges, NextSteps</span>.
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
              <Zap className="w-3 h-3" /> Generate Strategy
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