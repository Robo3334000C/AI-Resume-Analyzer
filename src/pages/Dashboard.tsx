import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText,
    ChevronRight,
    Trash2,
    FilePlus,
    Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';

import { KVDatabaseRecord } from '@/types/puter';
import { getRelativeTime } from '@/lib/utils';
import { Header } from '@/components/Header';
import { PageTransition } from '@/components/ui/page-transition';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [records, setRecords] = useState<KVDatabaseRecord[]>([]);

    const fetchRecords = async () => {
        try {
            setIsLoading(true);
            const items = await window.puter.kv.list() as { key: string, value: any }[];

            const parsedRecords = items
                .map(item => item.value)
                .filter((record): record is KVDatabaseRecord =>
                    record && typeof record === 'object' && 'id' in record && 'createdAt' in record
                )
                .sort((a, b) => b.createdAt - a.createdAt);

            setRecords(parsedRecords);
        } catch (error) {
            console.error("Failed to fetch records:", error);
            // Don't toast during initial loading to avoid clutter
        } finally {
            // Artificial delay for premium feel loading state
            setTimeout(() => setIsLoading(false), 800);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleCardClick = (type: string) => {
        console.log(`Handling card click for: ${type}`);
        switch (type) {
            case 'resume_analyzer':
                navigate('/upload');
                break;
            case 'skill_map':
                navigate('/proficiency-analyzer');
                break;
            case 'interview_simulator':
                navigate('/interview-simulator');
                break;
        }
    };

    const handleWipe = async () => {
        if (!window.confirm("Are you sure you want to delete ALL resumes? This cannot be undone.")) {
            return;
        }

        const wipeId = toast.loading("Wiping database...");
        try {
            const items = await window.puter.kv.list() as { key: string, value: any }[];
            for (const item of items) {
                await window.puter.kv.del(item.key);
            }
            toast.success("History cleared.", { id: wipeId });
            setRecords([]);
        } catch (error) {
            console.error("Wipe failed:", error);
            toast.error("Failed to wipe data.", { id: wipeId });
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-stitch-background text-foreground font-body selection:bg-stitch-primary/30 selection:text-foreground overflow-x-hidden relative">
                {/* Background Decorations */}
                <GlassBubbles />

                <Header />

                <main className="pt-32 pb-24 relative z-10">
                    {/* Hero Section */}
                    <section className="relative px-6 text-center space-y-6 mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-stitch-outline/30 text-stitch-primary text-xs font-black uppercase tracking-widest mb-4 shadow-sm"
                        >
                            <Sparkles className="w-3 h-3" />
                            <span>AI Career Intelligence</span>
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-fluid-h1 font-black tracking-tighter text-foreground max-w-4xl mx-auto mb-6 cursor-default"
                        >
                            <BubbleText text="Talent Dashboard." />
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-on-surface-variant font-medium max-w-2xl mx-auto text-shift"
                        >
                            Manage your professional portfolio and track your AI-driven performance metrics in one premium space.
                        </motion.p>
                    </section>

                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            {/* Left Side: Stats & Info (4 cols) */}
                            <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="rounded-[2.5rem] p-8 border border-stitch-outline/10 h-full bg-stitch-surface/30 backdrop-blur-xl transition-all duration-700 hover:bg-stitch-surface/40 magnetic-glass"
                                >
                                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-8 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-stitch-primary animate-ping" />
                                        System Status
                                    </h3>
                                    
                                    <div className="space-y-6">
                                        <div className="p-6 glass-card rounded-3xl border border-stitch-outline/10 group cursor-pointer hover:border-stitch-primary/30 transition-all shadow-lg">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-stitch-primary/10 rounded-2xl flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-stitch-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-foreground leading-none">Global Accuracy</h4>
                                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 block">AI Engine V5.2</span>
                                                </div>
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <span className="text-3xl font-black text-foreground">99.8%</span>
                                                <span className="text-xs font-bold text-[#171e00] bg-stitch-primary px-3 py-1 rounded-full">+2.4% Optimal</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-5 glass-card rounded-3xl border border-stitch-outline/10 hover:border-stitch-primary/30 transition-all shadow-md">
                                                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2">Total Scans</span>
                                                <span className="text-2xl font-black text-foreground">{records.length}</span>
                                            </div>
                                            <div className="p-5 glass-card rounded-3xl border border-stitch-outline/10 hover:border-stitch-primary/30 transition-all shadow-md">
                                                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2">Pro Credits</span>
                                                <span className="text-2xl font-black text-stitch-primary">∞</span>
                                            </div>
                                        </div>

                                        <Button 
                                            onClick={() => navigate('/upload')}
                                            className="w-full h-16 bg-gradient-to-br from-stitch-primary-container to-stitch-primary text-[#171e00] rounded-[1.5rem] font-black text-lg shadow-[0_10px_30px_rgba(183,222,5,0.3)] hover:shadow-[0_15px_40px_rgba(183,222,5,0.4)] group overflow-hidden relative border-none hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            <span className="relative z-10 flex items-center gap-3">
                                                <FilePlus className="w-5 h-5" /> New Analysis
                                            </span>
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Side: Saved Evaluations (8 cols) */}
                            <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="rounded-[2.5rem] p-10 border border-stitch-outline/10 shadow-xl h-full min-h-[600px] flex flex-col relative overflow-hidden bg-stitch-surface/30 backdrop-blur-xl transition-all duration-700 hover:bg-stitch-surface/40 magnetic-glass"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-stitch-primary/5 rounded-full blur-[80px]"></div>

                                    <div className="flex items-center justify-between mb-10 relative z-10">
                                        <h2 className="text-fluid-h2 font-black tracking-tighter text-foreground line-height-[1.1]">Saved <span className="text-stitch-primary">Evaluations.</span></h2>
                                        {records.length > 0 && (
                                            <button
                                                onClick={handleWipe}
                                                className="p-3 rounded-2xl glass-card text-on-surface-variant hover:text-red-400 hover:bg-red-500/10 transition-all border border-stitch-outline/20"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    {isLoading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="h-48 w-full rounded-3xl bg-stitch-surface animate-pulse border border-stitch-outline/10" />
                                            ))}
                                        </div>
                                    ) : records.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 relative z-10">
                                            <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] border border-stitch-outline/10 flex items-center justify-center text-on-surface-variant mb-6 transition-all hover:text-stitch-primary">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-black text-foreground mb-3">No scans yet.</h3>
                                            <p className="text-on-surface-variant font-medium max-w-sm mb-8">
                                                Upload your first resume to unlock premium AI insights and track your progress.
                                            </p>
                                            <Button 
                                                onClick={() => navigate('/upload')}
                                                className="px-8 h-14 bg-stitch-surface backdrop-blur-md border border-stitch-outline/20 text-stitch-primary hover:bg-stitch-surface-variant hover:border-stitch-primary/40 font-black rounded-2xl"
                                            >
                                                Scan First Resume
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                            {records.map((record) => (
                                                <HistoryCard 
                                                    key={record.id} 
                                                    record={record} 
                                                    onClick={() => navigate(`/result/${record.id}`)} 
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="glass-card border-t border-stitch-outline/20 pt-20 pb-12 mt-20 relative z-10">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
                            <div className="space-y-6 lg:max-w-xs">
                                <h4 className="text-2xl font-black text-foreground tracking-tighter">Curator AI</h4>
                                <p className="text-on-surface-variant text-sm leading-relaxed">
                                    The Obsidian Curator for high-performance professionals. Defining the future of AI-driven career architecture.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h5 className="font-bold text-stitch-primary uppercase tracking-[0.2em] text-xs">Product</h5>
                                    <ul className="space-y-4 text-sm font-medium text-on-surface-variant">
                                        {["Features", "Pricing", "Security", "Showcase"].map(link => (
                                            <li key={link} className="hover:text-stitch-primary cursor-pointer transition-colors duration-300">{link}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-6">
                                    <h5 className="font-bold text-stitch-primary uppercase tracking-[0.2em] text-xs">Company</h5>
                                    <ul className="space-y-4 text-sm font-medium text-on-surface-variant">
                                        {["About", "Newsletter", "Privacy", "Terms"].map(link => (
                                            <li key={link} className="hover:text-stitch-primary cursor-pointer transition-colors duration-300">{link}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-6">
                               <h5 className="font-bold text-stitch-primary uppercase tracking-[0.2em] text-xs">Status</h5>
                               <div className="flex items-center gap-4 glass-card p-4 rounded-2xl border border-stitch-outline/20 w-fit">
                                  <div className="w-3 h-3 rounded-full bg-stitch-primary animate-pulse" />
                                  <span className="text-sm font-bold text-foreground tracking-tight">All Systems Operational</span>
                               </div>
                            </div>
                        </div>
                        
                        <div className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] text-center md:text-left">
                            © 2026 Curator AI. The Obsidian Curator.
                        </div>
                    </div>
                </footer>
            </div>
        </PageTransition>
    );
};

const HistoryCard = ({ record, onClick }: { record: KVDatabaseRecord, onClick: () => void }) => {
    const score = Math.round(record.result.score);
    const scoreColor = score >= 75 ? 'text-stitch-primary' : score >= 50 ? 'text-orange-400' : 'text-red-400';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group h-full"
        >
            <div
                onClick={onClick}
                className="glass-card border border-stitch-outline/10 shadow-lg rounded-[1.5rem] overflow-hidden cursor-pointer hover:scale-[1.01] hover:bg-stitch-primary/5 hover:border-stitch-primary/30 transition-all duration-300 h-full flex flex-col p-8 relative"
            >
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="transition-all duration-500">
                            <FileText className="w-6 h-6 text-on-surface-variant group-hover:text-stitch-primary transition-colors" />
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="font-black text-foreground truncate max-w-[140px] text-lg leading-none">{record.pdfPath.split('/').pop()}</h4>
                            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mt-2">{getRelativeTime(record.createdAt)}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`text-3xl font-black ${scoreColor} leading-none`}>{score}</span>
                        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-1">Match Index</span>
                    </div>
                </div>

                <p className="text-sm text-on-surface-variant font-medium line-clamp-2 leading-relaxed italic mb-8 border-l-2 border-stitch-primary/20 pl-4 py-1">
                    "{record.result.summary}"
                </p>

                <div className="mt-auto pt-6 border-t border-stitch-outline/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-stitch-primary transition-colors">
                    <span>Performance Report</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
};

const BubbleText = ({ text }: { text: string }) => {
    const chars = text.split("");
    const glassEffect = {
        scale: 1.3,
        y: -12,
        color: "transparent",
        WebkitTextFillColor: "transparent",
        WebkitTextStroke: "1.5px hsl(var(--primary))",
        textShadow: "0 0 20px hsl(var(--primary) / 0.5), 0 0 40px hsl(var(--primary) / 0.3)",
        transition: { type: "spring", stiffness: 450, damping: 12 }
    };

    return (
        <div className="flex flex-wrap justify-center overflow-visible py-4">
            {chars.map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ y: 0, scale: 1, color: "var(--foreground)" }}
                    whileHover={glassEffect}
                    whileTap={glassEffect}
                    className="inline-block transition-none cursor-default"
                    style={{ 
                        marginRight: char === " " ? "0.3em" : "0",
                        textShadow: "none"
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </div>
    );
};

const GlassBubbles = ({ mouseX, mouseY }: { mouseX: number, mouseY: number }) => {
    const bubbles = Array.from({ length: 12 }).map((_, i) => {
        const size = Math.random() * 200 + 40;
        const left = Math.random() * 100;
        const duration = Math.random() * 30 + 30;
        const delay = Math.random() * 10;
        const depth = Math.random() * 0.05; // Parallax intensity
        // Organic bubble shapes
        const borderRadius = `${40 + Math.random() * 20}% ${40 + Math.random() * 20}% ${40 + Math.random() * 20}% ${40 + Math.random() * 20}% / ${40 + Math.random() * 20}% ${40 + Math.random() * 20}% ${40 + Math.random() * 20}% ${40 + Math.random() * 20}%`;
        return { id: i, size, left, duration, delay, borderRadius, depth };
    });

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            {bubbles.map(bubble => (
                <motion.div
                    key={bubble.id}
                    initial={{ y: "110vh", opacity: 0 }}
                    animate={{ 
                        y: "-20vh",
                        opacity: [0, 0.05, 0.08, 0.05, 0],
                        x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
                        rotate: [0, 90, 180, 270, 360]
                    }}
                    transition={{
                        duration: bubble.duration,
                        repeat: Infinity,
                        delay: bubble.delay,
                        ease: "linear"
                    }}
                    style={{
                        width: bubble.size,
                        height: bubble.size,
                        left: `${bubble.left}%`,
                        borderRadius: bubble.borderRadius,
                        translateX: (mouseX - 800) * bubble.depth,
                        translateY: (mouseY - 450) * bubble.depth
                    }}
                    className="absolute bg-white/[0.03] border-[0.5px] border-white/5 opacity-20"
                />
            ))}
        </div>
    );
};

export default Dashboard;
