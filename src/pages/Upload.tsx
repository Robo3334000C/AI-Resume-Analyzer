import React, { useState } from 'react';
import { PageTransition } from '@/components/ui/page-transition';
import { useNavigate } from 'react-router-dom';
import * as pdfjs from 'pdfjs-dist';
import { motion, AnimatePresence } from 'framer-motion';
import FileUploader from '../components/FileUploader';
import { FloatingInput } from '@/components/ui/floating-input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';
import SectionHeader from '@/components/SectionHeader';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sparkles,
    Zap,
    Briefcase,
    CheckCircle2,
    Loader2,
    Fingerprint,
    Search,
    AlertCircle
} from 'lucide-react';
import { analyzeResumeLocally, AnalysisResult, formatCategory } from '@/lib/resumeAnalyzer';
import atsGood from '../assets/public/icons/ats-good.svg';

const LOADING_STEPS = [
    "Uploading to Secure Cloud...",
    "Extracting PDF Context...",
    "Running ATS Simulations...",
    "Generating Insights..."
];

// Explicitly set the PDF worker to prevent Vite build errors
try {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();
} catch (error) {
    console.warn("Could not set up PDF worker relative to import.meta.url", error);
}

const Upload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [targetRole, setTargetRole] = useState('');
    const [seniorityLevel, setSeniorityLevel] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(-1);
    const [resumeText, setResumeText] = useState('');
    const [localAnalysis, setLocalAnalysis] = useState<AnalysisResult | null>(null);

    const navigate = useNavigate();

    const extractAndAnalyze = async (selectedFile: File) => {
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const doc = await pdfjs.getDocument(arrayBuffer).promise;

            let fullText = "";
            for (let i = 1; i <= doc.numPages; i++) {
                const textPage = await doc.getPage(i);
                const textContent = await textPage.getTextContent();
                fullText += textContent.items.map((item: any) => item.str).join(' ') + " ";
            }
            setResumeText(fullText);

            const analysis = analyzeResumeLocally(fullText);
            setLocalAnalysis(analysis);

            if (!targetRole) {
                setTargetRole(formatCategory(analysis.category));
                toast.success(`Industry detected: ${formatCategory(analysis.category)}`);
            }
        } catch (error) {
            console.error("Local extraction failed:", error);
        }
    };

    React.useEffect(() => {
        if (file) {
            extractAndAnalyze(file);
        } else {
            setLocalAnalysis(null);
            setResumeText('');
        }
    }, [file]);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !targetRole || !seniorityLevel) return;

        setIsUploading(true);
        setLoadingStep(0);
        const loadingToast = toast.loading("ResuMe Engine Initializing...");

        try {
            // 1. Text — reuse from local analysis or extract fresh
            let fullText = resumeText;
            if (!fullText) {
                const buf = await file.arrayBuffer();
                const doc = await pdfjs.getDocument(buf).promise;
                let extracted = "";
                for (let i = 1; i <= doc.numPages; i++) {
                    const pg = await doc.getPage(i);
                    const tc = await pg.getTextContent();
                    extracted += tc.items.map((item: any) => item.str).join(' ') + " ";
                }
                fullText = extracted;
                setResumeText(fullText);
            }
            setLoadingStep(1);

            // 2. Thumbnail
            let thumbnailPath = "";
            try {
                const thumbBuf = await file.arrayBuffer();
                const thumbDoc = await pdfjs.getDocument(thumbBuf).promise;
                const page = await thumbDoc.getPage(1);
                const vp = page.getViewport({ scale: 0.8 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (ctx && vp.width > 0 && vp.height > 0) {
                    canvas.width = vp.width;
                    canvas.height = vp.height;
                    await page.render({ canvasContext: ctx, viewport: vp } as any).promise;
                    const blob = await new Promise<Blob | null>((res) =>
                        canvas.toBlob((b) => res(b), 'image/jpeg', 0.6)
                    );
                    if (blob) {
                        const ts = Date.now();
                        thumbnailPath = `thumb_${ts}.jpg`;
                        await window.puter.fs.write(thumbnailPath, blob);
                    }
                }
            } catch (thumbErr) {
                console.warn("Thumbnail generation skipped:", thumbErr);
                // Non-fatal — continue without thumbnail
            }
            setLoadingStep(2);

            // 3. AI Analysis
            const prompt = `Act as a Senior Tech Recruiter. I am a ${seniorityLevel} level candidate applying for a ${targetRole} position. 
            Detected Industry Category: ${localAnalysis?.category} (Confidence: ${localAnalysis?.confidence})
            ${jobDescription ? `Analyze the following resume specifically against this Job Description:\n${jobDescription}` : "Analyze the following resume text against industry standards for this role."}
            
            Resume Text:
            ${fullText}

            CRITICAL: Return ONLY raw, valid JSON. Do not wrap in \`\`\`json markdown blocks. Do not include introductory text. Schema MUST strictly match: { "score": number, "summary": string, "strengths": string[], "weaknesses": string[], "actionItems": [{ "title": string, "description": string }] }`;

            const aiResponse = await window.puter.ai.chat(prompt);
            let jsonString = typeof aiResponse === 'object' && aiResponse !== null && 'text' in aiResponse
                ? String((aiResponse as any).text)
                : String(aiResponse);

            let cleanedJson = jsonString.trim();
            // Strip markdown code fences if present
            const fenceMatch = cleanedJson.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (fenceMatch) {
                cleanedJson = fenceMatch[1].trim();
            }

            // 4. Persistence & Validation
            let payload;
            try {
                payload = JSON.parse(cleanedJson);
            } catch (pErr) {
                console.error("JSON Parse Error. Raw AI output:", cleanedJson);
                throw new Error("AI returned unreadable format. Please retry.");
            }
            
            if (typeof payload.score !== 'number' || !payload.summary || !Array.isArray(payload.strengths)) {
                console.error("AI Response structure mismatch:", payload);
                throw new Error("Analysis data was incomplete. Please retry.");
            }

            const id = crypto.randomUUID();
            const record = {
                id,
                createdAt: Date.now(),
                pdfPath: file.name,
                thumbnailPath,
                result: payload,
                fullText: fullText
            };

            setLoadingStep(3);
            await window.puter.kv.set(id, record);

            toast.dismiss(loadingToast);
            toast.success("Analysis complete!");
            navigate('/result/' + id);
        } catch (error: unknown) {
            console.error("Analysis pipeline failed:", error);
            // Serialize any error shape — Puter errors may not be standard Error objects
            let msg = 'An unexpected error occurred.';
            if (error instanceof Error) {
                msg = error.message;
            } else if (typeof error === 'string') {
                msg = error;
            } else if (error && typeof error === 'object') {
                msg = JSON.stringify(error).slice(0, 200);
            }
            toast.dismiss(loadingToast);
            toast.error(`Analysis failed: ${msg}`);
            setIsUploading(false);
            setLoadingStep(-1);
        }
    };

    return (
        <PageTransition>
        <div className="min-h-screen bg-stitch-background selection:bg-stitch-primary/30 pb-32 text-foreground font-body overflow-x-hidden relative">
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-stitch-primary/10 rounded-full blur-[120px]"></div>
            </div>

            <Header />
            
            <div className="container mx-auto px-6 pt-32 pb-8">
                <SectionHeader />
            </div>

            <div className="container mx-auto px-6 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start lg:pt-10">

                    {/* Visual Accents (Left on Desktop) */}
                    <div className="hidden lg:block lg:col-span-4 space-y-10 pt-10">
                        <div className="space-y-4">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center p-2 opacity-80 transition-all hover:scale-105">
                                <img src={atsGood} alt="ATS Icon" className="w-full h-full dark:brightness-0 dark:invert" />
                            </div>
                            <h3 className="text-xl font-black text-foreground">ATS Optimized</h3>
                            <p className="text-on-surface-variant font-medium leading-relaxed">Our AI simulates enterprise tracking systems to ensure your CV passes the first filter.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 flex items-center justify-center text-stitch-primary">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-foreground">Instant Insights</h3>
                            <p className="text-on-surface-variant font-medium leading-relaxed">Get a comprehensive score and actionable feedback in under 30 seconds.</p>
                        </div>
                    </div>

                    {/* Main Form (Right on Desktop) */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card border border-stitch-outline/10 shadow-xl rounded-[2.5rem] p-10 lg:p-14 overflow-hidden relative backdrop-blur-xl"
                        >
                            {/* Decorative Glow */}
                            <div className="absolute -top-24 -right-24 w-72 h-72 bg-stitch-primary/10 rounded-full blur-[100px] opacity-60 pointer-events-none" />

                            <div className="relative space-y-10 z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-5 h-5 text-stitch-primary fill-stitch-primary" />
                                        <span className="text-[10px] font-black text-stitch-primary uppercase tracking-[0.2em]">AI Powered Analysis</span>
                                    </div>
                                    <h1 className="text-5xl font-black tracking-tight text-on-background leading-[1.1]">
                                        Scan your <span className="text-stitch-primary italic">Resume.</span>
                                    </h1>
                                    <p className="text-lg text-on-surface-variant font-medium">Configure your target role and let ResuME do the magic.</p>
                                </div>

                                <form onSubmit={handleAnalyze} className="space-y-8 relative z-20">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <FloatingInput
                                                id="targetRole"
                                                label="Target Position"
                                                icon={<Briefcase />}
                                                placeholder=" "
                                                value={targetRole}
                                                onChange={(e) => setTargetRole(e.target.value)}
                                                disabled={isUploading}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="seniority" className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1 mb-2 block">Experience Level</Label>
                                            <Select value={seniorityLevel} onValueChange={setSeniorityLevel} disabled={isUploading} required>
                                                <SelectTrigger className="h-16 pt-0 bg-transparent glass-card border border-stitch-outline/20 dark:border-[#8f937a]/20 rounded-[1.5rem] font-bold text-foreground focus:ring-stitch-primary/20 hover:border-stitch-outline/40 transition-all shadow-xl" id="seniority">
                                                    <SelectValue placeholder="Select rank" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-popover dark:bg-[#131410] backdrop-blur-xl rounded-2xl border border-stitch-outline/20 dark:border-[#8f937a]/20 shadow-2xl text-popover-foreground font-medium">
                                                    <SelectItem value="intern" className="font-bold py-3 hover:bg-stitch-primary/10 hover:text-stitch-primary focus:bg-stitch-primary/10 focus:text-stitch-primary text-foreground">Intern / Trainee</SelectItem>
                                                    <SelectItem value="junior" className="font-bold py-3 hover:bg-stitch-primary/10 hover:text-stitch-primary focus:bg-stitch-primary/10 focus:text-stitch-primary text-foreground">Junior Level</SelectItem>
                                                    <SelectItem value="mid" className="font-bold py-3 hover:bg-stitch-primary/10 hover:text-stitch-primary focus:bg-stitch-primary/10 focus:text-stitch-primary text-foreground">Mid-Level</SelectItem>
                                                    <SelectItem value="senior" className="font-bold py-3 hover:bg-stitch-primary/10 hover:text-stitch-primary focus:bg-stitch-primary/10 focus:text-stitch-primary text-foreground">Senior Rank</SelectItem>
                                                    <SelectItem value="staff" className="font-bold py-3 hover:bg-stitch-primary/10 hover:text-stitch-primary focus:bg-stitch-primary/10 focus:text-stitch-primary text-foreground">Staff / Principal</SelectItem>
                                                    <SelectItem value="manager" className="font-bold py-3 hover:bg-stitch-primary/10 hover:text-stitch-primary focus:bg-stitch-primary/10 focus:text-stitch-primary text-foreground">Executive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="jobDescription" className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1 mb-2 block">Job Description (Optional)</Label>
                                        <textarea
                                            id="jobDescription"
                                            className="w-full min-h-[160px] p-6 bg-transparent glass-card border border-stitch-outline/10 rounded-[1.5rem] font-medium text-foreground focus:ring-2 focus:ring-stitch-primary/20 hover:border-stitch-outline/40 transition-all shadow-md resize-none placeholder:text-on-surface-variant/30"
                                            placeholder="Paste the job description here for a tailored analysis..."
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            disabled={isUploading}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-xs font-black text-on-surface-variant uppercase tracking-widest ml-1 block mb-2">Document Upload</Label>
                                        <FileUploader file={file} setFile={setFile} accent="stitch" />
                                    </div>

                                    {/* Local Resume DNA Result */}
                                    <AnimatePresence>
                                        {localAnalysis && !isUploading && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-8 bg-stitch-primary/5 border border-stitch-primary/10 rounded-[1.5rem] space-y-6 shadow-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 bg-stitch-primary/10 rounded-2xl">
                                                                <Fingerprint className="w-6 h-6 text-stitch-primary" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-black uppercase tracking-tighter text-on-surface-variant">Resume DNA Detected</h4>
                                                                <p className="text-lg font-black text-on-background leading-tight">{formatCategory(localAnalysis.category)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-3xl font-black text-stitch-primary leading-none">{localAnalysis.matchScore}%</div>
                                                            <div className="text-[10px] font-black uppercase text-on-surface-variant/40 tracking-widest mt-1">Industry Score</div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-stitch-primary/10">
                                                        <div className="space-y-3">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 flex items-center gap-2">
                                                                <Search className="w-3.5 h-3.5" /> Market Keywords Found
                                                            </span>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {localAnalysis.topKeywordsFound.slice(0, 6).map(kw => (
                                                                    <Badge key={kw} variant="secondary" className="bg-stitch-primary/10 text-stitch-primary border-none text-[10px] lowercase font-black px-3 py-1">{kw}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 flex items-center gap-2">
                                                                <AlertCircle className="w-3.5 h-3.5" /> Core Insights Missing
                                                            </span>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {localAnalysis.missingKeywords.slice(0, 6).map(kw => (
                                                                    <Badge key={kw} variant="outline" className="opacity-40 text-on-surface-variant border-stitch-outline/20 text-[10px] lowercase font-black px-3 py-1">{kw}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Multi-Step Animated Loader */}
                                    <AnimatePresence mode="wait">
                                        {isUploading ? (
                                            <motion.div
                                                key="loader"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="glass-card border border-stitch-outline/10 rounded-[1.5rem] p-6 space-y-4 shadow-md"
                                            >
                                                {LOADING_STEPS.map((step, idx) => {
                                                    const isActive = loadingStep === idx;
                                                    const isComplete = loadingStep > idx;

                                                    return (
                                                        <motion.div 
                                                            key={idx}
                                                            initial={{ x: -10, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            className="flex items-center gap-4"
                                                        >
                                                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-stitch-surface/40 shadow-sm shrink-0 border border-stitch-outline/20">
                                                                {isComplete ? (
                                                                    <CheckCircle2 className="w-5 h-5 text-stitch-primary" />
                                                                ) : isActive ? (
                                                                    <Loader2 className="w-5 h-5 text-stitch-primary animate-spin" />
                                                                ) : (
                                                                    <div className="w-2 h-2 rounded-full bg-foreground/10" />
                                                                )}
                                                            </div>
                                                            <span className={cn(
                                                                "font-bold text-sm transition-colors duration-300",
                                                                isActive ? "text-stitch-primary font-black" : isComplete ? "text-foreground" : "text-on-surface-variant"
                                                            )}>
                                                                {step}
                                                            </span>
                                                        </motion.div>
                                                    );
                                                })}
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                key="submit"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                type="submit"
                                                className="w-full h-20 text-xl font-black mt-8 rounded-[1.5rem] bg-gradient-to-br from-stitch-primary-container to-stitch-primary text-[#171e00] hover:shadow-[0_15px_40px_rgba(183,222,5,0.4)] shadow-[0_10px_30px_rgba(183,222,5,0.2)] transition-all active:scale-[0.98] uppercase tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                                disabled={!file || !targetRole || !seniorityLevel}
                                            >
                                                Analyze My Resume
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
        </PageTransition>
    );
};

export default Upload;
