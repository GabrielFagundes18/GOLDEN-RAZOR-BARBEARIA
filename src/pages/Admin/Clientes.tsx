import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  UserPlus,
  Loader2,
  Trophy,
  Scissors,
  Mail,
  Phone,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { api } from "../../services/api";

// --- ESTILOS DE ALTO PADRÃO ---
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  color: #fff;
  font-family: "Inter", sans-serif;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;

  .title-area {
    h1 {
      font-family: "Rajdhani";
      font-size: 2.8rem;
      color: #d4af37;
      text-transform: uppercase;
      margin: 0;
      letter-spacing: 3px;
      line-height: 1;
    }
    p {
      color: #666;
      margin: 10px 0 0;
      font-size: 0.9rem;
      letter-spacing: 1px;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: #0f0f0f;
  padding: 1.8rem;
  border-radius: 16px;
  border: 1px solid #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.3s;

  &:hover {
    border-color: #d4af37;
  }

  .icon-wrapper {
    background: rgba(214, 175, 55, 0.05);
    color: #d4af37;
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .data {
    text-align: right;
    span {
      color: #555;
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
    }
    h2 {
      font-size: 2rem;
      margin: 5px 0 0;
      font-family: "Rajdhani";
      color: #fff;
    }
  }
`;

const TableWrapper = styled(motion.div)`
  background: #0a0a0a;
  border: 1px solid #161616;
  border-radius: 20px;
  overflow: hidden;
`;

const CustomTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: #111;
    padding: 1.2rem 1.5rem;
    text-align: left;
    color: #d4af37;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  td {
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid #111;
    font-size: 0.9rem;
  }

  tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  .client-cell {
    display: flex;
    align-items: center;
    gap: 15px;
    .avatar-circle {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #111, #000);
      border: 1px solid #d4af3733;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d4af37;
    }
    .info-text {
      strong {
        display: block;
        color: #fff;
        margin-bottom: 2px;
      }
      small {
        color: #444;
        font-size: 0.7rem;
        font-family: monospace;
      }
    }
  }

  .badge-points {
    background: rgba(214, 175, 55, 0.1);
    color: #d4af37;
    padding: 6px 12px;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.8rem;
    border: 1px solid rgba(214, 175, 55, 0.2);
  }
`;

export const ClientesDono = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/loja/clientes");
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro no Neon:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- LÓGICA DE DASHBOARD (Substituindo o For antigo) ---
  const totalMembros = clientes.length;
  const totalCortes = clientes.reduce(
    (acc, c) => acc + (Number(c.cortes_realizados) || 0),
    0,
  );
  const totalPontos = clientes.reduce(
    (acc, c) => acc + (Number(c.pontos) || 0),
    0,
  );

  const filtered = clientes.filter(
    (c) =>
      c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      <MainContent>
        <HeaderSection>
          <div className="title-area">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              SISTEMA DE GESTÃO ARSENAL
            </motion.p>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              Ranking de Clientes
            </motion.h1>
          </div>
          
        </HeaderSection>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="icon-wrapper">
              <Users size={24} />
            </div>
            <div className="data">
              <span>Base de Clientes</span>
              <h2>{totalMembros}</h2>
            </div>
          </StatCard>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="icon-wrapper">
              <Scissors size={24} />
            </div>
            <div className="data">
              <span>Serviços Totais</span>
              <h2>{totalCortes}</h2>
            </div>
          </StatCard>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="icon-wrapper">
              <Trophy size={24} />
            </div>
            <div className="data">
              <span>Economia Gerada</span>
              <h2>
                {totalPontos} <small style={{ fontSize: "12px" }}>pts</small>
              </h2>
            </div>
          </StatCard>
        </StatsGrid>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "#111",
              padding: "10px 20px",
              borderRadius: "10px",
              border: "1px solid #222",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "400px",
            }}
          >
            <Search size={18} color="#444" />
            <input
              placeholder="Buscar por nome ou ID do Clerk..."
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                outline: "none",
                width: "100%",
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: "100px", textAlign: "center" }}
            >
              <Loader2
                className="animate-spin"
                color="#d4af37"
                size={40}
                style={{ margin: "0 auto" }}
              />
              <p style={{ color: "#444", marginTop: "20px" }}>
                Sincronizando banco de dados...
              </p>
            </motion.div>
          ) : (
            <TableWrapper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CustomTable>
                <thead>
                  <tr>
                    <th>Cliente / Identificador</th>
                    <th>Email</th>
                    <th>Cortes Concluídos</th>
                    <th>Status Fidelidade</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="client-cell">
                          <div className="avatar-circle">
                            <Users size={18} />
                          </div>
                          <div className="info-text">
                            <strong>{c.nome || "Membro Oculto"}</strong>
                            <small>{c.id}</small>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: "#888" }}>
                        <Mail size={14} style={{ marginRight: 8 }} />
                        {c.email}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <TrendingUp size={16} color="#d4af37" />
                          <strong>{c.cortes_realizados || 0}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="badge-points">
                          <Trophy size={14} style={{ marginRight: 6 }} />
                          {c.pontos || 0} PTS
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </CustomTable>
            </TableWrapper>
          )}
        </AnimatePresence>
      </MainContent>
    </Layout>
  );
};
