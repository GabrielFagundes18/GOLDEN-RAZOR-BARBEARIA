import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Scissors,
  CheckCircle,
  Calendar as CalendarIcon,
  Loader2,
  Clock,
  Trash2,
} from "lucide-react";

import { api } from "../../services/api";


const Layout = styled.div`
  display: flex;
  background: var(--bg-color);
  min-height: 100vh;
  color: var(--text-color);
  font-family: "Inter", sans-serif;
  background-image: linear-gradient(var(--scanline-color) 1px, transparent 1px);
  background-size: 100% 4px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;

  .title {
    span {
      color: var(--primary-color);
      font-size: 0.6rem;
      font-weight: 900;
      letter-spacing: 3px;
    }
    h2 {
      font-family: "Rajdhani", sans-serif;
      font-size: 2.2rem;
      text-transform: uppercase;
      margin: 0;
    }
  }
`;

const TableContainer = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 100px 1.5fr 1fr 1fr 100px;
  padding: 1rem 1.5rem;
  background: var(--bg-darker);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-dark);
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: 100px 1.5fr 1fr 1fr 100px;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: 0.2s;

  &:hover {
    background: var(--bg-darker);
  }

  .time {
    font-family: "Syncopate", sans-serif;
    font-size: 0.75rem;
    color: var(--primary-color);
  }

  .customer {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .service-badge {
    background: var(--bg-color);
    padding: 4px 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.7rem;
    color: var(--text-muted);
    width: fit-content;
  }

  .barber {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    color: var(--gold-color);
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button<{ $variant: "success" | "error" }>`
  background: ${(props) =>
    props.$variant === "success"
      ? "rgba(34, 197, 94, 0.1)"
      : "rgba(255, 0, 0, 0.1)"};
  color: ${(props) =>
    props.$variant === "success"
      ? "var(--success-color)"
      : "var(--error-color)"};
  border: 1px solid
    ${(props) =>
      props.$variant === "success"
        ? "var(--success-color)"
        : "var(--error-color)"};
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.$variant === "success"
        ? "var(--success-color)"
        : "var(--error-color)"};
    color: white;
    box-shadow: 0 0 15px
      ${(props) =>
        props.$variant === "success"
          ? "var(--success-color)"
          : "var(--error-color)"};
  }
`;
const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem;
  color: var(--primary-color);
`;

const EmptyState = styled.div`
  padding: 4rem;
  text-align: center;
  color: var(--text-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

interface IAppointment {
  id: number;
  customerName: string;
  time: string;
  service: string;
  barberName: string;
  client_id: string;
}

export const AgendaDoDia: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAgenda = async () => {
    try {
      setLoading(true);
      const response = await api.get("/barber/agenda-hoje");
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  const handleFinish = async (appId: number, clientId: string) => {
    try {
      await api.patch(`/agendamentos/${appId}/finalizar`, { clientId });
      setAppointments((prev) => prev.filter((app) => app.id !== appId));
    } catch (error) {}
  };

  const handleCancel = async (appId: number) => {
    try {
      await api.delete(`/barber/agendamentos/${appId}`);
      setAppointments((prev) => prev.filter((app) => app.id !== appId));
    } catch (error) {}
  };

  return (
    <Layout>
      
      <MainContent>
        <ContentWrapper>
          <HeaderSection>
            <div className="title">
              
              <h2>Agenda de Hoje</h2>
            </div>
            <div
              style={{
                textAlign: "right",
                color: "var(--text-dark)",
                fontSize: "0.7rem",
              }}
            >
              <CalendarIcon size={12} style={{ marginRight: 5 }} />
              {new Date()
                .toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
                .toUpperCase()}
            </div>
          </HeaderSection>

          <TableContainer>
            <TableHeader>
              <div>Horário</div>
              <div>Cliente</div>
              <div>Serviço</div>
              <div>Barbeiro</div>
              <div>Ações</div>
            </TableHeader>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <LoadingWrapper>
                  <Loader2 className="animate-spin" size={32} />
                </LoadingWrapper>
              ) : appointments.length === 0 ? (
                <EmptyState>
                  <Clock size={40} />
                  <p>Nenhum agendamento pendente para hoje.</p>
                </EmptyState>
              ) : (
                appointments.map((app, index) => (
                  <Row
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="time">{app.time}</div>
                    <div className="customer">
                      <User size={14} color="var(--primary-color)" />
                      {app.customerName}
                    </div>
                    <div>
                      <span className="service-badge">{app.service}</span>
                    </div>
                    <div className="barber">
                      <Scissors size={14} />
                      {app.barberName}
                    </div>

                    <ActionGroup>
                      {/* Botão Cancelar */}
                      <IconButton
                        $variant="error"
                        title="Cancelar Agendamento"
                        onClick={() => handleCancel(app.id)}
                      >
                        <Trash2 size={18} />
                      </IconButton>

                      {/* Botão Finalizar */}
                      <IconButton
                        $variant="success"
                        title="Concluir Atendimento"
                        onClick={() => handleFinish(app.id, app.client_id)}
                      >
                        <CheckCircle size={18} />
                      </IconButton>
                    </ActionGroup>
                  </Row>
                ))
              )}
            </AnimatePresence>
          </TableContainer>
        </ContentWrapper>
      </MainContent>
    </Layout>
  );
};
