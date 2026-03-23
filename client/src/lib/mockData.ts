export const generateMockFields = (ideaType: string) => {
  // Special fields for personal development (YOU project)
  if (ideaType === "personal-development") {
    return [
      {
        id: "identity-basics",
        title: "Identity & Basics",
        description: "Define who you are and your foundational information",
        aiGenerated: "Understanding your core identity helps align all other personal development efforts with your authentic self.",
        tasks: [
          { id: "id1", title: "Define Your Name/Handle", description: "Choose how you want to be known professionally and personally", weight: 8, completed: false },
          { id: "id2", title: "Set Your Location Context", description: "Document your location for legal, market, and cost-of-living context", weight: 6, completed: false },
          { id: "id3", title: "Add Your Age (Optional)", description: "Include age for career stage context and goal setting", weight: 4, completed: false },
          { id: "id4", title: "List Your Languages", description: "Document all languages you speak and their proficiency levels", weight: 5, completed: false },
          { id: "id5", title: "Create Personal Mission Statement", description: "Write a brief statement about your core values and purpose", weight: 9, completed: false, suggested: true }
        ]
      },
      {
        id: "skills-knowledge",
        title: "Skills & Knowledge",
        description: "Map out your current abilities and learning areas",
        aiGenerated: "A clear skills inventory helps you identify strengths to leverage and gaps to fill for your goals.",
        tasks: [
          { id: "sk1", title: "List Hard Skills", description: "Document technical skills (coding, design, finance, marketing, etc.)", weight: 8, completed: false },
          { id: "sk2", title: "Assess Soft Skills", description: "Evaluate communication, leadership, discipline, and other soft skills", weight: 7, completed: false },
          { id: "sk3", title: "Rate Proficiency Levels", description: "Rate each skill from 1-10 (beginner to expert)", weight: 6, completed: false },
          { id: "sk4", title: "Identify Skills in Progress", description: "List skills you're currently learning or improving", weight: 7, completed: false },
          { id: "sk5", title: "Create Learning Roadmap", description: "Plan which skills to develop next and how", weight: 8, completed: false, suggested: true }
        ]
      },
      {
        id: "experience-background",
        title: "Experience & Background",
        description: "Document your professional and personal journey",
        aiGenerated: "Your experience shapes your unique perspective and provides valuable context for future opportunities.",
        tasks: [
          { id: "exp1", title: "Document Work/Study Background", description: "List your professional and educational experiences", weight: 8, completed: false },
          { id: "exp2", title: "Catalog Past Projects", description: "Document finished, failed, and ongoing projects with lessons learned", weight: 7, completed: false },
          { id: "exp3", title: "List Achievements & Certifications", description: "Document all accomplishments and formal recognitions", weight: 6, completed: false },
          { id: "exp4", title: "Map Your Network", description: "Identify mentors, collaborators, and professional contacts", weight: 7, completed: false },
          { id: "exp5", title: "Create Professional Story", description: "Craft a compelling narrative of your journey and growth", weight: 8, completed: false, suggested: true }
        ]
      },
      {
        id: "preferences-style",
        title: "Preferences & Style",
        description: "Understand your working style and personal preferences",
        aiGenerated: "Knowing your preferences helps you create an environment and approach that maximizes your productivity and satisfaction.",
        tasks: [
          { id: "pref1", title: "Define Work Style", description: "Identify if you're structured, chaotic, fast-paced, or slow & steady", weight: 7, completed: false },
          { id: "pref2", title: "List Hobbies & Interests", description: "Document what drives your creativity and niche interests", weight: 6, completed: false },
          { id: "pref3", title: "Choose Preferred Tools", description: "List tools you prefer (Notion, Figma, VSCode, Canva, etc.)", weight: 5, completed: false },
          { id: "pref4", title: "Identify Industry Preferences", description: "List industries you like and dislike working in", weight: 6, completed: false },
          { id: "pref5", title: "Create Ideal Work Environment", description: "Design your perfect workspace and working conditions", weight: 7, completed: false, suggested: true }
        ]
      },
      {
        id: "resources-available",
        title: "Resources Available",
        description: "Assess what you have to work with",
        aiGenerated: "Realistic resource assessment helps you set achievable goals and make the most of what you have.",
        tasks: [
          { id: "res1", title: "Calculate Time per Week", description: "Determine how many hours per week you can dedicate to projects", weight: 8, completed: false },
          { id: "res2", title: "Set Budget Range", description: "Define your financial resources for projects and learning", weight: 7, completed: false },
          { id: "res3", title: "Assess Team Access", description: "Determine if you work solo or have access to collaborators", weight: 6, completed: false },
          { id: "res4", title: "Inventory Tech & Infrastructure", description: "List equipment and tools you already own", weight: 5, completed: false },
          { id: "res5", title: "Create Resource Optimization Plan", description: "Plan how to maximize your available resources", weight: 7, completed: false, suggested: true }
        ]
      },
      {
        id: "constraints-limitations",
        title: "Constraints & Limitations",
        description: "Identify what you cannot or will not do",
        aiGenerated: "Understanding your constraints helps you make better decisions and avoid overcommitting or compromising your values.",
        tasks: [
          { id: "con1", title: "List Time Constraints", description: "Document time limitations due to other commitments", weight: 7, completed: false },
          { id: "con2", title: "Identify Skill Gaps", description: "List skills you cannot develop due to time or ability constraints", weight: 6, completed: false },
          { id: "con3", title: "Define Ethical Boundaries", description: "List things you won't do due to personal ethics or values", weight: 8, completed: false },
          { id: "con4", title: "Document Legal Restrictions", description: "Identify any legal or regulatory constraints", weight: 5, completed: false },
          { id: "con5", title: "Set Risk Tolerance", description: "Define risks you're not willing to take", weight: 7, completed: false, suggested: true }
        ]
      },
      {
        id: "goals-motivation",
        title: "Goals & Motivation",
        description: "Define what you want to achieve and why",
        aiGenerated: "Clear goals and understanding your motivation provides direction and helps maintain momentum during challenges.",
        tasks: [
          { id: "goal1", title: "Set Short-Term Goals (3-6 months)", description: "Define specific, achievable goals for the next few months", weight: 8, completed: false },
          { id: "goal2", title: "Define Long-Term Goals (3-5 years)", description: "Create vision for where you want to be in several years", weight: 9, completed: false },
          { id: "goal3", title: "Identify Core Motivation", description: "Understand why you want to build (money, freedom, impact, etc.)", weight: 8, completed: false },
          { id: "goal4", title: "Choose Preferred Outcomes", description: "Define desired results (side income, startup, growth, etc.)", weight: 7, completed: false },
          { id: "goal5", title: "Create Goal Achievement Plan", description: "Break down goals into actionable steps with timelines", weight: 8, completed: false, suggested: true }
        ]
      },
      {
        id: "learning-growth",
        title: "Learning & Growth",
        description: "Plan your continuous development journey",
        aiGenerated: "Continuous learning is essential for staying relevant and achieving your goals. Plan your growth strategically.",
        tasks: [
          { id: "learn1", title: "List Topics to Learn Next", description: "Identify specific subjects or skills you want to master", weight: 7, completed: false },
          { id: "learn2", title: "Identify Weaknesses to Improve", description: "Honestly assess areas where you need significant improvement", weight: 8, completed: false },
          { id: "learn3", title: "Define Learning Style", description: "Determine if you learn best through reading, video, or hands-on", weight: 6, completed: false },
          { id: "learn4", title: "Set Learning Pace", description: "Choose between intensive vs slow learning approaches", weight: 5, completed: false },
          { id: "learn5", title: "Create Learning Schedule", description: "Plan when and how you'll dedicate time to learning", weight: 7, completed: false, suggested: true }
        ]
      },
      {
        id: "health-lifestyle",
        title: "Health & Lifestyle",
        description: "Optimize your physical and mental well-being for peak performance",
        aiGenerated: "Your health and lifestyle directly impact your ability to achieve goals. Optimize these for sustainable success.",
        tasks: [
          { id: "health1", title: "Identify Energy Patterns", description: "Determine if you're a morning person or night owl", weight: 6, completed: false },
          { id: "health2", title: "Assess Stress Tolerance", description: "Understand your stress levels and coping mechanisms", weight: 7, completed: false },
          { id: "health3", title: "Measure Focus Time", description: "Determine your average focus time per session", weight: 6, completed: false },
          { id: "health4", title: "Create Wellness Routine", description: "Design habits that support your physical and mental health", weight: 8, completed: false },
          { id: "health5", title: "Plan Work-Life Balance", description: "Create boundaries and routines for sustainable productivity", weight: 7, completed: false, suggested: true }
        ]
      }
    ];
  }

  const baseFields = [
    {
      id: "problem-solution",
      title: "Problem & Solution Fit",
      description: "Define the core problem and validate your solution approach",
      aiGenerated:
        "Your idea addresses a clear market need. Focus on validating the problem with potential users and refining your solution based on feedback.",
      tasks: [
        { id: "ps1", title: "Define Problem Statement", description: "Write a clear, concise problem statement that your idea solves", weight: 9, completed: true },
        { id: "ps2", title: "Validate Problem with Users", description: "Interview 10-15 potential users to confirm problem exists", weight: 8, completed: true },
        { id: "ps3", title: "Craft Value Proposition", description: "Create a compelling statement of how you solve the problem", weight: 7, completed: false },
        { id: "ps4", title: "Conduct Market Research Survey", description: "Create and distribute a survey to gather market insights", weight: 6, completed: false, suggested: true },
        { id: "ps5", title: "Analyze Competitor Solutions", description: "Deep dive into how competitors address similar problems", weight: 7, completed: false, suggested: true }
      ]
    },
    {
      id: "market-competition",
      title: "Market & Competition",
      description: "Analyze your target market and competitive landscape",
      aiGenerated:
        "The market shows strong growth potential. Key competitors exist but there's room for differentiation through your unique approach.",
      tasks: [
        { id: "mc1", title: "Define Target Market Size", description: "Research and quantify your total addressable market (TAM)", weight: 6, completed: true },
        { id: "mc2", title: "Analyze Direct Competitors", description: "Identify and study 5-10 direct competitors in detail", weight: 7, completed: false },
        { id: "mc3", title: "Identify Market Trends", description: "Research current and emerging trends affecting your market", weight: 5, completed: false },
        { id: "mc4", title: "Create Competitive Analysis Matrix", description: "Build a comprehensive comparison table of key competitors", weight: 6, completed: false, suggested: true },
        { id: "mc5", title: "Identify Market Gaps", description: "Find underserved segments or unmet needs in the market", weight: 8, completed: false, suggested: true }
      ]
    },
    {
      id: "product-strategy",
      title: "Product Strategy",
      description: "Define your MVP and core product features",
      aiGenerated:
        "Start with a focused MVP that addresses the core problem. Plan for iterative development based on user feedback.",
      tasks: [
        { id: "prod1", title: "Define MVP Features", description: "List the minimum features needed for a viable first version", weight: 9, completed: true },
        { id: "prod2", title: "Create User Stories", description: "Write detailed user stories for each core feature", weight: 6, completed: false },
        { id: "prod3", title: "Plan Tech Architecture", description: "Choose technology stack and plan system architecture", weight: 7, completed: false },
        { id: "prod4", title: "Design User Interface Mockups", description: "Create wireframes and mockups for key user flows", weight: 6, completed: false, suggested: true },
        { id: "prod5", title: "Set Up Development Environment", description: "Configure tools, repositories, and development workflow", weight: 5, completed: false, suggested: true }
      ]
    },
    {
      id: "execution-roadmap",
      title: "Execution Roadmap",
      description: "Create a phased plan with milestones and timelines",
      aiGenerated:
        "Break down execution into 6-month phases with clear milestones. Focus on rapid prototyping and user feedback loops.",
      tasks: [
        { id: "exec1", title: "Phase 1 Planning (Months 1-2)", description: "Plan initial development and market research phase", weight: 8, completed: true },
        { id: "exec2", title: "Phase 2 Planning (Months 3-4)", description: "Plan MVP development and initial testing", weight: 8, completed: false },
        { id: "exec3", title: "Phase 3 Planning (Months 5-6)", description: "Plan launch preparation and growth strategy", weight: 7, completed: false },
        { id: "exec4", title: "Set Up Project Management Tools", description: "Configure Trello, Asana, or similar for task tracking", weight: 5, completed: false, suggested: true },
        { id: "exec5", title: "Create Milestone Timeline", description: "Define key dates and deliverables for each phase", weight: 6, completed: false, suggested: true }
      ]
    },
    {
      id: "next-steps",
      title: "Next Steps",
      description: "Outline the immediate actions to move your idea forward",
      aiGenerated:
        "Focus on quick wins to build momentum — validate assumptions, talk to users, and ship a prototype fast.",
      tasks: [
        { id: "ns1", title: "Create Action List", description: "List the next 5–10 immediate steps", weight: 7, completed: false },
        { id: "ns2", title: "Reach Out to Mentors", description: "Discuss the plan with experienced advisors", weight: 5, completed: false },
        { id: "ns3", title: "Validate with Early Users", description: "Show prototype sketches to at least 3 users", weight: 6, completed: false }
      ]
    },
    {
      id: "risks-challenges",
      title: "Risks & Challenges",
      description: "Identify possible risks and mitigation strategies",
      aiGenerated:
        "Be proactive in recognizing what might go wrong — market, tech, funding, or team — and plan mitigations early.",
      tasks: [
        { id: "risk1", title: "List Technical Risks", description: "Document potential tech failures or limitations", weight: 7, completed: false },
        { id: "risk2", title: "Identify Market Risks", description: "Define adoption or competitor-related risks", weight: 6, completed: false },
        { id: "risk3", title: "Create Mitigation Plan", description: "Write strategies to minimize high-priority risks", weight: 8, completed: false }
      ]
    },
    {
      id: "scaling-impact",
      title: "Scaling & Impact",
      description: "Plan how to scale your product and measure long-term impact",
      aiGenerated:
        "Think ahead: how will your solution scale across markets, and how will you measure the positive impact it creates?",
      tasks: [
        { id: "scale1", title: "Plan Infrastructure Scaling", description: "Outline how to scale backend & infra", weight: 7, completed: false },
        { id: "scale2", title: "Measure Impact Metrics", description: "Define KPIs (adoption, retention, revenue, etc.)", weight: 8, completed: false },
        { id: "scale3", title: "Plan Expansion Strategy", description: "Define regional/market expansion roadmap", weight: 6, completed: false }
      ]
    },
    {
      id: "team-resources",
      title: "Team & Resources",
      description: "Define your core team and key resource needs",
      aiGenerated:
        "Strong teams build strong products. Identify required roles early and plan how to fill them.",
      tasks: [
        { id: "team1", title: "List Required Roles", description: "Define team roles (tech, design, marketing)", weight: 8, completed: false },
        { id: "team2", title: "Find Co-founders / Collaborators", description: "Reach out to potential collaborators", weight: 7, completed: false },
        { id: "team3", title: "Identify Key Resources", description: "Budget tools, infra, services needed", weight: 6, completed: false }
      ]
    },
    {
      id: "marketing-growth",
      title: "Marketing & Growth",
      description: "Plan how to acquire and retain users",
      aiGenerated:
        "Growth comes from both marketing and product excellence. Plan your first 100 users strategy.",
      tasks: [
        { id: "mg1", title: "Define Acquisition Channels", description: "List marketing channels to test", weight: 7, completed: false },
        { id: "mg2", title: "Plan Launch Campaign", description: "Outline campaign strategy for first launch", weight: 6, completed: false },
        { id: "mg3", title: "Retention Strategy", description: "Plan features/flows that drive retention", weight: 8, completed: false }
      ]
    }
  ];

  // Type-specific fields
  if (ideaType === "startup" || ideaType === "existing-startup") {
    baseFields.push({
      id: "business-monetization",
      title: "Business & Monetization",
      description: "Define your business model and revenue strategy",
      aiGenerated:
        "Consider multiple revenue streams. Start with one primary model and expand as you grow.",
      tasks: [
        { id: "biz1", title: "Choose Revenue Model", description: "Select primary monetization strategy (subscription, marketplace, etc.)", weight: 9, completed: true },
        { id: "biz2", title: "Set Pricing Strategy", description: "Research market rates and set competitive pricing", weight: 7, completed: false },
        { id: "biz3", title: "Plan Go-to-Market", description: "Create strategy for reaching and acquiring customers", weight: 8, completed: false },
        { id: "biz4", title: "Create Financial Projections", description: "Build 12-month revenue and expense forecasts", weight: 6, completed: false, suggested: true },
        { id: "biz5", title: "Research Funding Options", description: "Explore investors, grants, or loan opportunities", weight: 5, completed: false, suggested: true }
      ]
    });
  }

  if (ideaType === "nonprofit") {
    baseFields.push({
      id: "impact-measurement",
      title: "Impact & Measurement",
      description: "Define success metrics and impact tracking",
      aiGenerated:
        "Focus on measurable outcomes that align with your mission. Plan for both quantitative and qualitative metrics.",
      tasks: [
        { id: "impact1", title: "Define Impact Metrics", description: "Establish clear, measurable indicators of success", weight: 9, completed: false },
        { id: "impact2", title: "Plan Funding Strategy", description: "Research grants, donations, and funding opportunities", weight: 8, completed: false },
        { id: "impact3", title: "Build Partnerships", description: "Identify potential partner organizations and stakeholders", weight: 7, completed: false }
      ]
    });
  }

  if (ideaType === "simple-project") {
    baseFields.push({
      id: "learning-showcase",
      title: "Learning & Showcase",
      description: "Plan what you'll learn and how to present the project",
      aiGenerated:
        "Document your learning journey and create compelling case studies to showcase your skills.",
      tasks: [
        { id: "learn1", title: "Define Learning Goals", description: "List specific skills and technologies you want to learn", weight: 8, completed: false },
        { id: "learn2", title: "Plan Documentation", description: "Create strategy for documenting process and learnings", weight: 6, completed: false },
        { id: "learn3", title: "Prepare Case Study", description: "Plan how to present this project in your portfolio", weight: 7, completed: false }
      ]
    });
  }

  return baseFields;
};
