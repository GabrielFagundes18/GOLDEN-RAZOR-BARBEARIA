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