import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GlassCard from "@/components/GlassCard";
import {
  TrendingUp,
  CheckCircle,
  BarChart3,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertCircle,
  Users,
  Lightbulb,
  Target,
  DollarSign,
  Activity,
  Globe,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  weight: number;
  completed: boolean;
  suggested?: boolean;
}

interface KPIMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  icon: any;
  color: string;
}

interface ScalingImpactProps {
  title: string;
  description: string;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
}

export default function ScalingImpact({
  title,
  description,
  tasks,
  onTasksUpdate,
}: ScalingImpactProps) {
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

  const handleGenerateAI = () => console.log("AI generating new scaling metrics for:", title);
  const handleAskAI = () => {
    setIsAsking(true);
    setTimeout(() => {
      console.log("AI answered about:", title);
      setIsAsking(false);
    }, 1200);
  };

  // Mock KPI metrics data
  const kpiMetrics: KPIMetric[] = [
    {
      id: '1',
      name: 'Monthly Active Users',
      value: 12500,
      target: 15000,
      unit: 'users',
      trend: 'up',
      change: 12.5,
      icon: Users,
      color: 'blue'
    },
    {
      id: '2',
      name: 'Revenue Growth',
      value: 45000,
      target: 60000,
      unit: '$',
      trend: 'up',
      change: 8.3,
      icon: DollarSign,
      color: 'green'
    },
    {
      id: '3',
      name: 'Market Penetration',
      value: 15.2,
      target: 25.0,
      unit: '%',
      trend: 'up',
      change: 2.1,
      icon: Target,
      color: 'purple'
    },
    {
      id: '4',
      name: 'Customer Satisfaction',
      value: 4.6,
      target: 4.8,
      unit: '/5',
      trend: 'stable',
      change: 0.1,
      icon: Activity,
      color: 'orange'
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getMetricColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'green': return 'bg-green-100 text-green-700';
      case 'purple': return 'bg-purple-100 text-purple-700';
      case 'orange': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <GlassCard className="p-4 hover:shadow-glow transition-all duration-500">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-purple-600" />
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
            Output
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

      {/* Main KPI Dashboard */}
      <div className="space-y-4 mb-4">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {kpiMetrics.map((metric) => {
            const Icon = metric.icon;
            const progressPercentage = (metric.value / metric.target) * 100;
            
            return (
              <Card key={metric.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getMetricColor(metric.color)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                          {getTrendIcon(metric.trend)}
                        </span>
                        <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">{metric.name}</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {metric.unit === '$' ? `$${metric.value.toLocaleString()}` : 
                         metric.unit === '%' ? `${metric.value}%` :
                         metric.unit === '/5' ? `${metric.value}` :
                         metric.value.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">{metric.unit}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Target: {metric.target.toLocaleString()}{metric.unit}</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(metric.value, metric.target)}`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trend Chart Placeholder */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Growth Trends</h4>
              <div className="flex items-center gap-2">
                <Badge className="text-xs bg-green-100 text-green-700">Last 6 months</Badge>
              </div>
            </div>
            
            {/* Mock trend visualization */}
            <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-end justify-between p-4">
              {[65, 72, 68, 85, 78, 92].map((height, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">M{index + 1}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">+24%</p>
                <p className="text-xs text-gray-500">User Growth</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">+18%</p>
                <p className="text-xs text-gray-500">Revenue Growth</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">+31%</p>
                <p className="text-xs text-gray-500">Market Share</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        {suggestedTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              AI Scaling Suggestions
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
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-purple-800 mb-1">🔗 Field Impact</h4>
                <p className="text-xs text-purple-700">
                  <strong>Output indicator</strong> - End result of ExecutionRoadmap + Monetization + Strategy. 
                  Impacts: <span className="font-medium">Strategy or Roadmap revisions</span>.
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
              <Zap className="w-3 h-3" /> Generate Metrics
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