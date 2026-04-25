import React, { useState } from "react";
import styled from "styled-components";
import {
  X,
  PackagePlus,
  Truck,
  DollarSign,
  Calculator,
  Tag,
  Store,
  TrendingUp,
} from "lucide-react";

// --- ESTILOS ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(8px);
`;

const Container = styled.div`
  background: #0a0a0a;
  border: 1px solid #d4af37;
  padding: 2.5rem;
  border-radius: 16px;
  width: 95%;
  max-width: 650px;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.1);
  color: white;

  h2 {
    font-family: "Rajdhani", sans-serif;
    color: #d4af37;
    font-size: 1.8rem;
    margin: 0;
    text-transform: uppercase;
  }
`;

const ProductBanner = styled.div`
  background: linear-gradient(90deg, #111 0%, #000 100%);
  border: 1px solid #222;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  display: flex;
  gap: 20px;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid #d4af37;
  }

  .info {
    flex: 1;
    .name {
      font-size: 1.2rem;
      color: #fff;
      font-weight: bold;
      display: block;
    }
    .brand {
      color: #d4af37;
      font-size: 0.8rem;
      text-transform: uppercase;
    }
  }

  .stock-badge {
    text-align: center;
    padding-left: 20px;
    border-left: 1px solid #222;
    span {
      color: #666;
      font-size: 0.7rem;
      display: block;
    }
    strong {
      font-size: 1.5rem;
      color: #fff;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const Field = styled.div`
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #d4af37;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  input {
    width: 100%;
    background: #111;
    border: 1px solid #333;
    color: #fff;
    padding: 14px;
    border-radius: 8px;
    font-size: 1rem;
    &:focus {
      border-color: #d4af37;
      background: #000;
      outline: none;
    }
  }
`;

const AnalysisCard = styled.div<{ isNegative?: boolean }>`
  background: #111;
  border-radius: 12px;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  border: 1px solid #222;
  margin: 25px 0;

  .box {
    display: flex;
    flex-direction: column;
    span {
      color: #666;
      font-size: 0.7rem;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    strong {
      font-size: 1.1rem;
      color: #fff;
    }
    &.profit strong {
      color: ${(props) => (props.isNegative ? "#ff4d4d" : "#2ecc71")};
    }
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  background: #d4af37;
  color: #000;
  border: none;
  padding: 18px;
  border-radius: 8px;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: 0.3s;
  text-transform: uppercase;
  &:hover {
    background: #fff;
    transform: translateY(-2px);
  }
  &:disabled {
    background: #333;
    cursor: not-allowed;
  }
`;

interface ReporProps {
  produto: any;
  onClose: () => void;
  onConfirm: (data: any) => void;
}

export const ModalReporEstoque = ({
  produto,
  onClose,
  onConfirm,
}: ReporProps) => {
  const [data, setData] = useState({
    quantidade: 1,
    preco_custo_unitario: 0,
    fornecedor: "",
  });

  // Cálculos Garantindo que são números
  const precoVenda = Number(produto?.preco || 0);
  const custoUnitario = Number(data.preco_custo_unitario || 0);
  const qtd = Number(data.quantidade || 0);

  const lucroPorUnidade = precoVenda - custoUnitario;
  const margemPercentual =
    precoVenda > 0 ? (lucroPorUnidade / precoVenda) * 100 : 0;
  const totalInvestimento = qtd * custoUnitario;
  const lucroTotalEsperado = lucroPorUnidade * qtd;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qtd <= 0 || custoUnitario <= 0) {
      alert("Defina a quantidade e o custo unitário!");
      return;
    }
    onConfirm({
      produto_id: produto.id,
      ...data,
    });
  };

  if (!produto) return null;

  return (
    <ModalOverlay>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Reposição Estratégica</h2>
            <p style={{ color: "#666", margin: 0, fontSize: "0.8rem" }}>
              Configure a entrada de mercadoria
            </p>
          </div>
          <X color="#444" size={28} cursor="pointer" onClick={onClose} />
        </div>

        <ProductBanner>
          {produto.imagem_url ? (
            <img src={produto.imagem_url} alt={produto.nome} />
          ) : (
            <div
              style={{
                width: 80,
                height: 80,
                background: "#222",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon size={30} color="#444" />
            </div>
          )}
          <div className="info">
            <span className="brand">{produto.marca || "Sem Marca"}</span>
            <span className="name">{produto.nome}</span>
            <span
              style={{
                color: "#2ecc71",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              Venda:{" "}
              {precoVenda.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
          <div className="stock-badge">
            <span>ATUAL</span>
            <strong>{produto.estoque_qtd}</strong>
          </div>
        </ProductBanner>

        <form onSubmit={handleSubmit}>
          <Field style={{ marginBottom: "20px" }}>
            <label>
              <Truck size={16} /> Fornecedor
            </label>
            <input
              placeholder="Ex: Distribuidora Barba Real"
              value={data.fornecedor}
              onChange={(e) => setData({ ...data, fornecedor: e.target.value })}
            />
          </Field>

          <Grid>
            <Field>
              <label>
                <PackagePlus size={16} /> Quantidade
              </label>
              <input
                type="number"
                value={data.quantidade}
                onChange={(e) =>
                  setData({
                    ...data,
                    quantidade: parseInt(e.target.value) || 0,
                  })
                }
              />
            </Field>
            <Field>
              <label>
                <DollarSign size={16} /> Custo Unitário
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                onChange={(e) =>
                  setData({
                    ...data,
                    preco_custo_unitario: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Field>
          </Grid>

          <AnalysisCard isNegative={lucroPorUnidade < 0}>
            <div className="box">
              <span>Investimento</span>
              <strong>
                {totalInvestimento.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
            <div className="box profit">
              <span>Lucro Unid.</span>
              <strong>
                {lucroPorUnidade.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
            <div className="box profit">
              <span>Margem Bruta</span>
              <strong>{margemPercentual.toFixed(1)}%</strong>
            </div>
          </AnalysisCard>

          <div style={{ marginBottom: "25px", textAlign: "center" }}>
            <span
              style={{
                color: "#444",
                fontSize: "0.75rem",
                textTransform: "uppercase",
              }}
            >
              Lucro Total Previsto:{" "}
            </span>
            <strong
              style={{
                color: lucroTotalEsperado < 0 ? "#ff4d4d" : "#d4af37",
                fontSize: "1.3rem",
                marginLeft: "10px",
              }}
            >
              {lucroTotalEsperado.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </div>

          <PrimaryButton type="submit">
            <Calculator size={20} /> FINALIZAR ENTRADA
          </PrimaryButton>
        </form>
      </Container>
    </ModalOverlay>
  );
};

// Ícone de fallback se a imagem falhar
const ImageIcon = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);
