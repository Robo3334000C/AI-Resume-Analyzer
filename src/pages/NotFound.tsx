import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center justify-center bg-stitch-background text-foreground font-body p-6 text-center overflow-hidden relative">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-stitch-primary/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-stitch-secondary/5 rounded-full blur-[100px] -z-10" />

        <div className="glass-card rounded-[3.5rem] p-16 border border-stitch-outline/20 shadow-2xl max-w-lg w-full relative liquid-glow">
          <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mb-10 text-red-500 mx-auto border border-red-500/20">
            <AlertCircle className="w-12 h-12" />
          </div>
          
          <h1 className="text-8xl font-black tracking-tighter text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-black text-on-background mb-6 uppercase tracking-tight">Route Not Found</h2>
          
          <p className="mb-12 text-on-surface-variant font-medium leading-relaxed">
            The path <span className="text-stitch-primary font-bold italic">"{location.pathname}"</span> does not exist in our career architecture.
          </p>
          
          <Button 
            onClick={() => navigate('/')}
            className="w-full h-16 bg-stitch-primary hover:bg-stitch-primary/90 text-[#171e00] font-black text-lg rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(183,222,5,0.3)] transition-all active:scale-95 border-none"
          >
            <ArrowLeft className="w-5 h-5" /> Return to Genesis
          </Button>
        </div>
        
        <p className="mt-12 text-[10px] font-black text-on-surface-variant/20 uppercase tracking-[0.5em]">
          Error Code: 0x404_NULL_POINTER
        </p>
      </div>
    </PageTransition>
  );
};

export default NotFound;
