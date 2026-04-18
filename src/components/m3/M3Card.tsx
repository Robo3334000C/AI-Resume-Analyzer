import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface M3CardProps {
    children: ReactNode;
    className?: string;
    variant?: "elevated" | "filled" | "outlined";
    size?: "md" | "lg"; // md = 12px rounding, lg = 24px rounding
}

export const M3Card = ({ children, className, variant = "elevated", size = "lg" }: M3CardProps) => {
    const baseClasses = "overflow-hidden transition-all duration-300 relative";

    const sizeClasses = {
        md: "rounded-xl", // 12px (closest tailwind equivalent)
        lg: "rounded-3xl", // 24px
    };

    const variantClasses = {
        elevated: "bg-[var(--md-sys-color-surface-container-low)] shadow-sm hover:shadow-md hover:shadow-black/5 hover:bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)]",
        filled: "bg-[var(--md-sys-color-surface-container-highest)] hover:bg-[var(--md-sys-color-surface-container-highest)]/80 text-[var(--md-sys-color-on-surface)]",
        outlined: "bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-lowest)]",
    };

    return (
        <div className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}>
            <div className="absolute inset-0 opacity-0 hover:opacity-[0.08] pointer-events-none bg-[var(--md-sys-color-on-surface)] transition-opacity"></div>
            {children}
        </div>
    );
};
