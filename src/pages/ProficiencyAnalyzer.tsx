import { useState, useEffect, useCallback } from 'react';
// Cache bust: 1772776600000
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    ResponsiveContainer
} from 'recharts';
import {
    Plus,
    Trash2,
    Sparkles,
    Map,
    ChevronRight,
    Zap,
    Award,
    HelpCircle,
    Youtube,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

// Quiz integration
import { quizBank, type LanguageQuiz } from '@/data/quizQuestions';
import { scoreQuiz } from '@/lib/quizEngine';
import { PageTransition } from '@/components/ui/page-transition';
import { Header } from '@/components/Header';
import SectionHeader from '@/components/SectionHeader';

const SYSTEM_PROMPT_PROFICIENCY = `You are ResuMe, an AI Career Hub / Senior Tech Mentor.
Analyze the provided list of languages and proficiency levels.

Return your response strictly as a JSON object matching this structure:
{
  "pros": [string, string, ...],
  "cons": [string, string, ...],
  "streamSuggestions": [
    { "streamName": string, "reason": string, "matchScore": number (0-100) }, ...
  ],
  "playlists": [
    { "title": string, "topic": string, "youtubeSearchQuery": string }, ...
  ],
  "skillMetrics": [
    { "skill": string, "level": number (1-10) }, ...
  ]
}
CRITICAL: Return ONLY raw, valid JSON. Do not wrap in markdown blocks.`;

const ProficiencyAnalyzer = () => {
    const [skills, setSkills] = useState([{ language: '', level: '5' }]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<any>(null);

    // Quiz State
    const [activeQuizSkillIndex, setActiveQuizSkillIndex] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});

    // Browser history integration for sub-views
    useEffect(() => {
        // Initialize current state as 'input'
        window.history.replaceState({ analyzerView: 'input' }, '');

        const handlePopState = (event: PopStateEvent) => {
            const state = event.state;
            if (state && state.analyzerView) {
                if (state.analyzerView === 'input') {
                    setResults(null);
                    setIsAnalyzing(false);
                    setActiveQuizSkillIndex(null);
                } else if (state.analyzerView === 'results') {
                    setResults(state.resultsData);
                    setActiveQuizSkillIndex(null);
                    setIsAnalyzing(false);
                } else if (state.analyzerView === 'quiz') {
                    setActiveQuizSkillIndex(state.skillIndex);
                    setResults(state.resultsData || results);
                }
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [results]);

    const changeViewToResults = (data: any) => {
        window.history.pushState({ analyzerView: 'results', resultsData: data }, '');
        setResults(data);
        setIsAnalyzing(false);
    };

    const changeViewToQuiz = (index: number) => {
        window.history.pushState({ analyzerView: 'quiz', skillIndex: index, resultsData: results }, '');
        setActiveQuizSkillIndex(index);
        setCurrentQuestionIndex(0);
        setAnswers({});
    };

    const handleAddSkill = () => setSkills([...skills, { language: '', level: '5' }]);
    const handleRemoveSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index));

    const handleSkillChange = (index: number, field: 'language' | 'level', value: string) => {
        const newSkills = [...skills];
        newSkills[index][field] = value;
        setSkills(newSkills);
    };

    const handleAnalyze = async () => {
        const validSkills = skills.filter(s => s.language.trim() !== '');
        if (validSkills.length === 0) {
            toast.error("Please add at least one language/skill.");
            return;
        }

        setIsAnalyzing(true);
        const loadingToast = toast.loading("ResuMe Engine mapping your career...");

        try {
            const skillsText = validSkills.map(s => `- ${s.language}: Level ${s.level}`).join('\n');
            const prompt = `${SYSTEM_PROMPT_PROFICIENCY}\n\n=== USER SKILLS ===\n${skillsText}`;

            const aiResponse = await window.puter.ai.chat(prompt);
            let jsonString = typeof aiResponse === 'object' && aiResponse !== null && 'text' in aiResponse
                ? String(aiResponse.text)
                : String(aiResponse);

            let cleanedJson = jsonString.trim();
            if (cleanedJson.startsWith('```')) {
                cleanedJson = cleanedJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
            }

            const data = JSON.parse(cleanedJson);
            changeViewToResults(data);
            toast.success("Career map generated!", { id: loadingToast });
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to analyze. Please try again.", { id: loadingToast });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Quiz Logic
    const getQuizForLanguage = (language: string): LanguageQuiz | undefined => {
        return quizBank.find(q => q.language.toLowerCase() === language.trim().toLowerCase());
    };

    const activeQuiz = activeQuizSkillIndex !== null
        ? getQuizForLanguage(skills[activeQuizSkillIndex].language)
        : null;
    const currentQuestion = activeQuiz?.questions[currentQuestionIndex];

    const startQuiz = (index: number) => {
        changeViewToQuiz(index);
    };

    const closeQuiz = () => {
        window.history.back();
    };

    const selectOption = (optionIndex: number) => {
        if (!currentQuestion) return;
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));
    };

    const goNext = () => {
        if (!activeQuiz) return;
        if (currentQuestionIndex < activeQuiz.questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
        } else {
            const result = scoreQuiz(activeQuiz, answers);
            const newSkills = [...skills];
            newSkills[activeQuizSkillIndex!] = { ...newSkills[activeQuizSkillIndex!], level: result.score.toString() };
            (newSkills[activeQuizSkillIndex!] as any).isEvaluated = true;
            setSkills(newSkills);
            toast.success(`Completed! Scored ${result.score}/10 in ${activeQuiz.language}.`);
            closeQuiz();
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-background text-on-background font-body selection:bg-stitch-primary/30">
                <Header />

                {/* Dashboard Matrix */}
                <main className="pt-24 pb-32 px-6 max-w-[1400px] mx-auto min-h-screen flex flex-col items-center">
                    
                    {/* Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16 space-y-4"
                    >
                        <h1 className="text-7xl font-black text-on-background tracking-tighter leading-none">
                            Proficiency <span className="text-stitch-primary italic">Mapper.</span>
                        </h1>
                        <p className="text-sm text-on-surface-variant/70 dark:text-on-surface-variant/40 font-black uppercase tracking-[0.4em] text-shift">Engine v5.28 Global Analysis</p>
                    </motion.div>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        
                        {/* Left: Input Console */}
                        <section className="lg:col-span-5 space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card rounded-[3rem] p-10 border border-stitch-outline/20 shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                    <Map className="w-40 h-40" />
                                </div>
                                
                                <h3 className="text-[10px] font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-stitch-primary animate-pulse" />
                                    Input Console
                                </h3>

                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {skills.map((skill, index) => {
                                            const hasQuiz = getQuizForLanguage(skill.language);
                                            const isEval = (skill as any).isEvaluated;
                                            return (
                                                <motion.div
                                                    key={index}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                                    className="p-5 glass-card rounded-[2rem] border border-stitch-outline/20 flex items-center gap-4 group hover:bg-stitch-surface/80 transition-all shadow-sm"
                                                >
                                                    <div className="flex-1 relative">
                                                        <input 
                                                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg font-black text-on-background placeholder:text-on-surface-variant/20 tracking-tight"
                                                            placeholder="Enter skill / tool..."
                                                            value={skill.language}
                                                            onChange={(e) => handleSkillChange(index, 'language', e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {hasQuiz ? (
                                                            <button 
                                                                onClick={() => startQuiz(index)}
                                                                className={cn(
                                                                    "h-12 px-6 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
                                                                    isEval ? "bg-stitch-primary text-on-primary shadow-lg shadow-stitch-primary/10" : "bg-on-background text-white hover:bg-on-background/90"
                                                                )}
                                                            >
                                                                {isEval ? `${skill.level}/10` : "VERIFY"}
                                                            </button>
                                                        ) : (
                                                            <Select value={skill.level} onValueChange={(val) => handleSkillChange(index, 'level', val)}>
                                                                <SelectTrigger className="h-12 w-16 glass-card border-stitch-outline/20 rounded-2xl font-black text-on-background shadow-inner">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-2xl bg-popover backdrop-blur-xl border-stitch-outline/20 shadow-2xl text-popover-foreground">
                                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                                        <SelectItem key={num} value={num.toString()} className="font-bold py-2 focus:bg-stitch-primary/10 focus:text-stitch-primary cursor-pointer">{num}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                        
                                                        <button 
                                                            onClick={() => handleRemoveSkill(index)}
                                                            className="w-12 h-12 rounded-2xl bg-on-background/5 text-on-surface-variant/30 hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center group-hover:opacity-100 md:opacity-0"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                    
                                    <button 
                                        onClick={handleAddSkill}
                                        className="w-full h-16 rounded-[2rem] border border-dashed border-on-surface-variant/20 hover:border-stitch-primary flex items-center justify-center gap-3 group transition-all hover:bg-stitch-primary/5"
                                    >
                                        <Plus className="w-5 h-5 text-on-surface-variant/30 group-hover:text-stitch-primary" />
                                        <span className="text-[10px] font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-[0.2em] group-hover:text-stitch-primary">Expand Field</span>
                                    </button>
                                </div>

                                <div className="pt-8">
                                    <button 
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing}
                                        className="group relative w-full h-20 bg-on-background rounded-[2.5rem] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:grayscale disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-stitch-primary to-lime-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative z-10 flex items-center justify-center gap-4">
                                            <span className="text-white text-xl font-black tracking-tighter group-hover:text-on-primary transition-colors uppercase">
                                                {isAnalyzing ? "Processing..." : "Generate Analysis"}
                                            </span>
                                            <div className="w-8 h-8 rounded-xl glass-card flex items-center justify-center group-hover:bg-on-primary/20 transition-colors">
                                                <Zap className="w-4 h-4 text-stitch-primary group-hover:text-on-primary" />
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                            
                            {/* Live Metrics */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-2 gap-5"
                            >
                                <div className="glass-card rounded-[2.5rem] p-6 border border-stitch-outline/20 shadow-xl flex flex-col items-center">
                                    <span className="text-3xl font-black text-on-background tracking-tighter">{skills.length}</span>
                                    <span className="text-[8px] font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest mt-1">Matrix Points</span>
                                </div>
                                <div className="glass-card rounded-[2.5rem] p-6 border border-stitch-outline/20 shadow-xl flex flex-col items-center">
                                    <span className="text-3xl font-black text-stitch-primary tracking-tighter">
                                        {skills.filter(s => (s as any).isEvaluated).length}
                                    </span>
                                    <span className="text-[8px] font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest mt-1">Verified Base</span>
                                </div>
                            </motion.div>
                        </section>

                        {/* Right: Analysis Scanner */}
                        <section className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {isAnalyzing ? (
                                    <motion.div 
                                        key="scanning"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-on-background/10 backdrop-blur-xl rounded-[2.5rem] p-12 h-[720px] flex flex-col border border-white/5 shadow-xl overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(183,222,5,0.05),transparent)] pointer-events-none" />
                                        
                                        <div className="flex items-center justify-between mb-16 relative z-10">
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">AI Core <span className="text-stitch-primary italic">Scanning.</span></h2>
                                                <p className="text-[10px] font-black text-stitch-primary/40 uppercase tracking-[0.3em]">Processing Neural Networks</p>
                                            </div>
                                            <div className="flex items-center justify-center animate-spin-slow">
                                                <Sparkles className="w-6 h-6 text-stitch-primary" />
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative z-10">
                                            {/* Scanning Animation */}
                                            <div className="relative w-72 h-72 flex items-center justify-center">
                                                <svg className="w-full h-full -rotate-90">
                                                    <circle className="text-white/5" cx="144" cy="144" fill="transparent" r="130" stroke="currentColor" strokeWidth="2"></circle>
                                                    <motion.circle 
                                                        className="text-stitch-primary drop-shadow-[0_0_15px_rgba(183,222,5,0.5)]" 
                                                        cx="144" 
                                                        cy="144" 
                                                        fill="transparent" 
                                                        r="130" 
                                                        stroke="currentColor" 
                                                        strokeDasharray="816" 
                                                        strokeDashoffset="816"
                                                        animate={{ strokeDashoffset: [816, 0] }}
                                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                        strokeWidth="6" 
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <motion.span 
                                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                        className="text-7xl font-black text-white tracking-tighter"
                                                    >
                                                        {Math.floor(Math.random() * 99) + 1}<span className="text-stitch-primary text-3xl">%</span>
                                                    </motion.span>
                                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-2">Precision Rate</span>
                                                </div>
                                            </div>

                                            <div className="w-full max-w-md space-y-4">
                                                {/* Analysis Log Mockup */}
                                                <div className="bg-white/5 rounded-2xl border border-white/5 p-6 font-mono text-[11px] space-y-2 overflow-hidden">
                                                    <p className="text-stitch-primary/60">Initializing career matrix v5.0...</p>
                                                    <p className="text-white/40">{">"} Analyzing semantic skill clusters</p>
                                                    <p className="text-white/40 animate-pulse">{">"} Mapping trajectory vectors...</p>
                                                    <p className="text-white/20">{">"} Identifying leadership signatures</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto relative z-10">
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-stitch-primary"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 4, repeat: Infinity }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : results ? (
                                    <motion.div 
                                        key="results"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-8"
                                    >
                                        {/* Result Header */}
                                        <div className="glass-card rounded-[2.5rem] p-10 border border-stitch-outline/10 shadow-xl backdrop-blur-xl">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-3xl font-black text-on-background tracking-tighter italic">Foundational Analytics</h3>
                                                <Badge className="bg-stitch-primary/10 text-stitch-primary border border-stitch-primary/30 font-black px-4 py-1.5 uppercase tracking-widest text-[9px]">Verified Path</Badge>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                                <div className="h-[300px] w-full bg-stitch-surface/40 rounded-[1.5rem] border border-stitch-outline/10 p-6 shadow-inner text-stitch-primary">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results.skillMetrics}>
                                                            <PolarGrid stroke="rgba(0,0,0,0.05)" />
                                                            <PolarAngleAxis dataKey="skill" tick={{ fill: 'rgba(0,0,0,0.6)', fontSize: 10, fontWeight: 700 }} />
                                                            <Radar
                                                                name="Level"
                                                                dataKey="level"
                                                                stroke="#b7de05"
                                                                fill="#b7de05"
                                                                fillOpacity={0.2}
                                                            />
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-[1.5rem]">
                                                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <Sparkles className="w-4 h-4" /> Core Excellence
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {results.pros.map((pro: string, i: number) => (
                                                                <span key={i} className="px-3 py-1 bg-white/60 border border-white/50 text-[10px] font-bold text-on-surface-variant/80 rounded-full">{pro}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-[1.5rem]">
                                                        <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <Award className="w-4 h-4" /> Growth Potential
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {results.cons.map((con: string, i: number) => (
                                                                <span key={i} className="px-3 py-1 bg-stitch-surface/60 border border-stitch-outline/20 text-[10px] font-bold text-on-surface-variant/80 rounded-full">{con}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Roadmap */}
                                        <div className="bg-on-background/10 backdrop-blur-xl rounded-[2.5rem] p-10 lg:p-14 border border-white/5 shadow-xl relative overflow-hidden group">
                                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-stitch-primary/10 rounded-full blur-[80px] pointer-events-none" />
                                            
                                            <div className="flex items-center justify-between mb-12 relative z-10">
                                                <h3 className="text-4xl font-black text-white tracking-tighter">Strategic <span className="text-stitch-primary">Roadmap.</span></h3>
                                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-stitch-primary border border-white/5">
                                                    <Map className="w-7 h-7" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                                {results.streamSuggestions.map((stream: any, i: number) => (
                                                    <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all group/card">
                                                        <div className="flex justify-between items-center mb-6">
                                                            <h4 className="text-xl font-black text-white tracking-tight">{stream.streamName}</h4>
                                                            <span className="text-stitch-primary font-black text-xl">{stream.matchScore}%</span>
                                                        </div>
                                                        <p className="text-white/40 text-sm font-medium leading-relaxed italic border-l-2 border-stitch-primary/30 pl-6">
                                                            "{stream.reason}"
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Learning Bridge */}
                                            <div className="mt-16 pt-12 border-t border-white/5 relative z-10">
                                                <h4 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-10 text-center">Accelerated Learning Tracks</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {results.playlists.map((pl: any, i: number) => (
                                                        <a 
                                                            key={i}
                                                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(pl.youtubeSearchQuery)}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-6 bg-white/5 border border-white/5 hover:border-stitch-primary rounded-2xl transition-all group/link hover:-translate-y-1"
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover/link:bg-red-500 transition-colors">
                                                                <Youtube className="w-5 h-5 text-red-500 group-hover/link:text-white" />
                                                            </div>
                                                            <h5 className="text-white font-black text-sm tracking-tight line-clamp-2 leading-tight">{pl.title}</h5>
                                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2">{pl.topic}</p>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="empty"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="glass-card rounded-[2.5rem] p-20 h-[720px] flex flex-col items-center justify-center border border-stitch-outline/10 shadow-xl border-dashed backdrop-blur-xl"
                                    >
                                        <div className="w-32 h-32 rounded-[3rem] bg-on-background/5 border border-on-surface-variant/10 flex items-center justify-center mb-10 group hover:scale-110 transition-transform duration-500">
                                            <Sparkles className="w-14 h-14 text-on-surface-variant/10 group-hover:text-stitch-primary transition-colors" />
                                        </div>
                                        <h3 className="text-4xl font-black text-on-background tracking-tighter">Engine <span className="opacity-20 italic">Standby.</span></h3>
                                        <p className="text-on-surface-variant/60 font-medium max-w-sm text-center mt-4 leading-relaxed">
                                            Map your competencies on the left matrix to initiate the career trajectory transformation.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    </div>
                </main>

                {/* Quiz Modal Overlay */}
                <AnimatePresence>
                    {activeQuiz && currentQuestion && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-on-background/80 backdrop-blur-3xl"
                                onClick={closeQuiz}
                            />
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="w-full max-w-4xl bg-stitch-surface/90 backdrop-blur-xl rounded-[2.5rem] p-10 lg:p-16 relative overflow-hidden shadow-2xl border border-stitch-outline/10"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
                                    <Sparkles className="w-64 h-64" />
                                </div>
                                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-stitch-primary/10 rounded-full blur-[80px] pointer-events-none outline outline-1 outline-stitch-primary/20" />

                                {/* Close */}
                                <button 
                                    onClick={closeQuiz}
                                    className="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-on-background/5 text-on-surface-variant/30 hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center z-20"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>

                                <div className="relative z-10">
                                    {/* Progress Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <span className="text-6xl">{activeQuiz.icon}</span>
                                                <div>
                                                    <h2 className="text-4xl font-black text-on-background tracking-tighter">{activeQuiz.language} <span className="text-stitch-primary italic">Verify.</span></h2>
                                                    <p className="text-[10px] font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-[0.4em] mt-1">Matrix Point Validation</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-4xl font-black text-stitch-primary italic tabular-nums leading-none">
                                                {Object.keys(answers).length}<span className="text-on-surface-variant/20 mx-1">/</span>{activeQuiz.questions.length}
                                            </span>
                                            <span className="text-[8px] font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest mt-1">Checkpoint Status</span>
                                        </div>
                                    </div>

                                    {/* Progression Bar */}
                                    <div className="w-full h-1.5 bg-on-background/5 rounded-full overflow-hidden mb-20">
                                        <motion.div 
                                            className="h-full bg-stitch-primary"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(Object.keys(answers).length / activeQuiz.questions.length) * 100}%` }}
                                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                        />
                                    </div>

                                    {/* Question Card */}
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-on-background text-white flex items-center justify-center font-black text-sm tabular-nums shadow-lg shadow-on-background/10">
                                                {currentQuestionIndex + 1}
                                            </div>
                                            <h3 className="text-2xl font-black text-on-background tracking-tight">{currentQuestion.question}</h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {currentQuestion.options.map((option, oi) => {
                                                const isSelected = answers[currentQuestion.id] === oi;
                                                return (
                                                        <button 
                                                            key={oi}
                                                            onClick={() => selectOption(oi)}
                                                            className={cn(
                                                                "group p-8 rounded-[2.5rem] border transition-all text-left relative overflow-hidden",
                                                                isSelected 
                                                                    ? "bg-on-background border-on-background scale-[1.02] shadow-2xl shadow-on-background/20" 
                                                                    : "bg-stitch-surface/40 border-stitch-outline/20 hover:border-stitch-primary/40 hover:bg-white"
                                                            )}
                                                        >
                                                        <div className="flex items-center gap-5 relative z-10">
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-xl border flex items-center justify-center font-black text-xs transition-colors",
                                                                isSelected ? "bg-stitch-primary border-stitch-primary text-on-primary" : "bg-stitch-surface/50 border-stitch-outline/20 text-on-surface-variant/70 dark:text-on-surface-variant/40 group-hover:border-stitch-primary/20 group-hover:text-stitch-primary"
                                                            )}>
                                                                {String.fromCharCode(65 + oi)}
                                                            </div>
                                                            <span className={cn(
                                                                "text-sm font-black transition-colors leading-tight",
                                                                isSelected ? "text-white" : "text-on-surface-variant/80"
                                                            )}>{option}</span>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                                                <Zap className="w-16 h-16 text-stitch-primary" />
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <div className="flex items-center justify-between mt-20 pt-10 border-t border-on-background/5">
                                        <button 
                                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                            disabled={currentQuestionIndex === 0}
                                            className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest text-on-surface-variant/30 hover:text-on-background transition-colors disabled:opacity-0"
                                        >
                                            Previous Point
                                        </button>
                                        
                                        <button 
                                            onClick={goNext}
                                            disabled={answers[currentQuestion.id] === undefined}
                                            className="group h-20 px-12 bg-on-background rounded-[2rem] flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 disabled:grayscale disabled:opacity-50"
                                        >
                                            <span className="text-white text-lg font-black tracking-tighter uppercase transition-colors">
                                                {currentQuestionIndex === activeQuiz.questions.length - 1 ? "Complete Matrix" : "Next Checkpoint"}
                                            </span>
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-colors">
                                                <ChevronRight className="w-5 h-5 text-stitch-primary" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
            
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </PageTransition>
    );
};

export default ProficiencyAnalyzer;
