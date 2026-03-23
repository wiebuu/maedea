// components/workspace/Dump.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GlassCard from "@/components/GlassCard";
import { Lightbulb, X, Sparkles, Trash2, Clock } from "lucide-react";

interface DumpItem {
  id: string;
  text: string;
  createdAt: string;
  aiSuggestions?: string[];
}

const Dump = () => {
  const [dumpOpen, setDumpOpen] = useState(false);
  const [dumpInput, setDumpInput] = useState("");
  const [dumpItems, setDumpItems] = useState<DumpItem[]>([]);

  const addDumpItem = () => {
    if (!dumpInput.trim()) return;
    const newItem: DumpItem = {
      id: Date.now().toString(),
      text: dumpInput.trim(),
      createdAt: new Date().toLocaleString(),
    };
    setDumpItems((prev) => [newItem, ...prev]);
    setDumpInput("");
  };

  const generateAISuggestions = (id: string) => {
    // Fake AI suggestions for now
    setDumpItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              aiSuggestions: [
                "Could be turned into a standalone feature module.",
                "Might improve user engagement if integrated smartly.",
                "Can connect with existing roadmap tasks.",
              ],
            }
          : item
      )
    );
  };

  const deleteDumpItem = (id: string) => {
    setDumpItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* Floating Dump Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setDumpOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl rounded-full p-5 transition-all"
        >
          <Lightbulb className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Dump Modal */}
      {dumpOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-2xl p-6 relative animate-in fade-in-50 slide-in-from-bottom-10">
            <button
              onClick={() => setDumpOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Idea Dump
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Capture raw thoughts, random notes, or feature sparks 💡 — then let AI help refine them.
            </p>

            <div className="space-y-4">
              <Textarea
                placeholder="Type your idea here..."
                value={dumpInput}
                onChange={(e) => setDumpInput(e.target.value)}
              />
              <Button
                onClick={addDumpItem}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 w-full text-white font-medium transition"
              >
                Add to Dump
              </Button>
            </div>

            {/* Dump Items */}
            <div className="mt-6 space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {dumpItems.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-10">
                  No ideas yet. Start by writing your first one ✍️
                </div>
              ) : (
                dumpItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-background/60 border border-white/10 shadow-sm hover:shadow-md transition group relative"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteDumpItem(item.id)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <p className="text-sm leading-relaxed">{item.text}</p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {item.createdAt}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 hover:border-purple-400 hover:text-purple-500"
                        onClick={() => generateAISuggestions(item.id)}
                      >
                        <Sparkles className="w-4 h-4" />
                        Ask AI
                      </Button>
                    </div>

                    {item.aiSuggestions && (
                      <div className="mt-3 rounded-md bg-purple-50 dark:bg-purple-950/40 p-3">
                        <p className="text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1">
                          AI Suggestions:
                        </p>
                        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                          {item.aiSuggestions.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};

export default Dump;
