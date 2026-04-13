import styled from "styled-components";

// Sincronizando com as suas GlobalStyles
export const THEME = {
  accent: "var(--primary-color)", // Crimson Red (#e11d48)
  accentGlow: "var(--primary-glow)", // Glow do Vermelho
  background: "var(--bg-color)", // Preto Profundo
  cardBg: "var(--card-color)", // Superfície Obsidian
  border: "rgba(255, 255, 255, 0.05)", // Borda sutil
  text: "var(--text-color)",
  textMuted: "var(--text-muted)",
};

export const Container = styled.div`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  color: ${THEME.text};
  font-family: "Inter", sans-serif;

  /* Scrollbar customizada dentro do container */
  div::-webkit-scrollbar {
    width: 4px;
  }
  div::-webkit-scrollbar-track {
    background: transparent;
  }
  div::-webkit-scrollbar-thumb {
    background: #1a1a1a;
    border-radius: 10px;
  }
  div::-webkit-scrollbar-thumb:hover {
    background: ${THEME.accent};
  }
`;

export const Card = styled.div<{ $active?: boolean }>`
  background: ${props => props.$active ? 'rgba(225, 29, 72, 0.1)' : 'rgba(255, 255, 255, 0.02)'};
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
  }
`;
export const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 380px; /* Ajuste essa altura conforme necessário */
  overflow-y: auto;
  padding-right: 8px; /* Espaço para a scrollbar não sobrepor o card */

  /* Scrollbar Estilizada (Estilo Cyberpunk/Tático) */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.01);
  }
  &::-webkit-scrollbar-thumb {
    background: #e11d48};
    border-radius: 10px;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  background: ${THEME.cardBg};
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${THEME.border};
`;

export const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 15px;
`;
