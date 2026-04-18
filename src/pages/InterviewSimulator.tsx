import { useState, useEffect, useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { InterviewQuestion } from '@/data/interviewQuestions';
import { motion, AnimatePresence } from 'framer-motion';
import FileUploader from '@/components/FileUploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sparkles,
    ChevronRight,
    Zap,
    Lightbulb,
    MessageSquare,
    Trophy,
    FileText,
    Briefcase,
    Mic,
    MicOff,
    Volume2,
    Settings2,
    Search,
    Fingerprint,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import SectionHeader from '@/components/SectionHeader';
import { analyzeResumeLocally, AnalysisResult, formatCategory } from '@/lib/resumeAnalyzer';

// Explicitly set the PDF worker
try {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();
} catch (error) {
    console.warn("Could not set up PDF worker", error);
}

const SYSTEM_PROMPT_INTERVIEW = `You are an expert Technical Interviewer conducting an adaptive, conversational interview.
Evaluate the user's previous answer (if provided), AND generate the NEXT follow-up question based on their response, the stated topic, and difficulty.

Provide your response strictly as a JSON object matching this structure:
{
  "score": number (1-10, grade the previous answer. Use 0 if this is the first question),
  "feedback": string (2-3 sentences of spoken constructive criticism. Leave empty if first question),
  "idealAnswer": string (How a senior candidate would answer. Leave empty if first question),
  "nextQuestion": string (The next question to ask the user, naturally following up on their answer or shifting to a related concept),
  "hint": string (A quick text hint for the UI)
}

CRITICAL: Return ONLY raw, valid JSON. Do not wrap in markdown blocks. Make the 'feedback' and 'nextQuestion' conversational, as they will be spoken aloud to the user by a Text-to-Speech system.`;

const SYSTEM_PROMPT_VOCABULARY = `You are an expert English Language, Grammar & Communication Coach conducting a spoken fluency drill.
Your ONLY job is to evaluate and improve the user's GRAMMAR, COMMUNICATION SKILLS, PRONUNCIATION, sentence structure, vocabulary usage, and spoken fluency.

ABSOLUTE RULE: You must NEVER ask any technical, coding, engineering, science, or domain-specific knowledge question. Every question and scenario you create must be purely about language, speaking ability, grammar, articulation, and professional communication.

Types of prompts you should give:
- Ask the user to describe a situation, opinion, or experience (e.g., "Describe your morning routine using at least three complex sentences.")
- Give a sentence with grammatical errors and ask them to correct it aloud.
- Ask them to rephrase a casual sentence into formal/professional language.
- Present a word and ask them to use it in a sentence (vocabulary building).
- Ask them to explain a common idiom or phrase in their own words.
- Give a short paragraph and ask them to summarize it concisely.
- Ask them to introduce themselves professionally or give a 30-second elevator pitch.

When evaluating, focus EXCLUSIVELY on:
- Grammar correctness (tense, subject-verb agreement, articles, prepositions)
- Sentence structure and complexity
- Word choice and vocabulary richness
- Clarity and conciseness of expression
- Professional tone and articulation
- Pronunciation hints (flag commonly mispronounced words)

Provide your response strictly as a JSON object matching this structure:
{
  "score": number (1-10, grade the previous answer on grammar/communication quality. Use 0 if first question),
  "feedback": string (2-3 sentences of spoken constructive criticism focusing ONLY on grammar, pronunciation, vocabulary, and communication clarity. Point out specific grammatical errors if any. Leave empty if first question),
  "idealAnswer": string (A grammatically perfect, more articulate and polished version of what they said. Leave empty if first question),
  "nextQuestion": string (The next grammar/communication/pronunciation prompt or scenario — NEVER technical),
  "hint": string (A quick grammar or vocabulary tip for the UI)
}

CRITICAL: Return ONLY raw, valid JSON. Do not wrap in markdown blocks. Make 'feedback' and 'nextQuestion' highly conversational, warm, and encouraging. Remember — ZERO technical questions, ONLY language and communication.`;

const SYSTEM_PROMPT_RESUME_EVAL = `You are a Senior Technical Recruiter conducting an adaptive interview based on the candidate's resume.
Evaluate their response based on accuracy, depth of experience shown, and professional delivery, AND generate the NEXT question tailored to their resume.

Provide your response strictly as a JSON object matching this structure:
{
  "score": number (1-10, grade the previous answer. Use 0 if first question),
  "feedback": string (2-3 sentences of spoken constructive criticism. Leave empty if first question),
  "idealAnswer": string (How a top-tier candidate would answer. Leave empty if first question),
  "nextQuestion": string (The next specific question derived from their resume or building on their last answer),
  "hint": string (A quick text hint for the UI)
}

CRITICAL: Return ONLY raw, valid JSON. Do not wrap in markdown blocks. Make 'feedback' and 'nextQuestion' conversational.`;

type ViewState = 'selection' | 'config' | 'resume-upload' | 'active';
type InterviewType = 'technical' | 'vocabulary' | 'resume';

// Map each view to its logical parent for back-navigation
const VIEW_PARENT: Record<ViewState, ViewState | null> = {
    'selection': null,       // top-level — back leaves the page
    'config': 'selection',
    'resume-upload': 'selection',
    'active': 'selection',   // from active interview, back goes to selection
};

const InterviewSimulator = () => {
    const navigate = useNavigate();
    const [view, setView] = useState<ViewState>('selection');
    const [interviewType, setInterviewType] = useState<InterviewType>('technical');

    // Browser back-button integration: push history when view changes, intercept popstate
    const changeView = useCallback((newView: ViewState) => {
        window.history.pushState({ interviewView: newView }, '');
        setView(newView);
    }, []);

    useEffect(() => {
        // Push initial state entry
        window.history.replaceState({ interviewView: 'selection' }, '');

        const handlePopState = (event: PopStateEvent) => {
            const state = event.state;
            if (state && state.interviewView) {
                // The browser went back to a previously pushed interview view
                setView(state.interviewView);
            } else {
                // No interview state — user pressed back from the top-level selection
                // Let the browser navigate away normally (to previous page)
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Configuration State
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('medium');

    // Resume Upload State
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [targetRole, setTargetRole] = useState('');
    const [seniorityLevel, setSeniorityLevel] = useState('');
    const [resumeText, setResumeText] = useState('');

    const [isGenerating, setIsGenerating] = useState(false);
    
    // Dataset-driven local analysis
    const [localAnalysis, setLocalAnalysis] = useState<AnalysisResult | null>(null);
    
    // Adaptive Session State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [feedback, setFeedback] = useState<{ score: number; feedback: string; idealAnswer: string } | null>(null);
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [cooldown, setCooldown] = useState(0);

    // Audio State
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechRecognition, setSpeechRecognition] = useState<any>(null);

    // Voice Pack State
    const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Filter to English voices and sort: prioritize natural/premium sounding ones
                const englishVoices = voices.filter(v => v.lang.startsWith('en'));
                const sorted = englishVoices.sort((a, b) => {
                    // Prefer remote/cloud voices (usually higher quality)
                    if (!a.localService && b.localService) return -1;
                    if (a.localService && !b.localService) return 1;
                    return a.name.localeCompare(b.name);
                });
                setAvailableVoices(sorted.length > 0 ? sorted : voices);
                // Auto-select the first premium voice
                if (!selectedVoiceURI && sorted.length > 0) {
                    setSelectedVoiceURI(sorted[0].voiceURI);
                }
            }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => { window.speechSynthesis.onvoiceschanged = null; };
    }, []);

    const previewVoice = (voiceURI: string) => {
        window.speechSynthesis.cancel();
        const voice = availableVoices.find(v => v.voiceURI === voiceURI);
        if (voice) {
            const utterance = new SpeechSynthesisUtterance("Hello! I will be your interview coach today. Let's get started.");
            utterance.voice = voice;
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    // Setup Web Speech API
    useEffect(() => {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            
            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setUserAnswer(prev => {
                        const trimmed = prev.trim();
                        return trimmed ? trimmed + ' ' + finalTranscript.trim() : finalTranscript.trim();
                    });
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                setIsRecording(false);
            };
            
            recognition.onend = () => {
                setIsRecording(false);
            };

            setSpeechRecognition(recognition);
        } else {
            console.warn("Speech Recognition not supported in this browser.");
        }
    }, []);

    const toggleRecording = () => {
        if (!speechRecognition) {
            toast.error("Speech recognition is not supported in this browser.");
            return;
        }

        if (isRecording) {
            speechRecognition.stop();
        } else {
            // Stop speech synthesis if it's talking
            window.speechSynthesis.cancel();
            speechRecognition.start();
            setIsRecording(true);
        }
    };

    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            // Apply the selected voice pack
            if (selectedVoiceURI) {
                const voice = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
                if (voice) utterance.voice = voice;
            }
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    // Handle cooldown
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const extractResumeText = async (file: File) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
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
                toast.success(`Automatically detected: ${formatCategory(analysis.category)}`, { icon: '🔍' });
            }
            
            return fullText;
        } catch (error) {
            console.error("PDF extraction failed:", error);
            toast.error("Failed to read PDF content.");
            return "";
        }
    };

    useEffect(() => {
        if (resumeFile) {
            extractResumeText(resumeFile);
        } else {
            setLocalAnalysis(null);
            setResumeText('');
        }
    }, [resumeFile]);

    const handleStartAdaptiveSession = async () => {
        if (interviewType === 'resume') {
            if (!resumeFile || !targetRole || !seniorityLevel) {
                toast.error("Please fill in all fields.");
                return;
            }
        } else {
            if (!topic) {
                toast.error("Please provide a topic.");
                return;
            }
        }

        setIsGenerating(true);
        changeView('active');
        const loadingToast = toast.loading("AI Interviewer is preparing the session...");

        try {
            let extractedText = resumeText;
            if (interviewType === 'resume' && !extractedText && resumeFile) {
                extractedText = await extractResumeText(resumeFile);
            }

            let systemPrompt = SYSTEM_PROMPT_INTERVIEW;
            if (interviewType === 'vocabulary') systemPrompt = SYSTEM_PROMPT_VOCABULARY;
            if (interviewType === 'resume') systemPrompt = SYSTEM_PROMPT_RESUME_EVAL;

            let contextStr = `\n\n=== CONTEXT ===\nThis is the very first question of the interview.`;
            if (interviewType === 'resume') {
                contextStr += `\nTarget Role: ${targetRole}\nSeniority: ${seniorityLevel}\nResume Content: ${extractedText}\nLocal Analysis Category: ${localAnalysis?.category}\nLocal Confidence: ${localAnalysis?.confidence}\nDifficulty: ${difficulty}`;
            } else {
                contextStr += `\nTopic: ${topic}\nDifficulty: ${difficulty}`;
            }

            const prompt = `${systemPrompt}${contextStr}\n\nGenerate the FIRST question.`;
            const aiResponse = await window.puter.ai.chat(prompt);

            let jsonString = typeof aiResponse === 'object' && aiResponse !== null && 'text' in aiResponse
                ? String(aiResponse.text) : String(aiResponse);

            let cleanedJson = jsonString.trim();
            if (cleanedJson.startsWith('```')) {
                cleanedJson = cleanedJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
            }

            const result = JSON.parse(cleanedJson);
            
            setQuestions([{
                id: 'first',
                category: interviewType,
                difficulty: difficulty as any,
                question: result.nextQuestion,
                hint: result.hint || "Listen closely and answer naturally."
            }]);

            toast.success("Ready!", { id: loadingToast });
            speakText(result.nextQuestion);
        } catch (error) {
            console.error("Start session failed:", error);
            toast.error("Failed to start session. Please try again.", { id: loadingToast });
            changeView(interviewType === 'resume' ? 'resume-upload' : 'config');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEvaluateAndNext = async () => {
        if (!userAnswer.trim()) {
            toast.error("Please provide an answer first.");
            return;
        }

        // Stop recording before eval
        if (isRecording) {
            speechRecognition?.stop();
            setIsRecording(false);
        }

        setIsEvaluating(true);
        const loadingToast = toast.loading("AI Interviewer is analyzing...");

        try {
            let systemPrompt = SYSTEM_PROMPT_INTERVIEW;
            if (interviewType === 'vocabulary') systemPrompt = SYSTEM_PROMPT_VOCABULARY;
            if (interviewType === 'resume') systemPrompt = SYSTEM_PROMPT_RESUME_EVAL;

            let contextInfo = '';
            if (interviewType === 'resume') {
                contextInfo = `\nTarget Role: ${targetRole}\nSeniority: ${seniorityLevel}\nDifficulty: ${difficulty}`;
            } else {
                contextInfo = `\nTopic: ${topic}\nDifficulty: ${difficulty}`;
            }

            const prompt = `${systemPrompt}\n\n=== SESSION CONTEXT ===${contextInfo}\nQuestion Number: ${currentIndex + 1}\n\n=== CURRENT QUESTION ===\n${questions[currentIndex].question}\n\n=== USER ANSWER ===\n${userAnswer}\n\n=== INSTRUCTION ===\nEvaluate the answer and provide feedback. THEN, generate the NEXT follow-up question that builds on this conversation. Keep questions on-topic and at the specified difficulty.`;
            const aiResponse = await window.puter.ai.chat(prompt);

            let jsonString = typeof aiResponse === 'object' && aiResponse !== null && 'text' in aiResponse
                ? String(aiResponse.text) : String(aiResponse);

            let cleanedJson = jsonString.trim();
            if (cleanedJson.startsWith('```')) {
                cleanedJson = cleanedJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
            }

            const result = JSON.parse(cleanedJson);
            setFeedback({
                score: result.score,
                feedback: result.feedback,
                idealAnswer: result.idealAnswer
            });

            // Push next question
            setQuestions(prev => [...prev, {
                id: `q-${prev.length}`,
                category: interviewType,
                difficulty: difficulty as any,
                question: result.nextQuestion,
                hint: result.hint || "Keep it up!"
            }]);

            toast.success("Feedback Received", { id: loadingToast });
            
            // Speak feedback, then next question
            speakText(result.feedback + " ... " + result.nextQuestion);
            
        } catch (error: any) {
            console.error(error);
            const isQuotaError = error.message?.includes('429');
            if (isQuotaError) setCooldown(15);
            toast.error(isQuotaError ? "Rate limit reached. Waiting..." : "Evaluation failed.", { id: loadingToast });
        } finally {
            setIsEvaluating(false);
        }
    };

    const handleNextCheckpoint = () => {
        // Stop audio if speaking
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentIndex(prev => {
            const nextIdx = prev + 1;
            // Speak the next question after a short delay to let React re-render
            if (questions[nextIdx]) {
                setTimeout(() => {
                    speakText(questions[nextIdx].question);
                }, 300);
            }
            return nextIdx;
        });
        setUserAnswer('');
        setFeedback(null);
    };

    if (view === 'selection') {
        return (
            <div className="min-h-screen bg-background selection:bg-stitch-primary/30 pb-32">
                <Header />
                <div className="container mx-auto px-6 max-w-5xl text-center pt-32 space-y-12">
                    <div className="flex flex-col items-center gap-4">
                        <SectionHeader />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <motion.div
                            whileHover={{ y: -10 }}
                            onClick={() => { setInterviewType('technical'); setTopic(''); changeView('config'); }}
                            className="group cursor-pointer"
                        >
                            <Card className="h-full border border-stitch-outline/10 glass-card rounded-[2.5rem] overflow-hidden p-10 space-y-8 hover:bg-white/10 transition-all shadow-xl relative backdrop-blur-xl">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                    <Zap className="w-40 h-40" />
                                </div>
                                <div className="w-16 h-16 flex items-center justify-center text-stitch-primary group-hover:scale-110 transition-transform">
                                    <Zap className="w-10 h-10" />
                                </div>
                                <div className="space-y-2 text-left relative z-10">
                                    <h3 className="text-3xl font-black text-on-background tracking-tighter">Technical <span className="text-stitch-primary italic">Interview.</span></h3>
                                    <p className="text-on-surface-variant/80 dark:text-on-surface-variant/60 font-medium">Practice specific coding and architecture topics adaptively.</p>
                                </div>
                                <div className="flex items-center gap-2 text-stitch-primary font-black uppercase tracking-widest text-xs pt-4 relative z-10">
                                    Configure Session <Settings2 className="w-4 h-4 ml-1" />
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            onClick={() => { setInterviewType('vocabulary'); setTopic(''); changeView('config'); }}
                            className="group cursor-pointer"
                        >
                            <Card className="h-full border border-stitch-outline/10 glass-card rounded-[2.5rem] overflow-hidden p-10 space-y-8 hover:bg-white/10 transition-all shadow-xl relative backdrop-blur-xl">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                    <MessageSquare className="w-40 h-40" />
                                </div>
                                <div className="w-16 h-16 flex items-center justify-center text-stitch-primary group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-10 h-10" />
                                </div>
                                <div className="space-y-2 text-left relative z-10">
                                    <h3 className="text-3xl font-black text-on-background tracking-tighter">Vocabulary <span className="text-stitch-primary italic">Drill.</span></h3>
                                    <p className="text-on-surface-variant/80 dark:text-on-surface-variant/60 font-medium">Enhance your speaking and articulation dynamically.</p>
                                </div>
                                <div className="flex items-center gap-2 text-stitch-primary font-black uppercase tracking-widest text-xs pt-4 relative z-10">
                                    Configure Session <Settings2 className="w-4 h-4 ml-1" />
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            onClick={() => { setInterviewType('resume'); changeView('resume-upload'); }}
                            className="group cursor-pointer md:col-span-2 max-w-2xl mx-auto w-full"
                        >
                            <Card className="h-full border border-stitch-outline/10 glass-card rounded-[2.5rem] overflow-hidden p-10 space-y-8 hover:bg-stitch-surface/40 transition-all flex flex-col items-start text-left shadow-xl relative backdrop-blur-xl">
                                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-stitch-primary/10 rounded-full blur-[80px]" />
                                <div className="w-16 h-16 flex items-center justify-center text-stitch-primary group-hover:scale-110 transition-transform">
                                    <FileText className="w-10 h-10" />
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <h3 className="text-3xl font-black text-on-background tracking-tighter">Resume <span className="text-stitch-primary italic">Mode.</span></h3>
                                    <p className="text-on-surface-variant/80 dark:text-on-surface-variant/60 font-medium italic opacity-80 leading-relaxed">Reverse-engineer specific interview questions directly from your career milestones.</p>
                                </div>
                                <div className="flex items-center gap-2 text-stitch-primary font-black uppercase tracking-widest text-xs pt-4 relative z-10">
                                    Upload Resume <ChevronRight className="w-4 h-4" />
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'config') {
         return (
            <div className="min-h-screen bg-background selection:bg-stitch-primary/30 pb-32 pt-12 text-on-background">
                <Header />
                <div className="container mx-auto px-6 max-w-4xl pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card border border-stitch-outline/10 shadow-xl rounded-[2.5rem] p-10 lg:p-14 overflow-hidden relative backdrop-blur-xl"
                    >
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-stitch-primary/10 rounded-full blur-[100px]" />

                        <div className="relative space-y-10 text-left">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-stitch-primary fill-stitch-primary" />
                                    <span className="text-[10px] font-black text-stitch-primary uppercase tracking-[0.2em]">{interviewType} Interview</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-on-background leading-[1.1]">
                                    Configure <span className="text-stitch-primary italic">Session.</span>
                                </h1>
                                <p className="text-lg text-on-surface-variant/80 dark:text-on-surface-variant/60 font-medium">Select the topic and difficulty. Our AI will dynamically adapt to your answers.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label htmlFor="topic" className="text-xs font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest ml-1">Interview Topic</Label>
                                    <div className="relative">
                                        <Input
                                            id="topic"
                                            placeholder={interviewType === 'technical' ? "e.g., React, System Design, Node.js" : "e.g., Leadership, Conflict Resolution"}
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            disabled={isGenerating}
                                            className="h-14 bg-stitch-surface/50 border border-stitch-outline/20 rounded-2xl font-bold placeholder:text-on-surface-variant/20 focus-visible:ring-stitch-primary/50 text-on-background shadow-inner px-6"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="difficulty" className="text-xs font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest ml-1">Difficulty Level</Label>
                                    <Select value={difficulty} onValueChange={setDifficulty} disabled={isGenerating}>
                                        <SelectTrigger className="h-14 bg-stitch-surface/50 border border-stitch-outline/20 rounded-2xl font-bold text-on-background focus:ring-stitch-primary/50 shadow-inner px-6" id="difficulty">
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border border-stitch-outline/20 shadow-2xl bg-popover backdrop-blur-xl text-popover-foreground">
                                            <SelectItem value="easy" className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer">Easy Fundamentals</SelectItem>
                                            <SelectItem value="medium" className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer">Medium Core Concepts</SelectItem>
                                            <SelectItem value="hard" className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer">Hard / Edge Cases</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="voicePack" className="text-xs font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest ml-1">Voice Pack</Label>
                                    <div className="flex gap-3">
                                        <Select value={selectedVoiceURI} onValueChange={setSelectedVoiceURI} disabled={isGenerating}>
                                            <SelectTrigger className="h-14 flex-1 bg-stitch-surface/50 border border-stitch-outline/20 rounded-2xl font-bold text-on-background focus:ring-stitch-primary/50 shadow-inner px-6" id="voicePack">
                                                <SelectValue placeholder={availableVoices.length === 0 ? 'Loading voices...' : 'Select a voice'} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border border-stitch-outline/20 shadow-2xl bg-popover backdrop-blur-xl text-popover-foreground max-h-64">
                                                {availableVoices.map((voice) => (
                                                    <SelectItem
                                                        key={voice.voiceURI}
                                                        value={voice.voiceURI}
                                                        className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer"
                                                    >
                                                        {voice.name} {!voice.localService && '⭐'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => previewVoice(selectedVoiceURI)}
                                            disabled={!selectedVoiceURI || isSpeaking}
                                            className="h-14 w-14 shrink-0 rounded-2xl border border-stitch-outline/20 bg-stitch-surface/50 text-stitch-primary hover:bg-stitch-primary/10 shadow-inner"
                                        >
                                            <Volume2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant/50 font-medium ml-1">⭐ = Cloud / premium quality voice. Tap the speaker to preview.</p>
                                </div>

                                <div className="p-5 bg-stitch-primary/5 border border-stitch-primary/10 rounded-2xl flex gap-4 items-center">
                                    <div className="w-12 h-12 shrink-0 bg-stitch-primary/10 flex items-center justify-center rounded-full text-stitch-primary">
                                        <Mic className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-on-surface-variant/80 leading-relaxed">
                                        This is a fully audio-based session. Ensure your microphone is connected and volume is turned up.
                                    </p>
                                </div>

                                <Button
                                    onClick={handleStartAdaptiveSession}
                                    size="lg"
                                    className="w-full h-20 text-xl font-black mt-8 rounded-[1.5rem] bg-stitch-primary text-on-primary-container hover:bg-stitch-primary/90 shadow-xl shadow-stitch-primary/10 transition-all active:scale-[0.98] uppercase tracking-tighter"
                                    disabled={!topic || !difficulty || isGenerating}
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 border-4 border-on-primary/20 border-t-on-primary rounded-full animate-spin" />
                                            Booting AI...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Start Audio Session <Zap className="w-5 h-5" />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
         );
    }

    if (view === 'resume-upload') {
        return (
            <div className="min-h-screen bg-background selection:bg-stitch-primary/30 pb-32 pt-12 text-on-background">
                <Header />
                <div className="container mx-auto px-6 max-w-4xl pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card border border-stitch-outline/10 shadow-xl rounded-[2.5rem] p-10 lg:p-14 overflow-hidden relative backdrop-blur-xl"
                    >
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-stitch-primary/10 rounded-full blur-[100px]" />

                        <div className="relative space-y-10 text-left">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-stitch-primary fill-stitch-primary" />
                                    <span className="text-[10px] font-black text-stitch-primary uppercase tracking-[0.2em]">Personalized Interview</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-on-background leading-[1.1]">
                                    Upload for <span className="text-stitch-primary italic">Resume Mode.</span>
                                </h1>
                                <p className="text-lg text-on-surface-variant/80 dark:text-on-surface-variant/60 font-medium">We'll scan your CV and dynamically adjust questions based on your background.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="targetRole" className="text-xs font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest ml-1">Target Position</Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-4 w-5 h-5 text-on-surface-variant/70 dark:text-on-surface-variant/40" />
                                            <Input
                                                id="targetRole"
                                                placeholder=" "
                                                value={targetRole}
                                                onChange={(e) => setTargetRole(e.target.value)}
                                                disabled={isGenerating}
                                                className="h-14 pl-12 bg-stitch-surface/50 border border-stitch-outline/20 rounded-2xl font-bold placeholder:text-on-surface-variant/20 focus-visible:ring-stitch-primary/50 text-on-background shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="seniority" className="text-xs font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest ml-1">Experience Level</Label>
                                        <Select value={seniorityLevel} onValueChange={setSeniorityLevel} disabled={isGenerating}>
                                            <SelectTrigger className="h-14 bg-stitch-surface/50 border border-stitch-outline/20 rounded-2xl font-bold text-on-background focus:ring-stitch-primary/50 shadow-inner" id="seniority">
                                                <SelectValue placeholder="Select rank" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border border-stitch-outline/20 shadow-2xl bg-popover backdrop-blur-xl text-popover-foreground">
                                                <SelectItem value="intern" className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer">Intern / Trainee</SelectItem>
                                                <SelectItem value="junior" className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer">Junior Level</SelectItem>
                                                <SelectItem value="mid" className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer">Mid-Level</SelectItem>
                                                <SelectItem value="senior" className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer">Senior Rank</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3 md:col-span-2">
                                        <Label htmlFor="diff" className="text-xs font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest ml-1">Interview Difficulty</Label>
                                        <Select value={difficulty} onValueChange={setDifficulty} disabled={isGenerating}>
                                            <SelectTrigger className="h-14 bg-stitch-surface/50 border border-stitch-outline/20 rounded-2xl font-bold text-on-background focus:ring-stitch-primary/50 shadow-inner" id="diff">
                                                <SelectValue placeholder="Select Difficulty" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border border-stitch-outline/20 shadow-2xl bg-popover backdrop-blur-xl text-popover-foreground">
                                                <SelectItem value="easy" className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer">Gentle (Soft details)</SelectItem>
                                                <SelectItem value="medium" className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer">Standard Verification</SelectItem>
                                                <SelectItem value="hard" className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer">Rigorous Deep-Dive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest ml-1">Your CV (PDF)</Label>
                                    <FileUploader file={resumeFile} setFile={setResumeFile} accent="stitch" />
                                </div>

                                {/* Local Resume DNA Result */}
                                <AnimatePresence>
                                    {localAnalysis && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 bg-stitch-primary/5 border border-stitch-primary/10 rounded-[2rem] space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-stitch-primary/10 rounded-xl">
                                                            <Fingerprint className="w-5 h-5 text-stitch-primary" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-black uppercase tracking-tighter text-on-surface-variant">Resume DNA Detected</h4>
                                                            <p className="text-sm font-black text-on-background">{formatCategory(localAnalysis.category)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-black text-stitch-primary leading-none">{localAnalysis.matchScore}%</div>
                                                        <div className="text-[9px] font-black uppercase text-on-surface-variant/40 tracking-widest">Industry Match</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 flex items-center gap-1">
                                                            <Search className="w-3 h-3" /> Core Keywords
                                                        </span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {localAnalysis.topKeywordsFound.slice(0, 5).map(kw => (
                                                                <Badge key={kw} variant="secondary" className="bg-stitch-primary/10 text-stitch-primary border-none text-[9px] lowercase font-bold">{kw}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" /> Industry Gaps
                                                        </span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {localAnalysis.missingKeywords.slice(0, 5).map(kw => (
                                                                <Badge key={kw} variant="outline" className="opacity-40 text-on-surface-variant border-stitch-outline/20 text-[9px] lowercase font-bold">{kw}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-3">
                                    <Label htmlFor="voicePackResume" className="text-xs font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest ml-1">Voice Pack</Label>
                                    <div className="flex gap-3">
                                        <Select value={selectedVoiceURI} onValueChange={setSelectedVoiceURI} disabled={isGenerating}>
                                            <SelectTrigger className="h-14 flex-1 bg-stitch-surface/50 border border-stitch-outline/20 rounded-2xl font-bold text-on-background focus:ring-stitch-primary/50 shadow-inner px-6" id="voicePackResume">
                                                <SelectValue placeholder={availableVoices.length === 0 ? 'Loading voices...' : 'Select a voice'} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border border-stitch-outline/20 shadow-2xl bg-popover backdrop-blur-xl text-popover-foreground max-h-64">
                                                {availableVoices.map((voice) => (
                                                    <SelectItem
                                                        key={voice.voiceURI}
                                                        value={voice.voiceURI}
                                                        className="font-bold py-3 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer"
                                                    >
                                                        {voice.name} {!voice.localService && '⭐'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => previewVoice(selectedVoiceURI)}
                                            disabled={!selectedVoiceURI || isSpeaking}
                                            className="h-14 w-14 shrink-0 rounded-2xl border border-stitch-outline/20 bg-stitch-surface/50 text-stitch-primary hover:bg-stitch-primary/10 shadow-inner"
                                        >
                                            <Volume2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant/50 font-medium ml-1">⭐ = Cloud / premium quality voice. Tap the speaker to preview.</p>
                                </div>

                                <Button
                                    onClick={handleStartAdaptiveSession}
                                    size="lg"
                                    className="w-full h-20 text-xl font-black mt-8 rounded-[1.5rem] bg-stitch-primary text-on-primary-container hover:bg-stitch-primary/90 shadow-xl shadow-stitch-primary/10 transition-all active:scale-[0.98] uppercase tracking-tighter"
                                    disabled={!resumeFile || !targetRole || !seniorityLevel || isGenerating}
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 border-4 border-on-primary/20 border-t-on-primary rounded-full animate-spin" />
                                            Building Context...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Start Audio Session <Zap className="w-5 h-5" />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (view === 'active' && (questions.length === 0 || !questions[currentIndex])) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="bg-stitch-surface/30 backdrop-blur-xl border border-stitch-outline/10 p-12 rounded-[2.5rem] shadow-xl flex flex-col items-center gap-8 max-w-sm w-full">
                    <div className="w-16 h-16 border-4 border-stitch-primary/20 border-t-stitch-primary rounded-full animate-spin" />
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-black text-on-background tracking-tighter">Preparing <span className="text-stitch-primary italic">Session.</span></h2>
                        <p className="text-on-surface-variant/80 dark:text-on-surface-variant/60 font-medium italic">Our AI is drafting the next topic...</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-background selection:bg-stitch-primary/30 pb-32 pt-32 text-on-background">
            <Header />
            <div className="container mx-auto px-6 max-w-5xl">

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 pt-10">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-5xl font-black text-on-background tracking-tighter leading-none">
                                {interviewType === 'technical' ? 'Technical' : interviewType === 'vocabulary' ? 'Vocabulary' : 'Resume-based'} <span className="text-stitch-primary italic">Review.</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-4 text-on-surface-variant/80 dark:text-on-surface-variant/60 font-medium">
                                <Badge variant="outline" className="bg-stitch-primary/5 uppercase tracking-widest text-[10px]">{difficulty}</Badge>
                                {topic && <Badge variant="outline" className="bg-stitch-primary/5 uppercase tracking-widest text-[10px]">{topic}</Badge>}
                                {interviewType === 'resume' && <Badge variant="outline" className="bg-stitch-primary/5 uppercase tracking-widest text-[10px]">{targetRole}</Badge>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-[10px] font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest mb-1">Adaptive Stage</div>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-4xl font-black text-on-background tracking-tighter italic">Q{currentIndex + 1}</span>
                            </div>
                        </div>
                        <div className="w-16 h-16 rounded-[2rem] bg-stitch-surface/40 backdrop-blur-md shadow-2xl flex items-center justify-center text-stitch-primary border border-stitch-outline/20 relative">
                             {isSpeaking && <div className="absolute inset-0 bg-stitch-primary/20 rounded-[2rem] animate-ping" />}
                            <Volume2 className="w-8 h-8 relative z-10" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    <Card className="border border-stitch-outline/10 shadow-xl glass-card rounded-[2.5rem] overflow-hidden relative backdrop-blur-xl">
                        <div className="h-1.5 w-full bg-stitch-primary" />

                        <CardContent className="p-10 lg:p-16 space-y-12">
                            {/* Question Header */}
                            <div className="space-y-6">
                                <h2 className="text-3xl font-black text-on-background leading-tight tracking-tight">
                                    {currentQuestion.question}
                                </h2>
                                <div className="flex items-center gap-3 p-5 bg-stitch-surface/40 rounded-[1.5rem] border border-stitch-outline/10 text-stitch-primary shadow-inner">
                                    <Lightbulb className="w-5 h-5 shrink-0" />
                                    <p className="text-xs font-bold opacity-80 italic text-on-surface-variant/80 dark:text-on-surface-variant/60 leading-tight">Insight: {currentQuestion.hint}</p>
                                </div>
                            </div>

                            {/* Answer Area with Voice Overlay */}
                            <div className="space-y-8">
                                <div className="flex flex-col items-center justify-center gap-6 pt-4">
                                     <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={toggleRecording}
                                        disabled={isEvaluating || !!feedback}
                                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all border-8 shadow-2xl relative ${
                                            isRecording 
                                            ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-red-500/20' 
                                            : 'bg-stitch-primary/10 border-stitch-primary/20 text-stitch-primary shadow-stitch-primary/10 hover:bg-stitch-primary/20'
                                        }`}
                                    >
                                         {isRecording && <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />}
                                         {isRecording ? <MicOff className="w-12 h-12 relative z-10" /> : <Mic className="w-12 h-12 relative z-10" />}
                                     </motion.button>
                                     <div className="text-center space-y-1">
                                         <p className="text-sm font-black uppercase tracking-widest text-on-background">
                                             {isRecording ? 'Listening...' : 'Tap to Speak'}
                                         </p>
                                         <p className="text-xs font-bold text-on-surface-variant/60">
                                            {isRecording ? 'Speak your answer clearly.' : 'Microphone access required.'}
                                         </p>
                                     </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest">
                                            <MessageSquare className="w-4 h-4 text-stitch-primary" /> Live Transcript
                                        </div>
                                    </div>
                                    <textarea
                                        className="min-h-[150px] w-full text-lg p-8 bg-stitch-surface/40 border border-stitch-outline/10 shadow-inner rounded-[1.5rem] font-medium leading-relaxed placeholder:text-on-surface-variant/20 focus-visible:ring-stitch-primary/20 text-on-background outline-none resize-none backdrop-blur-md"
                                        placeholder="Your spoken words will appear here. You can manually edit if needed..."
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        disabled={isEvaluating || !!feedback || isRecording}
                                    />
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col sm:flex-row gap-6 pt-4">
                                {!feedback ? (
                                    <Button
                                        onClick={handleEvaluateAndNext}
                                        disabled={isEvaluating || cooldown > 0 || !userAnswer.trim()}
                                        className="h-20 flex-1 rounded-[1.5rem] bg-stitch-primary text-on-primary-container hover:bg-stitch-primary/90 font-black text-xl gap-4 shadow-xl transition-all active:scale-95 uppercase tracking-tighter"
                                    >
                                        {isEvaluating ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 border-4 border-on-primary/20 border-t-on-primary rounded-full animate-spin" />
                                                Analyzing & Adapting...
                                            </div>
                                        ) : cooldown > 0 ? (
                                            <>System Cooldown ({cooldown}s)</>
                                        ) : (
                                            <>Submit & Continue <Sparkles className="w-6 h-6 text-stitch-primary" /></>
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNextCheckpoint}
                                        className="h-20 flex-1 rounded-[1.5rem] bg-stitch-primary text-on-primary-container hover:bg-stitch-primary/90 font-black text-xl gap-4 shadow-lg transition-all active:scale-[0.98] uppercase tracking-tighter"
                                    >
                                        Proceed to Next Question <ChevronRight className="w-6 h-6" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Feedback Reveal */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                    <Card className="md:col-span-4 border border-stitch-outline/10 shadow-xl glass-card rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-xl">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                            <Trophy className="w-32 h-32" />
                                        </div>
                                        <div className="flex items-center gap-2 mb-6 relative z-10">
                                            <Trophy className="w-5 h-5 text-stitch-primary" />
                                            <span className="text-[10px] font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-[0.2em]">Matrix Score</span>
                                        </div>
                                        <div className="text-8xl font-black text-on-background leading-none tracking-tighter relative z-10">
                                            {feedback.score}<span className="text-2xl text-on-surface-variant/20 font-black">/10</span>
                                        </div>
                                        <div className="mt-8 px-6 py-2 bg-stitch-primary/10 text-stitch-primary font-black text-xs rounded-full border border-stitch-primary/20 relative z-10 uppercase tracking-widest shadow-inner">
                                            {feedback.score >= 8 ? 'Outstanding' : feedback.score >= 6 ? 'Competent' : 'Growth Needed'}
                                        </div>
                                    </Card>

                                    <Card className="md:col-span-8 border border-stitch-outline/10 shadow-xl glass-card rounded-[2.5rem] p-12 lg:p-14 relative overflow-hidden backdrop-blur-xl">
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.05]">
                                            <Zap className="w-40 h-40 text-stitch-primary" />
                                        </div>
                                        <h3 className="text-[10px] font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                            <Sparkles className="w-4 h-4 text-stitch-primary" /> Global Benchmark Insights
                                        </h3>
                                        <p className="text-2xl font-black text-on-background leading-relaxed italic border-l-4 border-stitch-primary/30 pl-10 relative z-10">
                                            "{feedback.feedback}"
                                        </p>
                                    </Card>
                                </div>

                                {/* We'll omit the Ideal Pivot here because the flow is adaptive and fast-paced, 
                                    but we can keep it as an accordion or just display it as we did before. Let's keep it. */}
                                <Card className="border border-white/20 shadow-xl bg-on-background/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden relative">
                                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-stitch-primary/10 rounded-full blur-[80px]" />
                                    <div className="p-12 lg:p-16 space-y-12 relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center text-stitch-primary border border-white/10 shadow-inner">
                                                <Target className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-4xl font-black text-white leading-none tracking-tighter">The Ideal <span className="text-stitch-primary italic">Pivot.</span></h3>
                                                <p className="text-white/40 font-medium mt-3 text-lg">How a senior-level candidate would architect this response for maximum impact.</p>
                                            </div>
                                        </div>
                                        <div className="p-10 bg-white/5 rounded-[3rem] border border-white/5 shadow-inner backdrop-blur-sm">
                                            <p className="text-xl text-white/80 font-medium leading-loose whitespace-pre-wrap italic">
                                                {feedback.idealAnswer}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

interface TargetProps {
    className?: string;
}
const Target: React.FC<TargetProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default InterviewSimulator;
