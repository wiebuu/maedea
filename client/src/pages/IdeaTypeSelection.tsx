import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import FloatingOrbs from "@/components/FloatingOrbs";
import {
  Lightbulb,
  Building,
  Briefcase,
  Store,
  ShoppingCart,
  GraduationCap,
  Camera,
  Zap,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ideaTypes = [
  {
    id: "startup-idea",
    title: "Startup Idea",
    description: "Launch a new business venture with market potential",
    icon: Building,
    color: "text-primary-glow",
  },
  {
    id: "existing-startup",
    title: "Existing Startup",
    description: "Improve or refine your current business",
    icon: Lightbulb,
    color: "text-accent-glow",
  },
  {
    id: "freelance-solo",
    title: "Freelance / Solo Career",
    description:
      "Build a personal service business (designer, makeup artist, consultant)",
    icon: Briefcase,
    color: "text-electric-glow",
  },
  {
    id: "side-hustle",
    title: "Side Hustle",
    description: "Run a small-scale project alongside studies or work",
    icon: Zap,
    color: "text-accent-glow",
  },
  {
    id: "local-business",
    title: "Local Business",
    description: "Salon, café, gym, or brick-and-mortar shop",
    icon: Store,
    color: "text-primary-glow",
  },
  {
    id: "ecommerce",
    title: "E-commerce / Online Store",
    description: "Sell products online (physical or digital)",
    icon: ShoppingCart,
    color: "text-electric-glow",
  },
  {
    id: "content-creator",
    title: "Content Creator",
    description: "YouTube, Instagram, or personal brand growth",
    icon: Camera,
    color: "text-accent-glow",
  },
  {
    id: "education-coaching",
    title: "Education / Coaching",
    description: "Launch a course, training program, or tutoring",
    icon: GraduationCap,
    color: "text-primary-glow",
  },
];

const IdeaTypeSelection = () => {
  const navigate = useNavigate();

  const handleTypeSelect = (type: string) => {
    navigate(`/submit-idea?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
      <FloatingOrbs />

      <main className="relative z-10 flex flex-col items-center min-h-screen px-6 py-10">
        <div className="max-w-6xl w-full mx-auto">
          {/* Top bar (single Back link) */}
          <div className="flex justify-between items-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground/70 hover:text-foreground transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-glow">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-medium">Choose Your Path</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
              What’s Your Vision?
            </h1>
            <p className="text-base md:text-lg text-muted-foreground/80 mt-3 max-w-2xl mx-auto">
              Pick your idea type to unlock tailored fields and a clear roadmap.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {ideaTypes.map((type) => (
              <GlassCard
  key={type.id}
  className="p-5 rounded-2xl cursor-pointer transition-all hover:shadow-glow hover:-translate-y-0.5 flex flex-col justify-between min-h-[180px]"
  onClick={() => handleTypeSelect(type.id)}
>
  <div className="flex items-start gap-4">
    <div className="shrink-0 rounded-xl bg-white/5 p-3">
      <type.icon className={`w-6 h-6 ${type.color}`} />
    </div>
    <div>
      <h3 className="text-base font-semibold">{type.title}</h3>
      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
        {type.description}
      </p>
    </div>
  </div>
</GlassCard>

            ))}
          </div>

          {/* CTA row (no duplicate Home) */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:shadow-glow"
              onClick={() => navigate("/dashboard")}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View Dashboard
            </Button>
          </div>

          {/* Footer */}
          <footer className="text-center mt-10 pb-6">
            <p className="text-xs md:text-sm text-muted-foreground/70">
              Turn ideas into structured roadmaps with AI-powered guidance ✨
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default IdeaTypeSelection;
