import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowingCard({ children, className = "" }: GlowingCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    if (ref.current) {
      ref.current.style.setProperty("--mouse-x", `${mouseX}px`);
      ref.current.style.setProperty("--mouse-y", `${mouseY}px`);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative group h-full ${className}`}
    >
      <div 
        className="pointer-events-none absolute -inset-px z-20 opacity-0 transition duration-500 group-hover:opacity-100 mix-blend-overlay rounded-inherit"
        style={{
          background: "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.2), transparent 40%)",
          borderRadius: "inherit"
        }}
      />
      {/* 3D Content Container */}
      <div style={{ transform: "translateZ(30px)" }} className="h-full rounded-inherit">
        {children}
      </div>
    </motion.div>
  );
}
