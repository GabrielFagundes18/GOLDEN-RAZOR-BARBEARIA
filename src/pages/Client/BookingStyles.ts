import styled, { keyframes } from "styled-components";

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

export const Container = styled.div`
  background: var(--bg-color);
  color: var(--text-color);
  padding: 20px;
  border-radius: 20px;
  max-width: 450px;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);

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
        rgba(255, 0, 0, 0.04),
        rgba(0, 255, 0, 0.01),
        rgba(0, 0, 255, 0.04)
      );
    z-index: 2;
    background-size:
      100% 2px,
      3px 100%;
    pointer-events: none;
    opacity: 0.5;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent,
      var(--scanline-color),
      transparent
    );
    opacity: 0.1;
    z-index: 3;
    pointer-events: none;
    animation: ${scanline} 8s linear infinite;
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
  position: relative;
  z-index: 5;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: var(--bg-darker);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
    box-shadow: 0 0 5px var(--primary-glow);
  }
`;

export const Card = styled.div<{ $active?: boolean }>`
  background: ${(props) =>
    props.$active ? "var(--primary-glow)" : "var(--card-glass)"};
  border: 1px solid
    ${(props) =>
      props.$active ? "var(--primary-color)" : "var(--border-color)"};
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  position: relative;
  z-index: 5;
  backdrop-filter: blur(4px);

  &:hover {
    border-color: var(--primary-color);
    transform: translateX(5px);
    box-shadow: -5px 0 15px -5px var(--primary-glow);
  }

  strong {
    font-size: 0.85rem;
    color: ${(props) =>
      props.$active ? "var(--primary-color)" : "var(--text-color)"};
    transition: color 0.3s ease;
  }

  p {
    color: var(--text-muted);
  }
`;
