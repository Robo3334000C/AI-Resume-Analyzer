import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalaryRange } from "@/types/career";
import { IndianRupee, TrendingUp } from "lucide-react";

interface SalaryCardProps {
  salaryRange: SalaryRange;
}

export const SalaryCard = ({ salaryRange }: SalaryCardProps) => {
  const levels = [
    { label: "Entry Level", value: salaryRange.entry, icon: "🌱" },
    { label: "Mid Level", value: salaryRange.mid, icon: "📈" },
    { label: "Senior Level", value: salaryRange.senior, icon: "🚀" },
  ];

  return (
    <Card className="bg-card shadow-sm border rounded-3xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <IndianRupee className="h-5 w-5 text-accent" />
          Salary Range (India)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levels.map((level, index) => (
            <div
              key={index}
              className="relative p-6 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 border border-border/50 text-center group hover:shadow-lg transition-all duration-300"
            >
              <span className="text-3xl mb-3 block">{level.icon}</span>
              <p className="text-sm text-muted-foreground mb-2">{level.label}</p>
              <p className="text-2xl font-bold font-display text-foreground">
                {level.value}
              </p>
              {index < levels.length - 1 && (
                <TrendingUp className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-accent/50 hidden md:block" />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          * LPA = Lakhs Per Annum. Salaries vary based on location, company, and experience.
        </p>
      </CardContent>
    </Card>
  );
};
