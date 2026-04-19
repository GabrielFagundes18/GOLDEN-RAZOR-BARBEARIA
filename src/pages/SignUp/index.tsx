import React from "react";
import { SignUp } from "@clerk/clerk-react";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Fundo claro levemente acinzentado */
  background-color: #f8f9fa; 

  /* Grid sutil em cinza claro */
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    /* Vinheta clara para dar foco no centro */
    background: radial-gradient(circle at center, transparent 20%, #f8f9fa 100%);
    pointer-events: none;
    z-index: 1;
  }

  & > div {
    position: relative;
    z-index: 2;
  }
`;

const SignUpPage: React.FC = () => {
  return (
    <Container>
      <SignUp
        signInUrl="/login"
        routing="path"
        path="/cadastro"
        afterSignUpUrl="/dashboard"
        appearance={{
          layout: {
            socialButtonsVariant: "blockButton",
            shimmer: true,
          },
          elements: {
            card: {
              /* Card branco com sombra suave e elegante */
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
              padding: "24px",
            },
            headerTitle: {
              /* Título em cor escura para leitura clara */
              color: "#1a202c",
              fontSize: "24px",
              fontWeight: "800",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              fontFamily: "'Syncopate', sans-serif",
            },
            headerSubtitle: {
              color: "#718096",
              fontSize: "14px",
              marginTop: "8px",
            },
            formButtonPrimary: {
              /* Botão principal com a cor de destaque */
              backgroundColor: "#e11d48", 
              color: "#ffffff",
              fontWeight: "700",
              borderRadius: "6px",
              textTransform: "uppercase",
              fontSize: "13px",
              height: "48px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#9f1239",
                boxShadow: "0 4px 12px rgba(225, 29, 72, 0.3)",
              },
            },
            formFieldLabel: {
              /* Labels em cinza escuro para contraste */
              color: "#4a5568",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              marginBottom: "6px",
            },
            formFieldInput: {
              /* Inputs claros com bordas definidas */
              backgroundColor: "#ffffff",
              color: "#1a202c",
              border: "1px solid #cbd5e0",
              borderRadius: "6px",
              height: "44px",
              "&::placeholder": {
                color: "#a0aec0",
              },
              "&:focus": {
                border: "2px solid #e11d48",
                boxShadow: "none",
              },
            },
            footerActionLink: {
              /* Link em dourado/bronze para elegância */
              color: "#b7791f", 
              fontWeight: "700",
              "&:hover": {
                color: "#d69e2e",
                textDecoration: "underline",
              },
            },
            identityPreviewText: {
              color: "#1a202c",
            },
            dividerLine: {
              backgroundColor: "#e2e8f0",
            },
            dividerText: {
              color: "#a0aec0",
              fontSize: "11px",
              fontWeight: "600",
            },
            socialButtonsBlockButton: {
              /* Botões sociais brancos com borda cinza */
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#4a5568",
              fontWeight: "600",
              "&:hover": {
                backgroundColor: "#f7fafc",
                borderColor: "#cbd5e0",
              },
            },
            footerActionText: {
              color: "#718096",
            }
          },
        }}
      />
    </Container>
  );
};

export default SignUpPage;