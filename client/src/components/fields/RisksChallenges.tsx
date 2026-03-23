import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GlassCard from "@/components/GlassCard";
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Zap,
  Lightbulb,
  Target,
  Shield,
  TrendingDown,
  Clock,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  weight: number;
  completed: boolean;
  suggested?: boolean;
}

interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'technical' | 'business' | 'market' | 'operational';
  probability: number;
  impact: number;
  mitigation: string;
  status: 'identified' | 'mitigating' | 'resolved' | 'monitoring';
}

interface RisksChallengesProps {
  title: string;
  description: string;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
}

export default function RisksChallenges({
  title,
  description,
  tasks,
  onTasksUpdate,
}: RisksChallengesProps) {
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

  const handleGenerateAI = () => console.log("AI generating new risk assessment for:", title);
  const handleAskAI = () => {
    setIsAsking(true);
    setTimeout(() => {
      console.log("AI answered about:", title);
      setIsAsking(false);
    }, 1200);
  };

  // Mock risks data
  const risks: Risk[] = [
    {
      id: '1',
      title: 'Market Competition',
      description: 'New competitors entering the market with similar solutions',
      severity: 'high',
      category: 'market',
      probability: 80,
      impact: 70,
      mitigation: 'Focus on unique value proposition and rapid feature development',
      status: 'monitoring'
    },
    {
      id: '2',
      title: 'Technical Debt',
      description: 'Accumulated technical debt affecting development velocity',
      severity: 'medium',
      category: 'technical',
      probability: 60,
      impact: 50,
      mitigation: 'Allocate 20% of development time to refactoring',
      status: 'mitigating'
    },
    {
      id: '3',
      title: 'Key Personnel Loss',
      description: 'Risk of losing critical team members',
      severity: 'critical',
      category: 'operational',
      probability: 30,
      impact: 90,
      mitigation: 'Implement knowledge sharing and competitive retention packages',
      status: 'identified'
    },
    {
      id: '4',
      title: 'Regulatory Changes',
      description: 'Potential changes in data privacy regulations',
      severity: 'medium',
      category: 'business',
      probability: 40,
      impact: 60,
      mitigation: 'Stay updated with regulatory changes and implement compliance measures',
      status: 'monitoring'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'high': return AlertCircle;
      case 'medium': return Shield;
      case 'low': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-700';
      case 'business': return 'bg-purple-100 text-purple-700';
      case 'market': return 'bg-green-100 text-green-700';
      case 'operational': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'mitigating': return 'bg-blue-100 text-blue-700';
      case 'monitoring': return 'bg-yellow-100 text-yellow-700';
      case 'identified': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const criticalRisks = risks.filter(r => r.severity === 'critical').length;
  const highRisks = risks.filter(r => r.severity === 'high').length;
  const totalRisks = risks.length;

  return (
    <GlassCard className="p-4 hover:shadow-glow transition-all duration-500">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">{title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{totalRisks} risks identified</span>
              <span>•</span>
              <span className="text-red-600 font-medium">{criticalRisks} critical</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-red-200 bg-red-50 text-red-700">
            Reactive
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

      {/* Main Risk Assessment */}
      <div className="space-y-4 mb-4">
        {/* Risk Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">Critical</span>
              </div>
              <p className="text-xl font-bold text-red-600">{criticalRisks}</p>
              <p className="text-xs text-red-600">risks</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">High</span>
              </div>
              <p className="text-xl font-bold text-orange-600">{highRisks}</p>
              <p className="text-xs text-orange-600">risks</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Mitigating</span>
              </div>
              <p className="text-xl font-bold text-blue-600">{risks.filter(r => r.status === 'mitigating').length}</p>
              <p className="text-xs text-blue-600">in progress</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Resolved</span>
              </div>
              <p className="text-xl font-bold text-green-600">{risks.filter(r => r.status === 'resolved').length}</p>
              <p className="text-xs text-green-600">completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Risk List */}
        <div className="space-y-3">
          {risks.map((risk) => {
            const SeverityIcon = getSeverityIcon(risk.severity);
            const riskScore = (risk.probability * risk.impact) / 100;
            
            return (
              <Card key={risk.id} className={`${getSeverityColor(risk.severity).includes('red') ? 'border-l-4 border-l-red-500' : getSeverityColor(risk.severity).includes('orange') ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-yellow-500'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <SeverityIcon className={`w-5 h-5 ${getSeverityColor(risk.severity).split(' ')[1]}`} />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{risk.title}</h4>
                        <p className="text-sm text-gray-600">{risk.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getSeverityColor(risk.severity)}`}>
                        {risk.severity}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(risk.status)}`}>
                        {risk.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Probability</span>
                        <span className="font-medium">{risk.probability}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${risk.probability}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Impact</span>
                        <span className="font-medium">{risk.impact}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${risk.impact}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Risk Score</span>
                        <span className="font-medium">{Math.round(riskScore)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${riskScore > 60 ? 'bg-red-500' : riskScore > 30 ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${riskScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getCategoryColor(risk.category)}`}>
                        {risk.category}
                      </Badge>
                      <span className="text-xs text-gray-500">Mitigation: {risk.mitigation}</span>
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
              AI Risk Suggestions
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-red-800 mb-1">🔗 Field Impact</h4>
                <p className="text-xs text-red-700">
                  <strong>Reactive field</strong> - Summarizes vulnerabilities from other fields. 
                  Impacts: <span className="font-medium">Roadmap or Strategy adjustments</span>.
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
              <Zap className="w-3 h-3" /> Assess Risks
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