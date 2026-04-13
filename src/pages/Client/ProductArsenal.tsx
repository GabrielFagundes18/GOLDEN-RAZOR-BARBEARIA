import React, { useState } from "react";
import styled from "styled-components";
import { Loader2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";

// --- TIPOS ---

interface Product {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  info: string;
  imagem_url: string;
  em_estoque: boolean;
}

// --- ESTILOS ---

const ViewWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  box-sizing: border-box;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 10px 5px;
  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;

  @media (min-width: 768px) {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;

// Uso do prefixo $ para propriedades que não devem ir para o HTML
const CategoryBtn = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? "#e11d48" : "rgba(255, 255, 255, 0.05)"};
  border: 1px solid ${props => props.$active ? "#e11d48" : "rgba(255, 255, 255, 0.1)"};
  color: ${props => props.$active ? "#fff" : "#888"};
  padding: 10px 20px;
  border-radius: 8px;
  font-family: 'Syncopate', sans-serif;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #e11d48;
    color: white;
  }
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled(motion.div)`
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

const ImageBox = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #1a1a1a;
  border-radius: 10px;
  margin-bottom: 15px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StatusBadge = styled.span<{ $inStock: boolean }>`
  position: absolute;
  top: 30px;
  right: 30px;
  /* Uso do $inStock para evitar erro de atributo inválido */
  background: ${props => props.$inStock ? "#00ff88" : "#ff4444"};
  color: #000;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Syncopate', sans-serif;
  font-size: 8px;
  font-weight: 900;
  z-index: 2;
`;

const CardFooter = styled.div`
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function ProductArsenal() {
  const { data: products, loading } = useFetch<Product[]>("/produtos");
  const [activeCat, setActiveCat] = useState("TODOS");

  const cats = products 
    ? ["TODOS", ...new Set(products.map((p: Product) => p.categoria.toUpperCase()))]
    : ["TODOS"];

  const filtered = products?.filter((p: Product) => 
    activeCat === "TODOS" ? true : p.categoria.toUpperCase() === activeCat
  );

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
        <Loader2 className="animate-spin" size={40} color="#e11d48" />
      </div>
    );
  }

  return (
    <ViewWrapper>
      <FilterContainer>
        {cats.map((c) => (
          <CategoryBtn
            key={c}
            $active={activeCat === c} // Mudança aqui: $active
            onClick={() => setActiveCat(c)}
          >
            {c}
          </CategoryBtn>
        ))}
      </FilterContainer>

      <ProductGrid layout>
        <AnimatePresence mode="popLayout">
          {filtered?.map((p) => (
            <ProductCard
              key={p.id}
              layout // Mantém o layout suave durante a filtragem
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <StatusBadge $inStock={p.em_estoque}> {/* Mudança aqui: $inStock */}
                {p.em_estoque ? "READY" : "OUT"}
              </StatusBadge>

              <ImageBox>
                <img 
                  src={p.imagem_url} 
                  alt={p.nome} 
                  style={{ opacity: p.em_estoque ? 1 : 0.3 }}
                />
              </ImageBox>

              <div style={{ marginBottom: "15px" }}>
                <h4 style={{ color: "#fff", fontFamily: "Syncopate", fontSize: "12px", margin: "0 0 5px 0" }}>
                  {p.nome}
                </h4>
                <p style={{ color: "#666", fontSize: "12px", margin: 0, lineHeight: "1.4" }}>
                  {p.info}
                </p>
              </div>

              <CardFooter>
                <div>
                  <span style={{ color: "#e11d48", fontSize: "8px", fontFamily: "Syncopate", display: "block" }}>
                    VALOR
                  </span>
                  <strong style={{ color: "#fff", fontSize: "18px" }}>
                    R$ {Number(p.preco).toFixed(2)}
                  </strong>
                </div>

               
              </CardFooter>
            </ProductCard>
          ))}
        </AnimatePresence>
      </ProductGrid>
    </ViewWrapper>
  );
}