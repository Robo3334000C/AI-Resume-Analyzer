import type { LanguageQuiz } from '@/data/quizQuestions';

// ── Types ───────────────────────────────────────────────────
export type QuizResult = {
    language: string;
    totalQuestions: number;
    correctAnswers: number;
    score: number; // 1–10 scale
    beginnerCorrect: number;
    beginnerTotal: number;
    intermediateCorrect: number;
    intermediateTotal: number;
    advancedCorrect: number;
    advancedTotal: number;
};

export type AnalysisOutput = {
    skillMetrics: { skill: string; level: number }[];
    pros: string[];
    cons: string[];
    streamSuggestions: { streamName: string; reason: string; matchScore: number }[];
    playlists: { title: string; topic: string; youtubeSearchQuery: string }[];
};

// ── Scoring ─────────────────────────────────────────────────
export function scoreQuiz(
    quiz: LanguageQuiz,
    answers: Record<string, number> // questionId → selected option index
): QuizResult {
    let correct = 0;
    let beginnerCorrect = 0, beginnerTotal = 0;
    let intermediateCorrect = 0, intermediateTotal = 0;
    let advancedCorrect = 0, advancedTotal = 0;

    for (const q of quiz.questions) {
        const isCorrect = answers[q.id] === q.correctAnswer;
        if (isCorrect) correct++;

        switch (q.difficulty) {
            case 'beginner':
                beginnerTotal++;
                if (isCorrect) beginnerCorrect++;
                break;
            case 'intermediate':
                intermediateTotal++;
                if (isCorrect) intermediateCorrect++;
                break;
            case 'advanced':
                advancedTotal++;
                if (isCorrect) advancedCorrect++;
                break;
        }
    }

    // Weighted scoring: beginner questions are worth less, advanced more
    const weightedScore =
        (beginnerCorrect * 1 + intermediateCorrect * 2 + advancedCorrect * 3) /
        (beginnerTotal * 1 + intermediateTotal * 2 + advancedTotal * 3);

    const score = Math.round(weightedScore * 10); // 0–10

    return {
        language: quiz.language,
        totalQuestions: quiz.questions.length,
        correctAnswers: correct,
        score: Math.max(1, score), // minimum 1
        beginnerCorrect,
        beginnerTotal,
        intermediateCorrect,
        intermediateTotal,
        advancedCorrect,
        advancedTotal,
    };
}

// ── Career stream mapping ───────────────────────────────────
type StreamDef = {
    name: string;
    keywords: string[];
    reason: string;
};

const CAREER_STREAMS: StreamDef[] = [
    {
        name: 'Full-Stack Web Development',
        keywords: ['JavaScript', 'TypeScript', 'React', 'HTML/CSS', 'SQL'],
        reason: 'Strong web technology skills make full-stack development a natural path.',
    },
    {
        name: 'Data Science & Machine Learning',
        keywords: ['Python', 'SQL', 'C++'],
        reason: 'Python and SQL are foundational for data analysis, and C++ helps with performance-critical ML tasks.',
    },
    {
        name: 'Systems & Embedded Programming',
        keywords: ['C', 'C++', 'Go'],
        reason: 'Low-level language proficiency is essential for OS, firmware, and embedded systems work.',
    },
    {
        name: 'Backend / Cloud Engineering',
        keywords: ['Go', 'Java', 'Python', 'SQL', 'TypeScript'],
        reason: 'Backend and cloud services rely on scalable, concurrent server-side languages.',
    },
    {
        name: 'Mobile App Development',
        keywords: ['Java', 'TypeScript', 'React', 'JavaScript'],
        reason: 'Java for Android and React Native for cross-platform make mobile development accessible.',
    },
    {
        name: 'DevOps & Site Reliability',
        keywords: ['Go', 'Python', 'SQL'],
        reason: 'Automation and infrastructure tooling heavily use Go and Python.',
    },
    {
        name: 'Frontend Engineering',
        keywords: ['JavaScript', 'TypeScript', 'React', 'HTML/CSS'],
        reason: 'Core web technologies are the foundation of every frontend role.',
    },
    {
        name: 'Game Development',
        keywords: ['C++', 'C', 'Java'],
        reason: 'Game engines and graphics programming demand high-performance language skills.',
    },
];

