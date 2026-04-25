import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { StatCard } from "../../components/Admin/StatsCard";
import {
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
  TrendingUp,
  Search,
} from "lucide-react";
import { api } from "../../services/api";

// --- ESTILOS ---
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;
const MainContent = styled.main`
  flex: 1;
  padding: 2.5rem;
  overflow-y: auto;
  
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  h1 {
    font-family: "Rajdhani";
    font-size: 2.5rem;
    color: #d4af37;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: #111;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid #222;

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    label {
      color: #555;
      font-size: 0.65rem;
      text-transform: uppercase;
      font-weight: bold;
    }
    input {
      background: #000;
      border: 1px solid #333;
      color: #fff;
      padding: 6px 10px;
      border-radius: 4px;
      outline: none;
      font-size: 0.85rem;
      &:focus {
        border-color: #d4af37;
      }
    }
  }
`;

const SearchButton = styled.button`
  background: #d4af37;
  color: #000;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 0.8rem;
  margin-top: 15px;
  transition: all 0.2s;
  &:hover {
    background: #f1c40f;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const TransactionsContainer = styled.div`
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  overflow: hidden;
  .table-header {
    padding: 1.5rem;
    border-bottom: 1px solid #222;
    background: #0a0a0a;
    h3 {
      font-family: "Rajdhani";
      text-transform: uppercase;
      color: #fff;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
`;

const TransactionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    padding: 1rem 1.5rem;
    background: #0d0d0d;
    color: #555;
    font-size: 0.7rem;
    text-transform: uppercase;
  }
  td {
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid #1a1a1a;
    font-size: 0.9rem;
    color: #eee;
  }
  .value-in {
    color: #2ecc71;
    font-weight: 700;
    font-family: "Rajdhani";
    font-size: 1.1rem;
  }
  .barber-badge {
    font-size: 0.75rem;
    color: #888;
    background: #1a1a1a;
    padding: 2px 8px;
    border-radius: 4px;
  }
`;

export const Financeiro = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ faturamento: 0, saidas: 0, lucro: 0 });
  const [transacoes, setTransacoes] = useState<any[]>([]);

  // Filtro de data: Início do mês atual até hoje
  const [dateStart, setDateStart] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
  );
  const [dateEnd, setDateEnd] = useState(
    new Date().toISOString().split("T")[0],
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const params = { start: dateStart, end: dateEnd };

      const [resumoRes, transacoesRes] = await Promise.all([
        api.get("/financeiro/resumo", { params }),
        api.get("/financeiro/transacoes", { params }),
      ]);

      setStats(resumoRes.data);
      setTransacoes(transacoesRes.data);
    } catch (error) {
      console.error("Erro ao carregar financeiro:", error);
    } finally {
      setLoading(false);
    }
  }, [dateStart, dateEnd]);

  useEffect(() => {
    loadData();
  }, []); // Carrega ao montar a página

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <Layout>
      <MainContent>
        <HeaderRow>
          <h1>Financeiro</h1>
          <FilterContainer>
            <div className="input-group">
              <label>Data Início</label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Data Fim</label>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
              />
            </div>
            <SearchButton onClick={loadData}>
              <Search size={16} /> FILTRAR
            </SearchButton>
          </FilterContainer>
        </HeaderRow>

        {loading ? (
          <div style={{ padding: "5rem", textAlign: "center" }}>
            <Loader2
              size={40}
              className="animate-spin"
              color="#d4af37"
              style={{ margin: "0 auto" }}
            />
          </div>
        ) : (
          <>
            <StatsGrid>
              <StatCard
                label="Faturamento"
                value={formatCurrency(stats.faturamento)}
                icon={<ArrowUpCircle color="#2ecc71" size={24} />}
              />
              <StatCard
                label="Comissões"
                value={formatCurrency(stats.saidas)}
                icon={<ArrowDownCircle color="#e74c3c" size={24} />}
              />
              <StatCard
                label="Lucro Líquido"
                value={formatCurrency(stats.lucro)}
                icon={<DollarSign color="#d4af37" size={24} />}
              />
            </StatsGrid>

            <TransactionsContainer>
              <div className="table-header">
                <h3>
                  <TrendingUp size={20} color="#d4af37" /> Movimentações do
                  Período
                </h3>
              </div>
              <TransactionTable>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Serviço</th>
                    <th>Barbeiro</th>
                    <th style={{ textAlign: "right" }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes.length > 0 ? (
                    transacoes.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>
                            {t.cliente_nome }
                          </div>
                        </td>
                        <td style={{ color: "#666" }}>
                          {new Date(t.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td>{t.servico_nome}</td>
                        <td>
                          <span className="barber-badge">
                            {t.barbeiro_nome}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }} className="value-in">
                          {formatCurrency(t.valor)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          textAlign: "center",
                          padding: "3rem",
                          color: "#444",
                        }}
                      >
                        Nenhum registro no período selecionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </TransactionTable>
            </TransactionsContainer>
          </>
        )}
      </MainContent>
    </Layout>
  );
};
