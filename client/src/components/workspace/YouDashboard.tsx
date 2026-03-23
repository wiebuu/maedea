import React from "react";
import GlassCard from "@/components/GlassCard";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Brain, Globe, Shield } from "lucide-react";
import { youSections, YouSection, YouField } from "@/lib/youConfig";
import YouFieldCard from "@/components/workspace/YouFieldCard";

type IconMap = Record<string, React.ComponentType<any>>;

const iconMap: IconMap = {
  Brain,
  Globe,
  Shield,
};

type YouDashboardProps = {
  sections?: YouSection[];
};

const FieldRow = ({ field }: { field: YouField }) => {
  return (
    <div className="grid grid-cols-12 items-center gap-3 py-2.5">
      <div className="col-span-6 text-sm text-foreground/90">{field.label}</div>
      <div className="col-span-6">
        {field.type === "progress" ? (
          <div className="flex items-center gap-2">
            <Progress value={Number(field.value ?? 0)} className="h-1.5" />
            <span className="text-xs text-muted-foreground w-8 text-right">
              {Number(field.value ?? 0)}%
            </span>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground px-2 py-1 rounded border border-white/10 bg-white/5 inline-block">
            {String(field.value ?? "—")}
          </div>
        )}
      </div>
    </div>
  );
};

export const YouDashboard: React.FC<YouDashboardProps> = ({ sections }) => {
  const data = sections ?? youSections;

  return (
    <div className="space-y-5">
      <Accordion type="multiple" className="space-y-4">
        {data.map((section) => {
          const Icon = iconMap[section.icon] ?? Shield;
          return (
            <AccordionItem key={section.id} value={section.id} className="border-none">
              <GlassCard className="px-4 py-3 md:px-5 md:py-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-sm md:text-base">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    <span className="font-semibold tracking-tight">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mt-2 grid grid-cols-1 gap-4">
                    {section.fields.map((f) => (
                      <YouFieldCard
                        key={f.key}
                        title={f.label}
                        description={f.description}
                        type={(f.type as any) ?? "progress"}
                        value={f.value as any}
                        fieldKey={f.key}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </GlassCard>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default YouDashboard;

