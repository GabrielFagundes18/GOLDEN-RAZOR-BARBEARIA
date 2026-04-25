import React, { useState, useEffect, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Loader2, MapPin, ShieldCheck, Target } from "lucide-react";

import { Sidebar } from "../../components/Sidebar/Sidebar";
import WelcomeBanner from "./WelcomeBanner";
import AppointmentList from "./AppointmentList";
import { api } from "../../services/api";
import { Outlet, useLocation } from "react-router-dom";

/* ---------------- GLOBAL ---------------- */

const GlobalStyle = createGlobalStyle`
  body { 
    background-color: var(--bg-color); 
    color: var(--text-color); 
    font-family: 'Inter', sans-serif; 
    margin: 0; 
    overflow-x: hidden; 
  }
`;

/* ---------------- LAYOUT ---------------- */

const RootLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: 30px;
`;

/* ---------------- DASHBOARD GRID ---------------- */

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 30px;
  margin-top: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const TacticalCard = styled(motion.div)`
  background: var(--card-glass);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 30px;
  backdrop-filter: blur(12px);
`;

/* ---------------- COMPONENT ---------------- */

export default function ClientDashboard() {
  const { user, isLoaded } = useUser();
  const location = useLocation();

  const [pontos, setPontos] = useState(0);
  const [loading, setLoading] = useState(true);

  const isHome = location.pathname === "/client";

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await api.get(`/profile/${user.id}`);
      setPontos(res.data.pontos || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoaded && user) fetchData();
  }, [isLoaded, user, fetchData]);

  if (!isLoaded || loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-color)",
          flexDirection: "column",
          gap: 15,
        }}
      >
        <Loader2 size={40} className="animate-spin" />
        <span>Sincronizando...</span>
      </div>
    );
  }

  return (
    <>
      <GlobalStyle />

      <RootLayout>
        <Sidebar />

        <ContentWrapper>
          <WelcomeBanner pontos={pontos} />

          {/* 🔥 AQUI É O PONTO PRINCIPAL */}
          {isHome ? (
            <DashboardGrid>
              {/* LEFT */}
              <TacticalCard
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <span style={{ fontSize: 12 }}>// AGENDAMENTOS</span>
                  <Target size={14} />
                </div>

                <AppointmentList />
              </TacticalCard>

              {/* RIGHT */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <Card title="LOCALIZAÇÃO" icon={<MapPin size={14} />}>
                  Unidade Maia - Guarulhos
                </Card>

                <Card title="XP" icon={<ShieldCheck size={14} />}>
                  <h1 style={{ margin: 0 }}>{pontos} PTS</h1>
                </Card>
              </div>
            </DashboardGrid>
          ) : (
            /* 🔥 OUTLET SÓ PARA ROTAS INTERNAS */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginTop: 30 }}
            >
              <Outlet />
            </motion.div>
          )}
        </ContentWrapper>
      </RootLayout>
    </>
  );
}

/* ---------------- CARD ---------------- */

function Card({ title, icon, children }: any) {
  return (
    <div
      style={{
        background: "var(--card-glass)",
        padding: 20,
        borderRadius: 20,
        border: "1px solid var(--border-color)",
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {icon}
        <strong>{title}</strong>
      </div>

      {children}
    </div>
  );
}
