import { useState, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import { FaArrowRight, FaBoxOpen } from "react-icons/fa";

// --- INTERFACE ---
interface Product {
  id: string | number;
  nome?: string;
  marca?: string;
  categoria?: string;
  preco?: number | string;
  imagem_url?: string;
  estoque_qtd?: number; 
}

export default function ProductArsenal({
  products = [],
  loading = false,
}: {
  products: Product[];
  loading?: boolean;
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODOS");

  // 1. Geração de categorias com verificação de erro
  const categories = useMemo(() => {
    if (!Array.isArray(products)) return ["TODOS"];
    const rawCats = products
      .map((p) => p?.categoria)
      .filter((cat): cat is string => Boolean(cat));
    return ["TODOS", ...Array.from(new Set(rawCats))];
  }, [products]);

  // 2. Filtro de busca com verificação de nulos
  const filtered = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((p) => {
      const nome = p?.nome?.toLowerCase() || "";
      const marca = p?.marca?.toLowerCase() || "";
      const cat = p?.categoria || "";
      const term = searchTerm.toLowerCase();
      return (
        (nome.includes(term) || marca.includes(term)) &&
        (activeCategory === "TODOS" || cat === activeCategory)
      );
    });
  }, [products, searchTerm, activeCategory]);

  if (loading) return <LoadingWrapper>CARREGANDO INVENTÁRIO...</LoadingWrapper>;

  return (
    <div style={{ padding: "10px", maxWidth: "1400px", margin: "0 auto", width: '100%'}}>
      <div style={{ width: '100%', margin:"1rem", color: "var(--gold-color)", fontSize:"1rem"}}>
        <h2>Produtos golden razor</h2>
        </div>
      <FilterSection>
        <SearchBar>
          <HiSearch size={20} />
          <input
            placeholder="BUSCAR NO ARSENAL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <CategoryTabs>
          {categories.map((cat) => (
            <Tab
              key={`cat-${cat}`}
              $active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Tab>
          ))}
        </CategoryTabs>
      </FilterSection>

      <motion.div
        layout
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "25px",
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((product) => {
              // Garante que o estoque seja tratado como número
              const qtd = Number(product?.estoque_qtd || 0);
              const temEstoque = qtd > 0;

              return (
                <ProductCard
                  key={product.id}
                  layout
                  $outOfStock={!temEstoque}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="image-wrapper">
                    {!temEstoque && <Badge>ESGOTADO</Badge>}
                    <img
                      src={
                        product?.imagem_url || "https://via.placeholder.com/300"
                      }
                      alt={product?.nome}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span className="category-label">
                        {product?.categoria}
                      </span>
                      <span className="brand-label">{product?.marca}</span>
                    </div>
                    <h3 className="product-title">{product?.nome}</h3>
                    <span
                      style={{ fontSize: "0.7rem", color: "var(--text-dark)" }}
                    >
                      {temEstoque ? `${qtd} em estoque` : "Indisponível"}
                    </span>
                  </div>

                  <div className="card-footer">
                    <div>
                      <div className="price-label">PREÇO</div>
                      <div className="price-value">
                        R$ {Number(product?.preco || 0).toFixed(2)}
                      </div>
                    </div>

                    <MainBtn
                      disabled={!temEstoque}
                      onClick={() => navigate(`/produtos/${product.id}`)}
                    >
                      {temEstoque ? "DETALHES" : "OFFLINE"}
                    </MainBtn>
                  </div>
                </ProductCard>
              );
            })
          ) : (
            <EmptyArsenal>
              <FaBoxOpen size={40} />
              <p>NENHUM ITEM ENCONTRADO.</p>
            </EmptyArsenal>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// --- ESTILOS COM AS CORES :ROOT FORNECIDAS ---

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 20px;
  gap: 15px;
  input {
    background: none;
    border: none;
    color: var(--text-color);
    width: 100%;
    outline: none;
  }
  svg {
    color: var(--primary-color);
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${(props) =>
    props.$active ? "var(--primary-color)" : "var(--card-glass)"};
  color: ${(props) => (props.$active ? "#000" : "var(--text-muted)")};
  border: 1px solid
    ${(props) =>
      props.$active ? "var(--primary-color)" : "var(--border-color)"};
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
  text-transform: uppercase;
`;

const ProductCard = styled(motion.div)<{ $outOfStock: boolean }>`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  opacity: ${(props) => (props.$outOfStock ? 0.6 : 1)};

  .image-wrapper {
    height: 180px;
    background: var(--bg-darker);
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
    img {
      max-height: 80%;
      filter: ${(props) => (props.$outOfStock ? "grayscale(1)" : "none")};
    }
  }

  .product-title {
    font-size: 1rem;
    color: var(--text-color);
    margin: 10px 0;
  }
  .category-label {
    color: var(--primary-color);
    font-size: 9px;
    font-weight: 900;
  }
  .brand-label {
    color: var(--text-dark);
    font-size: 9px;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 20px;
  }
  .price-label {
    font-size: 0.5rem;
    color: var(--text-dark);
    font-weight: 900;
  }
  .price-value {
    font-size: 1.2rem;
    font-weight: 900;
    color: var(--text-color);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--error-color);
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 8px;
  font-weight: 900;
  z-index: 10;
`;

const MainBtn = styled.button`
  background: var(--primary-color);
  color: #000;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 900;
  cursor: pointer;
  font-size: 0.65rem;
  &:disabled {
    background: var(--bg-darker);
    color: var(--text-dark);
    border: 1px solid var(--border-color);
    cursor: not-allowed;
  }
`;

const LoadingWrapper = styled.div`
  padding: 100px;
  text-align: center;
  color: var(--primary-color);
`;

const EmptyArsenal = styled.div`
  grid-column: 1 / -1;
  padding: 100px;
  text-align: center;
  color: var(--text-dark);
`;
