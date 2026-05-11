import { useState } from "react";
import styled from "styled-components";
import { useUser } from "@clerk/clerk-react";
import {
  Loader2,
  AlertTriangle,
  RefreshCcw,
  PackageSearch,
} from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import ProductHeroCarousel from "./ProductHeroCarousel";
import ProductArsenal from "./ProductArsenal";

export default function ProductsPage() {
  const { isLoaded } = useUser();
  const { data: products, loading, error } = useFetch<any[]>("/produtos");

  if (!isLoaded || loading) {
    return (
      <StateScreen>
        <Loader2
          className="animate-spin"
          color="var(--primary-color)"
          size={48}
        />
        <p className="status-text">Sincronizando Arsenal...</p>
      </StateScreen>
    );
  }

  if (error) {
    return (
      <StateScreen>
        <AlertTriangle color="#ef4444" size={48} />
        <p className="status-text" style={{ color: "#ef4444" }}>
          Falha na Central
        </p>
        <ActionButton onClick={() => window.location.reload()}>
          <RefreshCcw size={16} /> Tentar Reconexão
        </ActionButton>
      </StateScreen>
    );
  }

  return (
    <RootLayout>
      <MainContent>
        {products && products.length > 0 ? (
          <>
            <ProductHeroCarousel products={products} />
            <ProductArsenal products={products} />
          </>
        ) : (
          <StateScreen style={{ height: "60vh" }}>
            <PackageSearch color="var(--text-muted)" size={60} />
            <p className="status-text">Arsenal Vazio</p>
          </StateScreen>
        )}
      </MainContent>
    </RootLayout>
  );
}

const RootLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
  width: 100%;
`;
const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`;
const StateScreen = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  gap: 1.5rem;
`;
const ActionButton = styled.button`
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
`;
