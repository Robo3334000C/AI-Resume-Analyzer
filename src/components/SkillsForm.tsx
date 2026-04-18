import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SkillSlider } from "./SkillSlider";
import { Skills, skillLabels, skillIcons } from "@/types/career";
import { Sparkles, RotateCcw } from "lucide-react";

interface SkillsFormProps {
  onSubmit: (skills: Skills) => void;
  isLoading: boolean;
}

const defaultSkills: Skills = {
  programming: 5,
  python: 5,
  dsa: 5,
  ml: 3,
  web: 5,
  db: 4,
  cyber: 3,
  qa: 4,
  cloud: 3,
  communication: 6,
};

export const SkillsForm = ({ onSubmit, isLoading }: SkillsFormProps) => {
  const [skills, setSkills] = useState<Skills>(defaultSkills);

  const handleSkillChange = (key: keyof Skills, value: number) => {
    setSkills((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSkills(defaultSkills);
  };

  const handleSubmit = () => {
    onSubmit(skills);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-display text-foreground mb-2">
          Rate Your Skills
        </h2>
        <p className="text-muted-foreground">
          Move the sliders to indicate your proficiency level (0-10) for each skill
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(skillLabels) as Array<keyof Skills>).map((key) => (
          <SkillSlider
            key={key}
            label={skillLabels[key]}
            icon={skillIcons[key]}
            value={skills[key]}
            onChange={(value) => handleSkillChange(key, value)}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button
          variant="outline"
          onClick={handleReset}
          className="gap-2"
          disabled={isLoading}
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Default
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="gap-2 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity px-8"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Analyze My Career
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
