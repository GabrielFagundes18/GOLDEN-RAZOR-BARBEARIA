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

/* --- Estilos de Layout --- */

const RootLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 1600px; // Evita que em telas ultra-wide o conteúdo estique demais
  margin: 0 auto;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
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
  text-align: center;
  padding: 20px;

  .status-text {
    color: var(--text-color);
    font-family: "Rajdhani", sans-serif;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .sub-text {
    color: var(--text-muted);
    font-size: 0.85rem;
    max-width: 300px;
    line-height: 1.5;
  }
`;

const ActionButton = styled.button`
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background: var(--primary-color);
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
  }
`;

/* --- Componente Principal --- */

export default function ProductsPage() {
  const { isLoaded } = useUser();
  const { data: products, loading, error } = useFetch<any[]>("/produtos");

  // Tela de Carregamento (Arsenal sendo preparado)
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

  // Tela de Erro (Falha na conexão)
  if (error) {
    return (
      <StateScreen>
        <AlertTriangle color="#ef4444" size={48} />
        <p className="status-text" style={{ color: "#ef4444" }}>
          Falha na Central
        </p>
        <p className="sub-text">
          Não foi possível estabelecer conexão com o estoque de produtos.
        </p>
        <ActionButton onClick={() => window.location.reload()}>
          <RefreshCcw size={16} />
          Tentar Reconexão
        </ActionButton>
      </StateScreen>
    );
  }

  return (
    <RootLayout>
      

      <MainContent>
        {/* Caso a lista venha vazia do banco */}
        {products && products.length > 0 ? (
          <>
            <ProductHeroCarousel products={products} />
            <ProductArsenal products={products} />
          </>
        ) : (
          <StateScreen style={{ height: "60vh" }}>
            <PackageSearch
              color="var(--text-muted)"
              size={60}
              strokeWidth={1}
            />
            <p className="status-text">Arsenal Vazio</p>
            <p className="sub-text">
              Nenhum produto foi cadastrado no sistema ainda.
            </p>
          </StateScreen>
        )}
      </MainContent>
    </RootLayout>
  );
}
