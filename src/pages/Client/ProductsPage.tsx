import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../services/api";
import {
  Loader2,
  AlertTriangle,
  RefreshCcw,
  PackageSearch,
} from "lucide-react";

// Importação apenas do Arsenal
import ProductArsenal from "./ProductArsenal";

// --- INTERFACE DE DADOS ---
interface Product {
  id: string | number;
  nome: string;
  marca: string;
  categoria: string;
  preco: number | string;
  imagem_url: string;
  estoque_qtd: number;
  info?: string;
  em_estoque?: boolean;
}

export default function ProductsPage() {
  const { isLoaded: userLoaded } = useUser();

  // Estados de Controle de Dados
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // --- BUSCA DE DADOS ---
  const fetchArsenal = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get<Product[]>("/produtos");

      const data = Array.isArray(response.data) ? response.data : [];
      setProducts(data);
    } catch (err) {
      console.error("Erro ao carregar o arsenal de produtos:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArsenal();
  }, [fetchArsenal]);

  // 1. Tela de Carregamento
  if (!userLoaded || loading) {
    return (
      <StateScreen>
        <Loader2
          className="animate-spin"
          color="var(--primary-color)"
          size={48}
        />
        <p className="status-text">SINCRONIZANDO ARSENAL...</p>
      </StateScreen>
    );
  }

  // 2. Tela de Erro
  if (error) {
    return (
      <StateScreen>
        <AlertTriangle color="#ef4444" size={48} />
        <p className="status-text" style={{ color: "#ef4444" }}>
          FALHA NA CONEXÃO COM A CENTRAL
        </p>
        <ActionButton onClick={fetchArsenal}>
          <RefreshCcw size={16} /> RECONECTAR RADAR
        </ActionButton>
      </StateScreen>
    );
  }

  return (
    <RootLayout>
      <MainContent>
        {products.length > 0 ? (
          /* Renderiza apenas a lista de produtos */
          <ProductArsenal products={products} />
        ) : (
          /* 3. Tela de Arsenal Vazio */
          <StateScreen style={{ height: "60vh" }}>
            <PackageSearch color="var(--text-dark)" size={60} />
            <p className="status-text">ARSENAL INDISPONÍVEL NO MOMENTO</p>
            <ActionButton onClick={fetchArsenal}>
              <RefreshCcw size={16} /> ATUALIZAR LISTA
            </ActionButton>
          </StateScreen>
        )}
      </MainContent>
    </RootLayout>
  );
}

// --- ESTILOS ---

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
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
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

  .status-text {
    font-family: "Syncopate", sans-serif;
    font-size: 0.7rem;
    letter-spacing: 2px;
    color: var(--text-color);
    font-weight: 700;
    text-transform: uppercase;
  }
`;

const ActionButton = styled.button`
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 900;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: var(--primary-color);
    color: #000;
    box-shadow: 0 0 25px var(--primary-glow);
    transform: translateY(-2px);
  }
`;
