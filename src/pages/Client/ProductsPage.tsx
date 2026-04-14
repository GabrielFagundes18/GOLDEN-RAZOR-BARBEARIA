import { useState } from "react";
import styled from "styled-components";
import { useUser } from "@clerk/clerk-react";
import { Loader2, AlertTriangle } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

import { Sidebar } from "./Sidebar";
import ProductHeroCarousel from "./ProductHeroCarousel";
import ProductArsenal from "./ProductArsenal";

const RootLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
  width: 100%;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;

  /* Ajuste de espaço para a Sidebar Desktop */
  margin-left: 260px;
  padding: 40px;
  width: calc(100% - 260px);
  min-width: 0;

  @media (max-width: 1024px) {
    margin-left: 0;
    width: 100%;
    padding: 100px 15px 40px 15px;
  }
`;

const LoadingScreen = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  gap: 20px;

  p {
    color: var(--text-color);
    font-family: "Syncopate", sans-serif;
    font-size: 0.8rem;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

export default function ProductsPage() {
  const { user, isLoaded } = useUser();
  const { data: products, loading, error } = useFetch<any[]>("/produtos");
  const [activeTab, setActiveTab] = useState("products");

  if (!isLoaded || loading) {
    return (
      <LoadingScreen>
        <Loader2
          className="animate-spin"
          color="var(--primary-color)"
          size={40}
        />
        <p>Acessando Arsenal...</p>
      </LoadingScreen>
    );
  }

  if (error) {
    return (
      <LoadingScreen>
        <AlertTriangle color="var(--error-color)" size={40} />
        <p style={{ color: "var(--text-color)" }}>
          Erro na conexão com a central de armas.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "none",
            border: "1px solid var(--border-bright)",
            color: "var(--text-muted)",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "10px",
            fontWeight: "bold",
          }}
        >
          TENTAR RECONEXÃO
        </button>
      </LoadingScreen>
    );
  }

  return (
    <RootLayout>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={user?.firstName || "Operador"}
      />

      <MainContent>
        <ProductHeroCarousel products={products || []} />

        <ProductArsenal products={products || []} />
      </MainContent>
    </RootLayout>
  );
}
