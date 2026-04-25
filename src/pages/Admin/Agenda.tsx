import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Clock, User, Scissors, Loader2, Calendar } from "lucide-react";
import { api } from "../../services/api";

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2.5rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-family: "Rajdhani";
    font-size: 2.5rem;
    color: #d4af37;
    text-transform: uppercase;
    margin: 0;
  }
  p {
    color: #666;
    font-size: 0.9rem;
  }
`;

const AppointmentCard = styled.div<{ status?: string }>`
  background: #111;
  border: 1px solid #222;
  border-left: 4px solid
    ${(props) => (props.status === "concluido" ? "#2ecc71" : "#d4af37")};
  padding: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px 12px 12px 4px;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(5px);
    background: #151515;
  }
`;

const StatusBadge = styled.span<{ status?: string }>`
  font-size: 0.65rem;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  background: ${(props) =>
    props.status === "concluido"
      ? "rgba(46, 204, 113, 0.1)"
      : "rgba(212, 175, 55, 0.1)"};
  color: ${(props) => (props.status === "concluido" ? "#2ecc71" : "#d4af37")};
`;

export const AgendaDono = () => {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAgenda = useCallback(async () => {
    try {
      setLoading(true);
      // Rota que você já tem no backend
      const { data } = await api.get("/barber/agenda-hoje");
      setAgendamentos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar agenda:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgenda();
  }, [loadAgenda]);

  return (
    <Layout>
      <MainContent>
        <Header>
          <h1>Agenda do Dia</h1>
          <p>
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </Header>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <Loader2
              size={32}
              className="animate-spin"
              color="#d4af37"
              style={{ margin: "0 auto" }}
            />
          </div>
        ) : (
          <div style={{ marginTop: "1rem" }}>
            {agendamentos.length > 0 ? (
              agendamentos.map((ag) => (
                <AppointmentCard key={ag.id} status={ag.status}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <User size={16} color="#d4af37" />
                      <strong style={{ color: "#fff" }}>
                        {ag.cliente_nome || ag.nome_cliente || "Cliente"}
                      </strong>
                      <StatusBadge status={ag.status}>{ag.status}</StatusBadge>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#666",
                        fontSize: "0.85rem",
                      }}
                    >
                      <Scissors size={14} />
                      {ag.servico_nome || "Serviço não especificado"}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: "#d4af37",
                        fontWeight: "bold",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Clock size={14} /> {ag.hora || ag.horario}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#444",
                        marginTop: "4px",
                      }}
                    >
                      Barbeiro:{" "}
                      <span style={{ color: "#888" }}>
                        {ag.barbeiro_nome || "Não definido"}
                      </span>
                    </div>
                  </div>
                </AppointmentCard>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#444",
                  border: "1px dashed #222",
                  borderRadius: "12px",
                }}
              >
                <Calendar
                  size={40}
                  style={{ marginBottom: "1rem", opacity: 0.2 }}
                />
                <p>Nenhum agendamento para hoje até o momento.</p>
              </div>
            )}
          </div>
        )}
      </MainContent>
    </Layout>
  );
};