// ── Playlist suggestions ────────────────────────────────────
const PLAYLIST_MAP: Record<string, { title: string; topic: string; query: string }[]> = {
    Python: [
        { title: 'Python Full Course for Beginners', topic: 'Complete Python tutorial', query: 'python full course beginners 2025' },
        { title: 'Advanced Python Concepts', topic: 'Decorators, generators, async', query: 'advanced python concepts tutorial' },
    ],
    JavaScript: [
        { title: 'JavaScript Crash Course', topic: 'Modern JS from scratch', query: 'javascript crash course 2025' },
        { title: 'Advanced JavaScript Patterns', topic: 'Closures, prototypes, async/await', query: 'advanced javascript patterns tutorial' },
    ],
    Java: [
        { title: 'Java Programming Masterclass', topic: 'Core Java fundamentals', query: 'java programming masterclass 2025' },
        { title: 'Java Spring Boot Tutorial', topic: 'Enterprise Java development', query: 'java spring boot tutorial 2025' },
    ],
    'C++': [
        { title: 'C++ for Beginners', topic: 'OOP, pointers, STL', query: 'c++ full course beginners 2025' },
        { title: 'Modern C++ (C++17/20)', topic: 'Smart pointers, move semantics', query: 'modern c++ 17 20 tutorial' },
    ],
    React: [
        { title: 'React Complete Guide', topic: 'Components, hooks, routing', query: 'react complete guide 2025' },
        { title: 'React Project Build', topic: 'Full project from scratch', query: 'react project tutorial build 2025' },
    ],
    SQL: [
        { title: 'SQL for Beginners', topic: 'SELECT, JOIN, GROUP BY', query: 'sql for beginners tutorial 2025' },
        { title: 'Advanced SQL Queries', topic: 'Subqueries, window functions, optimization', query: 'advanced sql queries tutorial' },
    ],
    TypeScript: [
        { title: 'TypeScript Full Course', topic: 'Types, generics, interfaces', query: 'typescript full course 2025' },
        { title: 'TypeScript with React', topic: 'Building type-safe React apps', query: 'typescript react tutorial 2025' },
    ],
    'HTML/CSS': [
        { title: 'HTML & CSS Crash Course', topic: 'Responsive web design basics', query: 'html css crash course 2025' },
        { title: 'CSS Grid & Flexbox Mastery', topic: 'Modern layout techniques', query: 'css grid flexbox mastery tutorial' },
    ],
    C: [
        { title: 'C Programming Full Course', topic: 'Pointers, memory, structs', query: 'c programming full course 2025' },
        { title: 'Data Structures in C', topic: 'Linked lists, trees, graphs', query: 'data structures in c tutorial' },
    ],
    Go: [
        { title: 'Go Programming for Beginners', topic: 'Goroutines, channels, packages', query: 'go golang full course beginners 2025' },
        { title: 'Building APIs with Go', topic: 'REST APIs, microservices', query: 'golang rest api tutorial 2025' },
    ],
};

// ── Analysis Generator ──────────────────────────────────────
export function generateAnalysis(results: QuizResult[]): AnalysisOutput {
    // 1. Skill metrics
    const skillMetrics = results.map((r) => ({
        skill: r.language,
        level: r.score,
    }));

    // 2. Pros / Cons
    const pros: string[] = [];
    const cons: string[] = [];

    for (const r of results) {
        if (r.score >= 7) {
            pros.push(`Strong proficiency in ${r.language} (${r.correctAnswers}/${r.totalQuestions} correct).`);
        } else if (r.score >= 5) {
            pros.push(`Solid fundamentals in ${r.language} with room to grow in advanced topics.`);
        }

        if (r.score <= 3) {
            cons.push(`${r.language} needs significant improvement — focus on fundamentals first.`);
        } else if (r.score <= 5) {
            cons.push(`Intermediate ${r.language} gaps detected — practice more advanced concepts.`);
        }

        // Specific feedback based on difficulty tiers
        if (r.beginnerTotal > 0 && r.beginnerCorrect < r.beginnerTotal) {
            cons.push(`Review basic ${r.language} fundamentals (${r.beginnerCorrect}/${r.beginnerTotal} beginner questions correct).`);
        }
        if (r.advancedTotal > 0 && r.advancedCorrect === r.advancedTotal) {
            pros.push(`Excellent advanced ${r.language} knowledge — all advanced questions correct!`);
        }
    }

    if (pros.length === 0) pros.push('Keep learning — every expert was once a beginner!');
    if (cons.length === 0) cons.push('Great all-around performance! Consider exploring new technologies.');

    // 3. Career stream suggestions
    const streamSuggestions = CAREER_STREAMS.map((stream) => {
        const matchingSkills = results.filter((r) =>
            stream.keywords.includes(r.language)
        );
        const avgScore =
            matchingSkills.length > 0
                ? matchingSkills.reduce((sum, r) => sum + r.score, 0) / matchingSkills.length
                : 0;
        const coverage = matchingSkills.length / stream.keywords.length;
        const matchScore = Math.round(avgScore * 7 + coverage * 30); // weighted combo

        return {
            streamName: stream.name,
            reason: stream.reason,
            matchScore: Math.min(100, matchScore),
        };
    })
        .filter((s) => s.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 4);

    // 4. Playlists
    const playlists: AnalysisOutput['playlists'] = [];
    for (const r of results) {
        const langPlaylists = PLAYLIST_MAP[r.language];
        if (langPlaylists) {
            // If score is low, recommend beginner playlists; if high, recommend advanced
            const pick = r.score <= 5 ? langPlaylists[0] : langPlaylists[1] || langPlaylists[0];
            playlists.push({
                title: pick.title,
                topic: pick.topic,
                youtubeSearchQuery: pick.query,
            });
        }
    }

    return { skillMetrics, pros, cons, streamSuggestions, playlists };
}
