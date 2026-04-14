import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";

import {
  HiOutlineChevronLeft,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineTruck,
  HiStar,
  HiCube,
} from "react-icons/hi";
import { FaShoppingCart, FaYoutube, FaWhatsapp } from "react-icons/fa";

// --- ANIMAÇÕES ---
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

// --- ESTILOS ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top right, #0a0a0a 0%, #030303 100%);
  color: #fff;
  padding: 60px 40px;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ImageSection = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.01);
  border-radius: 48px;
  padding: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  height: fit-content;

  .glow-bg {
    position: absolute;
    width: 300px;
    height: 300px;
    background: #e11d48;
    filter: blur(150px);
    opacity: 0.15;
    z-index: 0;
  }

  img {
    z-index: 1;
    max-width: 100%;
    max-height: 500px;
    object-fit: contain;
    filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.9));
    animation: ${float} 6s ease-in-out infinite;
  }
`;

const SpecCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  .spec-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.2);
    label {
      font-size: 9px;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    span {
      font-size: 13px;
      color: #ddd;
      font-weight: 600;
    }
  }
`;

const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 10px;

  .trust-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);

    svg {
      color: #e11d48;
      font-size: 20px;
    }
    span {
      font-size: 10px;
      font-weight: 700;
      color: #666;
      text-transform: uppercase;
    }
  }
`;

const MainActionButton = styled(motion.button)`
  background: #e11d48;
  color: #fff;
  border: none;
  height: 65px;
  border-radius: 20px;
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(225, 29, 72, 0.3);
  transition: 0.3s;

  &:hover {
    background: #f43f5e;
    transform: translateY(-2px);
  }
  &:disabled {
    background: #222;
    cursor: not-allowed;
    box-shadow: none;
    color: #444;
  }
`;

// --- COMPONENTE ---

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error } = useFetch<any>(`/produtos/${id}`);

  // Função para lidar com o "clique de compra"
  const handlePurchase = () => {
    if (!product) return;

    // Aqui você pode redirecionar para o WhatsApp com uma mensagem automática
    const message = encodeURIComponent(
      `Olá! Tenho interesse no equipamento: ${product.nome}`,
    );
    window.open(`https://wa.me/SEUNUMEROAQUI?text=${message}`, "_blank");
  };

  if (loading)
    return (
      <PageWrapper>
        <div style={{ textAlign: "center" }}>
          <HiOutlineLightningBolt
            size={40}
            color="#e11d48"
            className="spin-slow"
          />
          <p className="sync">SINCRONIZANDO ARSENAL...</p>
        </div>
      </PageWrapper>
    );

  if (error || !product)
    return (
      <PageWrapper>
        <div style={{ textAlign: "center" }}>
          <h2 className="sync">EQUIPAMENTO NÃO LOCALIZADO</h2>
          <MainActionButton
            onClick={() => navigate("/produtos")}
            style={{ marginTop: "20px", padding: "0 30px" }}
          >
            VOLTAR AO ARSENAL
          </MainActionButton>
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <div style={{ maxWidth: "1300px", width: "100%" }}>
        <button
          onClick={() => navigate("/produtos")}
          style={{
            background: "none",
            border: "none",
            color: "#444",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "30px",
            fontSize: "12px",
            fontWeight: "900",
          }}
        >
          <HiOutlineChevronLeft size={18} /> VOLTAR AO ARSENAL
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "60px",
          }}
        >
          <ImageSection>
            <div className="glow-bg" />
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={product.imagem_url}
              alt={product.nome}
            />
          </ImageSection>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "25px" }}
          >
            <div>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
              >
                <span
                  style={{
                    background: "#e11d48",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    fontSize: "10px",
                    fontWeight: "900",
                  }}
                >
                  {product.marca?.toUpperCase() || "ELITE"}
                </span>
                <span
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#facc15",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    fontSize: "10px",
                    fontWeight: "900",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <HiStar /> {product.avaliacao || "5.0"}
                </span>
              </div>
              <h1
                className="sync"
                style={{
                  fontSize: "3rem",
                  fontWeight: "900",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {product.nome}
              </h1>
            </div>

            <p
              style={{
                color: "#777",
                fontSize: "1rem",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              {product.descricao_longa ||
                product.info ||
                "Equipamento tático de alta performance, projetado para durabilidade extrema e precisão superior em qualquer cenário de operação."}
            </p>

            <div
              className="sync"
              style={{ fontSize: "2.5rem", fontWeight: "900" }}
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  color: "#e11d48",
                  marginRight: "10px",
                }}
              >
                R$
              </span>
              {Number(product.preco).toFixed(2)}
            </div>

            {/* Especificações Técnicas */}
            {product.especificacoes && (
              <SpecCard>
                {Object.entries(product.especificacoes).map(
                  ([key, value]: any) => (
                    <div className="spec-item" key={key}>
                      <label>{key}</label>
                      <span>{value}</span>
                    </div>
                  ),
                )}
              </SpecCard>
            )}

            {/* Grid de Confiança / Benefícios */}
            <TrustGrid>
              <div className="trust-item">
                <HiOutlineShieldCheck />
                <span>
                  Garantia
                  <br />
                  Vitalícia
                </span>
              </div>
              <div className="trust-item">
                <HiOutlineTruck />
                <span>
                  Entrega
                  <br />
                  Tática
                </span>
              </div>
              <div className="trust-item">
                <HiCube />
                <span>
                  Pronta
                  <br />
                  Entrega
                </span>
              </div>
            </TrustGrid>

            {/* Ações de Compra/Contato */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 70px",
                gap: "15px",
                marginTop: "10px",
              }}
            >
              <MainActionButton
                onClick={handlePurchase}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!product.em_estoque}
              >
                {product.em_estoque ? (
                  <>
                    <FaWhatsapp size={22} />
                    SOLICITAR EQUIPAMENTO
                  </>
                ) : (
                  "FORA DE ESTOQUE"
                )}
              </MainActionButton>

              {product.video_url && (
                <a
                  href={product.video_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#111",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e11d48",
                    border: "1px solid #333",
                  }}
                >
                  <FaYoutube size={24} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
