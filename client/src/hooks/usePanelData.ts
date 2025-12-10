import { useEffect, useState } from "react";

export interface InstagramProfile {
  usuario: string;
  nome: string;
  bio: string;
  avatar: string;
  estatisticas: {
    posts: string;
    seguidores: string;
    seguindo: string;
  };
}

export interface ServerInfo {
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  uptime: number;
  system: string;
  cpuUsage: number;
}

export interface CycleStatus {
  status: "idle" | "running" | "completed";
  accountsProcessed: number;
  totalAccounts: number;
  startTime?: Date;
  endTime?: Date;
  followersBefore?: number;
  followersAfter?: number;
}

export function usePanelData() {
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for Instagram profile
  const mockProfile: InstagramProfile = {
    usuario: "comedor_di_primas",
    nome: "come primas",
    bio: "Conteúdo exclusivo",
    avatar: "https://pic4.anon-viewer.com/media.php?media=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F447861696_432881039533253_2208804705902565169_n.jpg%3Fstp%3Ddst-jpg_s150x150_tt6%26efg%3DeyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby41NDguYzIifQ%26_nc_ht%3Dscontent-hel3-1.cdninstagram.com%26_nc_cat%3D105%26_nc_oc%3DQ6cZ2QHAIdGDHBbsTPaitH6H9GaCrUP1jRwGfs1flc01iT17PIajpw3iqoslVLquSKToeA1-A2IxPjumUiXdSH4YWUvW%26_nc_ohc%3DpF2Lzn9HkHwQ7kNvwGFrL4n%26_nc_gid%3DQ_qwbRfBD7QfzMC5nVWpjw%26edm%3DALGbJPMBAAAA%26ccb%3D7-5%26oh%3D00_AfnEQ_iH1wi6eMHRjr5AluNm4WQ46Ol2pXDNT7mUfeq37g%26oe%3D693F5C74%26_nc_sid%3D7d3ac5",
    estatisticas: {
      posts: "0",
      seguidores: "102.4K",
      seguindo: "0",
    },
  };

  // Fetch Instagram Profile
  const fetchInstagramProfile = async () => {
    try {
      // Try to fetch from API, but fallback to mock data
      try {
        const response = await fetch(
          "https://api.nexfuture.com.br/api/stalks/instagram?apikey=3f812997-350c-44aa-b8cc-d4e436188983&query=comedor_di_primas"
        );
        const data = await response.json();

        if (data.status && data.resultado) {
          setProfile(data.resultado);
          const followers = parseInt(
            data.resultado.estatisticas.seguidores.replace(/[^0-9]/g, "")
          );
          localStorage.setItem("initialFollowers", followers.toString());
          return;
        }
      } catch (apiError) {
        console.log("API indisponível, usando dados mock");
      }

      // Fallback to mock data
      setProfile(mockProfile);
      const followers = parseInt(
        mockProfile.estatisticas.seguidores.replace(/[^0-9]/g, "")
      );
      localStorage.setItem("initialFollowers", followers.toString());
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      setError("Erro ao carregar perfil do Instagram");
      // Still set mock data on error
      setProfile(mockProfile);
    }
  };

  // Simulate Server Info
  const fetchServerInfo = () => {
    const totalMemory = 8 * 1024; // 8GB em MB
    const usedMemory = Math.random() * totalMemory * 0.7;
    const uptime = Math.floor(Math.random() * 86400 * 30); // até 30 dias

    setServerInfo({
      memory: {
        total: totalMemory,
        used: usedMemory,
        free: totalMemory - usedMemory,
        percentage: (usedMemory / totalMemory) * 100,
      },
      uptime: uptime,
      system: "Linux x86_64",
      cpuUsage: Math.random() * 80,
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchInstagramProfile();
      fetchServerInfo();
      setLoading(false);
    };

    loadData();

    // Refresh server info every 5 seconds
    const serverInterval = setInterval(fetchServerInfo, 5000);

    return () => clearInterval(serverInterval);
  }, []);

  return {
    profile,
    serverInfo,
    loading,
    error,
    refetch: fetchInstagramProfile,
  };
}
