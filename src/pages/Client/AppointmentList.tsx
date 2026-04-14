import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { useFetch } from "../../hooks/useFetch";
import { Calendar, User, Clock, Scissors, Hash } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: number;
  data: string;
  status: string;
  valor: number | string;
  servico: {
    name: string;
    price: number;
  };
  barbeiro: {
    name: string;
  };
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Card = styled(motion.div)<{ $isReward?: boolean }>`
  background: linear-gradient(145deg, var(--card-color) 0%, #0f0f0f 100%);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid
    ${(props) => (props.$isReward ? "var(--gold-glow)" : "var(--border-color)")};
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 25px 20px 20px 20px;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 20%;
    height: 60%;
    width: 3px;
    background: ${(props) =>
      props.$isReward ? "var(--gold-color)" : "var(--primary-color)"};
    border-radius: 0 4px 4px 0;
    box-shadow: 0 0 10px
      ${(props) =>
        props.$isReward ? "var(--gold-color)" : "var(--primary-color)"};
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
    color: var(--text-muted);
    font-weight: 900;
    letter-spacing: 1.5px;
  }
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1.2;
  }
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  margin-top: 5px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const BadgeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--scanline-color);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);

  svg {
    color: var(--primary-color);
    flex-shrink: 0;
  }

  div {
    display: flex;
    flex-direction: column;
    span.title {
      font-size: 0.6rem;
      color: var(--text-dark);
      text-transform: uppercase;
      font-weight: 700;
    }
    span.value {
      font-size: 0.75rem;
      color: #bbb;
      font-weight: 500;
      white-space: nowrap;
    }
  }
`;

const PriceTag = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 15px;

  @media (max-width: 600px) {
    flex-direction: row;
    align-items: center;
    border-top: 1px solid var(--border-color);
    padding-top: 15px;
    margin-top: 5px;
  }

  .price {
    font-family: "Syncopate", sans-serif;
    color: var(--success-color);
    font-size: 0.9rem;
    font-weight: bold;
  }

  .status-pill {
    background: var(--border-color);
    color: var(--text-color);
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.55rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--border-bright);
    white-space: nowrap;
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
        <span
          className="sync"
          style={{ color: "var(--text-dark)", fontSize: "0.7rem" }}
        >
          ESCANEANDO RADAR...
        </span>
      </div>
    );
  if (error)
    return (
      <div
        style={{
          color: "var(--error-color)",
          padding: "20px",
          textAlign: "center",
        }}
        className="sync"
      >
        ERRO NA CONEXÃO COM O QG.
      </div>
    );

  if (!activeAppointments || activeAppointments.length === 0) {
    return (
      <div
        style={{
          color: "var(--text-dark)",
          padding: "40px",
          textAlign: "center",
          border: "1px dashed var(--border-bright)",
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
                    ? "RECOMPENSA ATIVA"
                    : `AGENTE: ${user?.firstName?.toUpperCase()}`}
                </span>
                <h3>
                  <Scissors
                    size={18}
                    color={
                      isFidelity ? "var(--gold-bright)" : "var(--primary-color)"
                    }
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
                  style={{ fontSize: "0.5rem", color: "var(--text-dark)" }}
                  className="sync"
                >
                  INVESTIMENTO
                </span>
                {isFidelity ? (
                  <div
                    className="price"
                    style={{ color: "var(--gold-bright)" }}
                  >
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
