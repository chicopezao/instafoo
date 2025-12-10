import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, className, delay = 0 }: StatCardProps) {
  return (
    <GlassCard 
      className={cn("flex flex-col justify-between group animate-in fade-in zoom-in duration-500 fill-mode-backwards", className)}
      style={{ animationDelay: `${delay}ms` }}
      variant="default"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-mono px-2 py-1 rounded-full border",
            trendUp 
              ? "text-green-400 border-green-400/30 bg-green-400/10" 
              : "text-red-400 border-red-400/30 bg-red-400/10"
          )}>
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
        <div className="text-3xl font-bold font-mono text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
          {value}
        </div>
      </div>
      
      {/* Decorative corner accent */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </GlassCard>
  );
}
