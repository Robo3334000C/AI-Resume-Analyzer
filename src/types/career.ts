export interface Skills {
  programming: number;
  python: number;
  dsa: number;
  ml: number;
  web: number;
  db: number;
  cyber: number;
  qa: number;
  cloud: number;
  communication: number;
}

export interface SkillComparison {
  skillName: string;
  requiredLevel: number;
  userLevel: number;
  gap: number;
}

export interface SalaryRange {
  entry: string;
  mid: string;
  senior: string;
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  duration: string;
}

export interface Course {
  name: string;
  platform: string;
  link: string;
}

export interface YouTubePlaylist {
  name: string;
  channel: string;
  link: string;
}

export interface GraphData {
  userSkills: Record<string, number>;
  requiredSkills: Record<string, number>;
}

export interface CareerAnalysis {
  careerTitle: string;
  matchScore: number;
  whyThisCareer: string;
  skillsComparison: SkillComparison[];
  salaryRange: SalaryRange;
  roadmap: RoadmapStep[];
  courses: Course[];
  youtubePlaylist: YouTubePlaylist[];
  graphData: GraphData;
}

export const skillLabels: Record<keyof Skills, string> = {
  programming: "Programming",
  python: "Python",
  dsa: "Data Structures & Algorithms",
  ml: "Machine Learning",
  web: "Web Development",
  db: "Database",
  cyber: "Cyber Security",
  qa: "Testing & QA",
  cloud: "Cloud & DevOps",
  communication: "Communication Skills",
};

export const skillIcons: Record<keyof Skills, string> = {
  programming: "💻",
  python: "🐍",
  dsa: "🧮",
  ml: "🤖",
  web: "🌐",
  db: "🗄️",
  cyber: "🔒",
  qa: "✅",
  cloud: "☁️",
  communication: "💬",
};
