import React from "react";
import { ShoppingCart, Package, Ban, Plus } from "lucide-react";
import styled from "styled-components";

const ProductCard = styled.div<{ $noStock: boolean }>`
  background: var(--card-color);
  border: 1px solid
    ${(props) => (props.$noStock ? "var(--text-dark)" : "var(--border-color)")};
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  opacity: ${(props) => (props.$noStock ? 0.7 : 1)};
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%;

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

const AddButton = styled.button`
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: #000;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
  text-transform: uppercase;

  &:disabled {
    background: var(--bg-darker);
    color: var(--text-dark);
    cursor: not-allowed;
    border: 1px solid var(--border-color);
  }

  &:hover:not(:disabled) {
    background: var(--gold-bright);
    transform: translateY(-2px);
  }
`;

export const ArsenalItem = ({ produto, onVender }: any) => {
  if (!produto) return null;

  const estoqueAtual = Number(produto.estoque_qtd || 0);
  const temNoEstoque = estoqueAtual > 0;

  return (
    <ProductCard $noStock={!temNoEstoque}>
      <div
        style={{
          height: "140px",
          marginBottom: "1rem",
          overflow: "hidden",
          borderRadius: "4px",
          background: "var(--bg-darker)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {produto.imagem_url ? (
          <img
            src={produto.imagem_url}
            alt={produto.nome}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              filter: !temNoEstoque ? "grayscale(1)" : "none",
            }}
          />
        ) : (
          <Package size={40} color="var(--text-dark)" />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h4
          style={{
            color: "var(--text-color)",
            textTransform: "uppercase",
            fontSize: "0.85rem",
          }}
        >
          {produto.nome}
        </h4>
        <p style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
          {produto.marca} | {produto.categoria}
        </p>
        <p
          style={{
            fontSize: "0.6rem",
            color: temNoEstoque ? "var(--success-color)" : "var(--error-color)",
            fontWeight: "bold",
            marginTop: "5px",
          }}
        >
          {temNoEstoque ? `${estoqueAtual} DISPONÍVEIS` : "ESGOTADO"}
        </p>
      </div>

      <PriceTag>R$ {Number(produto.preco || 0).toFixed(2)}</PriceTag>

      <AddButton disabled={!temNoEstoque} onClick={() => onVender(produto)}>
        {temNoEstoque ? (
          <>
            {" "}
            <Plus size={16} /> ADICIONAR{" "}
          </>
        ) : (
          <>
            {" "}
            <Ban size={16} /> SEM ESTOQUE{" "}
          </>
        )}
      </AddButton>
    </ProductCard>
  );
};
