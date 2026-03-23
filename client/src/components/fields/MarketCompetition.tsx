import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GlassCard from "@/components/GlassCard";
import {
  TrendingUp,
  CheckCircle,
  BarChart3,
  MessageSquare,
  Zap,
  Target,
  Star,
  AlertTriangle,
  Users,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  weight: number;
  completed: boolean;
  suggested?: boolean;
}

interface Competitor {
  id: string;
  name: string;
  marketShare: number;
  pricing: string;
  features: string[];
  strengths: string[];
  weaknesses: string[];
  rating: number;
  users: number;
  revenue: number;
}

interface MarketCompetitionProps {
  title: string;
  description: string;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
}

export default function MarketCompetition({
  title,
  description,
  tasks,
  onTasksUpdate,
}: MarketCompetitionProps) {
  const [isAsking, setIsAsking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Mock competitors data
  const competitors: Competitor[] = [
    {
      id: '1',
      name: 'Your Product',
      marketShare: 15,
      pricing: '$29/month',
      features: ['AI Integration', 'Real-time Analytics', 'Custom Workflows'],
      strengths: ['Modern UI', 'AI-powered', 'Fast setup'],
      weaknesses: ['New to market', 'Limited integrations'],
      rating: 4.5,
      users: 2500,
      revenue: 75000
    },
    {
      id: '2',
      name: 'Competitor A',
      marketShare: 35,
      pricing: '$49/month',
      features: ['Basic Analytics', 'Team Collaboration', 'File Sharing'],
      strengths: ['Established brand', 'Large user base', 'Enterprise features'],
      weaknesses: ['Outdated UI', 'High pricing', 'Complex setup'],
      rating: 3.8,
      users: 15000,
      revenue: 450000
    },
    {
      id: '3',
      name: 'Competitor B',
      marketShare: 25,
      pricing: '$19/month',
      features: ['Simple Interface', 'Mobile App', 'Basic Reporting'],
      strengths: ['Low cost', 'Easy to use', 'Good mobile app'],
      weaknesses: ['Limited features', 'Poor support', 'No AI'],
      rating: 3.2,
      users: 8000,
      revenue: 190000
    },
    {
      id: '4',
      name: 'Competitor C',
      marketShare: 20,
      pricing: '$39/month',
      features: ['Advanced Analytics', 'API Access', 'Custom Dashboards'],
      strengths: ['Powerful analytics', 'Developer friendly', 'Flexible'],
      weaknesses: ['Steep learning curve', 'Expensive', 'Complex UI'],
      rating: 4.1,
      users: 12000,
      revenue: 360000
    }
  ];

  const completedTasks = tasks.filter((t) => t.completed);
  const totalMarketShare = competitors.reduce((sum, c) => sum + c.marketShare, 0);

  const handleGenerateAI = () => console.log("AI analyzing competitors for:", title);
  const handleAskAI = () => {
    setIsAsking(true);
    setTimeout(() => {
      console.log("AI answered about:", title);
      setIsAsking(false);
    }, 1200);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMarketShareColor = (share: number) => {
    if (share >= 30) return 'bg-red-500';
    if (share >= 20) return 'bg-orange-500';
    if (share >= 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <GlassCard className="p-4 hover:shadow-glow transition-all duration-500">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">{title}</h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{competitors.length - 1} competitors</span>
              <span>•</span>
              <span className="text-green-600 font-medium">{competitors[0].marketShare}% market share</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-indigo-200 bg-indigo-50 text-indigo-700">
            External
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

      {/* Main Competitor Comparison Chart */}
      <div className="space-y-4 mb-4">
        {/* Market Share Bar Chart */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {competitors.map((competitor) => (
                <div key={competitor.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${competitor.name === 'Your Product' ? 'text-green-600' : 'text-gray-900'}`}>
                        {competitor.name}
                      </span>
                      {competitor.name === 'Your Product' && (
                        <Badge className="bg-green-100 text-green-700 text-xs">You</Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className={`w-3 h-3 ${getRatingColor(competitor.rating)}`} />
                        <span className={`text-xs font-medium ${getRatingColor(competitor.rating)}`}>
                          {competitor.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>{competitor.pricing}</span>
                      <span>{competitor.users.toLocaleString()} users</span>
                      <span className="font-semibold">{competitor.marketShare}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        competitor.name === 'Your Product' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        getMarketShareColor(competitor.marketShare)
                      }`}
                      style={{ width: `${competitor.marketShare}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {competitors.map((competitor) => (
            <Card key={competitor.id} className={`${competitor.name === 'Your Product' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'} transition-all`}>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{competitor.name}</h4>
                    {competitor.name === 'Your Product' && (
                      <Badge className="bg-green-100 text-green-700 text-xs">You</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{competitor.pricing}</p>
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="text-green-600 font-medium">✓ </span>
                      <span className="text-gray-700">{competitor.strengths[0]}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-red-600 font-medium">✗ </span>
                      <span className="text-gray-700">{competitor.weaknesses[0]}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Collapsible Details */}
      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <CollapsibleContent className="space-y-4">
          {/* Field Relationship Note */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-indigo-800 mb-1">🔗 Field Impact</h4>
                <p className="text-xs text-indigo-700">
                  <strong>External driver</strong> - Depends on ValueProposition + ProductStrategy. 
                  Impacts: <span className="font-medium">RisksChallenges, ProductStrategy</span>.
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
              <Zap className="w-3 h-3" /> Analyze Competitors
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
