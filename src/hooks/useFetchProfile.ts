import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

// Interface baseada no JSON que você enviou
interface ProfileData {
  id: string;
  nome: string;
  email: string;
  pontos: number;
}

export function useFetchProfile(userId: string | undefined, isLoaded: boolean) {
  const [pontos, setPontos] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Tipamos como Array: ProfileData[] pois a API retorna [{...}]
      const res = await api.get<ProfileData[]>(`/profiles/${userId}`);

      console.log("Dados brutos da API:", res.data);

      // Verificamos se o array não está vazio antes de acessar o índice 0
      if (res.data && res.data.length > 0) {
        const perfilEncontrado = res.data[0];
        console.log("Perfil processado:", perfilEncontrado);
        setPontos(perfilEncontrado.pontos || 0);
      } else {
        console.warn("API retornou uma lista vazia para o ID:", userId);
        setPontos(0);
      }
    } catch (err) {
      console.error("Erro ao buscar dados do perfil:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isLoaded && userId) {
      fetchData();
    } else if (isLoaded && !userId) {
      setLoading(false);
    }
  }, [isLoaded, userId, fetchData]);

  return { pontos, loading, refresh: fetchData };
}
