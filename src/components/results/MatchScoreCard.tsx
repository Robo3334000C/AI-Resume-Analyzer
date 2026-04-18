import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Lightbulb } from "lucide-react";
import ScoreGauge from "@/components/ScoreGauge";

interface MatchScoreCardProps {
  careerTitle: string;
  matchScore: number;
  whyThisCareer: string;
}

export const MatchScoreCard = ({
  careerTitle,
  matchScore,
  whyThisCareer,
}: MatchScoreCardProps) => {

  return (
    <Card className="bg-card shadow-sm border rounded-3xl overflow-hidden flex flex-col">
      <div className="bg-primary/5 p-6 border-b border-primary/10 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Trophy className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-widest text-primary">Best Match</span>
        </div>
        <h2 className="text-3xl font-black text-foreground text-center mb-2">
          {careerTitle}
        </h2>
        <ScoreGauge score={matchScore} size={140} strokeWidth={12} />
        <p className="text-sm text-muted-foreground mt-2 font-medium bg-background px-4 py-1.5 rounded-full border shadow-sm">
          Based on your skill profile
        </p>
      </div>

      <CardContent className="p-6 sm:p-8 flex-1 bg-background">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-2xl flex-shrink-0">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-2 text-lg">
              Why This Career Suits You
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {whyThisCareer}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
