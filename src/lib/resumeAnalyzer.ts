import categoryKeywords from '../data/category-keywords.json';

export interface AnalysisResult {
    category: string;
    confidence: number;
    matchScore: number;
    topKeywordsFound: string[];
    missingKeywords: string[];
}

/**
 * Analyzes resume text locally using frequency-based keyword matching
 * from the Kaggle Resume Dataset.
 */
export const analyzeResumeLocally = (text: string): AnalysisResult => {
    const doc = text.toLowerCase();
    // Simple word extraction: alphanumeric only
    const words = doc.match(/\b[a-z]{3,}\b/g) || [];
    const wordSet = new Set(words);

    let bestCategory = 'General';
    let maxMatches = 0;
    let categoryScores: Record<string, number> = {};

    // Calculate score for each category
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
        let matches = 0;
        keywords.forEach(kw => {
            if (wordSet.has(kw.toLowerCase())) {
                matches++;
            }
        });
        
        categoryScores[category] = matches;
        if (matches > maxMatches) {
            maxMatches = matches;
            bestCategory = category;
        }
    });

    const bestKeywords = (categoryKeywords as any)[bestCategory] || [];
    const found = bestKeywords.filter((kw: string) => wordSet.has(kw.toLowerCase()));
    const missing = bestKeywords.filter((kw: string) => !wordSet.has(kw.toLowerCase())).slice(0, 15);

    // Calculate confidence: how much the best category stands out vs others
    const totalCategories = Object.keys(categoryKeywords).length;
    const avgMatches = Object.values(categoryScores).reduce((a, b) => a + b, 0) / totalCategories;
    const confidence = maxMatches > 0 ? (maxMatches - avgMatches) / maxMatches : 0;

    // Match score: percentage of top keywords found for that category
    const matchScore = bestKeywords.length > 0 ? (found.length / bestKeywords.length) * 100 : 0;

    return {
        category: bestCategory,
        confidence: Math.min(Math.max(confidence, 0), 1),
        matchScore: Math.round(matchScore),
        topKeywordsFound: found.slice(0, 10),
        missingKeywords: missing
    };
};

/**
 * Formats the category string for UI display
 */
export const formatCategory = (cat: string): string => {
    return cat.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};
