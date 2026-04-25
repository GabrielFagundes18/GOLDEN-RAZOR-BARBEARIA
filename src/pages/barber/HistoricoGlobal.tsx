import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, User, Loader2 } from "lucide-react";
import { api } from "../../services/api";

// --- Estilos Manter os mesmos ---
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  color: var(--text-color);
  font-family: "Inter", sans-serif;
`;
const Main = styled.main`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Wrapper = styled.div`
  width: 100%;
  max-width: 1400px;
`;

const StatCard = styled.div<{ $color: string }>`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  padding: 1.2rem;
  border-radius: 8px;
  border-left: 4px solid ${(props) => props.$color};
  label {
    font-size: 0.65rem;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 800;
  }
  .val {
    font-size: 1.5rem;
    font-family: "Rajdhani";
    font-weight: 700;
    margin-top: 5px;
  }
`;

const FilterSection = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  select {
    background: #000;
    border: 1px solid var(--border-bright);
    color: #fff;
    padding: 8px;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
  }
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 100px 1.5fr 1fr 1fr 100px;
  padding: 1.2rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  &:hover {
    background: var(--bg-darker);
  }
`;

export const HistoricoGlobal = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .get("/barber/relatorios/geral")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data)
    return (
      <Layout>
        <Main>
          <Loader2 className="animate-spin" color="var(--primary-color)" />
        </Main>
      </Layout>
    );

  // --- LÓGICA DE FILTRAGEM DINÂMICA ---

  // 1. Filtramos a lista bruta de transações
  const filteredTransactions = data.transacoes.filter(
    (t: any) => filter === "all" || t.barbeiro === filter,
  );

  // 2. Recalculamos as estatísticas baseadas no filtro atual
  const stats = {
    hojeTotal: filteredTransactions
      .filter(
        (t: any) =>
          new Date(t.data).toDateString() === new Date().toDateString(),
      )
      .reduce((acc: number, curr: any) => acc + curr.valor, 0),

    mesTotal: filteredTransactions.reduce(
      (acc: number, curr: any) => acc + curr.valor,
      0,
    ),

    quantidade: filteredTransactions.length,
  };

  return (
    <Layout>
      <Main>
        <Wrapper>
        

          <h2
            style={{
              fontFamily: "Rajdhani",
              fontSize: "2rem",
              textTransform: "uppercase",
            }}
          >
            Performance {filter === "all" ? "Global" : `de ${filter}`}
          </h2>

     
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            <StatCard $color="var(--primary-color)">
              <label>Hoje ({filter === "all" ? "Geral" : filter})</label>
              <div className="val">R$ {stats.hojeTotal.toFixed(2)}</div>
            </StatCard>

            <StatCard $color="var(--success-color)">
              <label>Total Período</label>
              <div className="val">R$ {stats.mesTotal.toFixed(2)}</div>
            </StatCard>

            <StatCard $color="var(--gold-color)">
              <label>Atendimentos</label>
              <div className="val">{stats.quantidade}</div>
            </StatCard>
          </div>

          <FilterSection>
            <Filter size={18} color="var(--primary-color)" />
            <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
              FILTRAR POR BARBEIRO:
            </span>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Todos os barbeiros</option>
              {[...new Set(data.transacoes.map((t: any) => t.barbeiro))].map(
                (b: any) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ),
              )}
            </select>
          </FilterSection>

          <div
            style={{
              background: "var(--card-color)",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredTransactions.map((item: any, i: number) => (
                <TableRow
                  key={item.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.01 }}
                >
                  <div
                    style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}
                  >
                    {new Date(item.data).toLocaleDateString()}
                  </div>
                  <div style={{ fontWeight: "bold" }}>{item.cliente}</div>
                  <div
                    style={{
                      color: "var(--gold-color)",
                      fontSize: "0.8rem",
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    <User size={12} /> {item.barbeiro}
                  </div>
                  <div
                    style={{
                      color: "var(--primary-color)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {item.servico}
                  </div>
                  <div style={{ textAlign: "right", fontWeight: "bold" }}>
                    R$ {item.valor.toFixed(2)}
                  </div>
                </TableRow>
              ))}
            </AnimatePresence>
          </div>
        </Wrapper>
      </Main>
    </Layout>
  );
};
