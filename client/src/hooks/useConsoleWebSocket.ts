import { useEffect, useState, useCallback } from "react";
import { LogEntry } from "@/components/console-log";

export function useConsoleWebSocket(serverUrl?: string) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useState<WebSocket | null>(null)[1];

  // Gerar ID único para cada log
  const generateId = () => `log-${Date.now()}-${Math.random()}`;

  // Adicionar novo log
  const addLog = useCallback(
    (message: string, type: LogEntry["type"] = "info") => {
      const newLog: LogEntry = {
        id: generateId(),
        message,
        type,
        timestamp: new Date(),
      };
      setLogs((prev) => [...prev, newLog]);
    },
    []
  );

  // Limpar logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Conectar ao WebSocket
  useEffect(() => {
    if (!serverUrl) {
      // Se não houver URL, usar logs simulados
      addLog("Console aguardando conexão com servidor...", "info");
      return;
    }

    try {
      // Converter URL HTTP para WS
      const wsUrl = serverUrl
        .replace("https://", "wss://")
        .replace("http://", "ws://");

      const socket = new WebSocket(`${wsUrl}/logs`);

      socket.onopen = () => {
        setConnected(true);
        setError(null);
        addLog("✓ Conectado ao servidor", "success");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addLog(data.message, data.type || "info");
        } catch {
          addLog(event.data, "info");
        }
      };

      socket.onerror = (err) => {
        setConnected(false);
        setError("Erro ao conectar ao servidor");
        addLog("✗ Erro na conexão WebSocket", "error");
        console.error("WebSocket error:", err);
      };

      socket.onclose = () => {
        setConnected(false);
        addLog("✗ Desconectado do servidor", "warning");
      };

      return () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    } catch (err) {
      setError("Erro ao inicializar WebSocket");
      console.error("WebSocket initialization error:", err);
    }
  }, [serverUrl, addLog]);

  return {
    logs,
    connected,
    error,
    addLog,
    clearLogs,
  };
}
