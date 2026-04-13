import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { useFetch } from "../../hooks/useFetch";
import { Calendar, User, Clock, Scissors, Hash } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// --- INTERFACES ---
interface Appointment {
  id: number;
  data: string;
  status: string;
  valor: number | string; // Aceita string do banco e converte depois
  servico: {
    name: string;
    price: number;
  };
  barbeiro: {
    name: string;
  };
}

// --- ESTILOS ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Card = styled(motion.div)<{ $isReward?: boolean }>`
  background: linear-gradient(145deg, #0a0a0a 0%, #0f0f0f 100%);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid
    ${(props) =>
      props.$isReward ? "rgba(255, 215, 0, 0.3)" : "rgba(255, 255, 255, 0.05)"};
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 15px;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 20%;
    height: 60%;
    width: 3px;
    background: ${(props) => (props.$isReward ? "#FFD700" : "#e11d48")};
    border-radius: 0 4px 4px 0;
    box-shadow: 0 0 10px ${(props) => (props.$isReward ? "#FFD700" : "#e11d48")};
  }
`;

const MainInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  span.label {
    font-size: 0.55rem;
    color: #666;
    font-weight: 900;
    letter-spacing: 1.5px;
  }
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-top: 5px;
`;

const BadgeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 6px 12px;
  border-radius: 8px;
  svg {
    color: #e11d48;
  }
  div {
    display: flex;
    flex-direction: column;
    span.title {
      font-size: 0.6rem;
      color: #444;
      text-transform: uppercase;
    }
    span.value {
      font-size: 0.75rem;
      color: #bbb;
      font-weight: 500;
    }
  }
`;

const PriceTag = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  .price {
    font-family: "Syncopate", sans-serif;
    color: #22c55e;
    font-size: 0.9rem;
    font-weight: bold;
  }
  .status-pill {
    background: rgba(255, 255, 255, 0.05);
    color: #eee;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.55rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    gap: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export default function AppointmentList() {
  const { user } = useUser();
  const {
    data: appointments,
    loading,
    error,
  } = useFetch<Appointment[]>(
    user?.id ? `/agendamentos/cliente?clerk_id=${user.id}` : null,
  );

  const activeAppointments = appointments?.filter(
    (app) =>
      app.status?.toLowerCase() === "agendado" ||
      app.status?.toLowerCase() === "confirmado",
  );

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <span className="sync" style={{ color: "#444", fontSize: "0.7rem" }}>
          ESCANEANDO RADAR...
        </span>
      </div>
    );
  if (error)
    return (
      <div
        style={{ color: "#e11d48", padding: "20px", textAlign: "center" }}
        className="sync"
      >
        ERRO NA CONEXÃO COM O QG.
      </div>
    );

  if (!activeAppointments || activeAppointments.length === 0) {
    return (
      <div
        style={{
          color: "#444",
          padding: "40px",
          textAlign: "center",
          border: "1px dashed #222",
          borderRadius: "12px",
        }}
      >
        <p className="sync" style={{ fontSize: "0.6rem" }}>
          NENHUMA MISSÃO ATIVA NO RADAR.
        </p>
      </div>
    );
  }

  return (
    <Container>
      {activeAppointments.map((app) => {
        // CONVERSÃO SEGURA: Garante que tratamos o valor como número
        const valorNumerico = Number(app.valor);
        const isFidelity = valorNumerico === 0;

        return (
          <Card
            key={app.id}
            $isReward={isFidelity}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MainInfo>
              <Header>
                <span className="sync label">
                  {isFidelity
                    ? "⭐ RECOMPENSA ATIVA"
                    : `AGENTE: ${user?.firstName?.toUpperCase()}`}
                </span>
                <h3>
                  <Scissors
                    size={18}
                    color={isFidelity ? "#FFD700" : "#e11d48"}
                  />
                  {app.servico?.name}
                </h3>
              </Header>

              <MetaGrid>
                <BadgeItem>
                  <User size={14} />
                  <div>
                    <span className="title">Barbeiro</span>
                    <span className="value">{app.barbeiro?.name}</span>
                  </div>
                </BadgeItem>
                <BadgeItem>
                  <Calendar size={14} />
                  <div>
                    <span className="title">Data</span>
                    <span className="value">
                      {app.data
                        ? format(parseISO(app.data), "dd/MM 'às' HH:mm", {
                            locale: ptBR,
                          })
                        : "--/--"}
                    </span>
                  </div>
                </BadgeItem>
                <BadgeItem>
                  <Hash size={14} />
                  <div>
                    <span className="title">Missão</span>
                    <span className="value">#{app.id}</span>
                  </div>
                </BadgeItem>
              </MetaGrid>
            </MainInfo>

            <PriceTag>
              <div className="status-pill">
                <Clock size={10} />
                {app.status?.toUpperCase()}
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{ fontSize: "0.5rem", color: "#444" }}
                  className="sync"
                >
                  INVESTIMENTO
                </span>
                {isFidelity ? (
                  <div className="price" style={{ color: "#FFD700" }}>
                    CORTE PONTO
                  </div>
                ) : (
                  <div className="price">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valorNumerico)}
                  </div>
                )}
              </div>
            </PriceTag>
          </Card>
        );
      })}
    </Container>
  );
}
