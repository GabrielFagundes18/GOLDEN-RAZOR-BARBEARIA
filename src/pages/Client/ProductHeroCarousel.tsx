import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  HiLightningBolt,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";

// --- STYLED COMPONENTS ---

const CarouselWrapper = styled.div`
  width: 100%;
  min-height: 520px;
  background: var(--bg-darker);
  border-radius: 40px;
  border: 1px solid var(--border-bright);
  position: relative;
  overflow: hidden;
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7);

  /* Efeito de Scanline (Linhas Táticas) */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.1) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 10;
    opacity: 0.3;
  }

  /* Brilho Dinâmico de Fundo */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      var(--primary-glow) 0%,
      transparent 60%
    );
    z-index: 1;
    pointer-events: none;
    transition: background 0.2s ease;
  }
`;

const SlideContent = styled(motion.div)`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  padding: 80px;
  height: 100%;
  align-items: center;
  gap: 40px;
  position: relative;
  z-index: 5;

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
    background: linear-gradient(90deg, var(--primary-glow), transparent);
    border-left: 3px solid var(--primary-color);
    padding: 8px 16px;
    border-radius: 2px;
    color: var(--primary-color);
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 24px;
  }

  h2 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    color: var(--text-color);
    margin: 0;
    line-height: 0.9;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
  }

  p {
    color: var(--text-muted);
    line-height: 1.6;
    margin: 25px 0;
    font-size: 1rem;
    max-width: 480px;
    font-family: "Inter", sans-serif;
  }
`;

const PriceTag = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  border-left: 1px solid var(--border-bright);

  .label {
    font-family: "Syncopate", sans-serif;
    font-size: 9px;
    color: var(--text-dark);
    font-weight: 800;
    letter-spacing: 2px;
  }
  .value {
    font-family: "Bebas Neue", sans-serif;
    font-size: 3.2rem;
    line-height: 1;
    color: var(--text-color);
    span {
      color: var(--primary-color);
      font-size: 1.5rem;
      margin-right: 4px;
    }
  }
`;

const ImageBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  background: rgba(255, 255, 255, 0.02);

  /* Formato Tático Octogonal */
  clip-path: polygon(
    15px 0%,
    100% 0%,
    100% calc(100% - 15px),
    calc(100% - 15px) 100%,
    0% 100%,
    0% 15px
  );
  border: 1px solid var(--border-bright);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-top: 2px solid var(--primary-color);
    border-left: 2px solid var(--primary-color);
  }

  img {
    width: 110%;
    max-height: 380px;
    object-fit: contain;
    z-index: 2;
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.8));
  }

  .glow-circle {
    position: absolute;
    width: 250px;
    height: 250px;
    background: var(--primary-color);
    filter: blur(100px);
    opacity: 0.15;
    z-index: 1;
  }
`;

const ActionBtn = styled(motion.button)`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 16px 35px;
  border-radius: 4px;
  font-family: "Syncopate", sans-serif;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 0.7rem;
  letter-spacing: 2px;
  box-shadow: 0 10px 20px var(--primary-glow);
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
  }

  &:hover::after {
    transform: translateX(100%);
    transition: 0.6s;
  }
`;

const NavDots = styled.div`
  position: absolute;
  left: 80px;
  bottom: 40px;
  display: flex;
  gap: 10px;
  z-index: 15;
`;

const Dot = styled.div<{ $active: boolean }>`
  width: ${(props) => (props.$active ? "40px" : "10px")};
  height: 5px;
  background: ${(props) =>
    props.$active ? "var(--primary-color)" : "var(--border-bright)"};
  border-radius: 10px;
  transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
    props.$active ? "0 0 10px var(--primary-color)" : "none"};
`;

// --- COMPONENTE PRINCIPAL ---

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  if (featured.length === 0) return null;
  const current = featured[index];

  return (
    <CarouselWrapper onMouseMove={handleMouseMove}>
      <AnimatePresence mode="wait">
        <SlideContent
          key={current.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <InfoBox>
            <motion.div
              className="badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <HiLightningBolt /> {current.marca || "ARSENAL PREMIUM"}
            </motion.div>

            <h2 className="sync">{current.nome}</h2>
            <p>{current.info}</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "30px",
                flexWrap: "wrap",
              }}
            >
              <PriceTag>
                <span className="label">VALOR DE ELITE</span>
                <span className="value">
                  <span>R$</span>
                  {Number(current.preco).toFixed(2)}
                </span>
              </PriceTag>

              <ActionBtn
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/produtos/${current.id}`)}
              >
                <FaShoppingCart /> ADQUIRIR AGORA
              </ActionBtn>
            </div>
          </InfoBox>

          <ImageBox>
            <div className="glow-circle" />
            <motion.img
              key={`img-${current.id}`}
              initial={{ scale: 0.8, opacity: 0, rotate: 10 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
                y: [0, -15, 0],
              }}
              whileHover={{ rotateY: 15, scale: 1.1 }}
              transition={{
                duration: 0.8,
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              }}
              src={current.imagem_url}
              alt={current.nome}
            />
          </ImageBox>
        </SlideContent>
      </AnimatePresence>

      <NavDots>
        {featured.map((_, i) => (
          <Dot key={i} $active={index === i} />
        ))}
      </NavDots>

      {/* Barra de Progresso Laser */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "2px",
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <motion.div
          key={`bar-${index}`}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, ease: "linear" }}
          style={{
            height: "100%",
            background: "var(--primary-color)",
            boxShadow: "0 0 15px var(--primary-color)",
          }}
        />
      </div>
    </CarouselWrapper>
  );
}
