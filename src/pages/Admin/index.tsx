import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import {
  DollarSign,
  TrendingUp,
  Search,
  ChevronRight,
  AlertCircle,
  Target,
  Zap,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { api } from "../../services/api";
import { BarberRanking } from "../../components/Admin/BarberRanking";

/* =========================
   LAYOUT
========================= */

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  color: #fff;
  font-family: "Inter", sans-serif;
`;

const Main = styled.main`
  flex: 1;
  padding: 3rem;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

/* =========================
   HEADER
========================= */

const TopBanner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;

  h1 {
    font-size: 3rem;
    font-family: "Rajdhani", sans-serif;
    font-weight: 700;
    background: linear-gradient(90deg, #d4af37, #fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

/* =========================
   FILTER
========================= */

const FilterBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid #222;
  padding: 10px 14px;
  border-radius: 12px;

  input {
    background: transparent;
    border: none;
    color: #fff;
    outline: none;
    font-size: 0.85rem;
  }

  button {
    background: #d4af37;
    border: none;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
  }
`;

/* =========================
   STATS
========================= */

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MiniStat = styled.div`
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid #222;
  padding: 1.5rem;
  border-radius: 18px;

  .icon {
    width: 42px;
    height: 42px;
    background: rgba(212, 175, 55, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: #d4af37;
    margin-bottom: 10px;
  }

  .value {
    font-size: 1.6rem;
    font-weight: bold;
  }

  .label {
    font-size: 0.75rem;
    color: #888;
  }
`;

/* =========================
   GRID
========================= */

const VisualGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const GlassCard = styled.div`
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid #222;
  border-radius: 20px;
  height: 100%;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* =========================
   COMPONENT
========================= */

export const DashboardDono = () => {
  const [data, setData] = useState<any[]>([]);

  const [dates, setDates] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  /* ---------- LOAD ---------- */
  const loadAnalytics = useCallback(async () => {
    try {
      const res = await api.get("/barbeirosAdmin", { params: dates });
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  }, [dates]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  /* ---------- STATS ---------- */
  const stats = useMemo(() => {
    const total = data.reduce(
      (acc, b) => acc + Number(b?.faturamento_periodo || 0),
      0,
    );

    const cortes = data.reduce(
      (acc, b) => acc + Number(b?.total_cortes || 0),
      0,
    );

    return {
      total,
      cortes,
      ticket: cortes ? total / cortes : 0,
      meta: (total / 50000) * 100,
    };
  }, [data]);

  return (
    <Layout>
      <Main>
        {/* HEADER */}
        <TopBanner>
          <h1>GOLDEN RAZOR</h1>

          <FilterBox>
            <input
              type="date"
              value={dates.start}
              onChange={(e) => setDates({ ...dates, start: e.target.value })}
            />

            <ChevronRight size={16} />

            <input
              type="date"
              value={dates.end}
              onChange={(e) => setDates({ ...dates, end: e.target.value })}
            />

            <button onClick={loadAnalytics}>
              <Search size={16} />
            </button>
          </FilterBox>
        </TopBanner>

        {/* STATS */}
        <QuickStats>
          <MiniStat>
            <div className="icon">
              <DollarSign />
            </div>
            <div className="value">
              {stats.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div className="label">Receita Total</div>
          </MiniStat>

          <MiniStat>
            <div className="icon">
              <Target />
            </div>
            <div className="value">{stats.meta.toFixed(1)}%</div>
            <div className="label">Meta</div>
          </MiniStat>

          <MiniStat>
            <div className="icon">
              <TrendingUp />
            </div>
            <div className="value">
              {stats.ticket.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div className="label">Ticket Médio</div>
          </MiniStat>

          <MiniStat>
            <div className="icon">
              <Zap />
            </div>
            <div className="value">{stats.cortes}</div>
            <div className="label">Serviços</div>
          </MiniStat>
          
        </QuickStats>

        {/* VISUAL */}
        <VisualGrid>
          <GlassCard>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid stroke="#222" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Area
                  dataKey="faturamento_periodo"
                  stroke="#d4af37"
                  fill="#d4af3722"
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          <div>
            <BarberRanking
              data={data.map((b) => {
                const faturamentoTotalBarbeiro = Number(
                  b?.faturamento_periodo || 0,
                );

                const porcentagemCalculada =
                  stats.total > 0
                    ? (faturamentoTotalBarbeiro / stats.total) * 100
                    : 0;

                return {
                  nome: b?.name || "N/A",
                  faturamento: faturamentoTotalBarbeiro.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    },
                  ),
                  porcentagem: porcentagemCalculada,
                };
              })}
            />
          </div>
        </VisualGrid>
      </Main>
    </Layout>
  );
};
