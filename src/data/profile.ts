export type Link = {
  label: string;
  href: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  skills: string[];
};

export type Photo = {
  src: string;
  alt: string;
  smallSrc?: string;
  width: number;
  height: number;
};

export type Interest = {
  name: string;
  description: string;
  photo?: Photo;
};

export const profile = {
  name: "Shaury Gautam",
  email: "shaury04@gmail.com",
  headline: "Building software and ML systems",
  introduction:
    "I’m a Master of Computer Science student at UVA, graduating in May 2027. My work spans ML platforms, search ranking, predictive maintenance, and AI agents.",
  roleFocus: "Open to new graduate roles in software engineering and applied ML",
  portrait: {
    src: "/images/personal/with-dogs-1120.webp",
    smallSrc: "/images/personal/with-dogs-560.webp",
    alt: "Relaxing on a couch with two dogs",
    width: 1120,
    height: 1493,
  } as Photo,
  photos: [
    { src: "/images/personal/gym-1120.webp", smallSrc: "/images/personal/gym-560.webp", alt: "Mirror photo at the gym", caption: "At the gym", width: 1120, height: 1991 },
    { src: "/images/personal/friends-1120.webp", smallSrc: "/images/personal/friends-560.webp", alt: "A group of friends together in costumes", caption: "With friends", width: 1120, height: 1493 },
    { src: "/images/personal/dinner-1120.webp", smallSrc: "/images/personal/dinner-560.webp", alt: "Friends gathered around a restaurant table", caption: "Dinner with friends", width: 1120, height: 1493 },
  ],
  // Set this when a game, video, or other destination is ready.
  boredLink: undefined as string | undefined,
  interests: [
    { name: "Basketball", description: "Playing basketball" },
    { name: "Pickleball", description: "Playing pickleball" },
    { name: "Coding for fun", description: "Exploring ideas through personal projects" },
  ] satisfies Interest[] as Interest[],
  links: [
    { label: "GitHub", href: "https://github.com/shaury04" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/shauryg/" },
  ] satisfies Link[],
  education: [
    {
      school: "University of Virginia",
      logo: { src: "/images/uva-logo.svg", alt: "University of Virginia logo", width: 218, height: 53 },
      degree: "Master of Computer Science",
      period: "August 2025 – May 2027",
      location: "Charlottesville, VA",
    },
    {
      school: "James Madison University",
      logo: { src: "/images/jmu-logo-web.png", alt: "James Madison University logo", width: 700, height: 97 },
      degree: "Bachelor of Science in Computer Science",
      period: "August 2022 – May 2025",
      location: "Harrisonburg, VA",
    },
  ],
  experience: [
    {
      company: "Marriott International",
      role: "Data Science Intern",
      period: "June – August 2026",
      location: "Bethesda, MD",
      summary:
        "Built an extensible ML experimentation platform and a learning-to-rank pipeline for hotel search.",
      highlights: [
        "Improved NDCG@5 by 10.5% and NDCG@10 by 9.2% with CatBoost YetiRank.",
        "Raised booked-hotel rank-one placement by 6.9 percentage points, from 26.7% to 33.6%.",
      ],
      skills: ["Python", "Streamlit", "CatBoost", "Learning to rank"],
    },
    {
      company: "Siemens Digital Industries Software",
      role: "Software Engineering Intern",
      period: "December 2025 – May 2026",
      location: "Cincinnati, OH",
      summary:
        "Improved an existing LLM terminology-extraction pipeline for product localization.",
      highlights: [
        "Migrated inference from GPT-4o to GPT-5 mini while improving accuracy and reducing latency and cost.",
        "Raised terminology specificity from 67% to 81% with document-context enrichment.",
      ],
      skills: ["Python", "LLM evaluation", "Prompt engineering"],
    },
    {
      company: "RIIG Tech",
      role: "Graduate Research Assistant",
      period: "September – December 2025",
      location: "Charlottesville, VA",
      summary:
        "Built an agent that learns to navigate interactive voice-response systems.",
      highlights: [
        "Combined PPO, LLM prompt interpretation, speech-to-text context, and Twilio APIs.",
        "Developed a graph-based simulator and state/action framework for offline training and evaluation.",
      ],
      skills: ["Python", "PPO", "Twilio", "LLM agents"],
    },
  ] satisfies Experience[],
} as const;
