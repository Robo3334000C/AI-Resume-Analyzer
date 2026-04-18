import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoadmapStep } from "@/types/career";
import { Map, Clock, CheckCircle2 } from "lucide-react";

interface RoadmapSectionProps {
  roadmap: RoadmapStep[];
}

export const RoadmapSection = ({ roadmap }: RoadmapSectionProps) => {
  return (
    <Card className="bg-card shadow-sm border rounded-3xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Map className="h-5 w-5 text-accent" />
          Career Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-secondary hidden md:block" />

          <div className="space-y-6">
            {roadmap.map((step, index) => (
              <div
                key={index}
                className="relative flex gap-4 md:gap-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Step indicator */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold font-display shadow-lg">
                    {step.step}
                  </div>
                </div>

                {/* Step content */}
                <div className="flex-1 pb-6">
                  <div className="bg-secondary/50 rounded-xl p-5 border border-border/50 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h4 className="font-semibold text-foreground text-lg font-display">
                        {step.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-sm text-accent">
                        <Clock className="h-4 w-4" />
                        <span>{step.duration}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Final goal */}
            <div className="relative flex gap-4 md:gap-6">
              <div className="flex-shrink-0 relative z-10">
                <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-success-foreground shadow-lg">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-success/10 border border-success/30 rounded-xl p-5">
                  <h4 className="font-semibold text-success text-lg font-display">
                    Career Ready! 🎉
                  </h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    You've completed the roadmap and are ready to start your career journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
