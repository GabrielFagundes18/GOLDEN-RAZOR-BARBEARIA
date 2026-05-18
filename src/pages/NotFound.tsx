import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import { ArrowLeft, LayoutDashboard, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GlobalStyle = createGlobalStyle`
  :root {
    --onyx-black: #080808;
    --onyx-card: #0f0f0f;
    --gold-primary: #d4af37;
    --gold-muted: rgba(212, 175, 55, 0.5);
    --border-subtle: rgba(255, 255, 255, 0.05);
    --text-main: #ffffff;
    --text-dim: #666666;
  }
  body { 
    background-color: var(--onyx-black);
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--text-main);
    -webkit-font-smoothing: antialiased;
  }
`;

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <GlobalStyle />
      
      {/* Elemento de iluminação de fundo sutil */}
      <Spotlight />

      <Content
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Header>
          <BrandBadge>SYSTEM ERROR</BrandBadge>
          <ErrorCode>404</ErrorCode>
        </Header>

        <Divider />

        <InfoSection>
          <h1>Recurso Indisponível</h1>
          <p>
            A página ou o diretório não foi localizado 
            em nossos servidores ou você não possui as credenciais de acesso necessárias.
          </p>
        </InfoSection>

        <ActionGroup>
          <SecondaryButton onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Voltar ao Início
          </SecondaryButton>
          
          <PrimaryButton onClick={() => navigate("/")}>
            <LayoutDashboard size={18} /> Painel de Controle
          </PrimaryButton>
        </ActionGroup>

        <Footer>
          <div className="meta">
            <ShieldAlert size={14} color="var(--gold-muted)" />
            <span>ID de Referência: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
        </Footer>
      </Content>
    </Container>
  );
};

// --- STYLED COMPONENTS (PROFISSIONAL) ---

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Spotlight = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%);
  pointer-events: none;
`;

const Content = styled(motion.div)`
  width: 100%;
  max-width: 480px;
  padding: 40px;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const BrandBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 4px;
  color: var(--gold-primary);
  text-transform: uppercase;
  border: 1px solid var(--gold-muted);
  padding: 6px 12px;
  border-radius: 2px;
`;

const ErrorCode = styled.div`
  font-size: 8rem;
  font-weight: 200;
  color: var(--text-main);
  margin-top: 20px;
  letter-spacing: -5px;
  opacity: 0.9;
`;

const Divider = styled.div`
  width: 40px;
  height: 1px;
  background: var(--gold-primary);
  margin: 30px auto;
`;

const InfoSection = styled.div`
  h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 15px; }
  p { 
    font-size: 0.95rem; 
    color: var(--text-dim); 
    line-height: 1.6; 
    span { color: var(--gold-primary); font-family: monospace; }
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 40px;
  justify-content: center;
`;

const PrimaryButton = styled.button`
  background: var(--gold-primary);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { 
    background: #f1d77a; 
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { 
    background: rgba(255, 255, 255, 0.03);
    border-color: var(--text-dim);
  }
`;

const Footer = styled.div`
  margin-top: 60px;
  .meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--text-dim);
    font-size: 0.65rem;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
`;