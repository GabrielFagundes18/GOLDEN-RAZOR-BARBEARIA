import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";

import {
  HiOutlineChevronLeft,
  HiOutlineLightningBolt,
  HiStar,
  HiInformationCircle,
} from "react-icons/hi";
import { FaYoutube, FaWhatsapp } from "react-icons/fa";

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(0, 255, 136, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--bg-color, #0a0a0a);
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  color: var(--text-color, #ffffff);
  padding: 60px 20px;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 30px 15px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  background: radial-gradient(
    circle,
    rgba(0, 255, 136, 0.1) 0%,
    transparent 70%
  );
  border-radius: 40px;
  padding: 40px;
  border: 1px solid var(--border-color, #333);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  img {
    width: 100%;
    max-width: 450px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 20px 50px rgba(0, 0, 0, 0.5));
    animation: ${float} 6s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    padding: 20px;
    img {
      max-width: 300px;
    }
  }
`;

const BaseButton = styled(motion.button)`
  border: none;
  height: 65px;
  border-radius: 20px;
  font-weight: 900;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: 100%;

  &:disabled {
    background: #222 !important;
    color: #555 !important;
    cursor: not-allowed;
    animation: none !important;
    box-shadow: none !important;
  }
`;

const PurchaseButton = styled(BaseButton)`
  background: var(--primary-color, #00ff88);
  color: #000;
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2);
  animation: ${(props) => (props.disabled ? "none" : pulse)} 2s infinite;

  &:hover:not(:disabled) {
    background: #ffffff;
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 255, 255, 0.2);
  }
`;

const Badge = styled.span<{ $type?: "gold" | "primary" }>`
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;

  background: ${(props) =>
    props.$type === "gold"
      ? "rgba(255, 215, 0, 0.1)"
      : "rgba(0, 255, 136, 0.1)"};
  color: ${(props) => (props.$type === "gold" ? "#ffd700" : "#00ff88")};
  border: 1px solid
    ${(props) => (props.$type === "gold" ? "#ffd70044" : "#00ff8844")};
`;

const SpecGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin: 10px 0;
`;

const SpecItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 12px;
;

  label {
    display: block;
    font-size: 9px;
    color: #888;
    margin-bottom: 4px;
    text-transform: uppercase;
  }
  span {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
  }
`;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error } = useFetch<any>(`/produtos/${id}`);

  const handlePurchase = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `SOLICITAÇÃO DE EQUIPAMENTO\nID: ${product.id}\nITEM: ${product.nome}`,
    );
    window.open(`https://wa.me/5511999999999?text=${message}`, "_blank");
  };

  if (loading)
    return (
      <PageWrapper>
        <div style={{ textAlign: "center", paddingTop: "100px" }}>
          <HiOutlineLightningBolt
            size={50}
            color="#00ff88"
            className="spin-slow"
          />
          <h2
            className="sync"
            style={{
              fontSize: "14px",
              marginTop: "20px",
              letterSpacing: "2px",
            }}
          >
            SCANNING DATABASE...
          </h2>
        </div>
      </PageWrapper>
    );

  if (error || !product)
    return (
      <PageWrapper>
        <div
          style={{
            textAlign: "center",
            maxWidth: "400px",
            paddingTop: "100px",
          }}
        >
          <HiInformationCircle size={60} color="#ff4444" />
          <h2 className="sync" style={{ margin: "20px 0" }}>
            SINAL PERDIDO
          </h2>
          <p style={{ color: "#888", marginBottom: "30px" }}>
            Equipamento não localizado no inventário.
          </p>
          <PurchaseButton onClick={() => navigate("/produtos")}>
            VOLTAR AO ARSENAL
          </PurchaseButton>
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: "1100px", width: "100%" }}
      >
        <button
          onClick={() => navigate("/produtos")}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "30px",
            fontWeight: "900",
            fontSize: "12px",
          }}
        >
          <HiOutlineChevronLeft size={18} /> VOLTAR PARA PRODUTOS
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px",
            alignItems: "start",
          }}
        >
          <div style={{ position: "sticky", top: "40px" }}>
            <ImageContainer>
              <img src={product.imagem_url} alt={product.nome} />
            </ImageContainer>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "25px" }}
          >
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Badge>{product.marca || "ELITE"}</Badge>
              <Badge $type="gold">
                <HiStar /> {product.avaliacao || "5.0"}
              </Badge>
            </div>

            <h1
              className="sync"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                lineHeight: "1.1",
              }}
            >
              {product.nome}
            </h1>

            <p
              style={{
                color: "#aaa",
                fontSize: "1rem",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {product.descricao_longa || product.descricao}
            </p>

            <div>
              <label
                style={{
                  fontSize: "10px",
                  color: "#00ff88",
                  fontWeight: "900",
                  letterSpacing: "1px",
                }}
              >
                INVESTIMENTO TÁTICO
              </label>
              <div
                className="sync"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: "900",
                  marginTop: "5px",
                }}
              >
                <span
                  style={{
                    fontSize: "1.2rem",
                    opacity: 0.5,
                    marginRight: "5px",
                  }}
                >
                  R$
                </span>
                {Number(product.preco).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>

            {product.especificacoes && (
              <div>
                <label
                  style={{
                    fontSize: "10px",
                    color: "#666",
                    fontWeight: "900",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  ESPECIFICAÇÕES TÉCNICAS
                </label>
                <SpecGrid>
                  {Object.entries(product.especificacoes).map(
                    ([key, value]: any, i) => (
                      <SpecItem
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <label>{key.replace(/_/g, " ")}</label>
                        <span>{value}</span>
                      </SpecItem>
                    ),
                  )}
                </SpecGrid>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              <PurchaseButton
                onClick={handlePurchase}
                disabled={!product.em_estoque}
                whileTap={{ scale: 0.97 }}
              >
                {product.em_estoque ? (
                  <>
                    <FaWhatsapp size={20} /> SOLICITAR ITEM
                  </>
                ) : (
                  "ITEM ESGOTADO"
                )}
              </PurchaseButton>

              {product.video_url && (
                <a
                  href={product.video_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: "80px",
                    height: "65px",
                    background: "rgba(255, 68, 68, 0.1)",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ff4444",
                    border: "1px solid rgba(255, 68, 68, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <FaYoutube size={26} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
