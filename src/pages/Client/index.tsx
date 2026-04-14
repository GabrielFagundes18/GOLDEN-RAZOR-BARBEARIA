import React, { useState, useEffect, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Loader2, MapPin, ShieldCheck, Target, Menu, X } from "lucide-react"; // Adicionei Menu e X

import { Sidebar } from "./Sidebar";
import WelcomeBanner from "./WelcomeBanner";
import AppointmentList from "./AppointmentList";
import { api } from "../../services/api";

const GlobalStyle = createGlobalStyle`
  body { 
    background-color: var(--bg-color); 
    color: var(--text-color); 
    font-family: 'Inter', sans-serif; 
    margin: 0; 
    overflow-x: hidden; 
  }
  .sync { 
    font-family: 'Syncopate', sans-serif; 
    letter-spacing: 1px; 
    text-transform: uppercase; 
  }
`;

const RootLayout = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column; /* Mobile first */

  @media (min-width: 1025px) {
    flex-direction: row;
  }
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;

  /* Ajuste para Desktop */
  @media (min-width: 1025px) {
    margin-left: 260px; /* Largura da Sidebar */
    padding: 40px;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Empilhado no mobile */
  gap: 20px;
  margin-top: 20px;

  @media (min-width: 1200px) {
    grid-template-columns: 1fr 340px; /* Grid original no desktop */
    gap: 30px;
    margin-top: 30px;
  }
`;

const TacticalCard = styled(motion.div)`
  background: var(--card-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 20px;
  min-height: auto;

  @media (min-width: 768px) {
    padding: 30px;
    min-height: 500px;
  }
`;

// Estilo para o botão de menu mobile (Hambúrguer)
const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: var(--bg-darker);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;

  @media (min-width: 1025px) {
    display: none;
  }
`;
interface ClientDashboardProps {
  children?: React.ReactNode;
}

export default function ClientDashboard({ children }: ClientDashboardProps) {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [pontos, setPontos] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para o menu

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoadingStats(true);
      const response = await api.get(`/profile/${user.id}`);
      setPontos(response.data.pontos || 0);
    } catch (error) {
      console.error("Erro ao carregar métricas táticas:", error);
    } finally {
      setLoadingStats(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [isLoaded, user, fetchDashboardData]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  if (!isLoaded || loadingStats) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-color)",
          gap: "20px",
        }}
      >
        <Loader2
          className="animate-spin"
          color="var(--primary-color)"
          size={40}
        />
        <span
          className="sync"
          style={{ fontSize: "0.6rem", color: "var(--primary-color)" }}
        >
          Sincronizando Protocolos...
        </span>
      </div>
    );
  }

  const progressoCiclo = pontos > 0 && pontos % 10 === 0 ? 10 : pontos % 10;

  return (
    <>
      <GlobalStyle />

      <MobileHeader>
        <span
          className="sync"
          style={{ fontSize: "0.8rem", fontWeight: "bold" }}
        >
          GOLDEN RAZOR
        </span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-color)",
            cursor: "pointer",
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </MobileHeader>

      <RootLayout>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userName={user?.firstName}
          isOpen={isMobileMenuOpen}
        />

        <ContentWrapper>
          <WelcomeBanner pontos={pontos} />

          {children ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: "30px" }}
            >
              {children}
            </motion.div>
          ) : (
            <DashboardGrid>
              <section>
                <TacticalCard
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <span
                      className="sync"
                      style={{
                        fontSize: "0.6rem",
                        color: "var(--primary-color)",
                      }}
                    >
                      // PROTOCOLO_DE_AGENDAMENTOS
                    </span>
                    <Target size={14} color="var(--primary-color)" />
                  </div>
                  <AppointmentList />
                </TacticalCard>
              </section>

              <aside
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <MiniCard title="COORDENADAS" icon={<MapPin size={14} />}>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    Unidade Maia - Guarulhos
                  </p>
                </MiniCard>

                <MiniCard title="STATUS XP" icon={<ShieldCheck size={14} />}>
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "900",
                      color:
                        progressoCiclo === 10
                          ? "var(--gold-bright)"
                          : "var(--text-color)",
                      fontFamily: "Syncopate",
                    }}
                  >
                    {pontos} <span style={{ fontSize: "0.8rem" }}>PTS</span>
                  </div>
                  <small
                    style={{
                      color:
                        progressoCiclo === 10
                          ? "var(--gold-color)"
                          : "var(--text-muted)",
                      fontSize: "0.65rem",
                      fontWeight: "bold",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {progressoCiclo === 10
                      ? "MISSION ACCOMPLISHED: CORTE LIBERADO!"
                      : `FALTA(M) ${10 - progressoCiclo} CORTE(S) PARA O BÔNUS`}
                  </small>
                </MiniCard>
              </aside>
            </DashboardGrid>
          )}
        </ContentWrapper>
      </RootLayout>
    </>
  );
}

function MiniCard({ title, icon, children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, borderColor: "var(--primary-color)" }}
      style={{
        background: "var(--card-glass)",
        padding: "22px",
        borderRadius: "24px",
        border: `1px solid var(--border-color)`,
        transition: "all 0.3s ease",
        backdropFilter: "blur(12px)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--primary-color)",
          marginBottom: "12px",
        }}
      >
        {icon}
        <span className="sync" style={{ fontSize: "0.6rem" }}>
          {title}
        </span>
      </div>
      {children}
    </motion.div>
  );
}
