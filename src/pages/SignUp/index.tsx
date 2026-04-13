import React from "react";
import { SignUp } from "@clerk/clerk-react";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #050505;
  background-image: radial-gradient(circle at 50% 50%, #111 0%, #050505 100%);
`;

export default function SignUpPage() {
  return (
    <Container>
      <SignUp 
        signInUrl="/login" // Link para voltar ao login
        appearance={{
          /* Use o mesmo objeto 'appearance' da LoginPage para manter o padrão */
          elements: {
            formButtonPrimary: { backgroundColor: "#00f2ff", color: "#000" },
            card: { backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" },
            headerTitle: { color: "#fff" },
            headerSubtitle: { color: "#a1a1a1" },
            footerActionLink: { color: "#00f2ff" },
            formFieldLabel: { color: "#fff" },
            formFieldInput: { backgroundColor: "#050505", color: "#fff", border: "1px solid #222" }
          }
        }}
        routing="path" 
        path="/cadastro" 
      />
    </Container>
  );
}