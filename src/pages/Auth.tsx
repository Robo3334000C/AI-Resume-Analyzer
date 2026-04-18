import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePuterStore } from '../store/puterStore';
import { Button } from '@/components/ui/button';
import logo from "../assets/logo.png";
import { Github, Mail, Sparkles } from 'lucide-react';
import { PageTransition } from '@/components/ui/page-transition';

const Auth = () => {
    const { login, isAuthenticated } = usePuterStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (isAuthenticated) {
            const next = searchParams.get('next');
            if (next) {
                navigate(decodeURIComponent(next), { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [isAuthenticated, navigate, searchParams]);

    const handleLogin = async () => {
        await login();
    };

    return (
        <PageTransition>
            <div className="flex flex-col items-center justify-center min-h-screen bg-stitch-background relative overflow-hidden font-body">
                {/* Background gradients for aesthetics */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-stitch-primary/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stitch-secondary/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="p-10 max-w-md w-full glass-card border border-stitch-outline/10 rounded-[2.5rem] shadow-xl flex flex-col items-center gap-10 text-center relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-stitch-primary to-stitch-secondary"></div>

                    <div className="space-y-6 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-white p-2 shadow-lg shadow-stitch-primary/5 flex items-center justify-center border border-stitch-outline/10 relative">
                            <img src={logo} alt="ResuMe Logo" className="w-full h-full object-contain" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-stitch-primary flex items-center justify-center border-2 border-white shadow-lg">
                                <Sparkles className="h-3 w-3 text-[#171e00]" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter text-foreground mb-3 leading-none">
                                Resu<span className="text-stitch-primary italic">Me.</span>
                            </h1>
                            <p className="text-on-surface-variant font-black text-[10px] uppercase tracking-[0.3em] px-4 opacity-70">
                                Your AI-powered career bridge.
                            </p>
                        </div>
                    </div>

                    <div className="w-full space-y-4">
                        <Button
                            variant="outline"
                            onClick={handleLogin}
                            className="w-full h-14 text-sm font-black rounded-[1.5rem] border-stitch-outline/10 bg-stitch-surface/40 hover:bg-white/5 text-foreground transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            <Mail className="w-5 h-5 text-red-500" />
                            Continue with Google
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleLogin}
                            className="w-full h-14 text-sm font-black rounded-[1.5rem] border-stitch-outline/10 bg-stitch-surface/40 hover:bg-white/5 text-foreground transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            <Github className="w-5 h-5 text-foreground" />
                            Continue with GitHub
                        </Button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-stitch-outline/10"></span>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.4em] text-on-surface-variant/30">
                                <span className="bg-transparent px-4">OR</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleLogin}
                            className="w-full h-16 text-lg font-black rounded-[1.5rem] bg-stitch-primary hover:bg-stitch-primary/90 text-[#171e00] shadow-xl shadow-stitch-primary/10 transition-all active:scale-[0.98] border-none"
                        >
                            Sign in with Puter
                        </Button>
                    </div>

                    <p className="text-[9px] text-on-surface-variant/40 font-black uppercase tracking-[0.3em]">
                        Secured by Puter.js Cloud Architecture
                    </p>
                </div>
            </div>
        </PageTransition>
    );
};

export default Auth;
