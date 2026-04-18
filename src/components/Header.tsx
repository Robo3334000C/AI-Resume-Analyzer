import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutGrid,
  FileText,
  Zap,
  Award,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import logo from "../assets/logo.png";
import { usePuterStore } from "../store/puterStore";
import { LogOut, User } from "lucide-react";
import SocialMenu from "./SocialMenu";
import ThemeToggle from "./ThemeToggle";

const NavBubbles = () => {
    const bubbles = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        width: Math.random() * 40 + 20,
        height: Math.random() * 4 + 2, // Very thin, like streaks
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 20 + 20,
        yOffset: Math.random() * 30 - 15
    }));

    return (
        <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] z-0 overflow-hidden">
            {bubbles.map(bubble => (
                <motion.div
                    key={bubble.id}
                    initial={{ x: "-20%", y: `${50 + bubble.yOffset}%`, opacity: 0 }}
                    animate={{ 
                        x: "130%",
                        opacity: [0, 0.1, 0.15, 0.1, 0],
                        scaleX: [1, 1.2, 0.8, 1.1, 1]
                    }}
                    transition={{
                        x: { duration: bubble.duration, repeat: Infinity, delay: bubble.delay, ease: "linear" },
                        opacity: { duration: bubble.duration, repeat: Infinity, ease: "linear" },
                        scaleX: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                    style={{
                        width: bubble.width,
                        height: bubble.height,
                        borderRadius: "100px",
                        filter: "blur(2px)"
                    }}
                    className="absolute bg-white/20 dark:bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                />
            ))}
        </div>
    );
};

const NavShine = () => (
    <motion.div
        animate={{ 
            x: ["-200%", "200%"],
            opacity: [0, 0.4, 0]
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
        }}
        className="absolute inset-0 z-10 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
    />
);

export const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const { isAuthenticated, login, logout } = usePuterStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { path: "/upload", label: "Resume Scan", icon: FileText },
    { path: "/interview-simulator", label: "Interview", icon: Zap },
    { path: "/proficiency-analyzer", label: "Skills", icon: Award },
  ];

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          setMousePosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? "py-4" : "py-6"}`}
      style={{ 
          "--mouse-x": `${mousePosition.x}px`, 
          "--mouse-y": `${mousePosition.y}px` 
      } as any}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <nav className={`relative flex items-center justify-between px-4 sm:px-8 py-3 rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-700 border border-white/20 dark:border-white/10 shadow-lg ${isScrolled
          ? "bg-white/10 dark:bg-[#1b1c18]/40 backdrop-blur-xl"
          : "bg-white/5 dark:bg-white/5 backdrop-blur-lg"
          }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-10 hover:scale-105 transition-transform duration-500">
            <div className="relative">
              <div className="w-12 h-12 rounded-[1.2rem] bg-white/10 dark:bg-[#1b1c18]/40 backdrop-blur-md flex items-center justify-center shadow-md overflow-hidden border border-white/20 dark:border-white/10 p-1 relative">
                <img src={logo} alt="ResuME Logo" className="w-full h-full object-contain dark:brightness-0 dark:invert relative z-10" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-stitch-primary flex items-center justify-center border border-white/20 z-20">
                <Sparkles className="h-2 w-2 text-stitch-primary-foreground" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-on-background leading-none">
                Resu<span className="text-stitch-primary">ME</span>
              </span>
              <span className="text-[9px] font-black text-on-surface-variant/70 dark:text-on-surface-variant/40 uppercase tracking-widest mt-0.5">Digital Career Hub</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div 
            className="hidden xl:flex items-center gap-1 bg-white/5 dark:bg-white/5 p-1.5 rounded-[2rem] border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-lg mx-auto relative group overflow-hidden"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              const isHovered = hoveredPath === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => setHoveredPath(link.path)}
                  className={`relative px-6 py-2.5 rounded-2xl text-sm font-black transition-all duration-300 flex items-center gap-3 ${
                    isActive || isHovered
                      ? "text-stitch-primary"
                      : "text-on-surface-variant/70 dark:text-on-surface-variant/40 hover:text-on-background"
                  }`}
                >
                  {(isActive || isHovered) && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 dark:bg-white/10 rounded-[1.5rem] z-0 border border-white/20 dark:border-white/10 backdrop-blur-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 transition-colors duration-300 ${isActive || isHovered ? "text-stitch-primary" : "text-on-surface-variant/70 dark:text-on-surface-variant/40"}`} />
                  <span className="relative z-10 tracking-tight">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-4 border-l border-on-surface-variant/10">
                <div className="w-10 h-10 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-xl flex items-center justify-center text-stitch-primary border border-white/30 dark:border-white/20 cursor-pointer hover:bg-white/40 transition-all shadow-lg hover:scale-105">
                  <User className="w-5 h-5" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="rounded-full text-on-surface-variant/70 dark:text-on-surface-variant/40 hover:text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={login}
                className="rounded-full font-black text-on-surface-variant/80 dark:text-on-surface-variant/60 hover:text-on-background hover:bg-stitch-surface/40 backdrop-blur-sm px-6"
              >
                Sign In
              </Button>
            )}

          </div>

          {/* Mobile Toggle & Always-Visible Actions */}
          <div className="flex items-center gap-2 relative z-10">
            <ThemeToggle />
            <button
              className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-stitch-surface/40 backdrop-blur-md text-on-background border border-stitch-outline/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-6 right-6 mt-4 p-6 bg-stitch-surface/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-stitch-outline/20 md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${isActive ? "bg-stitch-primary/10 text-stitch-primary border border-stitch-primary/20" : "text-on-surface-variant/80 dark:text-on-surface-variant/60 hover:bg-white/40 hover:text-on-background"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Social Menu Widget */}
      <div className="fixed bottom-6 right-6 z-[100] transform scale-[0.55] origin-bottom-right drop-shadow-2xl">
        <SocialMenu />
      </div>
    </header>
  );
};
