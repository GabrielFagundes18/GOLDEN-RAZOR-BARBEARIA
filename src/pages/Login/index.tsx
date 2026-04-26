import React, { useEffect, useRef } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const LoginContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
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
    background: radial-gradient(circle at center, transparent 10%, #f8f9fa 90%);
    pointer-events: none;
    z-index: 1;
  }

  & > div {
    position: relative;
    z-index: 2;
  }
`;

const LoginPage: React.FC = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Ref para garantir que o redirecionamento só ocorra uma vez após o login
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Só executa a lógica se o Clerk carregou e o usuário está REALMENTE logado
    if (!isLoaded || !isSignedIn || !user || hasRedirected.current) return;

    hasRedirected.current = true;

    const from = location.state?.from?.pathname;
    const role = user?.publicMetadata?.role as string;

    console.log("LOGIN SUCESSO - ROLE:", role);

    // Se houver uma rota de origem (vinda de um ProtectedRoute), volta para ela
    if (from && from !== "/login" && from !== "/") {
      navigate(from, { replace: true });
      return;
    }

    // Redirecionamento baseado na Role do usuário
    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else if (role === "barber") {
      navigate("/barber", { replace: true });
    } else {
      navigate("/client", { replace: true });
    }
  }, [isSignedIn, isLoaded, user, navigate, location]);

  return (
    <LoginContainer>
      <SignIn
        signUpUrl="/cadastro"
        routing="virtual" 
        fallbackRedirectUrl="/client"
        signUpFallbackRedirectUrl="/client"
        appearance={{
          layout: {
            socialButtonsVariant: "blockButton",
            shimmer: true,
          },
          elements: {
            card: {
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
              padding: "24px",
            },
            headerTitle: {
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
              color: "#4a5568",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              marginBottom: "6px",
            },
            formFieldInput: {
              backgroundColor: "#ffffff",
              color: "#1a202c",
              border: "1px solid #cbd5e0",
              borderRadius: "6px",
              height: "44px",
              "&:focus": {
                border: "2px solid #e11d48",
                boxShadow: "none",
              },
            },
            footerActionLink: {
              color: "#b7791f",
              fontWeight: "700",
              "&:hover": {
                color: "#d69e2e",
                textDecoration: "underline",
              },
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
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#4a5568",
              fontWeight: "600",
              "&:hover": {
                backgroundColor: "#f7fafc",
                borderColor: "#cbd5e0",
              },
            },
          },
        }}
      />
    </LoginContainer>
  );
};

export default LoginPage;
