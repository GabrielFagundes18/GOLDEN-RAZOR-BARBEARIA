import { useState, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import { FaShoppingCart, FaArrowRight, FaBoxOpen } from "react-icons/fa";

// --- Estilos de Layout ---

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 20px 0;
  background: var(--bg-color, #0a0a0a);
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color, #333);
  border-radius: 12px;
  padding: 12px 20px;
  gap: 15px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: var(--primary-color, #00ff88);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 15px var(--primary-glow, rgba(0, 255, 136, 0.3));
  }

  input {
    background: none;
    border: none;
    color: var(--text-color, #fff);
    width: 100%;
    outline: none;
    font-size: 0.9rem;
    &::placeholder {
      color: var(--text-dark, #666);
    }
  }

  svg {
    color: var(--primary-color, #00ff88);
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${(props) =>
    props.$active
      ? "var(--primary-color, #00ff88)"
      : "var(--card-glass, rgba(255,255,255,0.05))"};
  color: ${(props) => (props.$active ? "#000" : "var(--text-muted, #aaa)")};
  border: 1px solid
    ${(props) =>
      props.$active
        ? "var(--primary-color, #00ff88)"
        : "var(--border-color, #333)"};
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.3s;
  text-transform: uppercase;
  font-family: "Syncopate", sans-serif;

  &:hover {
    border-color: var(--primary-color, #00ff88);
    box-shadow: 0 0 10px var(--primary-glow, rgba(0, 255, 136, 0.3));
  }
`;

const ProductCard = styled(motion.div)<{ $outOfStock: boolean }>`
  background: var(--card-color, #1a1a1a);
  border: 1px solid var(--border-color, #333);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  height: 100%;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    background: linear-gradient(
      135deg,
      transparent 50%,
      rgba(255, 255, 255, 0.03) 50%
    );
  }

  &:hover {
    border-color: ${(props) =>
      props.$outOfStock
        ? "var(--border-color, #333)"
        : "var(--primary-color, #00ff88)"};
    .arrow-icon {
      transform: translateX(5px);
      opacity: 1;
    }
  }

  .image-wrapper {
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    position: relative;

    img {
      max-height: 80%;
      object-fit: contain;
      filter: ${(props) =>
        props.$outOfStock ? "grayscale(1) opacity(0.5)" : "none"};
      transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  }
`;

const MainBtn = styled.button`
  background: var(--primary-color, #00ff88);
  color: #000;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.3s;
  font-family: "Syncopate", sans-serif;
  font-size: 0.65rem;

  .arrow-icon {
    opacity: 0.5;
    transition: 0.3s;
  }

  &:hover:not(:disabled) {
    background: #fff;
    box-shadow: 0 0 20px var(--primary-glow, rgba(0, 255, 136, 0.3));
  }

  &:disabled {
    background: var(--bg-darker, #111);
    color: var(--text-dark, #666);
    cursor: not-allowed;
  }
`;

const EmptyArsenal = styled(motion.div)`
  grid-column: 1 / -1;
  padding: 100px 20px;
  text-align: center;
  border: 1px dashed var(--border-color, #333);
  border-radius: 20px;
  color: var(--text-dark, #666);

  svg {
    margin-bottom: 15px;
    opacity: 0.3;
  }
  p {
    font-family: "Syncopate", sans-serif;
    font-size: 0.7rem;
    letter-spacing: 2px;
  }
`;


interface Product {
  id: string | number;
  nome?: string;
  marca?: string;
  categoria?: string;
  preco?: number | string;
  imagem_url?: string;
  em_estoque?: boolean;
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

  const categories = useMemo(() => {
    const rawCats =
      products
        ?.map((p) => p.categoria)
        .filter((cat): cat is string => Boolean(cat)) || [];
    return ["TODOS", ...Array.from(new Set(rawCats))];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const nome = p.nome?.toLowerCase() || "";
      const marca = p.marca?.toLowerCase() || "";
      const cat = p.categoria || "";
      const term = searchTerm.toLowerCase();

      const matchSearch = nome.includes(term) || marca.includes(term);
      const matchCat = activeCategory === "TODOS" || cat === activeCategory;

      return matchSearch && matchCat;
    });
  }, [products, searchTerm, activeCategory]);

  if (loading)
    return (
      <div
        style={{
          padding: "100px",
          textAlign: "center",
          color: "var(--primary-color, #00ff88)",
        }}
      >
        SINCRONIZANDO INVENTÁRIO...
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <FilterSection>
        <SearchBar>
          <HiSearch size={20} />
          <input
            placeholder="PROCURAR EQUIPAMENTO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <CategoryTabs>
          {categories.map((cat) => (
            <Tab
              key={cat}
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
            filtered.map((product) => (
              <ProductCard
                key={product.id}
                layout
                $outOfStock={!product.em_estoque}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="image-wrapper">
                  {!product.em_estoque && (
                    <div
                      style={{
                        position: "absolute",
                        background: "var(--error-color, #ff4444)",
                        color: "#fff",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        fontSize: "8px",
                        fontWeight: "900",
                        zIndex: 10,
                      }}
                    >
                      ESGOTADO
                    </div>
                  )}
                  <img
                    src={
                      product.imagem_url || "https://via.placeholder.com/200"
                    }
                    alt={product.nome}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--primary-color, #00ff88)",
                        fontSize: "9px",
                        fontWeight: "900",
                      }}
                    >
                      {product.categoria?.toUpperCase() || "SEM CATEGORIA"}
                    </span>
                    <span
                      style={{
                        color: "var(--text-dark, #666)",
                        fontSize: "9px",
                      }}
                    >
                      {product.marca}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      color: "#fff",
                      margin: "0 0 15px 0",
                    }}
                  >
                    {product.nome || "Produto sem nome"}
                  </h3>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.5rem",
                        color: "var(--text-dark, #666)",
                        fontWeight: "900",
                      }}
                    >
                      VALOR
                    </div>
                    <div
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "900",
                        color: product.em_estoque
                          ? "var(--success-color, #00ff88)"
                          : "var(--text-dark, #666)",
                      }}
                    >
                      R$ {Number(product.preco || 0).toFixed(2)}
                    </div>
                  </div>

                  <MainBtn
                    disabled={!product.em_estoque}
                    onClick={() => navigate(`/produtos/${product.id}`)}
                    style={{ width: "120px" }}
                  >
                    {product.em_estoque ? (
                      <>
                        DETALHES <FaArrowRight className="arrow-icon" />
                      </>
                    ) : (
                      "OFFLINE"
                    )}
                  </MainBtn>
                </div>
              </ProductCard>
            ))
          ) : (
            <EmptyArsenal
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FaBoxOpen size={40} />
              <p>NENHUM EQUIPAMENTO ENCONTRADO NO ARQUIVO.</p>
            </EmptyArsenal>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
