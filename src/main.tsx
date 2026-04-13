import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStyles } from './styles/GlobalStyles';
import { ClerkProvider } from '@clerk/clerk-react';

// Pegando a chave e garantindo que o TS entenda que é uma string
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

// Log para debug (aparecerá no F12 para confirmar se a chave chegou)
console.log("Status da Chave Clerk:", PUBLISHABLE_KEY ? "✅ Carregada" : "❌ Falhou");

if (!PUBLISHABLE_KEY) {
  throw new Error("Erro Crítico: A variável VITE_CLERK_PUBLISHABLE_KEY não foi definida no .env.local");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* O Provider deve envolver toda a aplicação */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <GlobalStyles />
      <App />
    </ClerkProvider>
  </React.StrictMode>
);