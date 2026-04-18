import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer
} from 'recharts';
import { KVDatabaseRecord } from '@/types/puter';
import { Download, Sparkles, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageTransition } from '@/components/ui/page-transition';

const Result = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [record, setRecord] = useState<KVDatabaseRecord | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let objectUrl: string | null = null;

        const fetchResult = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const data = await window.puter.kv.get(id) as KVDatabaseRecord | null;
                if (!data) {
                    setError("Evaluation not found. It might have been deleted.");
                    return;
                }
                setRecord(data);

                if (data.thumbnailPath) {
                    try {
                        const blob = await window.puter.fs.read(data.thumbnailPath);
                        objectUrl = URL.createObjectURL(blob as Blob);
                        setThumbnailUrl(objectUrl);
                    } catch (fsError) {
                        console.error("Could not load thumbnail", fsError);
                    }
                }
            } catch (err: any) {
                console.error("Failed to load result:", err);
                setError("Failed to fetch evaluation. Please try again.");
            } finally {
                setTimeout(() => setIsLoading(false), 800);
            }
        };

        fetchResult();
        return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stitch-background pb-32 font-body">
                <Header />
                <div className="pt-32 p-6 lg:p-12 space-y-12">
                    <div className="max-w-7xl mx-auto space-y-12">
                        <Skeleton className="h-10 w-48 bg-stitch-surface" />
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <Skeleton className="lg:col-span-4 h-[500px] rounded-[2.5rem] bg-stitch-surface" />
                            <Skeleton className="lg:col-span-8 h-[500px] rounded-[2.5rem] bg-stitch-surface" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !record) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-stitch-background text-foreground font-body">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 text-red-400">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black mb-4 text-foreground">Evaluation Not Found</h2>
                <p className="text-on-surface-variant font-medium mb-8 max-w-md">{error || "The requested analysis is no longer available."}</p>
                <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-stitch-primary hover:shadow-[0_0_20px_rgba(183,222,5,0.3)] text-[#171e00] rounded-full px-8 py-6 font-bold shadow-xl border-none active:scale-95 transition-all"
                >
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const result = record.result;
    if (!result || !result.score || !result.summary) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-stitch-background text-foreground font-body">
                <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mb-6 text-orange-400">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black mb-4 text-foreground">Malformed Analysis</h2>
                <p className="text-on-surface-variant font-medium mb-8 max-w-md">
                    The AI generated an incomplete analysis. This can happen if the resume content is too complex or the model is overloaded.
                </p>
                <Button
                    onClick={() => navigate('/upload')}
                    className="bg-stitch-primary hover:shadow-[0_0_20px_rgba(183,222,5,0.3)] text-[#171e00] rounded-full px-8 py-6 font-bold shadow-xl border-none active:scale-95 transition-all"
                >
                    Try New Scan
                </Button>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-stitch-background text-foreground font-body selection:bg-stitch-primary/30">
                <Header />

                <main className="flex h-[calc(100vh-4rem)] pt-16 overflow-hidden">
                    {/* Split Screen Layout */}
                    <div className="flex-1 flex overflow-hidden">
                        
                        {/* Left Side: Resume View */}
                        <section className="flex-1 bg-stitch-surface/30 backdrop-blur-sm p-8 overflow-y-auto hidden md:block border-r border-stitch-outline/10">
                            <div className="max-w-4xl mx-auto">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-between mb-10"
                                >
                                    <div className="flex flex-col">
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-stitch-primary animate-pulse" />
                                            Live Rendering Preview
                                        </h2>
                                        <p className="text-xl font-black text-foreground mt-2">{record.pdfPath.split('/').pop()}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl bg-stitch-surface border-stitch-outline/20 hover:bg-stitch-surface-variant text-foreground">
                                            <Download className="w-5 h-5 text-on-surface-variant" />
                                        </Button>
                                    </div>
                                </motion.div>

                                {/* Paper Mockup */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-sm p-1 gap-1 flex flex-col min-h-[1000px] border border-stitch-outline/20 relative group overflow-hidden"
                                >
                                    {thumbnailUrl ? (
                                        <img src={thumbnailUrl} alt="Resume Preview" className="w-full h-auto brightness-90 saturate-50 sepia-[.2]" />
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-on-surface-variant">
                                            <FileText className="w-32 h-32 mb-6 opacity-20" />
                                            <p className="text-xl font-black italic opacity-50">Visualizing content...</p>
                                        </div>
                                    )}
                                    
                                    {/* Scanning Overlay Effect */}
                                    <div className="absolute inset-x-0 h-1 bg-stitch-primary/40 shadow-[0_0_20px_rgba(183,222,5,0.8)] z-10 pointer-events-none animate-[scan_4s_ease-in-out_infinite]" />
                                </motion.div>
                            </div>
                        </section>

                        {/* Right Side: AI Insights Bento */}
                        <section className="w-full md:w-[480px] lg:w-[550px] xl:w-[600px] glass-card backdrop-blur-xl overflow-y-auto p-8 border-l border-stitch-outline/10 scrollbar-hide">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-10 flex items-center justify-between"
                            >
                                <div>
                                    <h2 className="text-4xl font-black text-foreground tracking-tighter">Analysis <span className="text-stitch-primary italic">Center.</span></h2>
                                    <p className="text-sm text-on-surface-variant font-medium mt-1 uppercase tracking-widest text-shift">Real-time Performance Metrics</p>
                                </div>
                                <button className="bg-stitch-primary hover:bg-stitch-primary/90 text-[#171e00] w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 group">
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </button>
                            </motion.div>

                            {/* Bento Grid */}
                            <div className="grid grid-cols-2 gap-5">
                                {/* Main Score Card */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="col-span-2 glass-card rounded-[2.5rem] p-8 border border-stitch-outline/20 shadow-xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity text-stitch-primary">
                                        <Sparkles className="w-32 h-32" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-8">Performance Benchmark</h3>
                                    
                                    <div className="flex flex-col md:flex-row items-center gap-10">
                                        <div className="relative w-40 h-40 flex items-center justify-center">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle className="text-white/5" cx="80" cy="80" fill="transparent" r="72" stroke="currentColor" strokeWidth="12"></circle>
                                                <motion.circle 
                                                    initial={{ strokeDashoffset: 452 }}
                                                    animate={{ strokeDashoffset: 452 - (452 * result.score) / 100 }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className="text-stitch-primary" 
                                                    cx="80" 
                                                    cy="80" 
                                                    fill="transparent" 
                                                    r="72" 
                                                    stroke="currentColor" 
                                                    strokeDasharray="452" 
                                                    strokeWidth="16"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-5xl font-black text-foreground tracking-tighter">{Math.round(result.score)}</span>
                                                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mt-1">Global Match</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 space-y-4">
                                            <div className="p-4 glass-card rounded-3xl border border-stitch-outline/10">
                                                <p className="text-sm font-black text-stitch-primary mb-1 flex items-center gap-2 uppercase tracking-tight">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-stitch-primary" />
                                                    Executive Insight
                                                </p>
                                                <p className="text-xs text-on-surface-variant leading-relaxed font-medium italic line-clamp-3">
                                                    "{result.summary}"
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-[9px] font-black bg-stitch-primary/10 text-stitch-primary px-3 py-1 rounded-full uppercase border border-stitch-primary/20">ATS OPTIMIZED</span>
                                                <span className="text-[9px] font-black glass-card text-on-surface-variant px-3 py-1 rounded-full uppercase border border-stitch-outline/10">V5 ANALYZED</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Advantages */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="col-span-2 md:col-span-1 glass-card rounded-[1.5rem] p-6 border border-stitch-outline/10 shadow-lg"
                                >
                                    <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-6">Key Strengths</h4>
                                    <div className="space-y-3">
                                        {result.strengths.slice(0, 3).map((s, i) => (
                                            <div key={i} className="flex gap-3 group">
                                                <div className="mt-1 w-1 h-1 rounded-full bg-stitch-primary shrink-0 group-hover:scale-150 transition-transform" />
                                                <p className="text-[11px] font-bold text-on-surface-variant leading-tight">{s}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Gaps */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="col-span-2 md:col-span-1 glass-card rounded-[1.5rem] p-6 border border-stitch-outline/10 shadow-lg"
                                >
                                    <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-6">Critical Gaps</h4>
                                    <div className="space-y-3">
                                        {result.weaknesses.slice(0, 3).map((w, i) => (
                                            <div key={i} className="flex gap-3 group">
                                                <div className="mt-1 w-1 h-1 rounded-full bg-red-500 shrink-0 group-hover:scale-150 transition-transform" />
                                                <p className="text-[11px] font-bold text-on-surface-variant leading-tight">{w}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Action Roadmap */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="col-span-2 glass-card text-foreground rounded-[1.5rem] p-8 border border-stitch-outline/10 shadow-xl relative overflow-hidden"
                                    >
                                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-stitch-primary/10 rounded-full blur-[60px] pointer-events-none" />
                                    <div className="flex justify-between items-center mb-8 relative z-10">
                                        <h4 className="text-xl font-black tracking-tight">Strategy Roadmap</h4>
                                        <div className="w-10 h-10 bg-stitch-surface-variant rounded-xl flex items-center justify-center border border-stitch-outline/10 group-hover:bg-stitch-primary/10 transition-colors">
                                            <ChevronRight className="w-5 h-5 text-stitch-primary" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-5 relative z-10">
                                        {result.actionItems.slice(0, 2).map((item, i) => (
                                            <div key={i} className="p-5 glass-card rounded-2xl border border-stitch-outline/10 hover:border-stitch-outline/30 transition-colors cursor-default">
                                                <p className="text-[10px] font-black text-stitch-primary mb-1 uppercase tracking-widest">{item.title}</p>
                                                <p className="text-xs text-on-surface-variant font-medium italic">"{item.description}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* AI Prompt Interaction */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="col-span-2 bg-stitch-primary/5 border border-stitch-primary/10 p-6 rounded-[1.5rem] mt-4"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-stitch-primary" />
                                        </div>
                                        <span className="text-sm font-black text-foreground tracking-tight">Interactive Optimization</span>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            className="w-full glass-card border-stitch-outline/20 rounded-2xl text-[13px] py-4 pl-5 pr-14 focus:ring-stitch-primary focus:border-stitch-primary font-bold placeholder:text-on-surface-variant text-foreground transition-all" 
                                            placeholder="e.g., 'Rewrite my summary to be more impact-focused'" 
                                            type="text"
                                        />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-stitch-primary rounded-xl flex items-center justify-center text-[#171e00] shadow-lg shadow-stitch-primary/20 hover:scale-105 active:scale-95 transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
            
            <style>{`
                @keyframes scan {
                    0%, 100% { top: 0%; opacity: 0; }
                    5% { opacity: 1; }
                    50% { top: 100%; }
                    95% { opacity: 1; }
                    99% { top: 100%; opacity: 0; }
                }
            `}</style>
        </PageTransition>
    );
};

export default Result;
