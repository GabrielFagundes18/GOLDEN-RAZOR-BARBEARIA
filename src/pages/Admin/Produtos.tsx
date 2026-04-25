import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import {
  Plus,
  Loader2,
  PackagePlus,
  Edit3,
  Filter,
  Search,
  
} from "lucide-react";
import { api } from "../../services/api";
import { FormularioProduto } from "./FormularioProduto";
import { ModalReporEstoque } from "./ModalReporEstoque";
import { ModalEditarProduto } from "./ModalEditarProduto";

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  color: white;
`;
const Main = styled.main`
  flex: 1;
  padding: 2.5rem;
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  h1 {
    color: #d4af37;
    font-family: "Rajdhani";
    font-size: 2.2rem;
    margin: 0;
  }
  p {
    color: #666;
    margin: 0;
    font-size: 0.9rem;
  }
`;
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
`;
const StatCard = styled.div<{ alert?: boolean; success?: boolean }>`
  background: #111;
  border: 1px solid
    ${(props) => (props.alert ? "#ff4d4d" : props.success ? "#2ecc71" : "#222")};
  padding: 1.2rem;
  border-radius: 12px;
  span {
    color: #555;
    font-size: 0.65rem;
    text-transform: uppercase;
  }
  strong {
    font-size: 1.4rem;
    color: ${(props) =>
      props.alert ? "#ff4d4d" : props.success ? "#2ecc71" : "#d4af37"};
    display: block;
    margin-top: 5px;
  }
  small {
    font-size: 0.7rem;
    color: #444;
    display: block;
  }
`;
const ControlBar = styled.div`
  display: flex;
  gap: 15px;
  background: #111;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #222;
  margin-bottom: 1.5rem;
  align-items: center;
  input,
  select {
    background: #000;
    border: 1px solid #333;
    color: #fff;
    padding: 10px;
    border-radius: 6px;
    outline: none;
  }
`;
const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #111;
  border-radius: 12px;
  overflow: hidden;
  th {
    background: #1a1a1a;
    color: #d4af37;
    text-align: left;
    padding: 15px;
    font-size: 0.8rem;
  }
  td {
    padding: 15px;
    border-bottom: 1px solid #222;
    font-size: 0.85rem;
  }
  img {
    width: 45px;
    height: 45px;
    border-radius: 6px;
    object-fit: cover;
  }
