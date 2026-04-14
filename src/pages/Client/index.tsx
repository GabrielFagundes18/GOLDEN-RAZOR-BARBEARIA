import React, { useState, useEffect, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Loader2, MapPin, ShieldCheck, Target } from "lucide-react";

import { Sidebar } from "./Sidebar";
import WelcomeBanner from "./WelcomeBanner";
import AppointmentList from "./AppointmentList";
import { api } from "../../services/api";

// --- CONFIGURAÇÕES ---
const COLORS = {
  bg: "#030303",
  card: "rgba(13, 13, 13, 0.7)",
  accent: "#e11d48",
  border: "rgba(255, 255, 255, 0.05)",
  textMuted: "#666666",
};

const GlobalStyle = createGlobalStyle`
  body { background-color: ${COLORS.bg}; color: #f0f0f0; font-family: 'Inter', sans-serif; margin: 0; overflow-x: hidden; }
  .sync { font-family: 'Syncopate', sans-serif; letter-spacing: 1px; text-transform: uppercase; }
`;

// --- LAYOUT ---
const RootLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ContentWrapper = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: 40px;
  max-width: 1400px;
  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 100px 20px 40px 20px;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 30px;
  margin-top: 30px;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const TacticalCard = styled(motion.div)`
  background: ${COLORS.card};
  backdrop-filter: blur(12px);
  border: 1px solid ${COLORS.border};
  border-radius: 24px;
  padding: 30px;
  min-height: 500px;
`;

// --- COMPONENTE PRINCIPAL ---
interface ClientDashboardProps {
  children?: React.ReactNode;
}

export default function ClientDashboard({ children }: ClientDashboardProps) {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [pontos, setPontos] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // 1. BUSCA DE DADOS (CORRIGIDA)
  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoadingStats(true);
      // CORREÇÃO: Usando user.id em vez de clerkId
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

  // 2. TELA DE CARREGAMENTO
  if (!isLoaded || loadingStats) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#030303",
          gap: "20px",
        }}
      >
        <Loader2 className="animate-spin" color={COLORS.accent} size={40} />
        <span
          className="sync"
          style={{ fontSize: "0.6rem", color: COLORS.accent }}
        >
          Sincronizando Protocolos...
        </span>
      </div>
    );
  }

  // Lógica de ciclo sincronizada
  const progressoCiclo = pontos > 0 && pontos % 10 === 0 ? 10 : pontos % 10;

  return (
    <>
      <GlobalStyle />
      <RootLayout>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userName={user?.firstName}
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
                      style={{ fontSize: "0.6rem", color: COLORS.accent }}
                    >
                      // PROTOCOLO_DE_AGENDAMENTOS
                    </span>
                    <Target size={14} color={COLORS.accent} />
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
                  <p style={{ fontSize: "0.8rem", color: "#ccc", margin: 0 }}>
                    Unidade Maia - Guarulhos
                  </p>
                </MiniCard>

                <MiniCard title="STATUS XP" icon={<ShieldCheck size={14} />}>
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "900",
                      color: progressoCiclo === 10 ? "#FFD700" : "#fff",
                      fontFamily: "Syncopate",
                    }}
                  >
                    {pontos} <span style={{ fontSize: "0.8rem" }}>PTS</span>
                  </div>
                  <small
                    style={{
                      color:
                        progressoCiclo === 10 ? "#FFD700" : COLORS.textMuted,
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

// --- SUB-COMPONENTE ---
function MiniCard({ title, icon, children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, borderColor: COLORS.accent }}
      style={{
        background: COLORS.card,
        padding: "22px",
        borderRadius: "24px",
        border: `1px solid ${COLORS.border}`,
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: COLORS.accent,
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
