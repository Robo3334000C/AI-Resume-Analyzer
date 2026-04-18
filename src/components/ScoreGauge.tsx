import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreGaugeProps {
    score: number;
    size?: number;
    strokeWidth?: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size = 120, strokeWidth = 12 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    // Premium Glow Colors based on score
    const getColor = () => {
        if (score >= 75) return {
            stroke: '#10B981', // Emerald
            light: 'bg-emerald-50',
            glow: 'shadow-emerald-200/50'
        };
        if (score >= 50) return {
            stroke: '#FB923C', // Orange
            light: 'bg-orange-50',
            glow: 'shadow-orange-200/50'
        };
        return {
            stroke: '#EF4444', // Red
            light: 'bg-red-50',
            glow: 'shadow-red-200/50'
        };
    };

    const colors = getColor();

    return (
        <div className="relative flex items-center justify-center p-2 rounded-full" style={{ width: size + 16, height: size + 16 }}>
            {/* Background glow disk */}
            <div className={cn("absolute inset-2 rounded-full opacity-10 blur-xl", colors.light)}></div>

            <svg className="transform -rotate-90" width={size} height={size}>
                {/* Background track */}
                <circle
                    className="text-slate-100"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress circle */}
                <circle
                    className="transition-all duration-[1500ms] ease-out"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke={colors.stroke}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ filter: `drop-shadow(0 0 6px ${colors.stroke}40)` }}
                />
            </svg>

            {/* Absolute centered text */}
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black tabular-nums tracking-tighter text-slate-900 leading-none">
                    {Math.round(score)}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Score</span>
            </div>
        </div>
    );
};

export default ScoreGauge;
