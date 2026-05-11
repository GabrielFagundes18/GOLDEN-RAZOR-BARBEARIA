import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";

import {
  HiOutlineChevronLeft,
  HiStar,
  HiInformationCircle,
} from "react-icons/hi";
import { FaYoutube, FaWhatsapp } from "react-icons/fa";

// --- INTERFACE PARA O SEU JSON ---
interface Product {
  id: number;
  nome: string;
  preco: string | number;
  categoria: string;
  info: string;
  imagem_url: string | null;
  estoque_qtd: number;
  marca: string;
  avaliacao: string;
  video_url: string | null;
  descricao_longa: string;
  especificacoes: Record<string, string>;
  em_estoque: boolean;
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tipando o useFetch com a nossa interface
  const { data: product, loading } = useFetch<Product>(`/produtos/${id}`);

  if (loading || !product) return <Loading>SCANNING ARSENAL...</Loading>;

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Olá! Tenho interesse no item: ${product.nome} (Ref: ${product.id})`,
    );
    // Substitua pelo seu número real
    window.open(`https://wa.me/5511999999999?text=${msg}`, "_blank");
  };

  return (
    <PageWrapper>
      <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <BackButton onClick={() => navigate("/client/produtos")}>
          <HiOutlineChevronLeft size={20} /> VOLTAR AO ARSENAL
        </BackButton>

        <MainGrid>
          <ImageSection>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={
                product.imagem_url ||
                "https://via.placeholder.com/400?text=Sem+Imagem"
              }
              alt={product.nome}
            />
          </ImageSection>

          <ContentSection>
            <BadgeGroup>
              <Tag>{product.marca}</Tag>
              <Tag $gold>
                <HiStar /> {product.avaliacao}
              </Tag>
              <Tag style={{ color: "#888" }}>
                {product.categoria.toUpperCase()}
              </Tag>
            </BadgeGroup>

            <h1>{product.nome}</h1>

            {/* Info Curta */}
            <h3 style={{ color: "var(--primary-color)", fontSize: "1.1rem" }}>
              {product.info}
            </h3>

            {/* Descrição Longa */}
            <p className="desc">{product.descricao_longa}</p>

            {/* Especificações Técnicas (Mapeando o objeto JSON) */}
            {product.especificacoes &&
              Object.keys(product.especificacoes).length > 0 && (
                <SpecBox>
                  <label>
                    <HiInformationCircle /> ESPECIFICAÇÕES
                  </label>
                  <div className="spec-grid">
                    {Object.entries(product.especificacoes).map(
                      ([key, value]) => (
                        <div className="spec-item" key={key}>
                          <span className="key">{key}:</span>
                          <span className="val">{value}</span>
                        </div>
                      ),
                    )}
                  </div>
                </SpecBox>
              )}

            <PriceArea>
              <label>INVESTIMENTO</label>
              <div className="value">R$ {Number(product.preco).toFixed(2)}</div>
            </PriceArea>

            <ActionGroup>
              <BuyButton
                onClick={handleWhatsApp}
                disabled={!product.em_estoque}
                whileTap={{ scale: 0.97 }}
              >
                <FaWhatsapp size={20} />
                {product.em_estoque
                  ? "SOLICITAR VIA WHATSAPP"
                  : "ESGOTADO NO ESTOQUE"}
              </BuyButton>

              {product.video_url && (
                <YouTubeBtn href={product.video_url} target="_blank">
                  <FaYoutube size={24} />
                </YouTubeBtn>
              )}
            </ActionGroup>
          </ContentSection>
        </MainGrid>
      </Container>
    </PageWrapper>
  );
}

// --- ESTILOS ADICIONAIS ---

const SpecBox = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 900;
    color: #444;
    margin-bottom: 10px;
  }

  .spec-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .spec-item {
    display: flex;
    flex-direction: column;
    .key {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
    }
    .val {
      font-size: 13px;
      color: #fff;
      font-weight: bold;
    }
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const YouTubeBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  background: rgba(255, 0, 0, 0.1);
  color: #ff0000;
  border: 1px solid rgba(255, 0, 0, 0.2);
  border-radius: 15px;
  transition: 0.3s;
  &:hover {
    background: #ff0000;
    color: #fff;
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  color: #fff;
`;
const Container = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
`;
const BackButton = styled.button`
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  margin-bottom: 20px;
  transition: 0.3s;
  &:hover {
    color: var(--primary-color);
  }
`;
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;
const ImageSection = styled.div`
  background: #111;
  border-radius: 30px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
`;
const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  h1 {
    font-size: 3rem;
    margin: 0;
    line-height: 1;
  }
  .desc {
    color: #888;
    line-height: 1.6;
    font-size: 1rem;
  }
`;
const PriceArea = styled.div`
  label {
    font-size: 10px;
    color: var(--primary-color);
    font-weight: 900;
  }
  .value {
    font-size: 3.5rem;
    font-weight: 900;
    font-family: "Rajdhani", sans-serif; 
  }
`;
const BuyButton = styled(motion.button)`
  flex: 1;
  background: var(--primary-color);
  color: #000;
  border: none;
  padding: 20px;
  border-radius: 15px;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  &:disabled {
    background: #222;
    color: #555;
    cursor: not-allowed;
  }
`;
const BadgeGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;
const Tag = styled.span<{ $gold?: boolean }>`
  background: ${(p) =>
    p.$gold ? "rgba(255,215,0,0.1)" : "rgba(0,255,136,0.1)"};
  color: ${(p) => (p.$gold ? "#ffd700" : "#00ff88")};
  padding: 5px 15px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid ${(p) => (p.$gold ? "#ffd70044" : "#00ff8844")};
`;
const Loading = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-weight: 900;
  background: #0a0a0a;
`;
