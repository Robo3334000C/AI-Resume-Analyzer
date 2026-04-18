import { CareerAnalysis } from "@/types/career";
import { MatchScoreCard } from "./results/MatchScoreCard";
import { SkillsComparisonChart } from "./results/SkillsComparisonChart";
import { SalaryCard } from "./results/SalaryCard";
import { RoadmapSection } from "./results/RoadmapSection";
import { CoursesSection } from "./results/CoursesSection";
import { YouTubeSection } from "./results/YouTubeSection";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface CareerResultsProps {
  analysis: CareerAnalysis;
  onReset: () => void;
}

export const CareerResults = ({ analysis, onReset }: CareerResultsProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Section: Match Score and Why This Career */}
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Analysis Report
        </h2>
        <Button variant="outline" onClick={onReset} className="gap-2 rounded-xl">
          <ArrowLeft className="h-4 w-4" />
          Analyze Again
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MatchScoreCard
          careerTitle={analysis.careerTitle}
          matchScore={analysis.matchScore}
          whyThisCareer={analysis.whyThisCareer}
        />
        <div className="lg:col-span-2">
          <SkillsComparisonChart
            skillsComparison={analysis.skillsComparison}
            graphData={analysis.graphData}
          />
        </div>
      </div>

      {/* Salary Range */}
      <SalaryCard salaryRange={analysis.salaryRange} />

      {/* Career Roadmap */}
      <RoadmapSection roadmap={analysis.roadmap} />

      {/* Learning Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoursesSection courses={analysis.courses} />
        <YouTubeSection playlists={analysis.youtubePlaylist} />
      </div>
    </div>
  );
};
