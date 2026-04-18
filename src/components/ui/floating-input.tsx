import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, icon, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="relative group">
        {icon && (
          <div className="absolute left-5 top-5 w-5 h-5 text-foreground/40 group-focus-within:text-primary transition-colors z-10">
            {icon}
          </div>
        )}
        <Input
          id={inputId}
          ref={ref}
          className={cn(
            "peer h-16 pt-5 pb-1 bg-stitch-surface/40 border-2 border-stitch-outline/20 rounded-[1.5rem] font-bold text-foreground outline-none focus-visible:ring-0 focus-visible:border-stitch-primary focus:border-stitch-primary focus:ring-4 focus:ring-stitch-primary/20 transition-all shadow-xl hover:border-stitch-outline/40",
            icon ? "pl-14" : "pl-6",
            className
          )}
          placeholder=" "
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute text-xs font-black text-foreground/60 duration-300 transform -translate-y-3 scale-[0.85] top-5 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:-translate-y-3 peer-focus:text-primary cursor-text tracking-widest uppercase",
            icon ? "left-14" : "left-6"
          )}
        >
          {label}
        </label>
      </div>
    )
  }
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