`;
const ActionButton = styled.button<{ variant?: "gold" | "outline" }>`
  background: ${(props) =>
    props.variant === "outline" ? "transparent" : "#d4af37"};
  color: ${(props) => (props.variant === "outline" ? "#fff" : "#000")};
  border: ${(props) =>
    props.variant === "outline" ? "1px solid #333" : "none"};
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
`;

export const ProdutosDono = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("todos");
  const [activeModal, setActiveModal] = useState<
    "create" | "repor" | "edit" | null
  >(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/ProdutoDono");
      setProdutos(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

 const metrics = useMemo(() => {
    // Valor total que você receberá ao vender tudo
    const totalVenda = produtos.reduce(
      (acc, p) => acc + Number(p.preco) * Number(p.estoque_qtd),
      0
    );

    // Valor que você investiu (Custo aproximado baseado em 60% do preço se não houver campo de custo)
    const totalInvestido = produtos.reduce(
      (acc, p) => acc + (Number(p.preco) * 0.6) * Number(p.estoque_qtd),
      0
    );

    const lucroEstimado = totalVenda - totalInvestido;
    const baixoEstoque = produtos.filter((p) => p.estoque_qtd < 5).length;
    const totalItens = produtos.reduce((acc, p) => acc + Number(p.estoque_qtd), 0);

    return { totalVenda, totalInvestido, lucroEstimado, baixoEstoque, totalItens };
  }, [produtos]);

  const filteredProducts = useMemo(() => {
    let result = produtos.filter((p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    if (filterMode === "critico")
      result = result.sort((a, b) => a.estoque_qtd - b.estoque_qtd);
    return result;
  }, [produtos, searchTerm, filterMode]);

  const handleSaveNew = async (data: any) => {
    await api.post("/ProdutoDono", data);
    setActiveModal(null);
    loadData();
  };

  const handleRepor = async (data: any) => {
    await api.post(`/ProdutoDono/reposicao/${data.produto_id}`, data);
    setActiveModal(null);
    loadData();
  };

  const handleUpdate = async (id: number, data: any) => {
    await api.put(`/ProdutoDono/${id}`, data);
    setActiveModal(null);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Excluir produto?")) {
      await api.delete(`/ProdutoDono/${id}`);
      setActiveModal(null);
      loadData();
    }
  };

  return (
    <Layout>
      <Main>
        <Header>
          <div>
            <h1>Gestão de Inventário</h1>
            
          </div>
          <ActionButton onClick={() => setActiveModal("create")}>
            <Plus size={18} /> NOVO PRODUTO
          </ActionButton>
        </Header>
       <StatsRow>
          {/* Patrimônio Líquido - Preço de Venda */}
          <StatCard>
            <span>Patrimônio (Venda)</span>
            <strong>
              {metrics.totalVenda.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
            <small>Valor total em prateleira</small>
          </StatCard>

          {/* Investimento - Valor de Custo */}
          <StatCard>
            <span>Capital Imobilizado</span>
            <strong style={{ color: "#aaa" }}>
              {metrics.totalInvestido.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
            <small>Custo estimado de aquisição</small>
          </StatCard>

          {/* Lucro Potencial */}
          <StatCard success={metrics.lucroEstimado > 0}>
            <span>Lucro Previsto</span>
            <strong style={{ color: "#2ecc71" }}>
              {metrics.lucroEstimado.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
            <small>Margem bruta projetada</small>
          </StatCard>

          {/* Alertas de Estoque */}
          <StatCard alert={metrics.baixoEstoque > 0}>
            <span>Rupturas / Alertas</span>
            <strong>{metrics.baixoEstoque} itens</strong>
            <small>Abaixo de 5 unidades</small>
          </StatCard>

          {/* Total de Itens Físicos */}
          <StatCard>
            <span>Volume Total</span>
            <strong>{metrics.totalItens} un.</strong>
            <small>Total de peças no galpão</small>
          </StatCard>
        </StatsRow>
        <ControlBar>
          <Search size={18} color="#444" />
          <input
            placeholder="Pesquisar..."
            style={{ flex: 1 }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter size={18} color="#d4af37" />
          <select onChange={(e) => setFilterMode(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="critico">Crítico</option>
          </select>
        </ControlBar>
        {loading ? (
          <Loader2 className="animate-spin" color="#d4af37" size={40} />
        ) : (
          <ProductTable>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.categoria}</td>
                  <td>
                    {Number(p.preco).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td
                    style={{ color: p.estoque_qtd < 5 ? "#ff4d4d" : "#2ecc71" }}
                  >
                    {p.estoque_qtd} un
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <ActionButton
                        variant="outline"
                        onClick={() => {
                          setSelectedProduct(p);
                          setActiveModal("repor");
                        }}
                      >
                        <PackagePlus size={14} />
                      </ActionButton>
                      <ActionButton
                        variant="outline"
                        onClick={() => {
                          setSelectedProduct(p);
                          setActiveModal("edit");
                        }}
                      >
                        <Edit3 size={14} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </ProductTable>
        )}
        {activeModal === "create" && (
          <FormularioProduto
            onClose={() => setActiveModal(null)}
            onSave={handleSaveNew}
          />
        )}
        {activeModal === "repor" && (
          <ModalReporEstoque
            produto={selectedProduct}
            onClose={() => setActiveModal(null)}
            onConfirm={handleRepor}
          />
        )}
        {activeModal === "edit" && (
          <ModalEditarProduto
            produto={selectedProduct}
            onClose={() => setActiveModal(null)}
            onSave={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </Main>
    </Layout>
  );
};
