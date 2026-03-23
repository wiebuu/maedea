import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import GlassCard from "@/components/GlassCard";
import FloatingOrbs from "@/components/FloatingOrbs";
import { ArrowLeft, Sparkles, X, Plus, Lightbulb } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const suggestedTags = ["AI/ML", "E-commerce", "FinTech", "HealthTech", "EdTech", "SaaS", "Mobile App", "Web Platform", "IoT", "Blockchain"];

const IdeaSubmission = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ideaType = searchParams.get("type") || "startup";
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
  });
  const [customTag, setCustomTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    
    // Simulate AI processing and navigate to workspace
    const ideaId = Math.random().toString(36).substring(7);
    navigate(`/workspace/${ideaId}?type=${ideaType}&title=${encodeURIComponent(formData.title)}`);
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addCustomTag = () => {
    if (customTag && !formData.tags.includes(customTag)) {
      addTag(customTag);
      setCustomTag("");
    }
  };

  const getTypeTitle = () => {
    switch (ideaType) {
      case "startup-idea": return "Startup Idea";
      case "existing-startup": return "Existing Startup";
      case "simple-project": return "Simple Project";
      case "freelance-solo": return "Freelance / Solo Career";
      case "side-hustle": return "Side Hustle";
      case "local-business": return "Local Business";
      case "ecommerce": return "E-commerce / Online Store";
      case "nonprofit": return "Non-Profit / Social Impact";
      case "education-coaching": return "Education / Coaching";
      case "content-creator": return "Content Creator / Influencer";
      case "tech-saas": return "Tech / SaaS Product";
      case "research-innovation": return "Research / Innovation Project";
      default: return "Your Idea";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
      <FloatingOrbs />
      
      <main className="relative z-10 flex flex-col items-center min-h-screen px-6 py-10">
        <div className="max-w-4xl w-full mx-auto">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-8">
            <Link
              to="/idea-type"
              className="inline-flex items-center gap-2 text-muted-foreground/70 hover:text-foreground transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Types</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-glow">
              <Lightbulb className="w-4 h-4" />
              <span className="text-xs font-medium">Share Your Vision</span>
            </div>
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left side - Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight mb-4">
                  Tell Us About Your {getTypeTitle()}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground/80 leading-relaxed">
                  Share your idea and our AI will create a personalized roadmap tailored to your specific goals and vision.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-glow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI-Powered Analysis</h3>
                    <p className="text-xs text-muted-foreground">Get intelligent insights and recommendations</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-accent-glow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Structured Roadmap</h3>
                    <p className="text-xs text-muted-foreground">Clear steps and milestones for success</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <GlassCard className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-foreground">Idea Title</label>
                  <Input
                    placeholder="Give your idea a catchy name..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-white/5 border-white/20 focus:border-primary/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-foreground">Idea Description</label>
                  <Textarea
                    placeholder="Describe your idea. It doesn't need to be perfect — just share what's on your mind, we can refine it later."
                    className="min-h-[120px] bg-white/5 border-white/20 focus:border-primary/50"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-foreground">Tags</label>
                  <p className="text-xs text-muted-foreground mb-4">Add relevant tags to help AI understand your idea better</p>
                  
                  {/* Selected Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-primary/20 text-primary-glow border-primary/30">
                          {tag}
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Suggested Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {suggestedTags.filter(tag => !formData.tags.includes(tag)).map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/10 border-white/20 hover:border-primary/30 transition-all"
                        onClick={() => addTag(tag)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Custom Tag Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom tag..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
                      className="bg-white/5 border-white/20 focus:border-primary/50"
                    />
                    <Button 
                      type="button" 
                      onClick={addCustomTag} 
                      disabled={!customTag}
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
                  disabled={!formData.title || !formData.description}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate My Roadmap
                </Button>
              </form>
            </GlassCard>
          </div>

          {/* Footer */}
          <footer className="text-center mt-12 pb-6">
            <p className="text-xs md:text-sm text-muted-foreground/70">
              Transform your idea into a structured roadmap with AI-powered guidance ✨
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default IdeaSubmission;