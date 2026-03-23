export type YouField = {
  key: string;
  label: string;
  description: string;
  value?: number | string;
  type?: "progress" | "text";
};

export type YouSection = {
  id: string;
  title: string;
  icon: string; // lucide-react icon name
  fields: YouField[];
};

export const youSections: YouSection[] = [
  {
    id: "internal",
    title: "Internal Factors",
    icon: "Shield",
    fields: [
      { key: "skills", label: "Skills", description: "Your technical and soft skills directly impact execution speed and quality.", type: "progress", value: 60 },
      { key: "knowledge", label: "Knowledge", description: "Domain and general knowledge inform better decisions and strategies.", type: "progress", value: 55 },
      { key: "experience", label: "Experience", description: "Past projects and lessons learned reduce risk and increase effectiveness.", type: "progress", value: 50 },
      { key: "financial_stability", label: "Financial Stability", description: "Runway and cash flow stability reduce pressure and enable long-term bets.", type: "progress", value: 40 },
      { key: "health", label: "Health", description: "Physical and mental health sustain energy, focus, and resilience.", type: "progress", value: 65 },
      { key: "discipline", label: "Discipline", description: "Consistency and follow-through compound progress over time.", type: "progress", value: 45 },
    ],
  },
  {
    id: "external",
    title: "External Factors",
    icon: "Globe",
    fields: [
      { key: "network", label: "Network & Connections", description: "Relationships unlock opportunities, partnerships, and faster feedback.", type: "progress", value: 35 },
      { key: "mentors", label: "Mentors", description: "Experienced guidance accelerates learning and avoids common pitfalls.", type: "progress", value: 20 },
      { key: "location_advantage", label: "Location Advantage", description: "Geography can influence access to markets, talent, and events.", type: "progress", value: 30 },
      { key: "market_access", label: "Market Access", description: "Proximity to customers and channels speeds validation and growth.", type: "progress", value: 30 },
      { key: "resources", label: "Tools/Resources", description: "The right tools and infrastructure increase output and quality.", type: "progress", value: 50 },
      { key: "location", label: "Location (Set city/country)", description: "Where you are impacts cost, laws, and available communities.", type: "text", value: "" },
    ],
  },
  {
    id: "behavioral",
    title: "Behavioral & Emotional Factors",
    icon: "Brain",
    fields: [
      { key: "mindset", label: "Mindset", description: "Optimistic, growth-oriented beliefs drive persistence and creativity.", type: "progress", value: 55 },
      { key: "focus", label: "Focus", description: "Deep work capacity determines throughput on important tasks.", type: "progress", value: 40 },
      { key: "resilience", label: "Resilience", description: "Bounce-back ability keeps momentum after setbacks.", type: "progress", value: 50 },
      { key: "risk_tolerance", label: "Risk Tolerance", description: "Comfort with uncertainty enables bold moves and learning.", type: "progress", value: 35 },
      { key: "emotional_intelligence", label: "Emotional Intelligence", description: "Self- and social-awareness improve communication and leadership.", type: "progress", value: 45 },
      { key: "reading_habits", label: "Reading/Learning Habits", description: "Deliberate learning compounds knowledge and opportunities.", type: "progress", value: 30 },
      { key: "creativity", label: "Creativity", description: "Idea generation and lateral thinking create novel solutions.", type: "progress", value: 60 },
    ],
  },
];

