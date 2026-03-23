import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GlassCard from "@/components/GlassCard";
import {
  DollarSign,
  CheckCircle,
  BarChart3,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertCircle,
  TrendingUp,
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

interface RevenueModel {
  id: string;
  name: string;
  type: 'subscription' | 'one-time' | 'freemium' | 'marketplace';
  price: string;
  revenue: number;
  users: number;
  description: string;
  features: string[];
}

interface BusinessMonetizationProps {
  title: string;
  description: string;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
}

export default function BusinessMonetization({
  title,
  description,
  tasks,
  onTasksUpdate,
}: BusinessMonetizationProps) {
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

  const handleGenerateAI = () => console.log("AI generating new monetization model for:", title);
  const handleAskAI = () => {
    setIsAsking(true);
    setTimeout(() => {
      console.log("AI answered about:", title);
      setIsAsking(false);
    }, 1200);
  };

  // Mock revenue models data
  const revenueModels: RevenueModel[] = [
    {
      id: '1',
      name: 'Freemium',
      type: 'freemium',
      price: '$0 - $29/mo',
      revenue: 15000,
      users: 2500,
      description: 'Free tier with premium features',
      features: ['Basic features free', 'Advanced features paid', 'Unlimited users']
    },
    {
      id: '2',
      name: 'Professional',
      type: 'subscription',
      price: '$49/mo',
      revenue: 35000,
      users: 700,
      description: 'Full feature access for teams',
      features: ['All features', 'Team collaboration', 'Priority support']
    },
    {
      id: '3',
      name: 'Enterprise',
      type: 'subscription',
      price: '$199/mo',
      revenue: 25000,
      users: 125,
      description: 'Custom solutions for large organizations',
      features: ['Custom integrations', 'Dedicated support', 'SLA guarantees']
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'freemium': return 'bg-green-100 text-green-700 border-green-200';
      case 'subscription': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'one-time': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'marketplace': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalRevenue = revenueModels.reduce((sum, model) => sum + model.revenue, 0);
  const totalUsers = revenueModels.reduce((sum, model) => sum + model.users, 0);

  return (
    <GlassCard className="p-4 hover:shadow-glow transition-all duration-500">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">{title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>${totalRevenue.toLocaleString()}/mo revenue</span>
              <span>•</span>
              <span>{totalUsers.toLocaleString()} users</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-green-200 bg-green-50 text-green-700">
            Financial
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

      {/* Main Revenue Models Table */}
      <div className="space-y-4 mb-4">
        {/* Revenue Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Total Revenue</span>
              </div>
              <p className="text-xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600">per month</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Total Users</span>
              </div>
              <p className="text-xl font-bold text-blue-600">{totalUsers.toLocaleString()}</p>
              <p className="text-xs text-blue-600">across all tiers</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">ARPU</span>
              </div>
              <p className="text-xl font-bold text-purple-600">${Math.round(totalRevenue / totalUsers)}</p>
              <p className="text-xs text-purple-600">average per user</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Models Table */}
        <div className="space-y-3">
          {revenueModels.map((model) => (
            <Card key={model.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-semibold text-gray-900">{model.name}</h4>
                    <Badge className={`text-xs ${getTypeColor(model.type)}`}>
                      {model.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{model.price}</p>
                    <p className="text-sm text-gray-600">{model.users} users</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {model.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs text-gray-600">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">${model.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">monthly revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Suggestions */}
        {suggestedTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              AI Monetization Suggestions
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-green-800 mb-1">🔗 Field Impact</h4>
                <p className="text-xs text-green-700">
                  <strong>Financial driver</strong> - Depends on ProblemSolution + ValueProposition. 
                  Impacts: <span className="font-medium">ScalingImpact, RisksChallenges</span>.
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
              <Zap className="w-3 h-3" /> Generate Model
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