export type Link = {
  label: string;
  href: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
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

export const profile = {
  name: "Shaury Gautam",
  email: "shaury04@gmail.com",
  introduction:
    "I’m a computer science graduate student at UVA interested in software engineering and applied ML",
  availability: "Graduating May 2027 · Open to new graduate roles",
  // Add the cleaned PDF at public/resume.pdf, then set this to "/resume.pdf".
  resume: undefined as "/resume.pdf" | undefined,
  photos: [
    { src: "/images/personal/with-dogs-1120.webp", smallSrc: "/images/personal/with-dogs-560.webp", alt: "Relaxing on a couch with two dogs", width: 1120, height: 1493 },
    { src: "/images/personal/gym-1120.webp", smallSrc: "/images/personal/gym-560.webp", alt: "Mirror photo at the gym", width: 1120, height: 1991 },
    { src: "/images/personal/friends-1120.webp", smallSrc: "/images/personal/friends-560.webp", alt: "A group of friends together in costumes", width: 1120, height: 1493 },
    { src: "/images/personal/dinner-1120.webp", smallSrc: "/images/personal/dinner-560.webp", alt: "Friends gathered around a restaurant table", width: 1120, height: 1493 },
  ] satisfies Photo[],
  interests: ["Basketball", "pickleball", "coding for fun"],
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
      highlights: [
        "Built an ML experimentation platform and hotel-ranking pipeline using CatBoost YetiRank, improving NDCG@5 by 10.5% and NDCG@10 by 9.2%",
        "Raised booked-hotel rank-one placement from 26.7% to 33.6%, a gain of 6.9 percentage points",
      ],
      skills: ["Python", "Streamlit", "CatBoost", "Learning to rank"],
    },
    {
      company: "Siemens Digital Industries Software",
      role: "Software Engineering Intern",
      period: "December 2025 – May 2026",
      location: "Cincinnati, OH",
      highlights: [
        "Migrated a terminology-extraction pipeline from GPT-4o to GPT-5 mini, improving accuracy while reducing latency and cost",
        "Raised terminology specificity from 67% to 81% through document-context enrichment for product localization",
      ],
      skills: ["Python", "LLM evaluation", "Prompt engineering"],
    },
    {
      company: "RIIG Tech",
      role: "Graduate Research Assistant",
      period: "September – December 2025",
      location: "Charlottesville, VA",
      highlights: [
        "Built an agent to navigate phone menus using PPO, LLM prompt interpretation, speech-to-text context, and Twilio APIs",
        "Developed a graph-based simulator and state/action framework for offline training and evaluation",
      ],
      skills: ["Python", "PPO", "Twilio", "LLM agents"],
    },
  ] satisfies Experience[],
} as const;
