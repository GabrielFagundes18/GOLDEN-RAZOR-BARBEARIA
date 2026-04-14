import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  HiLightningBolt,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";

// --- ESTILOS REFINADOS ---

const CarouselWrapper = styled.div`
  width: 100%;
  min-height: 480px;
  background: #050505;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7);

  /* Background Decorativo Estilo Radar */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(
        circle at 20% 30%,
        rgba(225, 29, 72, 0.08) 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba(225, 29, 72, 0.05) 0%,
        transparent 40%
      );
    pointer-events: none;
  }
`;

const SlideContent = styled(motion.div)`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  padding: 80px;
  height: 100%;
  align-items: center;
  gap: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    padding: 60px 32px;
    text-align: center;
  }
`;

const InfoBox = styled.div`
  position: relative;
  z-index: 5;

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(90deg, rgba(225, 29, 72, 0.2), transparent);
    border-left: 3px solid #e11d48;
    padding: 8px 16px;
    border-radius: 4px;
    color: #e11d48;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 24px;
  }

  h2 {
    font-size: clamp(2rem, 5vw, 4rem);
    color: #fff;
    font-weight: 900;
    margin: 0;
    line-height: 0.9;
    letter-spacing: -2px;
  }

  p {
    color: #888;
    line-height: 1.5;
    margin: 25px 0;
    font-size: 1.1rem;
    max-width: 520px;
    font-weight: 400;
  }
`;

const PriceTag = styled.div`
  display: flex;
  flex-direction: column;

  .label {
    font-size: 10px;
    color: #444;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .value {
    font-size: 2.2rem;
    font-weight: 900;
    color: #fff;
    span {
      color: #e11d48;
      font-size: 1.2rem;
      margin-right: 5px;
    }
  }
`;

const ImageBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 120%;
    max-height: 380px;
    object-fit: contain;
    z-index: 2;
    filter: drop-shadow(0 40px 80px rgba(0, 0, 0, 1));
  }

  .glow {
    position: absolute;
    width: 300px;
    height: 300px;
    background: #e11d48;
    filter: blur(150px);
    opacity: 0.2;
    z-index: 1;
  }
`;

const NavDots = styled.div`
  position: absolute;
  left: 80px;
  bottom: 40px;
  display: flex;
  gap: 8px;

  @media (max-width: 968px) {
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Dot = styled.div<{ $active: boolean }>`
  width: ${(props) => (props.$active ? "30px" : "8px")};
  height: 4px;
  background: ${(props) =>
    props.$active ? "#e11d48" : "rgba(255,255,255,0.1)"};
  border-radius: 10px;
  transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const ControlCenter = styled.div`
  position: absolute;
  bottom: 30px;
  right: 80px;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 10;

  @media (max-width: 968px) {
    display: none; // Escondido no mobile para limpar a UI
  }
`;

const ActionBtn = styled(motion.button)`
  background: #fff;
  color: #000;
  border: none;
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 0.85rem;
  letter-spacing: 1px;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
`;

// --- COMPONENTE ---

export default function ProductHeroCarousel({ products }: { products: any[] }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const featured = useMemo(
    () => products?.filter((p) => p.em_estoque).slice(0, 6) || [],
    [products],
  );

  const handleNext = () =>
    setIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
  const handlePrev = () =>
    setIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(handleNext, 8000);
    return () => clearInterval(timer);
  }, [featured.length, index]);

  if (featured.length === 0) return null;

  const current = featured[index];

  return (
    <CarouselWrapper>
      <AnimatePresence mode="wait">
        <SlideContent
          key={current.id}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8 }}
        >
          <InfoBox>
            <div className="badge">
              <HiLightningBolt /> {current.marca || "Equipamento Pro"}
            </div>

            <h2 className="sync">{current.nome}</h2>

            <p>{current.info}</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "40px",
                flexWrap: "wrap",
              }}
            >
              <PriceTag>
                <span className="label">INVESTIMENTO</span>
                <span className="value">
                  <span>R$</span>
                  {Number(current.preco).toFixed(2)}
                </span>
              </PriceTag>

              <ActionBtn
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/produtos/${current.id}`)}
              >
                <FaShoppingCart /> VER DETALHES
              </ActionBtn>
            </div>
          </InfoBox>

          <ImageBox>
            <div className="glow" />
            <motion.img
              key={`img-${current.id}`}
              initial={{ x: 100, opacity: 0, rotate: 10, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
              src={current.imagem_url}
              alt={current.nome}
              onClick={() => navigate(`/produtos/${current.id}`)}
              style={{ cursor: "pointer" }}
            />
          </ImageBox>
        </SlideContent>
      </AnimatePresence>

      <NavDots>
        {featured.map((_, i) => (
          <Dot key={i} $active={index === i} />
        ))}
      </NavDots>

      <ControlCenter>
        <button
          onClick={handlePrev}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            cursor: "pointer",
            color: "#fff",
            
          }}
        >
          <HiOutlineChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          style={{
           background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <HiOutlineChevronRight size={24} />
        </button>
      </ControlCenter>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <motion.div
          key={`bar-${index}`}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, ease: "linear" }}
          style={{
            height: "100%",
            background: "#e11d48",
            boxShadow: "0 0 15px #e11d48",
          }}
        />
      </div>
    </CarouselWrapper>
  );
}
