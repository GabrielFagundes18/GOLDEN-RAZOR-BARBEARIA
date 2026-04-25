import React, { useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import {
  RefreshCw,
  Calendar,
  Users,
  ShoppingBag,
  PlusCircle,
  ChevronRight,
} from "lucide-react";
import { api } from "../../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// --- ANIMAÇÕES ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- ESTILOS ---
const MainContainer = styled.div`
  min-height: 100vh;
  color: #fff;
  padding: 40px;
  font-family: "Plus Jakarta Sans", sans-serif;
  animation: ${fadeIn} 0.5s ease-out;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const GlassCard = styled.div`
  background: rgba(17, 17, 17, 0.8);
  border: 1px solid #222;
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    border-color: #d4af37;
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div<{ color?: string }>`
  font-size: 1.8rem;
  font-weight: 800;
  color: ${(props) => props.color || "#fff"};
  margin-top: 10px;
`;

const AgendaSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const TableWrapper = styled.div`
  max-height: 480px;
  overflow-y: auto;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #0a0a0a;
  }
  &::-webkit-scrollbar-thumb {
    background: #222;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #d4af37;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0 8px;
  border-collapse: separate;

  th {
    color: #555;
    text-align: left;
    padding: 12px;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: sticky;
    top: 0;
    background: #111;
    z-index: 10;
  }

  tbody tr {
    background: #0d0d0d;
    transition: background 0.2s;

    td {
      padding: 16px;
      &:first-child {
        border-radius: 12px 0 0 12px;
      }
      &:last-child {
        border-radius: 0 12px 12px 0;
      }
    }

    &:hover {
      background: #151515;
    }
  }
`;

const ActionBtn = styled.button`
  background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.03);
    opacity: 0.9;
  }
`;

export default function DashboardPremium() {
  const [agenda, setAgenda] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resAgenda, resVendas] = await Promise.all([
        api.get("/barber/agenda-hoje"),
        api.get("/vendas/historico"),
      ]);
      setAgenda(resAgenda.data);
      setVendas(resVendas.data?.slice(0, 12) || []);
    } catch (err) {
      toast.error("Erro ao atualizar dados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const finalizarCorte = async (id: number, clientId: string) => {
    try {
      await api.patch(`/agendamentos/${id}/finalizar`, { clientId });
      toast.success("Atendimento finalizado!");
      fetchData();
    } catch (error) {
      toast.error("Erro ao finalizar.");
    }
  };

  return (
    <MainContainer>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
        }}
      >
        <div>
          <h4
            style={{ color: "#d4af37", marginBottom: "5px", fontWeight: 500 }}
          >
            GESTÃO OPERACIONAL
          </h4>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800 }}>
            Barbearia <span style={{ color: "#d4af37" }}>Elite</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <ActionBtn
            onClick={fetchData}
            style={{
              background: "#111",
              color: "#fff",
              border: "1px solid #333",
            }}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </ActionBtn>
         <ActionBtn onClick={() => navigate("novo")}>
  <PlusCircle size={18} /> NOVO AGENDAMENTO
</ActionBtn>
        </div>
      </div>

      {/* CARDS */}
      <StatsGrid>
        <GlassCard>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#555", fontWeight: 600 }}>
              FILA DE ESPERA
            </span>
            <Users color="#d4af37" size={20} />
          </div>
          <StatValue>{agenda.length}</StatValue>
        </GlassCard>
        {/* Você pode adicionar outros cards aqui futuramente */}
      </StatsGrid>

      <AgendaSection>
        <GlassCard style={{ padding: "0px", overflow: "hidden" }}>
          <div style={{ padding: "24px", borderBottom: "1px solid #222" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Calendar size={20} color="#d4af37" /> Agenda do Dia
            </h3>
          </div>

          <div style={{ padding: "10px 24px 24px 24px" }}>
            <TableWrapper>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Horário</th>
                    <th>Cliente</th>
                    <th>Serviço</th>
                    <th style={{ textAlign: "right" }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {agenda.length > 0 ? (
                    agenda.map((item: any) => (
                      <tr key={item.id}>
                        <td>
                          <div
                            style={{
                              background: "#d4af3722",
                              color: "#d4af37",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontWeight: 800,
                              width: "fit-content",
                            }}
                          >
                            {item.time}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>
                            {item.customerName}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#444" }}>
                            ID: {item.client_id?.substring(0, 8)}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.9rem" }}>
                            {item.service}
                          </div>
                          <div
                            style={{ fontSize: "0.75rem", color: "#d4af37" }}
                          >
                            {item.barberName}
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <ActionBtn
                            onClick={() =>
                              finalizarCorte(item.id, item.client_id)
                            }
                          >
                            Finalizar <ChevronRight size={16} />
                          </ActionBtn>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          textAlign: "center",
                          color: "#444",
                          padding: "40px",
                        }}
                      >
                        Nenhum agendamento para hoje.
                      </td>
                    </tr>
                  )}
                </tbody>
              </StyledTable>
            </TableWrapper>
          </div>
        </GlassCard>

        {/* VENDAS */}
        <GlassCard>
          <h3
            style={{
              fontSize: "1rem",
              marginBottom: "20px",
              display: "flex",
              gap: "10px",
            }}
          >
            <ShoppingBag size={18} color="#d4af37" /> Vendas Recentes
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {vendas.map((v: any) => (
              <div
                key={v.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    {v.produto_nome}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#555" }}>
                    {v.cliente_nome}
                  </div>
                </div>
                <div style={{ color: "#22c55e", fontWeight: 800 }}>
                  R$: {v.valor_total}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </AgendaSection>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </MainContainer>
  );
}
