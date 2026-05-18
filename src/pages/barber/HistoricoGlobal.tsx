import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Loader2,
  TrendingUp,
  Scissors,
  Calendar,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Package,
  DollarSign,
} from "lucide-react";
import { api } from "../../services/api";

const ITEMS_PER_PAGE = 10;

export const HistoricoGlobal = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/history/global");
      setData(res.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Lógica de Filtro
  const filteredTransactions = useMemo(() => {
    if (!data?.transacoes) return [];

    return data.transacoes.filter((t: any) => {
      const matchFilter =
        filter === "all"
          ? true
          : filter === "servico" || filter === "produto"
            ? t.tipo === filter
            : t.barbeiro === filter;

      const matchSearch =
        t.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.descricao.toLowerCase().includes(searchTerm.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [data, filter, searchTerm]);

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const stats = useMemo(() => {
    const count = filteredTransactions.length;
    return { count };
  }, [filteredTransactions]);

  if (loading)
    return (
      <Center>
        <Loader2 className="animate-spin" size={40} color="#f1c40f" />
        <span style={{ fontFamily: "Rajdhani", fontWeight: "bold", marginLeft: 15, color: "#f1c40f" }}>
          SINCRONIZANDO FLUXO...
        </span>
      </Center>
    );

  return (
    <Container>
      <Header>
        <div>
          <h1>
            Fluxo <span className="highlight">Global</span>
          </h1>
          <p>Relatório tático de movimentações e vendas</p>
        </div>
        <button onClick={fetchData} className="refresh-btn" title="Atualizar Dados">
          <RefreshCw size={18} />
        </button>
      </Header>

      <StatsGrid>
        <StatCard $color="#f1c40f">
          <label>
            <TrendingUp size={14} /> Volume Filtrado
          </label>
          <div className="val">{stats.count} registros</div>
        </StatCard>

        <StatCard $color="#22c55e">
          <label>
            <DollarSign size={14} /> Faturamento Hoje
          </label>
          <div className="val">
            R${" "}
            {data?.resumoHoje?.total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>
          <span className="sub">
            {data?.resumoHoje?.quantidade} operações realizadas hoje
          </span>
        </StatCard>
      </StatsGrid>

      <ControlsRow>
        <SearchBox>
          <Search size={18} color="#444" />
          <input
            type="text"
            placeholder="Buscar por cliente, serviço ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        <SelectBox>
          <Filter size={18} color="#f1c40f" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos os Registros</option>
            <optgroup label="Categorias">
              <option value="servico">Apenas Serviços</option>
              <option value="produto">Apenas Produtos</option>
            </optgroup>
            <optgroup label="Barbeiros">
              {[
                ...new Set(
                  data?.transacoes
                    .filter((t: any) => t.barbeiro !== "Loja")
                    .map((t: any) => t.barbeiro),
                ),
              ].map((b: any) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </optgroup>
          </select>
        </SelectBox>
      </ControlsRow>

      <TableContainer>
        <THead>
          <div className="col-date">Data</div>
          <div className="col-main">Cliente / Operação</div>
          <div className="col-resp">Responsável</div>
          <div className="col-val">Valor</div>
        </THead>

        <AnimatePresence mode="popLayout">
          {paginatedData.length > 0 ? (
            paginatedData.map((item: any, i: number) => (
              <Row
                key={`${item.tipo}-${item.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
              >
                <div className="col-date">
                  <Calendar size={12} style={{ marginRight: 6, opacity: 0.5 }} />
                  {item.data_formatada}
                </div>

                <div className="col-main">
                  <div className="client-header">
                    <User size={12} color="#f1c40f" />
                    <strong>{item.cliente}</strong>
                  </div>
                  <span className="description">
                    {item.tipo === "produto" ? (
                      <Package size={12} color="#3b82f6" />
                    ) : (
                      <Scissors size={12} color="#f1c40f" />
                    )}
                    {item.descricao}
                  </span>
                </div>

                <div className="col-resp">
                  <Badge $isLoja={item.barbeiro === "Loja"}>
                    {item.barbeiro}
                  </Badge>
                </div>

                <div className="col-val">
                  <span className="currency">R$</span>
                  {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </Row>
            ))
          ) : (
            <NoData>Nenhuma movimentação encontrada para o filtro selecionado.</NoData>
          )}
        </AnimatePresence>
      </TableContainer>

      {totalPages > 1 && (
        <Pagination>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </Pagination>
      )}
    </Container>
  );
};

// --- ESTILOS UNIFICADOS ---

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  color: #eee;
`; 

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  h1 {
    font-family: "Rajdhani";
    font-size: 2.2rem;
    text-transform: uppercase;
    line-height: 1;
    letter-spacing: 1px;
  }
  .highlight { color: #f1c40f; }
  p {
    color: #555;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 5px;
  }
  .refresh-btn {
    background: #111;
    border: 1px solid #222;
    color: #f1c40f;
    width: 42px;
    height: 42px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      background: #f1c40f;
      color: #000;
      box-shadow: 0 0 15px rgba(241, 196, 15, 0.3);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled.div<{ $color: string }>`
  background: #0a0a0a;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #1a1a1a;
  border-left: 4px solid ${(p) => p.$color};
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.65rem;
    color: #666;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 0.8rem;
  }
  .val {
    font-family: "Rajdhani";
    font-size: 2.2rem;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }
  .sub {
    display: block;
    font-size: 0.7rem;
    color: #333;
    font-weight: 700;
    text-transform: uppercase;
    margin-top: 8px;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) { flex-direction: row; }
`;

const SearchBox = styled.div`
  flex: 2;
  background: var(--bg-darker);
  border: 1px solid #1a1a1a;
  display: flex;
  align-items: center;
  padding: 0 1.2rem;
  border-radius: 8px;
  height: 52px;
  transition: 0.3s;
  input {
    background: transparent;
    border: none;
    color: #fff;
    width: 100%;
    height: 40px;
    padding-left: 12px;
    font-size: 0.9rem;
    outline: none;
    &::placeholder { color: #333; }
  }
  &:focus-within {
    border-color: #f1c40f;
    box-shadow: 0 0 10px rgba(241, 196, 15, 0.1);
  }
`;

const SelectBox = styled(SearchBox)`
  flex: 1;
  font-size: 0.9rem;
  select {
    background: #0a0a0a ;
    border: none;
    color: #fff;
    width: 100%;
    height: 40px;
    outline: none;
    font-size: 0.9rem;
    cursor: pointer;
    font-family: "Rajdhani", sans-serif;
    font-weight: 600;
  }
`;

const TableContainer = styled.div`
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

const THead = styled.div`
  display: none;
  padding: 1.2rem;
  background: #000;
  font-size: 0.7rem;
  font-weight: 900;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 1px;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 140px 1fr 180px 120px;
    border-bottom: 1px solid #1a1a1a;
  }
`;

const Row = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 1.2rem;
  border-bottom: 1px solid #111;
  gap: 1rem;
  position: relative;
  transition: background 0.2s;

  &:hover { background: #0d0d0d; }

  .col-date {
    font-family: "Rajdhani";
    font-size: 0.8rem;
    color: #444;
    font-weight: 700;
    display: flex;
    align-items: center;
  }
  .col-main {
    .client-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    strong {
      color: #fff;
      font-size: 1.05rem;
      text-transform: uppercase;
    }
    .description {
      font-size: 0.85rem;
      color: #666;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  .col-val {
    position: absolute;
    right: 1.2rem;
    top: 1.2rem;
    font-family: "Rajdhani";
    color: #22c55e;
    font-size: 1.5rem;
    font-weight: 800;
    .currency { font-size: 0.8rem; margin-right: 4px; opacity: 0.6; }
  }

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 140px 1fr 180px 120px;
    padding: 1.2rem;
    gap: 0;
    position: static;
    align-items: center;
    .col-val {
      position: static;
      font-size: 1.2rem;
      text-align: right;
    }
  }
`;

const Badge = styled.div<{ $isLoja: boolean }>`
  display: inline-block;
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  background: ${(p) => (p.$isLoja ? "rgba(59, 130, 246, 0.1)" : "rgba(241, 196, 15, 0.1)")};
  color: ${(p) => (p.$isLoja ? "#3b82f6" : "#f1c40f")};
  border: 1px solid ${(p) => (p.$isLoja ? "rgba(59, 130, 246, 0.2)" : "rgba(241, 196, 15, 0.2)")};
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  padding-bottom: 2rem;

  span {
    font-family: "Rajdhani";
    font-weight: 700;
    color: #fff;
    font-size: 1.1rem;
    letter-spacing: 2px;
  }
  button {
    background: #111;
    border: 1px solid #222;
    color: #f1c40f;
    width: 45px;
    height: 45px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
    &:disabled { opacity: 0.1; cursor: not-allowed; }
    &:not(:disabled):hover {
      border-color: #f1c40f;
      transform: translateY(-2px);
    }
  }
`;

const NoData = styled.div`
  padding: 4rem;
  text-align: center;
  color: #444;
  font-family: "Rajdhani";
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Center = styled.div`
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;