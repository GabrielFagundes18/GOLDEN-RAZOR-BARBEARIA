import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Download,
  Calendar,
  User,
  Package,
  TrendingUp,
} from "lucide-react";
import { api } from "../../services/api";

export const HistoricoAdmin = () => {
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  const fetchHistorico = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/vendas/historico");
      setVendas(data);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, []);

  // Filtro de busca (por cliente ou produto)
  const vendasFiltradas = vendas.filter(
    (v) =>
      v.cliente_nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      v.produto_nome?.toLowerCase().includes(filtro.toLowerCase()),
  );

  const totalVendido = vendasFiltradas.reduce(
    (acc, curr) => acc + Number(curr.valor_total),
    0,
  );

  return (
    <Layout>
      <Content>
        <Header>
          <div className="title">
            <FileText size={32} color="var(--primary-color)" />
            <div>
              <h1>
                Histórico de <strong>Operações</strong>
              </h1>
              <p>Relatório detalhado de saída do arsenal</p>
            </div>
          </div>

          <StatsMini>
            <div className="stat">
              <span>TOTAL EM VENDAS</span>
              <strong style={{ color: "var(--success-color)" }}>
                R$ {totalVendido.toFixed(2)}
              </strong>
            </div>
            <div className="stat">
              <span>ORDENS CONCLUÍDAS</span>
              <strong>{vendasFiltradas.length}</strong>
            </div>
          </StatsMini>
        </Header>

        <Controls>
          <SearchWrapper>
            <Search size={18} />
            <input
              placeholder="Buscar por cliente ou equipamento..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </SearchWrapper>

          <ExportBtn onClick={() => window.print()}>
            <Download size={18} /> EXPORTAR PDF
          </ExportBtn>
        </Controls>

        <TableContainer>
          {loading ? (
            <div className="loading">CARREGANDO REGISTROS...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>
                    <Calendar size={14} /> DATA
                  </th>
                  <th>
                    <User size={14} /> CLIENTE
                  </th>
                  <th>
                    <Package size={14} /> PRODUTO
                  </th>
                  <th>QTD</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {vendasFiltradas.map((venda) => (
                  <tr key={venda.id}>
                    <td className="date">
                      {new Date(venda.data_venda).toLocaleDateString("pt-BR")}
                      <span>
                        {new Date(venda.data_venda).toLocaleTimeString(
                          "pt-BR",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </td>
                    <td className="client">{venda.cliente_nome}</td>
                    <td className="product">
                      <div className="tag">{venda.produto_categoria}</div>
                      {venda.produto_nome}
                    </td>
                    <td>{venda.quantidade}</td>
                    <td className="price">
                      R$ {Number(venda.valor_total).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge>CONCLUÍDO</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableContainer>
      </Content>
    </Layout>
  );
};

// --- ESTILOS ---

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
  padding: 3rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;

  .title {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    h1 {
      font-family: "Rajdhani", sans-serif;
      font-size: 2rem;
      color: #fff;
      text-transform: uppercase;
    }
    p {
      color: var(--text-muted);
      fontsize: 0.9rem;
    }
  }
`;

const StatsMini = styled.div`
  display: flex;
  gap: 2rem;
  .stat {
    background: var(--card-color);
    padding: 1rem 2rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    span {
      font-size: 0.6rem;
      color: var(--text-muted);
      font-weight: 800;
      margin-bottom: 5px;
    }
    strong {
      font-size: 1.2rem;
      font-family: "Rajdhani";
    }
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const SearchWrapper = styled.div`
  flex: 1;
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  gap: 1rem;
  svg {
    color: var(--primary-color);
  }
  input {
    background: none;
    border: none;
    color: #fff;
    width: 100%;
    height: 50px;
    outline: none;
    &::placeholder {
      color: var(--text-dark);
    }
  }
`;

const ExportBtn = styled.button`
  background: none;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0 2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: 0.3s;
  &:hover {
    background: var(--primary-color);
    color: #000;
  }
`;

const TableContainer = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;

    th {
      background: var(--bg-darker);
      padding: 1.2rem;
      color: var(--text-muted);
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 800;
      border-bottom: 1px solid var(--border-color);
      svg {
        vertical-align: middle;
        margin-right: 5px;
      }
    }

    td {
      padding: 1.2rem;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-color);
      font-size: 0.9rem;
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .date {
      font-family: "Rajdhani";
      span {
        display: block;
        font-size: 0.7rem;
        color: var(--text-dark);
      }
    }

    .client {
      font-weight: bold;
      color: var(--primary-color);
    }

    .product {
      .tag {
        font-size: 0.6rem;
        background: var(--bg-darker);
        padding: 2px 6px;
        border-radius: 4px;
        width: fit-content;
        margin-bottom: 4px;
        color: var(--text-muted);
      }
    }

    .price {
      font-weight: 900;
      color: var(--success-color);
      font-family: "Rajdhani";
    }
  }

  .loading {
    padding: 5rem;
    text-align: center;
    color: var(--primary-color);
    font-weight: bold;
  }
`;

const StatusBadge = styled.div`
  background: rgba(0, 255, 100, 0.1);
  color: var(--success-color);
  font-size: 0.65rem;
  font-weight: 900;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid var(--success-color);
  width: fit-content;
`;
