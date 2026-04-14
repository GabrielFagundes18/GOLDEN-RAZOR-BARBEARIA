import styled, { keyframes } from "styled-components";

export const THEME = {
  accent: "#e11d48",
  background: "#050505",
  cardBg: "#0a0a0a",
  text: "#ffffff",
};

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

export const Container = styled.div`
  background: ${THEME.background};
  color: ${THEME.text};
  padding: 20px;
  border-radius: 20px;
  max-width: 450px;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
      linear-gradient(
        90deg,
        rgba(255, 0, 0, 0.06),
        rgba(0, 255, 0, 0.02),
        rgba(0, 0, 255, 0.06)
      );
    z-index: 2;
    background-size:
      100% 2px,
      3px 100%;
    pointer-events: none;
  }

  .sync {
    font-family: "Syncopate", sans-serif;
    letter-spacing: 2px;
  }
`;

export const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 350px;
  overflow-y: auto;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #111;
  }
  &::-webkit-scrollbar-thumb {
    background: ${THEME.accent};
    border-radius: 10px;
  }
`;

export const Card = styled.div<{ $active?: boolean }>`
  background: ${(props) =>
    props.$active ? "rgba(225, 29, 72, 0.1)" : THEME.cardBg};
  border: 1px solid
    ${(props) => (props.$active ? THEME.accent : "rgba(255,255,255,0.05)")};
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  position: relative;

  &:hover {
    border-color: ${THEME.accent};
    transform: translateX(5px);
  }

  strong {
    font-size: 0.85rem;
    color: ${(props) => (props.$active ? THEME.accent : "#fff")};
  }
`;
