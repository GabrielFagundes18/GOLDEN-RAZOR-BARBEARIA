import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  ArrowLeft,
  User,
  Calendar,
  Scissors,
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
  History,
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import Sidebar from "./Sidebar";

// --- Estilos ---
const Layout = styled.div`
  display: flex;
  background: #050505;
  min-height: 100vh;
  color: #fff;
  font-family: "Inter", sans-serif;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 900px;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: #444;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  font-size: 0.75rem;
  font-weight: 800;
  transition: 0.2s;
  &:hover {
    color: #e11d48;
  }
`;

const ProfileHeader = styled.div`
  background: #0a0a0a;
  border: 1px solid #111;
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #e11d48;
  }

  .avatar-circle {
    width: 90px;
    height: 90px;
    background: #000;
    border: 2px solid #e11d48;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 30px rgba(225, 29, 72, 0.15);
  }

  .info {
    h2 {
      font-family: "Rajdhani";
      font-size: 2.5rem;
      margin: 0;
      text-transform: uppercase;
    }
    .contact-row {
      display: flex;
      gap: 20px;
      margin-top: 10px;
      color: #666;
      font-size: 0.8rem;
      div {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ $vip?: boolean }>`
  background: #0a0a0a;
  border: 1px solid #111;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;

  label {
    font-size: 0.6rem;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .value {
    display: block;
    font-size: 2rem;
    font-family: "Rajdhani";
    color: ${(props) => (props.$vip ? "#d4af37" : "#fff")};
    font-weight: 800;
    margin-top: 5px;
  }
`;

const HistorySection = styled.div`
  background: #0a0a0a;
  border: 1px solid #111;
  border-radius: 8px;
  overflow: hidden;

  .table-header {
    padding: 1.2rem;
    background: #000;
    border-bottom: 1px solid #111;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.7rem;
    font-weight: 900;
    color: #e11d48;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const HistoryRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 120px 1.5fr 1fr 100px;
  padding: 1.2rem;
  border-bottom: 1px solid #0f0f0f;
  font-size: 0.85rem;
  align-items: center;

  .date {
    color: #555;
    font-size: 0.75rem;
    font-family: "Syncopate", sans-serif;
  }
  .service {
    color: #eee;
    font-weight: 600;
  }
  .barber {
    color: #d4af37;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .price {
    color: #22c55e;
    text-align: right;
    font-weight: 900;
    font-family: "Rajdhani";
    font-size: 1.1rem;
  }
`;

export const DetalhesCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/barber/clientes/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Erro ao carregar detalhes do cliente");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Sidebar />
        <MainContent>
          <Loader2 className="animate-spin" color="#e11d48" size={40} />
        </MainContent>
      </Layout>
    );
  }

  if (!data)
    return (
      <Layout>
        <Sidebar />
        <MainContent>Cliente não encontrado.</MainContent>
      </Layout>
    );

  return (
    <Layout>
      <Sidebar />
      <MainContent>
        <Container>
          <BackBtn onClick={() => navigate("/barber/clientes")}>
            <ArrowLeft size={14} /> VOLTAR PARA LISTA
          </BackBtn>

          <ProfileHeader>
            <div className="avatar-circle">
              <User size={45} color="#e11d48" />
            </div>
            <div className="info">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#e11d48",
                  fontSize: "0.6rem",
                  fontWeight: 900,
                }}
              >
                <ShieldCheck size={12} /> VERIFICADO VIA CLERK
              </div>
              <h2>{data.perfil.nome}</h2>
              <div className="contact-row">
                <div>
                  <Mail size={14} /> {data.perfil.email || "Não informado"}
                </div>
                <div>
                  <Phone size={14} /> {data.perfil.telefone || "Não informado"}
                </div>
              </div>
            </div>
          </ProfileHeader>

          <StatsGrid>
            <StatCard>
              <label>Pontos Acumulados</label>
              <span className="value">{data.perfil.pontos || 0}</span>
            </StatCard>
            <StatCard>
              <label>Frequência Total</label>
              <span className="value">{data.historico.length} visitas</span>
            </StatCard>
            <StatCard $vip={data.perfil.pontos >= 10}>
              <label>Status Fidelidade Ponto</label>
              <span className="value">
                {data.perfil.pontos >= 10 ? "Com serviço gratis" : "Sem benefícios"}
              </span>
            </StatCard>
          </StatsGrid>

          <HistorySection>
            <div className="table-header">
              <History size={14} /> Histórico de Atendimentos
            </div>

            {data.historico.length === 0 ? (
              <div
                style={{ padding: "3rem", textAlign: "center", color: "#444" }}
              >
                Nenhum serviço concluído até o momento.
              </div>
            ) : (
              data.historico.map((h: any, i: number) => (
                <HistoryRow
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="date">
                    {new Date(h.data).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="service">{h.servico}</div>
                  <div className="barber">
                    <Scissors size={12} /> {h.barbeiro}
                  </div>
                  <div className="price">R$ {Number(h.valor).toFixed(2)}</div>
                </HistoryRow>
              ))
            )}
          </HistorySection>
        </Container>
      </MainContent>
    </Layout>
  );
};
