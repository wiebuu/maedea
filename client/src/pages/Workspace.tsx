import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GlassCard from "@/components/GlassCard";
import FloatingOrbs from "@/components/FloatingOrbs";
import { FieldSection } from "@/components/workspace/FieldSection";
import YouDashboard from "@/components/workspace/YouDashboard";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { ArrowLeft, Download, Share, MessageCircle } from "lucide-react";
import { generateMockFields } from "@/lib/mockData";
import Dump from "@/components/workspace/Dump";

const Workspace = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const ideaType = searchParams.get("type") || "startup-idea";
  const ideaTitle = searchParams.get("title") || "Untitled Idea";
  const isPersonalDevelopment = ideaType === "personal-development";

  const [fields, setFields] = useState<any[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockFields = generateMockFields(ideaType);
      setFields(mockFields);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [ideaType]);

  const updateFieldTasks = (fieldId: string, updatedTasks: any[]) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, tasks: updatedTasks } : field
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-secondary flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">
            Generating Your Roadmap...
          </h2>
          <p className="text-muted-foreground">
            Our AI is analyzing your idea and creating personalized fields
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
      <FloatingOrbs />

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${
        isPersonalDevelopment 
          ? 'border-purple-400/20 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10' 
          : 'border-white/10 bg-background/70'
      }`}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className={`transition-colors ${
                isPersonalDevelopment 
                  ? 'text-purple-300 hover:text-purple-200' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className={`text-lg sm:text-xl font-semibold ${
                isPersonalDevelopment 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
              }`}>
                {decodeURIComponent(ideaTitle)}
              </h1>
              <Badge
                variant="outline"
                className={`text-xs ${
                  isPersonalDevelopment 
                    ? 'border-purple-400/30 bg-purple-500/10 text-purple-300' 
                    : 'border-primary/30 bg-primary/10 text-primary'
                }`}
              >
                {ideaType.replace("-", " ")}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChatOpen((prev) => !prev)}
              className="hover:bg-primary/10 hover:text-primary transition-all"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              {chatOpen ? "Close AI" : "AI Assistant"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Share className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex h-[calc(100vh-140px)] relative z-10">
        <ChatPanel
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          fields={fields}
          onFieldsUpdate={setFields}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-6">
            {isPersonalDevelopment ? (
              <div className="space-y-6">
                <div className="mb-2 p-4 md:p-5 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 border border-purple-400/20 rounded-md">
                  <p className="text-sm md:text-[15px] text-purple-200/90">
                    💡 The YOU Project is your foundation. Improving here increases your chances of success in every other idea.
                  </p>
                </div>
                <YouDashboard />
              </div>
            ) : (
              <div className="space-y-8">
                {fields?.map((field) => (
                  <div key={field.id}>
                    <FieldSection
                      field={field}
                      onTasksUpdate={(tasks) =>
                        updateFieldTasks(field.id, tasks)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Dump />
    </div>
  );
};

export default Workspace;
