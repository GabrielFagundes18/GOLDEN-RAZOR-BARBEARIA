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

  background-image:
    linear-gradient(to right, var(--secondary-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--secondary-color) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.8;

  mask-image: radial-gradient(circle at center, black 40%, transparent 90%);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      transparent 0%,
      var(--bg-color) 80%
    );
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
              border: "1px solid var(--border-bright)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8)",
              borderRadius: "4px",
            },
            headerTitle: {
              color: "var(--text-color)",
              fontSize: "24px",
              fontWeight: "800",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontFamily: "'Syncopate', sans-serif",
            },
            headerSubtitle: {
              color: "var(--text-muted)",
              fontSize: "14px",
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
                boxShadow: "0 0 20px var(--primary-glow)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            },
            formFieldLabel: {
              color: "var(--text-color)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px",
            },
            formFieldInput: {
              backgroundColor: "var(--bg-darker)",
              color: "var(--text-color)",
              border: "1px solid var(--border-bright)",
              borderRadius: "2px",
              padding: "12px",
              "&:focus": {
                border: "1px solid var(--primary-color)",
                boxShadow: "0 0 5px var(--primary-glow)",
              },
            },
            socialButtonsBlockButton: {
              backgroundColor: "var(--bg-darker)",
              border: "1px solid var(--border-bright)",
              color: "var(--text-color)",
              borderRadius: "2px",
              "&:hover": {
                backgroundColor: "var(--card-color)",
                border: "1px solid var(--primary-color)",
              },
            },
            dividerLine: { background: "var(--border-bright)" },
            dividerText: {
              color: "var(--text-muted)",
              fontSize: "10px",
              textTransform: "uppercase",
            },
            footerActionLink: {
              color: "var(--primary-color)",
              fontWeight: "bold",
              transition: "0.3s",
              "&:hover": {
                color: "var(--text-color)",
                textShadow: "0 0 10px var(--primary-glow)",
              },
            },
            footerActionText: {
              color: "var(--text-muted)",
            },
            identityPreviewText: { color: "var(--text-color)" },
            identityPreviewEditButtonIcon: { color: "var(--primary-color)" },
          },
        }}
      />
    </LoginContainer>
  );
};

export default LoginPage;
