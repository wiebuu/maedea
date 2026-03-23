import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Sparkles } from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  fields: any[];
  onFieldsUpdate: (fields: any[]) => void;
  currentFieldId?: string;
}

export const ChatPanel = ({
  isOpen,
  onClose,
  fields,
  onFieldsUpdate,
  currentFieldId,
}: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "👋 Hi! I’m your AI assistant. Ask me to refine your idea, add more tasks, or suggest improvements to any field!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: generateAIResponse(inputValue),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsProcessing(false);

    if (
      inputValue.toLowerCase().includes("add") ||
      inputValue.toLowerCase().includes("task")
    ) {
      simulateFieldUpdate();
    }
  };

  const generateAIResponse = (input: string) => {
    const responses = [
      "✨ I’ve added new tasks to your roadmap. Check the updated fields above!",
      "🔧 I refined your tasks and included new ones based on best practices.",
      "📈 Your strategy is updated. The new tasks should accelerate your goals.",
      "🚀 I’ve added high-impact tasks — focus on those with higher weight first.",
      "💡 I restructured a few items and added actionable next steps.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const simulateFieldUpdate = () => {
    const updatedFields = fields.map((field) => {
      if (Math.random() > 0.5) {
        const newTask = {
          id: `task-${Date.now()}`,
          title: "AI Generated Task",
          description:
            "This task was added based on your conversation with the AI assistant.",
          weight: Math.floor(Math.random() * 4) + 6,
          completed: false,
        };
        return { ...field, tasks: [...field.tasks, newTask] };
      }
      return field;
    });
    onFieldsUpdate(updatedFields);
  };

  return (
    <div className="w-[420px] h-full flex flex-col border-l border-white/10 bg-background/60 backdrop-blur-md shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-background/70 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-sm text-foreground">AI Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-white/5"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 text-sm shadow-sm border ${
                  message.type === "user"
                    ? "bg-primary/20 border-primary/30 text-primary-foreground"
                    : "bg-muted/40 border-white/10 text-foreground"
                } rounded-md max-w-[75%]`}
              >
                <div className="whitespace-pre-line">{message.content}</div>
                <div className="text-[10px] opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="px-3 py-2 text-sm bg-muted/40 border border-white/10 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-3 h-3 border-2 border-primary/40 border-t-transparent rounded-full"></div>
                  <span className="text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-background/70 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            placeholder="💬 Ask AI to add tasks, refine fields..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isProcessing}
            className="bg-background/60 border-white/20 focus:border-primary/40 focus:ring-0 rounded-md text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            size="sm"
            className="bg-primary/20 text-primary hover:bg-primary/30 rounded-md"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
