import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface SkillSliderProps {
  label: string;
  icon: string;
  value: number;
  onChange: (value: number) => void;
}

export const SkillSlider = ({ label, icon, value, onChange }: SkillSliderProps) => {
  const getSkillLevel = (val: number) => {
    if (val <= 2) return { text: "Beginner", color: "text-destructive" };
    if (val <= 4) return { text: "Basic", color: "text-warning" };
    if (val <= 6) return { text: "Intermediate", color: "text-muted-foreground" };
    if (val <= 8) return { text: "Advanced", color: "text-accent" };
    return { text: "Expert", color: "text-success" };
  };

  const level = getSkillLevel(value);

  return (
    <div className="group bg-card rounded-3xl border p-5 transition-all duration-300 hover:shadow-xl hover:border-primary/30 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="font-medium text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", level.color)}>{level.text}</span>
          <span className="text-xl font-bold font-display text-primary">{value}</span>
        </div>
      </div>
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          max={10}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
};
