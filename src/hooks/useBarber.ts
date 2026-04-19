import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

export const useBarberStore = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStoreData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/loja/agenda-geral");
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar dados da loja", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const finishService = async (appId: number, clientId: string) => {
    try {
      await api.post(`/loja/servicos/${appId}/complete`, { clientId });
      setAppointments((prev) => prev.filter((a) => a.id !== appId));
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  return { appointments, loading, finishService, refresh: fetchStoreData };
};
