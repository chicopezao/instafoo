import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "neon" | "danger";
  intensity?: "low" | "medium" | "high";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, variant = "default", intensity = "medium", ...props }, ref) => {
    
    const intensityClasses = {
      low: "bg-card/30 backdrop-blur-sm border-white/5",
      medium: "bg-card/60 backdrop-blur-md border-white/10",
      high: "bg-card/80 backdrop-blur-xl border-white/20",
    };

    const variantClasses = {
      default: "shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] hover:border-primary/30 transition-colors duration-300",
      neon: "shadow-[0_0_15px_rgba(0,255,255,0.1)] border-primary/40 hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] hover:border-primary transition-all duration-300",
      danger: "shadow-[0_0_15px_rgba(255,0,0,0.1)] border-destructive/40 hover:shadow-[0_0_25px_rgba(255,0,0,0.3)] hover:border-destructive transition-all duration-300",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border p-6 text-card-foreground relative overflow-hidden",
          intensityClasses[intensity],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {/* Shine effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
