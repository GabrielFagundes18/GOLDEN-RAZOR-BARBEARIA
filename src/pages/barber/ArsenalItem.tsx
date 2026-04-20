import React from "react";
import { ShoppingCart, Package, Ban } from "lucide-react";
import styled from "styled-components";

const ProductCard = styled.div<{ $noStock: boolean }>`
  background: var(--card-color);
  border: 1px solid
    ${(props) => (props.$noStock ? "var(--text-dark)" : "var(--border-color)")};
  padding: 1.5rem;
  border-radius: 4px;
  text-align: center;
  opacity: ${(props) => (props.$noStock ? 0.6 : 1)};
  transition: 0.3s;
  position: relative;

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

const SellButton = styled.button`
  width: 100%;
  padding: 10px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;

  &:disabled {
    background: var(--text-dark);
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--secondary-color);
  }
`;

export const ArsenalItem = ({ produto, onVender }: any) => {
  return (
    <ProductCard $noStock={!produto.em_estoque}>
      <div
        style={{
          height: "150px",
          marginBottom: "1rem",
          overflow: "hidden",
          borderRadius: "4px",
        }}
      >
        {produto.imagem_url ? (
          <img
            src={produto.imagem_url}
            alt={produto.nome}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              background: "#000",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Package size={40} color="var(--text-dark)" />
          </div>
        )}
      </div>

      <h4 style={{ color: "var(--text-color)", textTransform: "uppercase" }}>
        {produto.nome}
      </h4>
      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
        {produto.marca} | {produto.categoria}
      </p>

      <PriceTag>R$ {Number(produto.preco).toFixed(2)}</PriceTag>

      <SellButton
        disabled={!produto.em_estoque}
        onClick={() => onVender(produto)}
      >
        {produto.em_estoque ? (
          <>
            <ShoppingCart size={16} /> VENDER
          </>
        ) : (
          <>
            <Ban size={16} /> ESGOTADO
          </>
        )}
      </SellButton>
    </ProductCard>
  );
};
