import styled, { createGlobalStyle } from 'styled-components';

export const COLORS = {
  bg: '#050505',          // Preto profundo
  surface: '#0d0d0d',     // Cinza quase preto
  border: '#1a1a1a',      // Borda sutil
  primary: '#e11d48',     // Vermelho Crimson (Destaque)
  primary_glow: 'rgba(225, 29, 72, 0.15)',
  text_main: '#ffffff',
  text_dim: '#4b5563',    // Cinza para textos menos importantes
};

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${COLORS.bg};
    color: ${COLORS.text_main};
    font-family: 'Inter', sans-serif;
    margin: 0;
  }
  .sync { font-family: 'Syncopate', sans-serif; letter-spacing: 3px; }
`;

export const GlassCard = styled.div`
  background: ${COLORS.surface};
  border: 1px solid ${COLORS.border};
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: 0.3s ease;

  &:hover {
    border-color: ${COLORS.primary};
  }
`;