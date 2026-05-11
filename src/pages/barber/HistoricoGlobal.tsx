import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Loader2,
  TrendingUp,
  ShoppingBag,
  Scissors,
  Calendar,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
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

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const stats = useMemo(() => {
    const total = filteredTransactions.reduce(
      (acc: number, curr: any) => acc + curr.valor,
      0,
    );
    return { total, count: filteredTransactions.length };
  }, [filteredTransactions]);

  if (loading)
    return (
      <Center>
        <Loader2 className="animate-spin" size={40} color="#ffcc00" />
      </Center>
    );

  return (
    <Container>
      <Header>
        <div>
          <h1>
            Fluxo <span className="highlight">Global</span>
          </h1>
          <p>Relatório tático de movimentações</p>
        </div>
        <button onClick={fetchData} className="refresh-btn">
          <RefreshCw size={16} />
        </button>
      </Header>

      <StatsGrid>
        <StatCard $color="#ffcc00">
          <label>
            <TrendingUp size={14} /> Volume Filtrado
          </label>
          <div className="val">{stats.count} registros encontrados</div>
        </StatCard>

        <StatCard $color="#22c55e">
          <label>
            <Calendar size={14} /> Faturamento Hoje
          </label>
          <div className="val">
            R${" "}
            {data?.resumoHoje?.total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>
          <span className="sub">
            {data?.resumoHoje?.quantidade} operações hoje
          </span>
        </StatCard>
      </StatsGrid>

      <ControlsRow>
        <SearchBox>
          <Search size={18} color="#444" />
          <input
            type="text"
            placeholder="Buscar por cliente ou item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        <SelectBox>
          <Filter size={18} color="#ffcc00" />
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
          <div className="col-main">Cliente / Descrição</div>
          <div className="col-resp">Responsável</div>
          <div className="col-val">Valor</div>
        </THead>

        <AnimatePresence mode="popLayout">
          {paginatedData.map((item: any, i: number) => (
            <Row
              key={`${item.tipo}-${item.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="col-date">{item.data_formatada}</div>

              <div className="col-main">
                <div className="client-header">
                  <User size={12} color="#ffcc00" />
                  <strong>{item.cliente}</strong>
                </div>
                <span className="description">
                  {item.tipo === "produto" ? (
                    <ShoppingBag size={12} color="#3b82f6" />
                  ) : (
                    <Scissors size={12} color="#ffcc00" />
                  )}
                  {item.descricao}
                </span>
              </div>

              <div className="col-resp">
                <Badge $isLoja={item.barbeiro === "Loja"}>
                  {item.barbeiro}
                </Badge>
              </div>

              <div className="col-val">R$ {item.valor.toFixed(2)}</div>
            </Row>
          ))}
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

// --- ESTILOS ---

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
  }
  .highlight {
    color: #ffcc00;
  }
  p {
    color: #444;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .refresh-btn {
    background: #111;
    border: 1px solid #222;
    color: #ffcc00;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      background: #ffcc00;
      color: #000;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ $color: string }>`
  background: #0a0a0a;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #1a1a1a;
  border-left: 4px solid ${(p) => p.$color};
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.65rem;
    color: #555;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  .val {
    font-family: "Rajdhani";
    font-size: 2.2rem;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }
  .sub {
    font-size: 0.65rem;
    color: #333;
    font-weight: bold;
    text-transform: uppercase;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SearchBox = styled.div`
  flex: 2;
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-radius: 8px;
  height: 50px;
  input {
    background: transparent;
    border: none;
    color: #fff;
    width: 100%;
    padding-left: 10px;
    font-size: 1rem;
    outline: none;
  }
  &:focus-within {
    border-color: #ffcc00;
  }
`;

const SelectBox = styled(SearchBox)`
  flex: 1;
  select {
    background: #0a0a0a;
    border: none;
    color: #fff;
    width: 100%;
    outline: none;
    font-size: 0.9rem;
    cursor: pointer;
  }
`;

const TableContainer = styled.div`
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
`;

const THead = styled.div`
  display: none;
  padding: 1rem;
  background: #111;
  font-size: 0.65rem;
  font-weight: 900;
  color: #444;
  text-transform: uppercase;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 120px 1fr 180px 100px;
  }
`;

const Row = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 1.2rem;
  border-bottom: 1px solid #161616;
  gap: 0.8rem;
  position: relative;

  .col-date {
    font-family: "Rajdhani";
    font-size: 0.75rem;
    color: #444;
    font-weight: bold;
  }
  .col-main {
    .client-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
    }
    strong {
      color: #fff;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .description {
      font-size: 0.8rem;
      color: #555;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
  .col-val {
    position: absolute;
    right: 1.2rem;
    top: 1.2rem;
    font-family: "Rajdhani";
    color: #ffcc00;
    font-size: 1.4rem;
    font-weight: 800;
  }

  @media (min-width: 768px) {
    display: grid;
    flex-direction: row;
    grid-template-columns: 120px 1fr 180px 100px;
    padding: 1rem;
    gap: 0;
    position: static;
    align-items: center;
    .col-date {
      font-size: 0.85rem;
      color: #333;
    }
    .col-main strong {
      font-size: 0.9rem;
    }
    .col-val {
      position: static;
      font-size: 1.1rem;
      text-align: right;
    }
  }
`;

const Badge = styled.div<{ $isLoja: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 900;
  text-transform: uppercase;
  background: ${(p) => (p.$isLoja ? "#1e3a8a33" : "#42200633")};
  color: ${(p) => (p.$isLoja ? "#3b82f6" : "#ffcc00")};
  border: 1px solid ${(p) => (p.$isLoja ? "#3b82f644" : "#ffcc0044")};
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  span {
    font-family: "Rajdhani";
    font-weight: bold;
    color: #444;
    font-size: 0.9rem;
  }
  button {
    background: #111;
    border: 1px solid #222;
    color: #fff;
    width: 45px;
    height: 45px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:disabled {
      opacity: 0.1;
      cursor: not-allowed;
    }
    &:not(:disabled):hover {
      border-color: #ffcc00;
      color: #ffcc00;
    }
  }
  @media (min-width: 768px) {
    justify-content: center;
    gap: 3rem;
  }
`;

const Center = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
