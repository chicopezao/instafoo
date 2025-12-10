import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/stat-card";
import { ConsoleLog, LogEntry } from "@/components/console-log";
import { usePanelData, CycleStatus } from "@/hooks/usePanelData";
import { useState, useEffect } from "react";
import {
  Users,
  Activity,
  Server,
  TrendingUp,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function Home() {
  const { profile, serverInfo, loading, error } = usePanelData();
  const [cycleStatus, setCycleStatus] = useState<CycleStatus>({
    status: "idle",
    accountsProcessed: 0,
    totalAccounts: 12,
  });
  const [followerGain, setFollowerGain] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [wsConnected, setWsConnected] = useState(false);

  // Conectar ao WebSocket para receber logs em tempo real
  useEffect(() => {
    // Determinar a URL do servidor
    const serverUrl = import.meta.env.VITE_SERVER_URL || window.location.origin;
    const wsUrl = serverUrl
      .replace("https://", "wss://")
      .replace("http://", "ws://");

    try {
      const ws = new WebSocket(`${wsUrl}/ws/logs`);

      ws.onopen = () => {
        setWsConnected(true);
        addLog("✓ Conectado ao servidor", "success");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addLog(data.message, data.type || "info");
          
          // Atualizar status do ciclo baseado nos logs
          if (data.message.includes("Iniciando ciclo")) {
            setCycleStatus({
              status: "running",
              accountsProcessed: 0,
              totalAccounts: 12,
              startTime: new Date(),
            });
          }
          
          if (data.message.includes("Processando") && data.message.includes("/12")) {
            const match = data.message.match(/\((\d+)\/12\)/);
            if (match) {
              setCycleStatus((prev) => ({
                ...prev,
                accountsProcessed: parseInt(match[1]),
              }));
            }
          }
          
          if (data.message.includes("concluído") || data.message.includes("Ciclo finalizado")) {
            setCycleStatus((prev) => ({
              ...prev,
              status: "completed",
              endTime: new Date(),
            }));
          }
          
          if (data.message.includes("Ganho") || data.message.includes("seguidores")) {
            const match = data.message.match(/\+?(\d+)/);
            if (match) {
              setFollowerGain(parseInt(match[1]));
            }
          }
        } catch {
          addLog(event.data, "info");
        }
      };

      ws.onerror = () => {
        setWsConnected(false);
        addLog("✗ Erro ao conectar ao servidor", "error");
      };

      ws.onclose = () => {
        setWsConnected(false);
        addLog("✗ Desconectado do servidor", "warning");
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    } catch (err) {
      console.error("WebSocket error:", err);
      addLog("✗ Falha ao conectar WebSocket", "error");
    }
  }, []);

  // Função para adicionar logs
  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: new Date(),
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // Limpar logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Format uptime
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="flex flex-col items-center gap-4 p-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-foreground">Carregando painel...</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Painel de Controle
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitoramento em tempo real de automação Instagram
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-6 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              wsConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {wsConnected ? "Conectado ao servidor" : "Desconectado - aguardando servidor..."}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <GlassCard
            className="mb-6 border-destructive/40 bg-destructive/10"
            variant="danger"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-destructive">{error}</p>
            </div>
          </GlassCard>
        )}

        {/* Profile Section */}
        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Profile Card */}
            <GlassCard
              className="lg:col-span-1 flex flex-col items-center text-center p-8"
              variant="neon"
            >
              <div className="w-24 h-24 rounded-full border-2 border-primary/50 overflow-hidden mb-4 shadow-lg shadow-primary/20">
                <img
                  src={profile.avatar}
                  alt={profile.usuario}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/avatar-placeholder.png";
                  }}
                />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                @{profile.usuario}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">{profile.nome}</p>
              <div className="w-full text-left">
                <p className="text-xs text-muted-foreground mb-2 truncate">
                  Bio: {profile.bio || "Sem bio"}
                </p>
              </div>
            </GlassCard>

            {/* Stats Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Seguidores"
                value={profile.estatisticas.seguidores}
                icon={Users}
                trend={followerGain > 0 ? `+${followerGain}` : undefined}
                trendUp={followerGain > 0}
                delay={100}
              />
              <StatCard
                title="Posts"
                value={profile.estatisticas.posts}
                icon={Activity}
                delay={200}
              />
              <StatCard
                title="Seguindo"
                value={profile.estatisticas.seguindo}
                icon={TrendingUp}
                delay={300}
              />
            </div>
          </div>
        )}

        {/* Cycle Status Section */}
        {cycleStatus.status !== "idle" && (
          <GlassCard className="mb-8 p-8" variant="default">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    cycleStatus.status === "running"
                      ? "bg-chart-3/20 text-chart-3"
                      : cycleStatus.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cycleStatus.status === "running" ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : cycleStatus.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Zap className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Status do Ciclo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cycleStatus.status === "running" && "Processando contas..."}
                    {cycleStatus.status === "completed" && "Ciclo concluído"}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Contas Processadas
                </span>
                <span className="text-sm font-mono text-primary">
                  {cycleStatus.accountsProcessed}/{cycleStatus.totalAccounts}
                </span>
              </div>
              <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden border border-primary/20">
                <div
                  className="h-full bg-gradient-to-r from-primary to-chart-2 transition-all duration-500"
                  style={{
                    width: `${(cycleStatus.accountsProcessed / cycleStatus.totalAccounts) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Cycle Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {cycleStatus.startTime && (
                <div className="p-3 bg-muted/20 rounded-lg border border-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">Início</p>
                  <p className="text-sm font-mono text-foreground">
                    {cycleStatus.startTime.toLocaleTimeString("pt-BR")}
                  </p>
                </div>
              )}
              {cycleStatus.endTime && (
                <div className="p-3 bg-muted/20 rounded-lg border border-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">Término</p>
                  <p className="text-sm font-mono text-foreground">
                    {cycleStatus.endTime.toLocaleTimeString("pt-BR")}
                  </p>
                </div>
              )}
              {cycleStatus.status === "completed" && (
                <div className="p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                  <p className="text-xs text-green-400 mb-1">
                    Ganho de Seguidores
                  </p>
                  <p className="text-sm font-mono text-green-400">
                    +{followerGain} seguidores
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* Console Section */}
        <div className="mb-8">
          <ConsoleLog logs={logs} onClear={clearLogs} />
        </div>

        {/* Server Info Section */}
        {serverInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Memory Usage */}
            <GlassCard className="p-8" variant="default">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-chart-1/20 text-chart-1">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Memória</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Uso</span>
                    <span className="text-sm font-mono text-primary">
                      {serverInfo.memory.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden border border-primary/20">
                    <div
                      className="h-full bg-gradient-to-r from-chart-1 to-chart-3"
                      style={{ width: `${serverInfo.memory.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/10">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Usado</p>
                    <p className="text-sm font-mono text-foreground">
                      {(serverInfo.memory.used / 1024).toFixed(2)} GB
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Disponível
                    </p>
                    <p className="text-sm font-mono text-foreground">
                      {(serverInfo.memory.free / 1024).toFixed(2)} GB
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* System Info */}
            <GlassCard className="p-8" variant="default">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-chart-4/20 text-chart-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Sistema</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Tempo Ativo
                  </p>
                  <p className="text-sm font-mono text-foreground">
                    {formatUptime(serverInfo.uptime)}
                  </p>
                </div>

                <div className="pt-4 border-t border-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">
                    Sistema Operacional
                  </p>
                  <p className="text-sm font-mono text-foreground">
                    {serverInfo.system}
                  </p>
                </div>

                <div className="pt-4 border-t border-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">CPU</p>
                  <p className="text-sm font-mono text-foreground">
                    {serverInfo.cpuUsage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
