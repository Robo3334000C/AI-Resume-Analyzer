import { useState } from "react";
import { Skills, CareerAnalysis } from "@/types/career";
import { toast } from "sonner";

const SYSTEM_PROMPT_CAREER = `You are ResuMe, an AI Career Hub / Senior Career Counselor.
Analyze the provided skill levels and recommend the best career path.

Return your response strictly as a JSON object matching this structure:
{
  "careerTitle": string,
  "matchScore": number (0-100),
  "whyThisCareer": string (2-3 sentences explaining why),
  "skillsComparison": [
    { "skillName": string, "requiredLevel": number (1-10), "userLevel": number (1-10), "gap": number }
  ],
  "salaryRange": { "entry": string, "mid": string, "senior": string },
  "roadmap": [
    { "step": number, "title": string, "description": string, "duration": string }
  ],
  "courses": [
    { "name": string, "platform": string, "link": string }
  ],
  "youtubePlaylist": [
    { "name": string, "channel": string, "link": string }
  ],
  "graphData": {
    "userSkills": { "Programming": number, "Python": number, "DSA": number, "ML": number, "Web": number, "Database": number, "Cyber Security": number, "QA": number, "Cloud": number, "Communication": number },
    "requiredSkills": { "Programming": number, "Python": number, "DSA": number, "ML": number, "Web": number, "Database": number, "Cyber Security": number, "QA": number, "Cloud": number, "Communication": number }
  }
}

Provide real, useful course links and YouTube playlist links. The gap in skillsComparison should be requiredLevel - userLevel (can be negative if user exceeds requirement).
CRITICAL: Return ONLY raw, valid JSON. Do not wrap in markdown blocks.`;

export const useCareerAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCareer = async (skills: Skills) => {
    setIsLoading(true);
    setError(null);

    const loadingToast = toast.loading("Analyzing your profile using Puter AI...");

    try {
      const skillsText = Object.entries(skills)
        .map(([key, value]) => `- ${key}: ${value}/10`)
        .join('\n');

      const prompt = `${SYSTEM_PROMPT_CAREER}\n\n=== USER SKILLS ===\n${skillsText}`;

      const aiResponse = await window.puter.ai.chat(prompt);

      let jsonString = '';
      if (typeof aiResponse === 'object' && aiResponse !== null && 'text' in aiResponse) {
        jsonString = String(aiResponse.text);
      } else {
        jsonString = String(aiResponse);
      }

      // Cleanup markdown block padding if the AI misbehaved
      let cleanedJson = jsonString.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      const data = JSON.parse(cleanedJson);

      setAnalysis(data as CareerAnalysis);
      toast.success("Career analysis complete!", { id: loadingToast });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze career";
      setError(message);
      toast.error(message, { id: loadingToast });
      console.error("Career analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    isLoading,
    analysis,
    error,
    analyzeCareer,
    resetAnalysis,
  };
};
