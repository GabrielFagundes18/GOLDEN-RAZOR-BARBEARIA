import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Search,
  User,
  Package,
  ArrowLeft,
  Loader2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import Sidebar from "./Sidebar";

// --- STYLED COMPONENTS ---

const Layout = styled.div`
  display: flex;
  background: var(--bg-color);
  min-height: 100vh;
  color: var(--text-color);
    background-image: linear-gradient(var(--scanline-color) 1px, transparent 1px);
  background-size: 100% 4px;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;

`;



const HeaderTitle = styled.h2`
  font-family: "Rajdhani", sans-serif;
  color: var(--gold-color);
  text-transform: uppercase;
  font-size: 1.8rem;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px var(--gold-glow);
`;

const SearchBar = styled.div`
  background: var(--card-glass);
  border: 1px solid var(--border-color);
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 2rem 0;
  max-width: 500px;
  backdrop-filter: blur(5px);
  transition: 0.3s;

  input {
    background: transparent;
    border: none;
    color: #fff;
    outline: none;
    width: 100%;
    font-family: "Inter", sans-serif;
    &::placeholder {
      color: var(--text-dark);
    }
  }

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 15px var(--primary-glow);
  }
`;

const TableContainer = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 1.2rem 1rem;
    background: #080808;
    color: var(--text-muted);
    font-size: 0.75rem;
    font-family: "Rajdhani", sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 2px solid var(--border-color);
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.9rem;
    vertical-align: middle;
  }

  tr:hover {
    background: rgba(
      225,
      29,
      72,
      0.03
    ); // Leve brilho vermelho ao passar o mouse
  }
`;

const ProductIcon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
  background: #000;
  border: 1px solid var(--border-bright);
  padding: 2px;
`;

const StatusTag = styled.span`
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
  padding: 4px 10px;
  border-radius: 2px;
  font-size: 0.65rem;
  font-weight: 800;
  border: 1px solid rgba(34, 197, 94, 0.2);
  text-transform: uppercase;
`;

// --- COMPONENT ---

export const HistoricoVendas = () => {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/vendas/historico")
      .then((res) => {
        setVendas(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = vendas.filter(
    (v) =>
      v.cliente_nome?.toLowerCase().includes(search.toLowerCase()) ||
      v.produto_nome?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout>
      <Sidebar />
      <Main>
        

        <HeaderTitle>Registro de Operações</HeaderTitle>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            marginBottom: "2rem",
          }}
        >
          Monitoramento de vendas e saída de estoque em tempo real.
        </p>

        <SearchBar>
          <Search size={18} color="var(--primary-color)" />
          <input
            placeholder="Filtrar por agente ou item de inventário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBar>

        {loading ? (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              color: "var(--primary-color)",
            }}
          >
            <Loader2 className="animate-spin" />
            <span style={{ fontFamily: "Rajdhani", fontWeight: "bold" }}>
              SINCRONIZANDO DADOS...
            </span>
          </div>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>
                    <Calendar size={12} style={{ marginRight: 5 }} /> Data
                  </th>
                  <th>
                    <User size={12} style={{ marginRight: 5 }} /> Cliente
                  </th>
                  <th>
                    <Package size={12} style={{ marginRight: 5 }} /> Produto
                  </th>
                  <th>Qtd</th>
                  <th>
                    <DollarSign size={12} style={{ marginRight: 5 }} /> Valor
                    Total
                  </th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id}>
                    <td
                      style={{
                        color: "var(--text-muted)",
                        fontFamily: "monospace",
                      }}
                    >
                      {new Date(v.data_venda).toLocaleDateString("pt-BR")}
                    </td>

                    <td style={{ fontWeight: "600", color: "#eee" }}>
                      {v.cliente_nome}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <ProductIcon
                          src="https://www.shutterstock.com/image-vector/vintage-barber-icon-neon-great-600w-2376353149.jpg"
                          alt="item"
                        />
                        <span style={{ color: "var(--gold-bright)" }}>
                          {v.produto_nome}
                        </span>
                      </div>
                    </td>

                    <td style={{ color: "var(--text-muted)" }}>
                      {v.quantidade}x
                    </td>

                    <td
                      style={{
                        color: "var(--success-color)",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                      }}
                    >
                      R$ {Number(v.valor_total).toFixed(2)}
                    </td>

                    <td>
                      <StatusTag>Concluído</StatusTag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </Main>
    </Layout>
  );
};
