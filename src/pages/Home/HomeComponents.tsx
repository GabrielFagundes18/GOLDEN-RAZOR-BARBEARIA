import styled from "styled-components";
import { motion } from "framer-motion";

export const MainButton = styled(motion.button)<{ $primary?: boolean }>`
  padding: 20px 45px;
  font-family: "Syncopate", sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 3px;
  cursor: pointer;
  border-radius: 2px;

  border: ${(props) =>
    props.$primary ? "none" : `1px solid var(--border-bright)`};
  background: ${(props) =>
    props.$primary ? "var(--primary-color)" : "transparent"};
  color: var(--text-color);

  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    box-shadow: ${(props) =>
      props.$primary
        ? `0 0 40px var(--primary-glow)`
        : "inset 0 0 15px var(--scanline-color)"};
    transform: translateY(-3px) scale(1.02);
    letter-spacing: 5px;

    ${(props) => !props.$primary && `border-color: var(--primary-color);`}
  }
`;

export const PriceCard = styled.div`
  /* Uso do card-glass para efeito tático */
  background: var(--card-glass);
  backdrop-filter: blur(15px);
  border: 1px solid var(--border-color);
  padding: 50px 40px;
  border-radius: 4px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: 0.5s;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at top right,
      var(--primary-glow),
      transparent
    );
    opacity: 0;
    transition: 0.5s;
  }

  h3 {
    font-size: 0.9rem;
    letter-spacing: 2px;
    margin-bottom: 20px;
    z-index: 1;
    position: relative;
    color: var(--text-color);
    font-family: "Syncopate", sans-serif;
  }

  p {
    font-size: 0.85rem;
    color: var(--text-muted);
    z-index: 1;
    position: relative;
  }

  .price {
    margin-top: 35px;
    font-size: 1.8rem;
    color: var(--text-color);
    font-weight: 900;
    font-family: "Syncopate", sans-serif;
    text-shadow: 0 0 15px var(--primary-glow);
  }

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

    &::before {
      opacity: 1;
    }
  }
`;
