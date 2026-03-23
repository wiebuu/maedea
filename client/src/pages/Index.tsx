import { Button } from "@/components/ui/button";
import FloatingOrbs from "@/components/FloatingOrbs";
import TypewriterText from "@/components/TypewriterText";
import GlassCard from "@/components/GlassCard";
import { Github, Sparkles, Code2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
      {/* Floating background orbs */}
      <FloatingOrbs />
      
      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Hero section */}
        <div className="text-center max-w-4xl mx-auto animate-slide-up">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-glow mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Beautiful. Modern. Interactive.</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 leading-tight">
              <TypewriterText text="I have an idea." delay={100} />
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground/80 mb-8 animate-slide-up" style={{ animationDelay: '2s' }}>
              AI-powered roadmaps for startups, projects, and world-changing ideas. Get structured tasks, weighted progress, and expert guidance.
            </p>
          </div>
          
          {/* Interactive cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '3s' }}>
            <GlassCard className="p-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-4 text-primary-glow" />
              <h3 className="text-lg font-semibold mb-2">AI-Generated Fields</h3>
              <p className="text-sm text-muted-foreground">Get personalized roadmaps with structured fields and tasks tailored to your idea type</p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <Code2 className="w-8 h-8 mx-auto mb-4 text-accent-glow" />
              <h3 className="text-lg font-semibold mb-2">Weighted Progress</h3>
              <p className="text-sm text-muted-foreground">Track progress with intelligent task weighting based on business impact</p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <Rocket className="w-8 h-8 mx-auto mb-4 text-primary-glow" />
              <h3 className="text-lg font-semibold mb-2">Interactive AI Chat</h3>
              <p className="text-sm text-muted-foreground">Refine and expand your roadmap through conversation with AI</p>
            </GlassCard>
          </div>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '4s' }}>
            <Link to="/idea-type">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105 border-0"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Your Idea
              </Button>
            </Link>
            
            <Link to="/dashboard">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Github className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm text-muted-foreground/60">
            Transform ideas into structured roadmaps with AI-powered guidance
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
