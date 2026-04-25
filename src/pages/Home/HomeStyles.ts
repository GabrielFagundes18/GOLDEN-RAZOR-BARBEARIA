import { createGlobalStyle, keyframes } from "styled-components";

export const shine = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const HomeGlobalStyle = createGlobalStyle`
  * { 
    box-sizing: border-box; 
  }

  body { 
    background-color: var(--bg-color); 
    color: var(--text-color);
    margin: 0;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  h1, h2, h3 { 
    font-family: 'Syncopate', sans-serif; 
    font-weight: 700; 
    margin: 0; 
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  /* Seleção de Texto */
  ::selection {
    background-color: var(--primary-color);
    color: var(--text-color);
  }
  
  /* Scrollbar Customizada (Estilo Tático) */
  ::-webkit-scrollbar { 
    width: 6px; 
  }

  ::-webkit-scrollbar-track { 
    background: var(--bg-color); 
  }

  ::-webkit-scrollbar-thumb { 
    background: var(--primary-color); 
    border-radius: 10px;
    box-shadow: 0 0 10px var(--primary-glow);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
  }
`;