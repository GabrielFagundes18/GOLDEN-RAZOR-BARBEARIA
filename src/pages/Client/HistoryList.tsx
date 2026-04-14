import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { useFetch } from "../../hooks/useFetch";
import {
  CheckCircle,
  Clock,
  XCircle,
  Scissors,
  Calendar,
  Shield,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
`;

const TimelineItem = styled(motion.div)<{ $status: string }>`
  display: flex;
  gap: 20px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 16px;
    top: 35px;
    bottom: -25px;
    width: 2px;
    background: linear-gradient(
      to bottom,
      ${(props) => getStatusColor(props.$status)},
      var(--border-color) 40%,
      transparent
    );
    opacity: 0.3;
  }

  &:last-child::before {
    display: none;
  }
`;

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "concluido":
      return "#22c55e";
    case "cancelado":
      return "#ef4444";
    case "agendado":
      return "#eab308";
    default:
      return "var(--text-muted)";
  }
};

const IconCircle = styled.div<{ $status: string }>`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--bg-darker);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border: 1px solid ${(props) => getStatusColor(props.$status)};
  box-shadow: 0 0 15px
    ${(props) =>
      props.$status === "concluido"
        ? "rgba(34, 197, 94, 0.15)"
        : "transparent"};
  flex-shrink: 0;
`;

const Content = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  padding: 18px;
  flex: 1;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    background: linear-gradient(
      135deg,
      transparent 50%,
      rgba(255, 255, 255, 0.05) 50%
    );
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--border-bright);
    transform: translateX(8px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${(props) => `${getStatusColor(props.$status)}15`};
  border: 1px solid ${(props) => `${getStatusColor(props.$status)}30`};

  span {
    font-size: 0.5rem;
    font-family: "Syncopate", sans-serif;
    font-weight: 900;
    color: ${(props) => getStatusColor(props.$status)};
    letter-spacing: 1px;
  }
`;

export default function HistoryList() {
  const { user } = useUser();
  const { data: history, loading } = useFetch<any[]>(
    user?.id ? `/agendamentos/historico?clerk_id=${user.id}` : null,
  );

  if (loading)
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="sync"
          style={{ color: "var(--primary-color)", fontSize: "0.6rem" }}
        >
          DESSCRIPTOGRAFANDO REGISTROS...
        </motion.div>
      </div>
    );

  if (!history?.length)
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          border: "1px dashed var(--border-color)",
          borderRadius: "16px",
          margin: "10px",
        }}
      >
        <Shield
          size={30}
          color="var(--text-dark)"
          style={{ marginBottom: "10px", opacity: 0.5 }}
        />
        <p
          className="sync"
          style={{ fontSize: "0.6rem", color: "var(--text-dark)", margin: 0 }}
        >
          NENHUMA MISSÃO NO ARQUIVO.
        </p>
      </div>
    );

  return (
    <HistoryContainer>
      {history.map((log, index) => (
        <TimelineItem
          key={log.id}
          $status={log.status}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <IconCircle $status={log.status}>
            {log.status === "concluido" ? (
              <CheckCircle size={18} color="#22c55e" />
            ) : log.status === "cancelado" ? (
              <XCircle size={18} color="#ef4444" />
            ) : (
              <Clock size={18} color="#eab308" />
            )}
          </IconCircle>

          <Content>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <StatusBadge $status={log.status}>
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: getStatusColor(log.status),
                  }}
                />
                <span>{log.status?.toUpperCase()}</span>
              </StatusBadge>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--text-dark)",
                  fontSize: "0.65rem",
                  fontWeight: "600",
                }}
              >
                <Calendar size={12} />
                {format(parseISO(log.data), "dd MMM yyyy", { locale: ptBR })}
              </div>
            </div>

            <h4
              style={{
                margin: "0 0 4px 0",
                fontSize: "1rem",
                color: "var(--text-color)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "800",
              }}
            >
              {log.servico_name}
            </h4>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.5rem",
                    color: "var(--text-muted)",
                    fontWeight: "bold",
                  }}
                >
                  {log.barbeiro_name.charAt(0)}
                </div>
                <span
                  style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                >
                  {log.barbeiro_name}
                </span>
              </div>

              {log.preco && (
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "0.5rem",
                      color: "var(--text-dark)",
                      fontWeight: "bold",
                    }}
                    className="sync"
                  >
                    CRÉDITOS
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color:
                        log.status === "cancelado"
                          ? "var(--text-dark)"
                          : "var(--success-color)",
                      fontWeight: "900",
                    }}
                  >
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(log.preco)}
                  </div>
                </div>
              )}
            </div>
          </Content>
        </TimelineItem>
      ))}
    </HistoryContainer>
  );
}
