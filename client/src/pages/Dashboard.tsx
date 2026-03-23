import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlassCard from "@/components/GlassCard";
import FloatingOrbs from "@/components/FloatingOrbs";
import {
  Plus,
  Search,
  MoreVertical,
  Calendar,
  BarChart3,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data for user's ideas
const mockIdeas = [
  {
    id: "you",
    title: "YOU",
    type: "personal-development",
    progress: 60,
    lastUpdated: "1 hour ago",
    tags: ["Personal Growth", "Self-Development", "Life Project"],
    isSpecial: true,
  },
  {
    id: "1",
    title: "AI-Powered Fitness Coach",
    type: "startup",
    progress: 75,
    lastUpdated: "2 hours ago",
    tags: ["AI/ML", "HealthTech", "Mobile App"],
  },
  {
    id: "2",
    title: "Local Community Garden Network",
    type: "nonprofit",
    progress: 45,
    lastUpdated: "1 day ago",
    tags: ["Social Impact", "Community", "Environment"],
  },
  {
    id: "3",
    title: "Task Management Dashboard",
    type: "portfolio",
    progress: 90,
    lastUpdated: "3 days ago",
    tags: ["Web Platform", "React", "UI/UX"],
  },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredIdeas = mockIdeas.filter((idea) => {
    const matchesSearch = idea.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || idea.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "personal-development":
        return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-400/30";
      case "startup-idea":
        return "bg-primary/20 text-primary";
      case "existing-startup":
        return "bg-accent/20 text-accent";
      case "simple-project":
        return "bg-secondary/20 text-secondary-foreground";
      case "freelance-solo":
        return "bg-electric/20 text-electric";
      case "side-hustle":
        return "bg-accent/20 text-accent";
      case "local-business":
        return "bg-primary/20 text-primary";
      case "ecommerce":
        return "bg-electric/20 text-electric";
      case "nonprofit":
        return "bg-accent/20 text-accent";
      case "education-coaching":
        return "bg-primary/20 text-primary";
      case "content-creator":
        return "bg-electric/20 text-electric";
      case "tech-saas":
        return "bg-accent/20 text-accent";
      case "research-innovation":
        return "bg-primary/20 text-primary";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "personal-development":
        return "Personal";
      case "startup-idea":
        return "Startup";
      case "existing-startup":
        return "Existing";
      case "simple-project":
        return "Project";
      case "freelance-solo":
        return "Freelance";
      case "side-hustle":
        return "Side Hustle";
      case "local-business":
        return "Local";
      case "ecommerce":
        return "E-commerce";
      case "nonprofit":
        return "Nonprofit";
      case "education-coaching":
        return "Education";
      case "content-creator":
        return "Content";
      case "tech-saas":
        return "Tech/SaaS";
      case "research-innovation":
        return "Research";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
      {/* Floating background orbs */}
      <FloatingOrbs />

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-background/80 sticky top-0 z-20">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  My Ideas
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Track and manage all your projects in one place
                </p>
              </div>
            </div>

            <Link to="/idea-type">
              <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                New Idea
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 relative z-10">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/60 border-white/20 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {["all", "personal-development", "startup-idea", "existing-startup", "simple-project", "freelance-solo", "side-hustle", "local-business", "ecommerce", "nonprofit", "education-coaching", "content-creator", "tech-saas", "research-innovation"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className="whitespace-nowrap"
              >
                {type === "all" ? "All" : getTypeLabel(type)}
              </Button>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        {filteredIdeas.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No ideas found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Start by creating your first idea"}
              </p>
              <Link to="/idea-type">
                <Button className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Idea
                </Button>
              </Link>
            </div>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredIdeas.map((idea) => (
              <Link
                key={idea.id}
                to={`/workspace/${idea.id}${idea.id === 'you' ? '?type=personal-development&title=YOU' : ''}`}
                className="h-full"
              >

                <GlassCard
                  className={`p-6 flex flex-col justify-between h-full transition-all duration-300 hover:scale-105 hover:shadow-glow cursor-pointer group ${idea.isSpecial
                      ? 'bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 border-purple-400/20 hover:border-purple-400/40'
                      : ''
                    }`}
                >

                  <div className="flex items-start justify-between mb-4">
                    <Badge className={getTypeColor(idea.type)}>
                      {getTypeLabel(idea.type)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-70 hover:opacity-100 transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${idea.isSpecial
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                      : ''
                    }`}>
                    {idea.title}
                  </h3>

                  {idea.isSpecial && (
                    <p className="text-sm text-purple-300/80 mb-1 italic">
                      Your biggest project - personal growth & development
                    </p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">
                          Progress
                        </span>
                        <span className="text-sm font-medium">
                          {idea.progress}%
                        </span>
                      </div>
                      <Progress
                        value={idea.progress}
                        className={`h-2 ${idea.isSpecial
                            ? '[&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500'
                            : ''
                          }`}
                      />
                    </div>

                    {idea.isSpecial ? (
                      <div className="h-6" />
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {idea.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {idea.tags.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            +{idea.tags.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    Updated {idea.lastUpdated}
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Floating Ask AI Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button className="bg-gradient-primary hover:shadow-glow text-white px-5 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all duration-300">
          <MessageSquare className="w-5 h-5" />
          Ask AI
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
