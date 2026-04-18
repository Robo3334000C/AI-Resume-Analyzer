import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/types/career";
import { BookOpen, ExternalLink } from "lucide-react";

interface CoursesSectionProps {
  courses: Course[];
}

export const CoursesSection = ({ courses }: CoursesSectionProps) => {
  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      Coursera: "bg-primary/10 text-primary border-primary/30",
      Udemy: "bg-accent/10 text-accent border-accent/30",
      edX: "bg-destructive/10 text-destructive border-destructive/30",
      LinkedIn: "bg-accent/10 text-accent border-accent/30",
      Pluralsight: "bg-warning/10 text-warning border-warning/30",
      default: "bg-accent/10 text-accent border-accent/30",
    };
    return colors[platform] || colors.default;
  };

  return (
    <Card className="bg-card shadow-sm border rounded-3xl overflow-hidden h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <BookOpen className="h-5 w-5 text-accent" />
          Recommended Courses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {courses.map((course, index) => (
            <a
              key={index}
              href={course.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-accent/50 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {course.name}
                  </h4>
                  <span
                    className={`inline-block mt-2 px-2.5 py-1 text-xs font-medium rounded-full border ${getPlatformColor(
                      course.platform
                    )}`}
                  >
                    {course.platform}
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
