import { GlassCard } from "@/components/ui/glass-card";
import { useEffect, useRef, useState } from "react";
import { Terminal, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LogEntry {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
}

interface ConsoleLogProps {
  logs: LogEntry[];
  onClear?: () => void;
}

export function ConsoleLog({ logs, onClear }: ConsoleLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      case "info":
      default:
        return "text-cyan-400";
    }
  };

  const getLogPrefix = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "✓";
      case "warning":
        return "⚠";
      case "error":
        return "✗";
      case "info":
      default:
        return "→";
    }
  };

  const copyLogs = () => {
    const text = logs
      .map(
        (log) =>
          `[${log.timestamp.toLocaleTimeString("pt-BR")}] ${log.message}`
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col h-96" variant="default">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-primary/20 text-primary">
            <Terminal className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Console
          </h3>
          <span className="text-xs text-muted-foreground ml-2">
            {logs.length} mensagens
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={copyLogs}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Copiar logs"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Limpar console"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Console Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-gradient-to-b from-muted/10 to-transparent"
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            Aguardando logs...
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`flex gap-3 ${getLogColor(log.type)} transition-colors duration-200`}
              >
                <span className="text-muted-foreground flex-shrink-0 w-4">
                  {getLogPrefix(log.type)}
                </span>
                <span className="text-muted-foreground flex-shrink-0">
                  [{log.timestamp.toLocaleTimeString("pt-BR")}]
                </span>
                <span className="flex-1 break-words">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {copied && (
        <div className="px-4 py-2 bg-green-500/20 border-t border-green-400/30 text-xs text-green-400">
          ✓ Logs copiados para a área de transferência
        </div>
      )}
    </GlassCard>
  );
}
