import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`

:root {
  --bg-color: #030303;
  --bg-darker: #050505;
  --card-color: #0a0a0a;
  --card-glass: rgba(13, 13, 13, 0.7);
  
  --border-color: rgba(255, 255, 255, 0.05);
  --border-bright: rgba(255, 255, 255, 0.1);
  
  --primary-color: #e11d48;
  --primary-glow: rgba(225, 29, 72, 0.4);
  --secondary-color: #9f1239;
  
  --gold-color: #D4AF37;
  --gold-bright: #FFD700;
  --gold-glow: rgba(212, 175, 55, 0.2);
  
  --text-color: #ffffff;
  --text-muted: #666666;
  --text-dark: #444444;
  
  --success-color: #22c55e;
  --error-color: #ff0000;
  --pending-color: #e11d48;
  
  --scanline-color: rgba(255, 255, 255, 0.03);
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