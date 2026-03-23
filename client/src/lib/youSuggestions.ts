export type YouTask = {
  id: string;
  title: string;
  description: string;
  weight: number;
  completed: boolean;
  suggested?: boolean;
};

const t = (title: string, description: string, weight = 6): YouTask => ({
  id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).slice(2, 7)}`,
  title,
  description,
  weight,
  completed: false,
  suggested: true,
});

export const getYouTasksForField = (key: string): YouTask[] => {
  switch (key) {
    case "skills":
      return [
        t("Pick a flagship skill", "Choose one high-leverage skill to master first." , 9),
        t("Daily 45m practice", "Block a consistent daily slot for focused drills.", 8),
        t("1 project per month", "Ship a small project to apply the skill in public.", 8),
        t("Read: Deep Work", "Cal Newport — build deep focus for faster skill growth.", 5),
      ];
    case "knowledge":
      return [
        t("Curate 3 sources", "Pick newsletters/podcasts with high signal-to-noise.", 6),
        t("Zettelkasten notes", "Capture and connect insights after each session.", 7),
        t("Summarize weekly", "Write a short weekly digest of what you learned.", 6),
      ];
    case "experience":
      return [
        t("Reverse CV", "List projects by impact/lessons, not just roles.", 6),
        t("Mentored replication", "Rebuild a great project end-to-end with guidance.", 7),
        t("Public write-ups", "Publish 2 case studies of past work.", 6),
      ];
    case "financial_stability":
      return [
        t("3–6 month runway", "Budget to cover essentials and reduce stress.", 8),
        t("Automate savings", "Pay yourself first via automatic transfers.", 6),
        t("Track expenses 30d", "Log spending to spot cut opportunities.", 5),
      ];
    case "health":
      return [
        t("Sleep 7–8h", "Consistent bedtime and wake time.", 8),
        t("Walk 8k+/day", "Daily movement baseline for energy.", 6),
        t("Strength 3x/week", "Short compound sessions for longevity.", 7),
      ];
    case "discipline":
      return [
        t("Daily schedule", "Plan tomorrow the night before (10 minutes).", 7),
        t("Habit tracker", "Track 3 keystone habits visibly.", 6),
        t("Accountability buddy", "Weekly check-in with a peer.", 5),
      ];
    case "network":
      return [
        t("Warm 10 contacts", "Reconnect with people you value (no asks).", 6),
        t("1 cold DM/week", "Thoughtful outreach with value upfront.", 6),
        t("Host a small meetup", "Gather 4–6 peers around a topic.", 7),
      ];
    case "mentors":
      return [
        t("List 5 candidates", "Identify mentors by specific traits and outcomes.", 6),
        t("Ask precise questions", "Short, contextual asks respecting time.", 6),
        t("Give updates", "Close feedback loop monthly with progress.", 5),
      ];
    case "location_advantage":
      return [
        t("Map local assets", "Communities, events, accelerators, coworking.", 5),
        t("Join 1 community", "Participate weekly with visible contributions.", 6),
      ];
    case "market_access":
      return [
        t("Interview 5 users", "Short calls to validate pains and language.", 7),
        t("Open a channel", "Newsletter, Discord, or X for distribution.", 6),
      ];
    case "resources":
      return [
        t("Audit tools", "List core tools and remove low-value ones.", 5),
        t("Automate 1 workflow", "Save 2h/week with a simple automation.", 6),
      ];
    case "location":
      return [
        t("Set city/country", "Record constraints and advantages.", 4),
        t("Travel plan", "Plan 1 trip to a hub for density and serendipity.", 5),
      ];
    case "mindset":
      return [
        t("Morning priming", "3-minute intention and gratitude.", 5),
        t("Reframe journal", "Turn setbacks into experiments.", 6),
        t("Read: Growth Mindset", "Carol Dweck — adopt learning lens.", 4),
      ];
    case "focus":
      return [
        t("2 deep-work blocks", "Two 60–90m focus sessions daily.", 8),
        t("Block distractions", "Website/app blockers during deep work.", 6),
      ];
    case "resilience":
      return [
        t("Energy review", "Weekly review of stressors and supports.", 5),
        t("Recovery toolkit", "Breathing, walks, social decompression.", 5),
      ];
    case "risk_tolerance":
      return [
        t("Small bets", "Place 3 tiny, reversible bets per month.", 6),
        t("Pre-mortem", "Write what could go wrong and mitigations.", 6),
      ];
    case "emotional_intelligence":
      return [
        t("Name emotions", "Check-in 3x/day with a mood label.", 4),
        t("Active listening", "Reflect back and confirm understanding.", 5),
      ];
    case "reading_habits":
      return [
        t("Read 20m/day", "Set a fixed slot and place.", 5),
        t("Book notes", "Write 5 bullets per chapter.", 5),
        t("Share summaries", "Post short summaries to teach others.", 5),
      ];
    case "creativity":
      return [
        t("Idea quota", "10 ideas/day on one theme.", 6),
        t("Inspiration system", "Swipe file with annotated examples.", 5),
      ];
    default:
      return [
        t("Define next action", "Pick one meaningful improvement step.", 6),
        t("Schedule it", "Put it on the calendar with a reminder.", 5),
      ];
  }
};

