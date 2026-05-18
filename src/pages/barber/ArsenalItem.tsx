import React from "react";
import { ShoppingCart, Package, Ban, Plus, ShieldCheck } from "lucide-react";
import styled from "styled-components";

// --- Estilos Evoluídos ---

const ProductCard = styled.div<{ $noStock: boolean }>`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  padding: 1.2rem;
  border-radius: 4px;
  text-align: center;
  opacity: ${(props) => (props.$noStock ? 0.6 : 1)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;

  /* Detalhe estético no canto superior */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    background: ${(props) =>
      props.$noStock
        ? "transparent"
        : "linear-gradient(225deg, var(--primary-color) 0%, transparent 50%)"};
    opacity: 0.5;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: ${(props) =>
      props.$noStock ? "var(--border-color)" : "var(--primary-color)"};
    box-shadow: ${(props) =>
      props.$noStock ? "none" : "0 10px 30px -10px rgba(212, 175, 55, 0.2)"};
  }
`;

const ImageContainer = styled.div<{ $noStock: boolean }>`
  height: 160px;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 4px;
  background: var(--bg-darker);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  position: relative;

  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    filter: ${(props) =>
      props.$noStock
        ? "grayscale(1) brightness(0.5)"
        : "drop-shadow(0 5px 15px rgba(0,0,0,0.5))"};
    transition: 0.3s;
  }

  ${ProductCard}:hover & img {
    transform: scale(1.08);
  }
`;

const Badge = styled.span<{ $type: "stock" | "out" }>`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  font-size: 0.6rem;
  font-weight: 900;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${(props) =>
    props.$type === "stock"
      ? "rgba(74, 222, 128, 0.1)"
      : "rgba(239, 68, 68, 0.1)"};
  color: ${(props) =>
    props.$type === "stock" ? "var(--success-color)" : "var(--error-color)"};
  border: 1px solid
    ${(props) =>
      props.$type === "stock" ? "var(--success-color)" : "var(--error-color)"};
  z-index: 2;
`;

const ProductInfo = styled.div`
  flex: 1;
  margin-top: 0.5rem;

  h4 {
    color: var(--text-color);
    text-transform: uppercase;
    font-size: 0.9rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: 1px;
    font-family: "Rajdhani", sans-serif;
  }

  .category {
    font-size: 0.65rem;
    color: var(--text-dark);
    text-transform: uppercase;
    margin-top: 4px;
    display: block;
  }
`;

const PriceTag = styled.div`
  color: var(--gold-bright);
  font-weight: 800;
  font-size: 1.4rem;
  margin: 12px 0;
  font-family: "Rajdhani", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  span {
    font-size: 0.8rem;
    color: var(--gold-color);
    opacity: 0.7;
  }
`;

const AddButton = styled.button`
  width: 100%;
  padding: 14px;
  background: var(--primary-color);
  color: var(--bg-darker);
  border: none;
  border-radius: 4px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.8rem;

  &:disabled {
    background: var(--bg-darker);
    color: var(--text-dark);
    border: 1px solid var(--border-color);
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--gold-bright);
    box-shadow: 0 0 20px var(--primary-glow);
  }
`;

// --- Componente ---

export const ArsenalItem = ({ produto, onVender }: any) => {
  if (!produto) return null;

  const estoqueAtual = Number(produto.estoque_qtd || 0);
  const temNoEstoque = estoqueAtual > 0;

  return (
    <ProductCard $noStock={!temNoEstoque}>
      <ImageContainer $noStock={!temNoEstoque}>
        <Badge $type={temNoEstoque ? "stock" : "out"}>
          {temNoEstoque ? `${estoqueAtual} EM ESTOQUE` : "INDISPONÍVEL"}
        </Badge>

        {produto.imagem_url ? (
          <img src={produto.imagem_url} alt={produto.nome} />
        ) : (
          <Package size={48} color="var(--text-dark)" strokeWidth={1} />
        )}
      </ImageContainer>

      <ProductInfo>
        <h4>{produto.nome}</h4>
        <span className="category">
          {produto.marca} // {produto.categoria}
        </span>
      </ProductInfo>

      <PriceTag>
        <span>R$</span> {Number(produto.preco || 0).toFixed(2)}
      </PriceTag>

      <AddButton disabled={!temNoEstoque} onClick={() => onVender(produto)}>
        {temNoEstoque ? (
          <>
            <Plus size={18} strokeWidth={3} />
            <span>Adicionar</span>
          </>
        ) : (
          <>
            <Ban size={18} />
            <span>Sem Unidades</span>
          </>
        )}
      </AddButton>
    </ProductCard>
  );
};
