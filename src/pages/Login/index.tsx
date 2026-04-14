import React from "react";
import { SignIn } from "@clerk/clerk-react";
import styled from "styled-components";

const LoginContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  
  /* Efeito de Grid (Linhas de fundo sutis) */
  background-image: 
    linear-gradient(to right, #491818 1px, transparent 1px),
    linear-gradient(to bottom, #491818 1px, transparent 1px);
  background-size: 40px 40px;

  /* Máscara radial para o Grid sumir nas bordas e focar no card */
  mask-image: radial-gradient(circle at center, black 40%, transparent 90%);
  
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 0%, var(--bg-color) 80%);
    pointer-events: none;
  }
`;

const LoginPage: React.FC = () => {
  return (
    <LoginContainer>
      <SignIn 
        signUpUrl="/cadastro" 
        routing="path" 
        path="/login" 
        appearance={{
          layout: {
            socialButtonsVariant: "blockButton",
            shimmer: true,
          },
          elements: {
            card: { 
              backgroundColor: "var(--card-color)", 
              border: "1px solid #1a1a1a", 
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              borderRadius: "4px" 
            },
            headerTitle: { 
              color: "var(--text-color)", 
              fontSize: "24px",
              fontWeight: "800",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontFamily: "'Syncopate', sans-serif" 
            },
            headerSubtitle: { 
              color: "var(--text-muted)",
              fontSize: "14px"
            },
            formButtonPrimary: { 
              backgroundColor: "var(--primary-color)", 
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "2px",
              textTransform: "uppercase",
              fontSize: "14px",
              transition: "all 0.3s ease",
              "&:hover": { 
                backgroundColor: "var(--secondary-color)",
                boxShadow: "0 0 15px var(--primary-glow)"
              },
              "&:active": {
                transform: "scale(0.98)"
              }
            },
            formFieldLabel: { 
              color: "var(--text-color)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px"
            },
            formFieldInput: { 
              backgroundColor: "var(--bg-color)", 
              color: "var(--text-color)", 
              border: "1px solid #222",
              borderRadius: "2px",
              padding: "12px",
              "&:focus": { 
                border: "1px solid var(--primary-color)",
                boxShadow: "none"
              }
            },
            socialButtonsBlockButton: {
              backgroundColor: "#050505",
              border: "1px solid #222",
              color: "var(--text-color)",
              borderRadius: "2px",
              "&:hover": { 
                backgroundColor: "#111",
                border: "1px solid var(--primary-color)" 
              }
            },
            dividerLine: { background: "#222" },
            dividerText: { color: "var(--text-muted)", fontSize: "10px", textTransform: "uppercase" },
            footerActionLink: { 
              color: "var(--primary-color)",
              fontWeight: "bold",
              "&:hover": { color: "black" } 
            },
            footerActionText: {
              color: "var(--text-muted)"
            },
            identityPreviewText: { color: "var(--text-color)" },
            identityPreviewEditButtonIcon: { color: "var(--primary-color)" }
          }
        }}
      />
    </LoginContainer>
  );
}

export default LoginPage;