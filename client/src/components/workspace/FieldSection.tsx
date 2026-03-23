import React, { useState } from "react";

// Import all field components
import ProblemSolution from "@/components/fields/ProblemSolution";
import NextSteps from "@/components/fields/NextSteps";
import ValueProposition from "@/components/fields/ValueProposition";
import MarketCompetition from "@/components/fields/MarketCompetition";
import ProductStrategy from "@/components/fields/ProductStrategy";
import BusinessMonetization from "@/components/fields/BusinessMonetization";
import ExecutionRoadmap from "@/components/fields/ExecutionRoadmap";
import RisksChallenges from "@/components/fields/RisksChallenges";
import ScalingImpact from "@/components/fields/ScalingImpact";

interface Task {
  id: string;
  title: string;
  description: string;
  weight: number;
  completed: boolean;
  suggested?: boolean;
}

interface Field {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  aiGenerated: string;
}

interface FieldSectionProps {
  field: Field;
  onTasksUpdate: (tasks: Task[]) => void;
}

// Field component mapping
const fieldComponentMap: Record<string, React.ComponentType<any>> = {
  "problem-solution": ProblemSolution,
  "next-steps": NextSteps,
  "value-proposition": ValueProposition,
  "market-competition": MarketCompetition,
  "product-strategy": ProductStrategy,
  "business-monetization": BusinessMonetization,
  "execution-roadmap": ExecutionRoadmap,
  "risks-challenges": RisksChallenges,
  "scaling-impact": ScalingImpact,
  "impact-measurement": ScalingImpact, // Use ScalingImpact for impact measurement
  "learning-showcase": NextSteps, // Use NextSteps for learning showcase
};

export const FieldSection = ({ field, onTasksUpdate }: FieldSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get the appropriate field component
  const FieldComponent = fieldComponentMap[field.id] || ProblemSolution;

  return (
    <div className="space-y-4">
      <FieldComponent
        title={field.title}
        description={field.description}
        tasks={field.tasks}
        onTasksUpdate={onTasksUpdate}
      />
    </div>
  );
};
