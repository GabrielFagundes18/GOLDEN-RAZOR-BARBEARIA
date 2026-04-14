import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Ícones
import { HiOutlineExternalLink, HiSearch } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";

// --- ESTILOS ---

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 12px 20px;
  gap: 15px;

  input {
    background: none;
    border: none;
    color: #fff;
    width: 100%;
    outline: none;
    &::placeholder {
      color: #444;
    }
  }
  svg {
    color: #e11d48;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

// O prefixo $ impede que a prop "active" seja passada para o botão HTML
const Tab = styled.button<{ $active: boolean }>`
  background: ${(props) =>
    props.$active ? "#e11d48" : "rgba(255, 255, 255, 0.03)"};
  color: ${(props) => (props.$active ? "#fff" : "#666")};
  border: 1px solid
    ${(props) => (props.$active ? "#e11d48" : "rgba(255, 255, 255, 0.05)")};
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
  text-transform: uppercase;

  &:hover {
    border-color: #e11d48;
  }
`;

const GridContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
`;

const ProductCard = styled(motion.div)<{ $outOfStock: boolean }>`
  background: #0a0a0a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: 0.3s;
  position: relative;

  opacity: ${(props) => (props.$outOfStock ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) =>
      props.$outOfStock ? "rgba(255, 255, 255, 0.1)" : "#e11d48"};
    transform: ${(props) => (props.$outOfStock ? "none" : "translateY(-5px)")};
  }

  .image-wrapper {
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    img {
      max-height: 100%;
      object-fit: contain;
      border-radius: 12px;
      filter: ${(props) =>
        props.$outOfStock ? "grayscale(1) brightness(0.6)" : "none"};
      transition: 0.3s;
    }
  }
`;

const StockBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #e11d48;
  color: #fff;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1px;
  z-index: 2;
`;

const PriceTag = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  margin-top: auto;
`;

const MainBtn = styled.button`
  background: #e11d48;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: 0.3s;

  &:disabled {
    background: #1a1a1a;
    color: #444;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #f43f5e;
  }
`;

// --- COMPONENTE ---

interface Product {
  id: string | number;
  nome: string;
  marca?: string;
  categoria: string;
  preco: number | string;
  imagem_url: string;
  em_estoque: boolean;
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

  // Categorias dinâmicas com useMemo para performance
  const categories = useMemo(() => {
    return [
      "TODOS",
      ...Array.from(new Set(products.map((p) => p.categoria).filter(Boolean))),
    ];
  }, [products]);

  // Filtro lógico
  const filtered = products.filter((p) => {
    const nome = p.nome?.toLowerCase() || "";
    const marca = p.marca?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    const matchSearch = nome.includes(term) || marca.includes(term);
    const matchCat =
      activeCategory === "TODOS" || p.categoria === activeCategory;

    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div
        style={{
          color: "#fff",
          textAlign: "center",
          padding: "50px",
          fontWeight: "bold",
        }}
      >
        CARREGANDO ARSENAL...
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", background: "#050505", minHeight: "100vh" }}>
      <FilterSection>
        <SearchBar>
          <HiSearch size={20} />
          <input
            placeholder="Procurar no arsenal..."
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

      <GridContainer layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <ProductCard
              layout
              key={product.id}
              $outOfStock={!product.em_estoque}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="image-wrapper">
                {!product.em_estoque && <StockBadge>ESGOTADO</StockBadge>}
                <img src={product.imagem_url} alt={product.nome} />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#e11d48",
                    fontSize: "10px",
                    fontWeight: "900",
                  }}
                >
                  {product.categoria?.toUpperCase()}
                </span>
                <span style={{ color: "#444", fontSize: "10px" }}>
                  {product.marca}
                </span>
              </div>

              <h3
                style={{ fontSize: "1.1rem", margin: "5px 0", color: "#fff" }}
              >
                {product.nome}
              </h3>

              <PriceTag style={{ color: product.em_estoque ? "#fff" : "#444" }}>
                R$ {Number(product.preco).toFixed(2)}
              </PriceTag>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 50px",
                  gap: "10px",
                }}
              >
                <MainBtn
                  disabled={!product.em_estoque}
                  onClick={() => navigate(`/produtos/${product.id}`)}
                >
                  <FaShoppingCart />
                  {product.em_estoque ? "DETALHES" : "SEM ESTOQUE"}
                </MainBtn>

                
              </div>
            </ProductCard>
          ))}
        </AnimatePresence>
      </GridContainer>
    </div>
  );
}
