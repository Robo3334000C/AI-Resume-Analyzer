import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillComparison, GraphData } from "@/types/career";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface SkillsComparisonChartProps {
  skillsComparison: SkillComparison[];
  graphData: GraphData;
}

export const SkillsComparisonChart = ({
  skillsComparison,
  graphData,
}: SkillsComparisonChartProps) => {
  // Transform data for radar chart
  const chartData = Object.keys(graphData.userSkills).map((skill) => ({
    skill: skill.length > 12 ? skill.substring(0, 12) + "..." : skill,
    fullSkill: skill,
    user: graphData.userSkills[skill],
    required: graphData.requiredSkills[skill],
  }));

  return (
    <Card className="bg-card shadow-sm border rounded-3xl overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <BarChart3 className="h-5 w-5 text-accent" />
          Skills Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
              />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 10]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <Radar
                name="Your Skills"
                dataKey="user"
                stroke="hsl(var(--accent))"
                fill="hsl(var(--accent))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Required Skills"
                dataKey="required"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Gap Table */}
        <div className="mt-4 space-y-2 max-h-[200px] overflow-y-auto">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">
            Skill Gap Analysis
          </h4>
          {skillsComparison.map((skill, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50 text-sm"
            >
              <span className="font-medium text-foreground">{skill.skillName}</span>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  You: <span className="text-accent font-semibold">{skill.userLevel}</span>
                </span>
                <span className="text-muted-foreground">
                  Req: <span className="text-primary font-semibold">{skill.requiredLevel}</span>
                </span>
                <span
                  className={`font-semibold ${skill.gap <= 0 ? "text-success" : "text-warning"
                    }`}
                >
                  {skill.gap <= 0 ? "✓" : `-${skill.gap}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
