import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Target,
  BrainCircuit,
  Fingerprint,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticWrapper } from "@/components/ui/magnetic-wrapper";
import { PageTransition } from "@/components/ui/page-transition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-stitch-background text-foreground selection:bg-stitch-primary-container selection:text-stitch-primary relative overflow-hidden">
        {/* Liquid Glass Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-[60%] h-[60%] bg-stitch-primary/10 rounded-full blur-[120px]"
          />
          <div className="absolute inset-0 bg-on-background/5 backdrop-blur-[1px]" />
        </div>

        <Header />

        <main className="relative z-10 pt-32 pb-24 px-6">
          <div className="container mx-auto max-w-7xl">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 pt-12">
              <div className="space-y-8 z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stitch-surface-variant/10 dark:bg-stitch-surface-variant border border-stitch-primary/20 text-stitch-primary dark:text-stitch-primary text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(183,222,5,0.1)]"
                >
                  <span className="flex h-2 w-2 rounded-full bg-stitch-primary animate-pulse"></span>
                  Intelligence Platform
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-gradient-liquid text-balance"
                >
                  Architecting Your <br /> Future Path
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl md:text-2xl text-on-surface-variant font-light max-w-xl leading-relaxed text-shift"
                >
                  The obsidian standard for career curation. Leverage deep AI analytics to transform your professional narrative into a high-performance engine.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-6 pt-4"
                >
                  <Link to="/upload">
                    <MagneticWrapper>
                      <Button className="h-16 px-10 rounded-[1.5rem] bg-gradient-to-br from-stitch-primary-container to-stitch-primary text-[#171e00] font-black text-lg gap-4 shadow-xl shadow-stitch-primary/10 hover:shadow-2xl hover:shadow-stitch-primary/20 transition-all active:scale-95">
                        Initialize Growth <ArrowRight className="w-6 h-6" />
                      </Button>
                    </MagneticWrapper>
                  </Link>
                  <Link to="/proficiency-analyzer">
                    <MagneticWrapper>
                      <Button variant="outline" className="h-16 px-10 rounded-[1.5rem] border-stitch-outline/10 bg-transparent backdrop-blur-xl text-foreground font-black text-lg hover:bg-white/5 transition-all">
                        View Methodology
                      </Button>
                    </MagneticWrapper>
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative flex justify-center group"
              >
                <div className="absolute inset-0 bg-stitch-primary/5 rounded-full blur-[120px]"></div>
                <div className="relative w-full aspect-square max-w-md glass-card rounded-[2.5rem] p-1 overflow-hidden shadow-2xl border border-stitch-outline/20 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-[1.02]">
                  <img
                    alt="Abstract 3D plant"
                    className="w-full h-full object-cover rounded-[2.4rem]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB4u6X1GzryJMBLWZLksjraoY08ApSG__UygN1LdlQD6nWu5UTIIZ1P-a76hQncJXC0jIm2mpZRS767STAeX1gaMuE1ELRGYIW0E4HhBier3Ofvx6MAFRZ42bbeLi5_z-dkVOa8AaO0EWxkfQQ1H_cDWhaGppTfRRAoHztkqOcyoXzJiwxt__dp-ofGc4UgbsnXy7aPcKK0x3HVO-3o-0k_4Vc3kS46tIgP_zl6PrXunsC1YgrHuHXBi1es7ruC5k3VSHftWNL-Js"
                  />
                  
                  {/* Floating Glass Labels */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-6 right-6 glass-card p-5 rounded-[1.5rem] border border-stitch-outline/10 backdrop-blur-xl z-20"
                  >
                    <div className="text-stitch-primary text-xs font-bold tracking-widest uppercase mb-1">Growth Index</div>
                    <div className="text-3xl font-black text-foreground">+184%</div>
                  </motion.div>
                </div>
              </motion.div>
            </section>

            {/* Precision Instruments Bento Grid */}
            <section className="space-y-16 py-24">
              <div className="mb-16">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Precision Instruments</h2>
                <p className="text-on-surface-variant text-lg max-w-xl font-light">Advanced modules designed to dissect, analyze, and rebuild your professional DNA.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[800px]">
                {/* AI Resume Optimizer */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="md:col-span-8 glass-card rounded-[2.5rem] p-12 border border-stitch-outline/10 flex flex-col justify-between relative overflow-hidden group shadow-xl backdrop-blur-xl"
                >
                  <div className="relative z-10">
                    <Sparkles className="text-stitch-primary w-12 h-12 mb-6" />
                    <h3 className="text-4xl font-black mb-4">AI Resume Optimizer</h3>
                    <p className="text-on-surface-variant text-lg max-w-md mb-8">Deploying neural-linguistic models to reconstruct your experience into high-conversion bullet points that outperform ATS benchmarks.</p>
                    <Button variant="ghost" className="text-stitch-primary font-bold hover:bg-transparent hover:text-stitch-primary p-0 flex items-center gap-2 group-hover:gap-4 transition-all text-lg">
                      Execute Analysis <ArrowRight className="w-6 h-6" />
                    </Button>
                  </div>
                  <div className="absolute right-0 bottom-0 w-3/5 opacity-60 dark:opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img 
                      alt="UI Mockup" 
                      className="w-full h-full object-cover rounded-tl-[2.5rem]" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWcpy-0kTMm2_kZvwiKtQB8gWCoW1htrntVmZoJunVvNrzJNeb_J7A9Q9eUDD6LxHkPxFoUmqGRyThxjrO8Jm6RAtVPuBqry_O81Pny1SWt6uFZrQvK5gqFZGSXTXdKrN1-qMbPYh_Sso31CeDc5-9HASJDM-h55y0nEgZpNRiinZs8ab8cikRLqnbsQLUaAsuD16TCbbhB5u0Fi9t4bAq1sXYDjn039bTVBkJsAm_CWBUogTB-1DGlLNgmFzDFadAdyIUqT_bQoE"
                    />
                  </div>
                </motion.div>

                {/* Resume Scanner */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="md:col-span-4 glass-card rounded-[2.5rem] p-10 border border-stitch-outline/10 flex flex-col items-start justify-end bg-gradient-to-t from-stitch-primary/10 to-transparent shadow-xl backdrop-blur-xl"
                >
                  <Target className="text-stitch-primary w-12 h-12 mb-6" />
                  <h3 className="text-3xl font-black mb-4">Resume Scanner</h3>
                  <p className="text-on-surface-variant text-base mb-8">Instant compatibility scoring against Tier-1 job descriptions.</p>
                  <div className="w-full h-40 glass-card rounded-[1.5rem] border border-stitch-outline/5 p-4 flex items-center justify-center backdrop-blur-xl">
                    <div className="w-20 h-20 flex items-center justify-center">
                       <ArrowRight className="w-8 h-8 text-stitch-primary -rotate-90" />
                    </div>
                  </div>
                </motion.div>

                {/* Skill DNA */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="md:col-span-4 glass-card rounded-[2.5rem] p-10 border border-stitch-outline/10 flex flex-col shadow-xl backdrop-blur-xl"
                >
                  <Fingerprint className="text-stitch-primary w-12 h-12 mb-6" />
                  <h3 className="text-3xl font-black mb-4">Skill DNA</h3>
                  <p className="text-on-surface-variant text-base mb-8">Map your cognitive and technical abilities onto a multi-dimensional graph to identify critical market gaps.</p>
                  <div className="mt-auto grid grid-cols-3 gap-3">
                    <div className="h-24 bg-stitch-primary/40 rounded-xl"></div>
                    <div className="h-40 bg-stitch-primary/60 rounded-xl relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" /></div>
                    <div className="h-20 bg-stitch-primary/20 rounded-xl"></div>
                  </div>
                </motion.div>

                {/* Interview Simulator */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="md:col-span-8 glass-card rounded-[2.5rem] p-12 border border-stitch-outline/10 relative overflow-hidden flex items-center shadow-xl backdrop-blur-xl"
                >
                  <div className="w-1/2 pr-8 z-10">
                    <BrainCircuit className="text-stitch-primary w-12 h-12 mb-6" />
                    <h3 className="text-4xl font-black mb-4">Interview Simulator</h3>
                    <p className="text-on-surface-variant text-lg mb-8">Face custom-tailored AI personas in high-stakes simulations with real-time biometric feedback.</p>
                    <Button className="bg-stitch-surface-variant text-foreground px-8 py-6 rounded-2xl text-lg font-black border border-stitch-outline/20 hover:bg-white/10 transition-all">
                      Begin Session
                    </Button>
                  </div>
                  <div className="w-1/2 h-full absolute right-0 top-0 bottom-0 py-8 pr-8">
                    <div className="w-full h-full rounded-[1.5rem] overflow-hidden border border-stitch-outline/5">
                      <img 
                        alt="Person in studio" 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg_ugcf_7q6OMvJ4d31kFeRSAY2lAW6N9EWqAcW9LLr8m60AjhHcLYMFkS6-CNDAlPXoJum5w0wCRUGIiYB0vv-fK-ocjoviS8j6c6dUvEgz7EVB6d0Hhyd-ekvZYuSEoX_9aT6JsVWBaWvgNu4iUVXO447pP2cDjL_9-zbmZ0ROSsk_mqydSJqpT02RZlJqYwwvCV4pDQOo7X8tTBjwLITRZOOjUUoLbpKDLIQvEHRSAOYQF8zsyPcXADDAPdmFkZBSVqk8TDaVc"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 border-t border-stitch-outline/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                {[
                  { label: "Success Rate", val: "94%", highlight: true },
                  { label: "Profiles Scanned", val: "12M+", highlight: false },
                  { label: "Daily Placements", val: "2.4k", highlight: false },
                  { label: "Analysis Latency", val: "15ms", highlight: true }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center justify-center space-y-3">
                     <p className={`text-6xl font-black tracking-tighter ${stat.highlight ? 'text-stitch-primary liquid-glow p-2 rounded-full' : 'text-foreground'}`}>{stat.val}</p>
                     <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Floating Section */}
            <section className="relative h-64 flex justify-center items-center mt-12 mb-20 pointer-events-none">
              <div className="absolute w-full px-6 pointer-events-auto">
                <div className="glass-card rounded-[2.5rem] p-12 border border-stitch-primary/10 shadow-xl flex flex-col md:flex-row items-center gap-10 bg-stitch-surface/80 backdrop-blur-xl">
                  <div className="flex-1">
                    <h4 className="text-4xl font-black mb-3">Ready to initiate?</h4>
                    <p className="text-lg text-on-surface-variant">Your premium career trajectory is one computation away.</p>
                  </div>
                  <Button className="bg-stitch-primary text-[#171e00] px-12 py-8 rounded-[1.5rem] font-black text-xl shadow-xl shadow-stitch-primary/10 hover:shadow-2xl transition-all active:scale-95">
                    GET ACCESS NOW
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 bg-[#0e0f0b] border-t border-stitch-outline/20 pt-20 pb-12 mt-32">
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
                 <div className="flex items-center gap-4 bg-stitch-surface/40 p-4 rounded-2xl border border-stitch-outline/20 w-fit">
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

export default Index;
