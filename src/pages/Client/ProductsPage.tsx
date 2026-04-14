import React, { useState } from "react";
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
  background-color: #030303;
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
  align-items: center;
  justify-content: center;
  background: #030303;
`;

export default function ProductsPage() {
  const { user, isLoaded } = useUser();
  const { data: products, loading, error } = useFetch<any[]>("/produtos");
  const [activeTab, setActiveTab] = useState("products");

  if (!isLoaded || loading) {
    return (
      <LoadingScreen>
        <Loader2 className="animate-spin" color="#e11d48" size={40} />
      </LoadingScreen>
    );
  }

  if (error) {
    return (
      <LoadingScreen style={{ flexDirection: 'column', gap: '20px' }}>
        <AlertTriangle color="#e11d48" size={40} />
        <p style={{ color: '#fff' }}>Erro ao conectar com o Arsenal.</p>
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
        {/* Carrossel no topo */}
        <ProductHeroCarousel products={products || []} />
        
        {/* Listagem completa abaixo */}
        <ProductArsenal products={products || []} />
      </MainContent>
    </RootLayout>
  );
}