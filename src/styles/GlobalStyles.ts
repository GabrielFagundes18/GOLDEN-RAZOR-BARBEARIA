import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`

:root {
  /* Fundo (preto elegante) */
  --bg-color: #0d0d0d;
  --bg-darker: #080808;
  --card-color: #141414;
  --card-glass: rgba(20, 20, 20, 0.85);

  /* Bordas sutis */
  --border-color: rgba(255, 255, 255, 0.06);
  --border-bright: rgba(255, 255, 255, 0.12);

  /* Cor principal (dourado moderno) */
  --primary-color: #d4af37;
  --primary-glow: rgba(212, 175, 55, 0.35);
  --secondary-color: #a88c2d;

  /* Dourado refinado */
  --gold-color: #d4af37;
  --gold-bright: #f1d77a;
  --gold-glow: rgba(212, 175, 55, 0.25);

  /* Texto (mais legível) */
  --text-color: #f9f9f9;
  --text-muted: #a1a1a1;
  --text-dark: #6b6b6b;

  /* Estados */
  --success-color: #4ade80;
  --error-color: #ef4444;
  --pending-color: #d4af37;

  /* Efeito */
  --scanline-color: rgba(255, 255, 255, 0.015);
}

 * {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: var(--bg-color);
    color: var(--text-color);
    /* Inter como fonte padrão para leitura */
    font-family: 'Inter', sans-serif;
    margin: 0;
    overflow-x: hidden;
  }

  .sync {
    font-family: 'Syncopate', sans-serif;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 700;
  }

  .bebas {
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  h1, h2, h3 {
    font-family: 'Syncopate', sans-serif;
    text-transform: uppercase;
    margin: 0;
  }

  ::selection {
    background: var(--primary-color);
    color: var(--text-color);
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-darker);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border-bright); 
    border-radius: 10px;
    transition: background 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color);
    box-shadow: 0 0 10px var(--primary-glow);
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: var(--border-bright) var(--bg-darker);
  }
`;