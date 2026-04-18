// Predefined keywords for ATS matching
const TECH_KEYWORDS = new Set([
    "react", "angular", "vue", "javascript", "typescript", "node.js", "python", "java", "c++", "c#", "go", "ruby", "php",
    "html", "css", "tailwind", "bootstrap", "sass", "less", "redux", "graphql", "rest", "api", "sql", "mysql", "postgresql",
    "mongodb", "nosql", "redis", "elasticsearch", "docker", "kubernetes", "aws", "azure", "gcp", "linux", "git", "ci/cd",
    "jenkins", "github actions", "gitlab", "terraform", "ansible", "agile", "scrum", "kanban", "machine learning", "ai",
    "data science", "pandas", "numpy", "tensorflow", "pytorch", "spark", "hadoop", "kafka", "dsa", "algorithms",
    "data structures", "system design", "microservices", "serverless", "express", "django", "flask", "spring boot",
    "asp.net", "laravel", "mern", "mean", "lamp", "figma", "ui/ux", "jest", "cypress", "selenium", "mocha", "vitest",
    "swift", "kotlin", "react native", "flutter", "dart", "ios", "android", "mobile"
]);

const ACTION_VERBS = new Set([
    "architected", "spearheaded", "engineered", "optimized", "implemented", "developed",
    "designed", "led", "managed", "created", "built", "delivered", "deployed", "scaled",
    "reduced", "increased", "improved", "automated", "streamlined", "transformed"
]);

const WEAK_VERBS = ["worked on", "helped with", "responsible for", "was involved in", "did", "made"];

