import { useState, useEffect } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { ShoppingCart, Package, Loader2, Ban } from "lucide-react";

// Reaproveitando o estilo Premium Dark que definimos
const ProductCard = styled.div<{ $noStock: boolean }>`
  background: var(--card-color);
  border: 1px solid
    ${(props) => (props.$noStock ? "var(--text-dark)" : "var(--border-color)")};
  padding: 1.5rem;
  border-radius: 4px;
  text-align: center;
  opacity: ${(props) => (props.$noStock ? 0.6 : 1)};
  transition: 0.3s;

  &:hover {
    border-color: ${(props) =>
      props.$noStock ? "var(--text-dark)" : "var(--primary-color)"};
    box-shadow: ${(props) =>
      props.$noStock ? "none" : "0 0 15px var(--primary-glow)"};
  }
`;

const PriceTag = styled.div`
  color: var(--gold-color);
  font-weight: 800;
  font-size: 1.5rem;
  margin: 10px 0;
  font-family: "Rajdhani", sans-serif;
`;

export const Vendas = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArsenal = async () => {
      try {
        setLoading(true);
        // Chamando a rota que executa o seu 'getProducts'
        const { data } = await api.get("/produtos");
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao carregar arsenal");
      } finally {
        setLoading(false);
      }
    };
    fetchArsenal();
  }, []);

  const realizarVenda = async (id: number) => {
    // Aqui você pode criar uma rota de venda ou apenas dar o alerta
    alert(`Produto ${id} selecionado para venda.`);
  };

  return (
    <div
      style={{
        padding: "2rem",
        background: "var(--bg-color)",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          color: "var(--gold-color)",
          marginBottom: "2rem",
          textTransform: "uppercase",
        }}
      >
        Arsenal de Produtos
      </h2>

      {loading ? (
        <Loader2 className="animate-spin" color="var(--primary-color)" />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {produtos.map((p) => (
            <ProductCard key={p.id} $noStock={!p.em_estoque}>
              <div style={{ position: "relative" }}>
                {p.imagem_url ? (
                  <img
                    src={p.imagem_url}
                    alt={p.nome}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  <Package size={48} color="var(--text-dark)" />
                )}
                {!p.em_estoque && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "var(--error-color)",
                      color: "white",
                      padding: "4px 8px",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    ESGOTADO
                  </div>
                )}
              </div>

              <h4 style={{ marginTop: "1rem", color: "var(--text-color)" }}>
                {p.nome}
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {p.marca} | {p.categoria}
              </p>

              <PriceTag>R$ {p.preco}</PriceTag>

              <button
                disabled={!p.em_estoque}
                onClick={() => realizarVenda(p.id)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: p.em_estoque
                    ? "var(--primary-color)"
                    : "var(--text-dark)",
                  color: "white",
                  border: "none",
                  cursor: p.em_estoque ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {p.em_estoque ? (
                  <>
                    <ShoppingCart size={16} /> VENDER
                  </>
                ) : (
                  <>
                    <Ban size={16} /> SEM ESTOQUE
                  </>
                )}
              </button>
            </ProductCard>
          ))}
        </div>
      )}
    </div>
  );
};
