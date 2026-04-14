import styled from "styled-components";
import { motion } from "framer-motion";
import { THEME } from "./HomeStyles";

export const MainButton = styled(motion.button)<{ $primary?: boolean }>`
  padding: 20px 45px;
  font-family: 'Syncopate', sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 3px;
  cursor: pointer;
  border-radius: 2px; /* Pontas secas para ar mais agressivo/premium */
  border: ${props => props.$primary ? 'none' : `1px solid ${THEME.border}`};
  background: ${props => props.$primary ? THEME.accent : 'transparent'};
  color: #fff;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    box-shadow: ${props => props.$primary ? `0 0 40px ${THEME.accent_glow}` : 'inset 0 0 15px rgba(255,255,255,0.1)'};
    transform: translateY(-3px) scale(1.02);
    letter-spacing: 5px;
  }
`;

export const PriceCard = styled.div`
  background: ${THEME.surface};
  backdrop-filter: blur(15px); /* Efeito de vidro */
  border: 1px solid ${THEME.border};
  padding: 50px 40px;
  border-radius: 4px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: 0.5s;

  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at top right, rgba(225, 29, 72, 0.1), transparent);
    opacity: 0;
    transition: 0.5s;
  }

  h3 { font-size: 0.9rem; letter-spacing: 2px; margin-bottom: 20px; z-index: 1; position: relative; }
  p { font-size: 0.85rem; color: ${THEME.text_dim}; z-index: 1; position: relative; }
  
  .price { 
    margin-top: 35px; 
    font-size: 1.8rem;
    color: #fff;
    font-weight: 900;
    text-shadow: 0 0 15px ${THEME.accent_glow};
  }

  &:hover {
    border-color: ${THEME.accent};
    transform: translateY(-10px);
    &::before { opacity: 1; }
  }
`;