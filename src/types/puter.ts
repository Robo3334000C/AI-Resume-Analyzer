export interface PuterUser {
    id: string;
    username: string;
    avatar_url?: string;
    email?: string;
}

export interface AnalysisActionItem {
    title: string;
    description: string;
}

export interface AnalysisResult {
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    actionItems: AnalysisActionItem[];
}

export interface KVDatabaseRecord {
    id: string;
    createdAt: number;
    pdfPath: string;
    thumbnailPath: string;
    result: AnalysisResult;
    fullText?: string;
}

declare global {
    interface Window {
        puter: {
            auth: {
                getUser: () => Promise<PuterUser>;
                signIn: () => Promise<void>;
                signOut: () => Promise<void>;
            };
            fs: {
                write: (path: string, content: string | Blob | File | ArrayBuffer) => Promise<unknown>;
                read: (path: string) => Promise<Blob>;
            };
            ai: {
                chat: (prompt: string) => Promise<{ toString?: () => string, text?: string } | unknown>;
            };
            kv: {
                set: (key: string, value: unknown) => Promise<void>;
                get: (key: string) => Promise<unknown>;
                list: () => Promise<{ key: string, value: unknown }[] | unknown>;
                del: (key: string) => Promise<void>;
            };
        };
    }
}
