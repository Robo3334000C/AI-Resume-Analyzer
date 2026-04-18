export type InterviewQuestion = {
    id: string;
    category: 'frontend' | 'backend' | 'behavioral' | 'fullstack' | 'data-science' | 'devops' | 'vocabulary' | 'technical' | 'resume';
    question: string;
    hint: string;
    difficulty: 'easy' | 'medium' | 'hard';
};

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
    // ── VOCABULARY & SPEAKING ───────────────────────────────
    {
        id: 'v1',
        difficulty: 'easy',
        category: 'vocabulary',
        question: "How would you introduce yourself professionally in a networking event?",
        hint: "Focus on a clear 'Elevator Pitch' - who you are, what you do, and what you're looking for."
    },
    {
        id: 'v2',
        difficulty: 'medium',
        category: 'vocabulary',
        question: "Explain a complex technical concept (like 'Recursion' or 'API') to a non-technical stakeholder.",
        hint: "Avoid jargon. Use analogies and focus on the 'What' and 'Why' rather than the 'How'."
    },
    {
        id: 'v3',
        difficulty: 'hard',
        category: 'vocabulary',
        question: "You need to deliver bad news to a client about a project delay. How do you sprout this conversation?",
        hint: "Use professional and empathetic language. Focus on transparency and the solution/next steps."
    },
    {
        id: 'v4',
        difficulty: 'medium',
        category: 'vocabulary',
        question: "What does 'Thinking outside the box' mean to you in a professional context? Give an example.",
        hint: "Focus on creative problem solving and challenging traditional assumptions."
    },

    // ── BEHAVIORAL (End of session) ───────────────────────────────
    {
        id: 'b1',
        difficulty: 'medium',
        category: 'behavioral',
        question: "Tell me about a time you faced a significant conflict with a colleague. How did you resolve it?",
        hint: "Use the STAR method (Situation, Task, Action, Result) and focus on professionalism over resentment."
    },
    {
        id: 'b2',
        difficulty: 'medium',
        category: 'behavioral',
        question: "Describe a project where you had to learn a new technology under tight deadlines. What was your approach?",
        hint: "Highlight your learning strategy (docs, sample projects) and time management skills."
    },
    {
        id: 'b3',
        difficulty: 'hard',
        category: 'behavioral',
        question: "What is your biggest professional failure, and what did you learn from it?",
        hint: "Be honest about the mistake, but focus heavily on the 'Lesson Learned' part."
    },

    // ── FRONTEND ───────────────────────────────────────────────
    {
        id: 'f-easy',
        difficulty: 'easy',
        category: 'frontend',
        question: "What is the difference between '==' and '===' in JavaScript?",
        hint: "Think about type coercion vs strict equality checks."
    },
    {
        id: 'f1',
        difficulty: 'medium',
        category: 'frontend',
        question: "Explain the difference between Virtual DOM and Shadow DOM.",
        hint: "Mention React's diffing algorithm for Virtual DOM and native browser encapsulation for Shadow DOM."
    },
    {
        id: 'f2',
        difficulty: 'hard',
        category: 'frontend',
        question: "How do you optimize a React application for performance?",
        hint: "Think about useMemo, useCallback, Code Splitting (React.lazy), and Image optimization."
    },

    // ── BACKEND ────────────────────────────────────────────────
    {
        id: 'be-easy',
        difficulty: 'easy',
        category: 'backend',
        question: "What is an API, and what are the most common HTTP methods used in REST?",
        hint: "GET for reading, POST for creating, PUT for updating, and DELETE for removing data."
    },
    {
        id: 'be1',
        difficulty: 'medium',
        category: 'backend',
        question: "What is horizontal vs vertical scaling in backend systems?",
        hint: "Vertical = more power to one machine; Horizontal = adding more machines to a cluster."
    },
    {
        id: 'be2',
        difficulty: 'hard',
        category: 'backend',
        question: "Explain the ACID properties of a database transaction.",
        hint: "Atomicity, Consistency, Isolation, and Durability."
    },

    // ── FULLSTACK ──────────────────────────────────────────────
    {
        id: 'fs-easy',
        difficulty: 'easy',
        category: 'fullstack',
        question: "What is the purpose of a .gitignore file?",
        hint: "It tells Git which files or directories to ignore in a project."
    },
    {
        id: 'fs1',
        difficulty: 'medium',
        category: 'fullstack',
        question: "Explain what happens when you type a URL in your browser and hit enter.",
        hint: "Cover DNS lookup, TCP/IP handshake, HTTP request, Server processing, and Browser rendering."
    },
    {
        id: 'fs2',
        difficulty: 'hard',
        category: 'fullstack',
        question: "How would you secure a REST API from common vulnerabilities?",
        hint: "Talk about JWT, Rate Limiting, CORS, and SQL Injection prevention."
    }
];
