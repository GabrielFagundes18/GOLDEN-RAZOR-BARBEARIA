import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStyles } from './styles/GlobalStyles';
import { ClerkProvider } from '@clerk/clerk-react';
import { ptBR } from '@clerk/localizations'; 

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;


if (!PUBLISHABLE_KEY) {
  throw new Error("Erro Crítico: A variável VITE_CLERK_PUBLISHABLE_KEY não foi definida no .env.local");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      localization={ptBR}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
  redirectUrl="/"
    >
      <GlobalStyles />
      <App />
    </ClerkProvider>
  </React.StrictMode>
);