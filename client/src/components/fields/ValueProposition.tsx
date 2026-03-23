import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GlassCard from "@/components/GlassCard";
import {
  Target,
  Lightbulb,
  Star,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  weight: number;
  completed: boolean;
  suggested?: boolean;
}

interface ValuePropositionProps {
  title: string;
  description: string;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
}

export default function ValueProposition({
  title,
  description,
  tasks,
  onTasksUpdate,
}: ValuePropositionProps) {
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

  const handleGenerateAI = () => console.log("AI generating new value prop for:", title);
  const handleAskAI = () => {
    setIsAsking(true);
    setTimeout(() => {
      console.log("AI answered about:", title);
      setIsAsking(false);
    }, 1200);
  };

  // Mock value proposition data
  const valueProps = [
    {
      problem: "Users struggle with complex project management tools",
      solution: "Simple, AI-powered task management that learns your workflow",
      impact: "Save 3 hours per week on project coordination"
    },
    {
      problem: "Teams waste time in endless meetings",
      solution: "Automated meeting summaries with action items",
      impact: "Reduce meeting time by 40% while improving outcomes"
    },
    {
      problem: "Decision-making is slow and data-scattered",
      solution: "Real-time dashboard with predictive insights",
      impact: "Make decisions 5x faster with 90% accuracy"
    }
  ];

  return (
    <GlassCard className="p-4 hover:shadow-glow transition-all duration-500">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Target className="w-4 h-4 text-purple-600" />
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
          <Badge variant="outline" className="text-xs border-purple-200 bg-purple-50 text-purple-700">
            Positioning
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

      {/* Main Value Proposition Comparison */}
      <div className="space-y-3 mb-4">
        {valueProps.map((prop, index) => (
          <Card key={index} className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Problem */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <h4 className="text-sm font-semibold text-red-700">Problem</h4>
                  </div>
                  <p className="text-sm text-gray-700">{prop.problem}</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-purple-500" />
                </div>

                {/* Solution */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <h4 className="text-sm font-semibold text-green-700">Solution</h4>
                  </div>
                  <p className="text-sm text-gray-700">{prop.solution}</p>
                  <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-xs font-medium text-green-800">Impact: {prop.impact}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Suggestions */}
      {suggestedTasks.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-blue-600" />
            AI Suggestions
          </h4>
          <div className="space-y-2">
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

      {/* Collapsible Details */}
      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <CollapsibleContent className="space-y-4">
          {/* Field Relationship Note */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-purple-800 mb-1">🔗 Field Impact</h4>
                <p className="text-xs text-purple-700">
                  <strong>Branding/positioning driver</strong> - Driven by ProblemSolution. 
                  Impacts: <span className="font-medium">ProductStrategy, MarketCompetition, ScalingImpact</span>.
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
              <Zap className="w-3 h-3" /> Generate Value Prop
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