const EXTRACT_KEYWORDS = (text: string) => {
    const words = text.toLowerCase().match(/\b[\w.#+-]+\b/g) || [];
    return new Set(words.filter(w => TECH_KEYWORDS.has(w)));
};

export const evaluateResumeLocally = async (resumeText: string, jdText: string) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const resumeLower = resumeText.toLowerCase();
    const jdLower = jdText.toLowerCase();

    // 1. Keyword Matching
    const jdKeywords = EXTRACT_KEYWORDS(jdLower);
    const resumeKeywords = EXTRACT_KEYWORDS(resumeLower);

    let matchCount = 0;
    const missingKeywords: string[] = [];

    jdKeywords.forEach(kw => {
        if (resumeKeywords.has(kw)) {
            matchCount++;
        } else {
            missingKeywords.push(kw);
        }
    });

    const skillMatchScore = jdKeywords.size > 0 ? Math.round((matchCount / jdKeywords.size) * 40) : 40;

    // 2. Experience Relevance (Heuristic based on years and seniority terms)
    let experienceRelevance = 20; // Base score
    if (/senior|lead|principal|director/i.test(jdLower) && /senior|lead|principal|director/i.test(resumeLower)) {
        experienceRelevance += 10;
    } else if (/junior|entry/i.test(jdLower)) {
        experienceRelevance += 10; // Junior positions are forgiving
    } else {
        // If not matching specific seniority, give average
        experienceRelevance += 5;
    }

    // Cap at 30
    experienceRelevance = Math.min(experienceRelevance, 30);

    // 3. Impact Score (Checking for numbers, percentages, and strong action verbs)
    let impactScore = 5; // Base score
    if (/\d+%/.test(resumeLower)) impactScore += 5; // Has percentages
    if (/\$\d+|\d+%\s*increase|\d+%\s*decrease/i.test(resumeLower)) impactScore += 5; // Has monetary/metric impacts

    let strongVerbCount = 0;
    ACTION_VERBS.forEach(verb => {
        if (resumeLower.includes(verb)) strongVerbCount++;
    });
    impactScore += Math.min(strongVerbCount, 5); // Up to 5 points for strong verbs

    // Cap at 20
    impactScore = Math.min(impactScore, 20);

    const totalScore = skillMatchScore + experienceRelevance + impactScore;

    // Formatting critical gaps
    const criticalGaps: any[] = missingKeywords.slice(0, 5).map(kw => ({
        message: `Missing required skill/keyword: ${kw.toUpperCase()}`,
        linkObj: {
            text: `Search Google for 'How to add ${kw.toUpperCase()} to a resume'`,
            url: `https://www.google.com/search?q=How+to+add+${encodeURIComponent(kw)}+to+a+resume+2026`
        }
    }));
    if (criticalGaps.length === 0) {
        criticalGaps.push({ message: "Your resume matches most core requirements perfectly." });
    }

    // Heuristic rewrites for Weak Verbs
    const rewrittenSuccess: { original: string; improved: string }[] = [];
    WEAK_VERBS.forEach(weak => {
        const index = resumeLower.indexOf(weak);
        if (index !== -1) {
            // Find the sentence context roughly
            const start = Math.max(0, resumeLower.lastIndexOf(".", index) + 1);
            const end = Math.min(resumeLower.length, resumeLower.indexOf(".", index + weak.length));
            if (end !== -1) {
                const sentence = resumeText.substring(start, end).trim();
                if (sentence.length < 100) { // Keep it manageable
                    let replacement = "Engineered";
                    if (weak === "helped with") replacement = "Collaborated to deliver";
                    if (weak === "responsible for") replacement = "Spearheaded";

                    rewrittenSuccess.push({
                        original: `"... ${sentence} ..."`,
                        improved: `Replace '${weak}' with a stronger action verb like '${replacement}' to show impact.`
                    });
                }
            }
        }
    });

    if (rewrittenSuccess.length === 0) {
        if (strongVerbCount < 3) {
            rewrittenSuccess.push({
                original: "Resume lacks strong action verbs.",
                improved: "Start your bullet points with words like 'Architected', 'Optimized', or 'Spearheaded'."
            });
        } else {
            rewrittenSuccess.push({
                original: "Well structured bullets",
                improved: "Your action verbs look great! Ensure every bullet point includes a measurable metric (e.g. 'Improved performance by 20%')."
            });
        }
    }

    // Dynamic Specializations based on found keywords
    const specializations = [
        { name: "Frontend Development", matchPercentage: resumeKeywords.has("react") || resumeKeywords.has("javascript") ? 85 : 40 },
        { name: "Backend Architecture", matchPercentage: resumeKeywords.has("node.js") || resumeKeywords.has("python") || resumeKeywords.has("java") ? 80 : 45 },
        { name: "Cloud & Infrastructure", matchPercentage: resumeKeywords.has("aws") || resumeKeywords.has("docker") ? 75 : 30 },
    ].sort((a, b) => b.matchPercentage - a.matchPercentage);

    const matchedSkills = Array.from(jdKeywords).filter(kw => resumeKeywords.has(kw)).map(kw => kw.toUpperCase());

    const formatFeedback: string[] = [];
    if (!resumeLower.includes("education") && !resumeLower.includes("degree")) {
        formatFeedback.push("Missing standard 'Education' section.");
    } else {
        formatFeedback.push("Standard 'Education' section detected.");
    }
    if (!resumeLower.includes("experience") && !resumeLower.includes("work")) {
        formatFeedback.push("Missing standard 'Experience' section.");
    } else {
        formatFeedback.push("Standard 'Experience' section detected.");
    }

    const experienceFeedback: string[] = [];
    if (/senior|lead|principal|director/i.test(jdLower) && !/senior|lead|principal|director/i.test(resumeLower)) {
        experienceFeedback.push("The JD asks for Senior-level experience, but your resume lacks clear senior titles.");
    } else {
        experienceFeedback.push("Your experience level appears to align with the job requirements.");
    }

    if (/\d+%/.test(resumeLower) || /\$\d+/.test(resumeLower)) {
        experienceFeedback.push("Great job using numbers to quantify your impact!");
    } else {
        experienceFeedback.push("Quantify your achievements! Add metrics (%, $) to your bullet points.");
    }

    return {
        totalScore,
        breakdown: {
            skillMatch: skillMatchScore,
            experienceRelevance,
            impact: impactScore
        },
        matchedSkills,
        formatFeedback,
        experienceFeedback,
        criticalGaps,
        rewrittenSuccess: rewrittenSuccess.slice(0, 5), // Max 5 suggestions
        specializations
    };
};
