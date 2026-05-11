import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  Loader2,
  Clock,
  Trash2,
  User,
  Scissors,
} from "lucide-react";
import { api } from "../../services/api";

export const AgendaDoDia: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchAgenda = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/schedules/daily");
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar lista:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgenda();
  }, [fetchAgenda]);

  const handleComplete = async (id: number) => {
    setProcessingId(id);
    try {
      await api.patch(`/appointments/${id}/complete`);
      setAppointments((prev) => prev.filter((app) => app.id !== id));
    } catch (err: any) {
      alert("Falha ao concluir serviço.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este agendamento?")) return;
    setProcessingId(id);
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      alert("Erro ao excluir.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Main>
      <Header>
        <div className="title-group">
          <Scissors size={24} color="#ffcc00" />
          <h2>Agenda</h2>
        </div>
        <DateLabel>
          <Calendar size={14} />
          {new Date()
            .toLocaleDateString("pt-BR", { weekday: "long", day: "numeric" })
            .toUpperCase()}
        </DateLabel>
      </Header>

      <Container>
        <THeader>
          <div>Horário / Data</div>
          <div className="hide-mobile">Cliente</div>
          <div>Serviço</div>
          <div style={{ textAlign: "right" }}>Ações</div>
        </THeader>

        <AnimatePresence mode="popLayout">
          {loading ? (
            <StatusBox key="loading">
              <Loader2 className="animate-spin" size={32} color="#ffcc00" />
              <p>Carregando...</p>
            </StatusBox>
          ) : appointments.length === 0 ? (
            <StatusBox key="empty">
              <Clock size={40} color="#333" />
              <p>Nenhum agendamento.</p>
            </StatusBox>
          ) : (
            appointments.map((app) => (
              <Row
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <div className="time-col">
                  <span className="time">{app.time}</span>
                  <span className="date-info">{app.dateDay || app.date}</span>
                </div>

                <div className="client-col">
                  <div className="client">
                    <User size={14} color="#888" />
                    <span>{app.customerName || "Cliente"}</span>
                  </div>
                  <span className="service-name">{app.service}</span>
                </div>

                <div className="hide-mobile">
                  <Badge $status={app.status}>{app.status}</Badge>
                </div>

                <Actions>
                  <Btn
                    $color="#ef4444"
                    onClick={() => handleDelete(app.id)}
                    disabled={processingId === app.id}
                  >
                    <Trash2 size={18} />
                  </Btn>
                  <Btn
                    $color="#22c55e"
                    onClick={() => handleComplete(app.id)}
                    disabled={processingId === app.id}
                  >
                    {processingId === app.id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <CheckCircle size={18} />
                    )}
                  </Btn>
                </Actions>
              </Row>
            ))
          )}
        </AnimatePresence>
      </Container>
    </Main>
  );
};

// --- ESTILOS AJUSTADOS PARA RESPONSIVIDADE ---

const Main = styled.div`
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  color: #eee;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #222;

  h2 {
    font-size: 1.2rem;
  }
  @media (min-width: 768px) {
    h2 {
      font-size: 1.5rem;
    }
  }
`;

const DateLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.65rem;
  color: #666;
`;

const Container = styled.div`
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
`;

const THeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 100px; /* Mobile */
  padding: 1rem;
  background: #111;
  font-size: 0.6rem;
  color: #444;
  text-transform: uppercase;
  font-weight: 800;

  .hide-mobile {
    display: none;
  }

  @media (min-width: 768px) {
    grid-template-columns: 120px 1fr 1fr 120px;
    .hide-mobile {
      display: block;
    }
  }
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1.5fr 100px; /* Mobile */
  padding: 1rem;
  border-bottom: 1px solid #161616;
  align-items: center;

  .time-col {
    display: flex;
    flex-direction: column;
    .time {
      color: #ffcc00;
      font-weight: 700;
      font-size: 1rem;
    }
    .date-info {
      font-size: 0.7rem;
      color: #666;
    }
  }

  .client-col {
    display: flex;
    flex-direction: column;
    gap: 4px;
    .client {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
    }
    .service-name {
      font-size: 0.75rem;
      color: #888;
    }
  }

  .hide-mobile {
    display: none;
  }

  @media (min-width: 768px) {
    grid-template-columns: 120px 1fr 1fr 120px;
    padding: 1.2rem 1.5rem;
    .hide-mobile {
      display: block;
    }
    .service-name {
      display: none;
    } /* No desktop mostramos na coluna própria */
  }
`;

const Badge = styled.span<{ $status?: string }>`
  font-size: 0.6rem;
  background: #1a1a1a;
  padding: 4px 10px;
  border-radius: 20px;
  color: #888;
  border: 1px solid #333;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const Btn = styled.button<{ $color: string }>`
  background: #111;
  border: 1px solid #222;
  color: #555;
  padding: 10px; /* Maior para facilitar o toque no celular */
  border-radius: 8px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${(p) => p.$color};
    color: #fff;
  }
`;

const StatusBox = styled.div`
  padding: 3rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
