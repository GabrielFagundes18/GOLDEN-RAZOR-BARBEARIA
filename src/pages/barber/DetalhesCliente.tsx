import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  ArrowLeft,
  User,
  Scissors,
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";

// --- Interfaces para garantir consistência com o seu Back-end ---
interface HistoricoItem {
  data: string;
  servico: string;
  barbeiro: string;
  valor: number;
}

interface ClienteData {
  perfil: {
    clerk_id: string;
    nome: string;
    email: string | null;
    telefone: string | null;
    pontos: number;
  };
  historico: HistoricoItem[];
}

// --- Estilos ---
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  color: var(--text-color, #fff);
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
  color: var(--text-dark, #666);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  font-size: 0.75rem;
  font-weight: 800;
  &:hover {
    color: var(--primary-color, #f1c40f);
  }
`;

const ProfileHeader = styled.div`
  background: var(--card-color, #1a1a1a);
  border: 1px solid var(--border-color, #333);
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  border-left: 4px solid var(--primary-color, #f1c40f);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ $vip?: boolean }>`
  background: var(--card-color, #1a1a1a);
  border: 1px solid var(--border-color, #333);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  .label {
    font-size: 0.6rem;
    color: #666;
    text-transform: uppercase;
  }
  .value {
    display: block;
    font-size: 2rem;
    font-family: "Rajdhani";
    color: ${(props) => (props.$vip ? "#ffd700" : "#fff")};
  }
`;

const HistoryRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 120px 1.5fr 1fr 100px;
  padding: 1.2rem;
  border-bottom: 1px solid #333;
  align-items: center;
  font-size: 0.9rem;
`;

export const DetalhesCliente = () => {
  // 1. IMPORTANTE: O nome 'id' aqui deve bater com o path do seu App.tsx (:id)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ClienteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      // Se o id for "undefined" como string ou nulo, não faz a chamada
      if (!id || id === "undefined") return;

      try {
        setLoading(true);
        // Chamada para a rota que você testou no Postman
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
        <MainContent>
          <Loader2 className="animate-spin" color="#f1c40f" size={40} />
        </MainContent>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <MainContent>
          <Container>
            <BackBtn onClick={() => navigate("/barber/clientes")}>
              <ArrowLeft size={14} /> VOLTAR PARA LISTA
            </BackBtn>
            <p>Cliente não encontrado (ID: {id})</p>
          </Container>
        </MainContent>
      </Layout>
    );
  }

  return (
    <Layout>
      <MainContent>
        <Container>
          <BackBtn onClick={() => navigate("/barber/clientes")}>
            <ArrowLeft size={14} /> VOLTAR PARA LISTA
          </BackBtn>

          <ProfileHeader>
            <div
              style={{
                background: "#000",
                padding: "15px",
                borderRadius: "50%",
              }}
            >
              <User size={40} color="#f1c40f" />
            </div>
            <div>
              <div
                style={{
                  color: "#f1c40f",
                  fontSize: "0.6rem",
                  fontWeight: 900,
                }}
              >
                <ShieldCheck size={12} style={{ verticalAlign: "middle" }} />{" "}
                ID: {data.perfil.clerk_id}
              </div>
              <h2
                style={{
                  fontSize: "2.5rem",
                  margin: "5px 0",
                  fontFamily: "Rajdhani",
                }}
              >
                {data.perfil.nome}
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  color: "#aaa",
                  fontSize: "0.8rem",
                }}
              >
                <span>
                  <Mail size={12} /> {data.perfil.email || "---"}
                </span>
                <span>
                  <Phone size={12} /> {data.perfil.telefone || "---"}
                </span>
              </div>
            </div>
          </ProfileHeader>

          <StatsGrid>
            <StatCard>
              <span className="label">Pontos Acumulados</span>
              <span className="value">{data.perfil.pontos}</span>
            </StatCard>
            <StatCard>
              <span className="label">Total de Visitas</span>
              <span className="value">{data.historico.length}</span>
            </StatCard>
            <StatCard $vip={data.perfil.pontos >= 10}>
              <span className="label">Status</span>
              <span className="value">
                {data.perfil.pontos >= 10 ? "Com benefícios" : "Sem benefícios"}
              </span>
            </StatCard>
          </StatsGrid>

          <div
            style={{
              background: "#1a1a1a",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1rem",
                background: "#000",
                color: "#f1c40f",
                fontWeight: "bold",
                fontSize: "0.7rem",
              }}
            >
              <History size={14} /> HISTÓRICO DE SERVIÇOS
            </div>

            <AnimatePresence>
              {data.historico.length === 0 ? (
                <div
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Nenhum serviço concluído.
                </div>
              ) : (
                data.historico.map((h, i) => (
                  <HistoryRow
                    // CORREÇÃO DE KEY AQUI:
                    key={`hist-${i}-${h.data}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div style={{ color: "#666" }}>
                      {new Date(h.data).toLocaleDateString("pt-BR")}
                    </div>
                    <div style={{ fontWeight: "bold" }}>{h.servico}</div>
                    <div style={{ color: "#f1c40f" }}>
                      <Scissors size={12} /> {h.barbeiro}
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        color: "#2ecc71",
                        fontWeight: "900",
                      }}
                    >
                      R$ {Number(h.valor).toFixed(2)}
                    </div>
                  </HistoryRow>
                ))
              )}
            </AnimatePresence>
          </div>
        </Container>
      </MainContent>
    </Layout>
  );
};
