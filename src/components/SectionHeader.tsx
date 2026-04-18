import { Dna } from "lucide-react";

interface SectionHeaderProps {
  title?: string;
}

const SectionHeader = ({ title = "SKILL DNA DISCOVERY" }: SectionHeaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Dna className="w-8 h-8 text-purple-500 animate-pulse" />
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
        </div>
        <h2 className="text-xl font-black tracking-[0.2em] text-accent uppercase">
          {title}
        </h2>
      </div>
      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-4 rounded-full" />
    </div>
  );
};

export default SectionHeader;
