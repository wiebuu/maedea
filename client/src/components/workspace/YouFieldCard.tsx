import React, { useState } from "react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Info, CheckCircle, Lightbulb, BookOpen, Users, Activity, Target, Heart, Coins, Brain, Focus } from "lucide-react";
import { getYouTasksForField, YouTask } from "@/lib/youSuggestions";

type Props = {
  title: string;
  description: string;
  fieldKey?: string;
};

const YouFieldCard: React.FC<Props> = ({ title, description, fieldKey }) => {
  const [guidance, setGuidance] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<YouTask[]>(() => getYouTasksForField(fieldKey ?? title.toLowerCase()));

  const updateValue = (val: number | string) => {
    setLocalValue(val);
    onChange?.(val);
  };

  const generateGuidance = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const why = `${title} is a leverage point for improving outcomes across your projects.`;
    const how = `Use short, consistent practice cycles and real-world reps. Reflect weekly.`;
    const steps = `1) Set a weekly target. 2) Do 3 focused sessions. 3) Review outcomes each week.`;
    const resources = `Recommended: high-signal books, 1–2 curated courses, and a peer group.`;
    setGuidance(`Why it matters: ${why}\n\nHow to improve: ${how}\n\nAction steps: ${steps}\n\nResources: ${resources}`);
    setLoading(false);
  };

  const headerIcon = (() => {
    const key = (fieldKey ?? title).toLowerCase();
    if (key.includes("skill")) return Target;
    if (key.includes("knowledge") || key.includes("reading")) return BookOpen;
    if (key.includes("network") || key.includes("mentor")) return Users;
    if (key.includes("health")) return Heart;
    if (key.includes("discipline") || key.includes("focus")) return Activity;
    if (key.includes("finance") || key.includes("financial")) return Coins;
    if (key.includes("mindset") || key.includes("emotional") || key.includes("resilience") || key.includes("creativity") || key.includes("risk")) return Brain;
    return Focus;
  })();
  const Icon = headerIcon;

  return (
    <GlassCard className="p-4 h-full flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold leading-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-start gap-1"><Info className="w-3 h-3 mt-0.5" /> {description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={generateGuidance} disabled={loading} className="text-xs h-8">
            <Sparkles className={`w-3 h-3 mr-1 ${loading ? "animate-pulse" : ""}`} />
            {loading ? "Guiding..." : "Guidance"}
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-8">
            Ask AI
          </Button>
        </div>
      </div>

      {/* Suggestions / Tasks */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-2 rounded-lg border ${task.completed ? "bg-green-50/5 border-green-400/30" : task.suggested ? "bg-primary/5 border-primary/30" : "border-white/10"} hover:bg-white/5`}
          >
            {task.completed ? (
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            ) : (
              <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.completed ? "line-through text-green-300" : "text-foreground"}`}>{task.title}</p>
              <p className="text-[11px] text-muted-foreground truncate">{task.description}</p>
            </div>
            {task.completed ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, completed: false, suggested: true } : t))}
              >
                Undo
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, completed: true, suggested: false } : t))}
              >
                Complete
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={generateGuidance} disabled={loading} className="text-xs">
          <Sparkles className={`w-3 h-3 mr-1 ${loading ? "animate-pulse" : ""}`} />
          {loading ? "Generating..." : "Generate Guidance"}
        </Button>
        {typeof localValue === "number" && (
          <span className="text-[11px] text-muted-foreground">Self-assessment: {localValue}%</span>
        )}
      </div>

      {guidance && (
        <div className="border border-white/10 rounded-md p-3 bg-white/5">
          <pre className="whitespace-pre-wrap text-xs leading-relaxed">{guidance}</pre>
        </div>
      )}
    </GlassCard>
  );
};

export default YouFieldCard;

