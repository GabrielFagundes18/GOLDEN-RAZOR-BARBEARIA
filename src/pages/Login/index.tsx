import React from "react";
import { SignIn } from "@clerk/clerk-react";
import styled from "styled-components";

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #050505;
  background-image: radial-gradient(circle at 50% 50%, #111 0%, #050505 100%);
`;

export default function LoginPage() {
  return (
    <LoginContainer>
      <SignIn 
        // Define para onde o link "Não tem uma conta? Cadastre-se" vai levar
        signUpUrl="/cadastro" 
        appearance={{
          elements: {
            formButtonPrimary: {
              backgroundColor: "#00f2ff",
              color: "#000",
              fontSize: "0.9rem",
              textTransform: "uppercase",
              fontWeight: "700",
              "&:hover": {
                backgroundColor: "#00d1db",
              }
            },
            card: {
              backgroundColor: "#0a0a0a",
              border: "1px solid #1a1a1a",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
            },
            headerTitle: { color: "#fff", fontFamily: "Syncopate" },
            headerSubtitle: { color: "#a1a1a1" },
            socialButtonsBlockButton: {
              backgroundColor: "#111",
              border: "1px solid #222",
              color: "#fff",
              "&:hover": { backgroundColor: "#1a1a1a" }
            },
            footerActionLink: { color: "#00f2ff" },
            identityPreviewText: { color: "#fff" },
            formFieldLabel: { color: "#fff" },
            formFieldInput: { 
              backgroundColor: "#050505", 
              border: "1px solid #222", 
              color: "#fff" 
            },
            dividerLine: { backgroundColor: "#222" },
            dividerText: { color: "#444" }
          }
        }}
        routing="path" 
        path="/login" 
      />
    </LoginContainer>
  );
}