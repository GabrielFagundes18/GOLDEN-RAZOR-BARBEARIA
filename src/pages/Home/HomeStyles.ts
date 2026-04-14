import { createGlobalStyle, keyframes } from "styled-components";

export const THEME = {
  bg: "#020202", // Preto ainda mais profundo
  surface: "rgba(15, 15, 15, 0.6)", // Semi-transparente para Glassmorphism
  accent: "#e11d48",
  accent_glow: "rgba(225, 29, 72, 0.5)",
  border: "rgba(255, 255, 255, 0.08)",
  text_dim: "#999",
};

export const shine = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const HomeGlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body { 
    background-color: ${THEME.bg}; 
    color: #fff;
    margin: 0;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3 { font-family: 'Syncopate', sans-serif; font-weight: 700; margin: 0; }
  
  /* Scrollbar Customizada */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #000; }
  ::-webkit-scrollbar-thumb { background: ${THEME.accent}; border-radius: 10px; }
`;
