import React, { ReactNode, useState, useEffect, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Loader2, MapPin, ShieldCheck, LayoutDashboard } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "../../components/Sidebar/Sidebar";
import WelcomeBanner from "./WelcomeBanner";
import { useFetchProfile } from "../../hooks/useFetchProfile";
import ProductHeroCarousel from "./ProductHeroCarousel";
import { api } from "../../services/api";

/* ---------------- ESTILOS GLOBAIS ---------------- */

const GlobalStyle = createGlobalStyle`
  body { 
    background-color: var(--bg-color); 
    color: var(--text-color); 
    font-family: 'Inter', sans-serif; 
    margin: 0; 
  }
`;

/* ---------------- LAYOUT ESTRUTURAL ---------------- */

const RootLayout = styled.div`
  display: flex;
  width: 100vw;
`;

const MainContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 20px;
  box-sizing: border-box;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px; /* Carrossel largo e Status na direita */
  grid-template-rows: 1fr; /* Ocupa todo o resto da altura */
  gap: 24px;
  flex: 1;
  min-height: 0;
`;

const CarouselArea = styled.div`
  height: 100%;
  border-radius: 32px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--card-glass);

  /* Ajuste para o carrossel preencher o container */
  & > div {
    height: 100% !important;
    min-height: 100% !important;
    border: none !important;
  }
`;

const SideStatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
`;

/* ---------------- COMPONENTE PRINCIPAL ---------------- */

export default function ClientDashboard() {
  const { user, isLoaded } = useUser();
  const location = useLocation();
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const { pontos, loading: loadingProfile } = useFetchProfile(
    user?.id,
    isLoaded,
  );

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/produtos");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) fetchProducts();
  }, [isLoaded, fetchProducts]);

  const isHome = location.pathname === "/client";
  const featured = products
    .filter((p) => p.em_estoque || p.estoque_qtd > 0)
    .slice(0, 5);

  if (!isLoaded || loadingProfile || loadingProducts) {
    return (
      <LoadingWrapper>
        <Loader2
          size={40}
          className="animate-spin"
          color="var(--primary-color)"
        />
        <p className="sync-text">A ACESSAR ARSENAL...</p>
      </LoadingWrapper>
    );
  }

  return (
    <>
      <GlobalStyle />
      <RootLayout>
        <Sidebar />

        <MainContainer>
          {/* Topo: Bem-vindo */}
          <WelcomeBanner pontos={pontos} />

          {isHome ? (
            <DashboardGrid>
              {/* 1. ÁREA DO CARROSSEL - Ocupa a maior parte da tela */}
              <CarouselArea>
                {featured.length > 0 ? (
                  <ProductHeroCarousel products={featured} />
                ) : (
                  <EmptyState>NENHUM ITEM EM DESTAQUE</EmptyState>
                )}
              </CarouselArea>

              {/* 2. COLUNA DE STATUS LATERAL */}
              <SideStatusColumn>
                <StatusCard title="LOCALIZAÇÃO" icon={<MapPin size={16} />}>
                  <p className="val">Unidade Maia</p>
                  <span className="sub">Guarulhos, SP</span>
                </StatusCard>

                <StatusCard
                  title="REPUTAÇÃO (XP)"
                  icon={<ShieldCheck size={16} />}
                >
                  <XPDisplay>
                    {pontos} <span className="unit">PTS</span>
                  </XPDisplay>
                  <XPBar>
                    <motion.div
                      className="fill"
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                    />
                  </XPBar>
                </StatusCard>

                {/* Opcional: Card de Atalho ou Info Extra */}
                <StatusCard
                  title="SISTEMA"
                  icon={<LayoutDashboard size={16} />}
                >
                  <p className="val" style={{ fontSize: "11px", opacity: 0.6 }}>
                    Todos os sistemas operacionais.
                  </p>
                </StatusCard>
              </SideStatusColumn>
            </DashboardGrid>
          ) : (
            /* CONTEÚDO DE OUTRAS PÁGINAS (Produtos, Perfil, etc) */
            <SubContainer>
              <Outlet />
            </SubContainer>
          )}
        </MainContainer>
      </RootLayout>
    </>
  );
}

/* ---------------- COMPONENTES AUXILIARES ---------------- */

function StatusCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: any;
  children: ReactNode;
}) {
  return (
    <StyledCard>
      <div className="head">
        {icon}
        <span>{title}</span>
      </div>
      <div className="body-content">{children}</div>
    </StyledCard>
  );
}

const StyledCard = styled.div`
  background: var(--card-glass);
  padding: 24px;
  border-radius: 24px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);

  .head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    opacity: 0.5;
    span {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 2px;
    }
    svg {
      color: var(--primary-color);
    }
  }

  .val {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  }
  .sub {
    font-size: 11px;
    opacity: 0.5;
  }
`;

const XPDisplay = styled.h2`
  margin: 0;
  font-size: 2.2rem;
  font-weight: 900;
  font-family: "Syncopate", sans-serif;
  color: var(--text-color);
  .unit {
    font-size: 0.8rem;
    opacity: 0.4;
    margin-left: 5px;
  }
`;

const XPBar = styled.div`
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  margin-top: 15px;
  overflow: hidden;
  .fill {
    height: 100%;
    background: var(--primary-color);
    box-shadow: 0 0 15px var(--primary-glow);
  }
`;

const LoadingWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  .sync-text {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 3px;
    margin-top: 20px;
  }
`;

const EmptyState = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  letter-spacing: 4px;
  opacity: 0.3;
`;

const SubContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;
