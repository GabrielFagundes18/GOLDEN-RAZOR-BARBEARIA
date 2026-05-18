import React, { useEffect, useState, useCallback, useMemo } from "react";
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

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// --- ESTILOS RESPONSIVOS ---
const MainContainer = styled.div`
  min-height: 100vh;
  color: #fff;
  padding: 40px;
  font-family: "Plus Jakarta Sans", sans-serif;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 25px;
  }
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  margin: 0;

  span {
    color: #d4af37;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    width: 100%;
    gap: 10px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  overflow-x: auto; /* Responsividade para tabelas longas */
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
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
  min-width: 600px; /* Garante que a tabela não esmague no mobile */

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
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  white-space: nowrap;

  &:hover {
    transform: scale(1.03);
    opacity: 0.9;
  }

  &.secondary {
    background: #111;
    color: #fff;
    border: 1px solid #333;
  }

  svg.spinning {
    animation: ${spin} 1s linear infinite;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.8rem;
    flex: 1;
  }
`;

export default function DashboardPremium() {
  const [agenda, setAgenda] = useState<any[]>([]);
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const hoje = new Intl.DateTimeFormat("pt-BR").format(new Date());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resAgenda, resVendas] = await Promise.all([
        api.get("/schedules/daily"),
        api.get("/sales/history"),
      ]);
      setAgenda(Array.isArray(resAgenda.data) ? resAgenda.data : []);
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

  const agendaDoDia = useMemo(() => {
    return agenda.filter((item: any) => item.date === hoje);
  }, [agenda, hoje]);

  const finalizarCorte = async (id: number) => {
    try {
      await api.patch(`/appointments/${id}/complete`);
      toast.success("Atendimento finalizado!");
      fetchData();
    } catch (error) {
      toast.error("Erro ao finalizar.");
    }
  };

  return (
    <MainContainer>
      {/* HEADER */}
      <HeaderContainer>
        <div>
          <Title>
            Barbearia <span>Dashboard</span>
          </Title>
        </div>
        <ButtonGroup>
          <ActionBtn className="secondary" onClick={fetchData}>
            <RefreshCw size={18} className={loading ? "spinning" : ""} />
          </ActionBtn>
          <ActionBtn onClick={() => navigate("novo")}>
            <PlusCircle size={18} />
            <span>NOVO AGENDAMENTO</span>
          </ActionBtn>
        </ButtonGroup>
      </HeaderContainer>

      {/* CARDS DE RESUMO */}
      <StatsGrid>
        <GlassCard>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#555", fontWeight: 600 }}>
              AGENDAMENTOS HOJE
            </span>
            <Users color="#d4af37" size={20} />
          </div>
          <StatValue>{agendaDoDia.length}</StatValue>
        </GlassCard>
        {/* Você pode adicionar mais GlassCards aqui para outras métricas */}
      </StatsGrid>

      <AgendaSection>
        {/* TABELA DA AGENDA */}
        <GlassCard style={{ padding: "0px", overflow: "hidden" }}>
          <div
            style={{
              padding: "24px",
              borderBottom: "1px solid #222",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: 0,
              }}
            >
              <Calendar size={20} color="#d4af37" /> Agenda de Hoje
            </h3>
            <span
              style={{ fontSize: "0.8rem", color: "#d4af37", fontWeight: 600 }}
            >
              {hoje}
            </span>
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
                  {agendaDoDia.length > 0 ? (
                    agendaDoDia.map((item: any) => (
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
                          <div style={{ fontSize: "0.7rem", color: "#666" }}>
                            Duração: {item.duration} min
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.9rem" }}>
                            {item.service}
                          </div>
                          <div
                            style={{ fontSize: "0.75rem", color: "#d4af37" }}
                          >
                            {item.barberName} •{" "}
                            <span style={{ color: "#22c55e" }}>
                              R$ {item.price}
                            </span>
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <ActionBtn
                            onClick={() => finalizarCorte(item.id)}
                            style={{ padding: "8px 12px", fontSize: "0.75rem" }}
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
                          color: "#666",
                          padding: "60px",
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

        {/* VENDAS RECENTES */}
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
            {vendas.length > 0 ? (
              vendas.map((v: any) => (
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
              ))
            ) : (
              <p style={{ fontSize: "0.8rem", color: "#444" }}>
                Nenhuma venda recente.
              </p>
            )}
          </div>
        </GlassCard>
      </AgendaSection>
    </MainContainer>
  );
}
