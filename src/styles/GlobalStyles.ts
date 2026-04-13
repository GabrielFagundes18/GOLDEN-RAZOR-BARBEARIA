import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* Tons de Base (Profundidade) */
    --bg-color: #050505;          /* Preto Profundo */
    --card-color: #0a0a0a;        /* Superfície Obsidian */
    --border-color: rgb(255, 255, 255);
    
    /* Cores de Ação (Agressividade) */
    --primary-color: #e11d48;     /* Crimson Red (Vibrante) */
    --primary-glow: rgba(225, 29, 72, 0.4);
    --secondary-color: #9f1239;   /* Vinho Profundo */
    
    /* Tipografia */
    --text-color: #ffffff;
    --text-muted: #666666;
    --error-color: #ff0000;
  }

  * {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
  }

  body {
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: 'Inter', sans-serif;
    margin: 0;
    overflow-x: hidden;
  }

  /* Fonte para Headers e Logos (Se não tiver, importe no index.html) */
  .sync {
    font-family: 'Syncopate', sans-serif;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  /* Botão de Elite */
  button {
    background: var(--primary-color);
    color: #fff;
    font-family: 'Syncopate', sans-serif;
    font-size: 0.7rem;
    font-weight: bold;
    letter-spacing: 1px;
    border: none;
    border-radius: 4px;
    padding: 12px 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 15px rgba(225, 29, 72, 0.1);
    
    &:hover {
      background: #f43f5e; /* Um vermelho um pouco mais claro no hover */
      box-shadow: 0 0 25px var(--primary-glow);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: #1a1a1a;
      color: #444;
      cursor: not-allowed;
      box-shadow: none;
    }
  }

  /* Scrollbar Customizada (Dark Mode) */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg-color);
  }
  ::-webkit-scrollbar-thumb {
    background: #1a1a1a;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color);
  }
`;