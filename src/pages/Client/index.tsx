import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MapPin, ShieldCheck } from "lucide-react";

// Componentes internos - Verifique se os caminhos estão corretos
import { Sidebar } from "./Sidebar";
import WelcomeBanner from "./WelcomeBanner";
import BookingForm from "./BookingForm";
import AppointmentList from "./AppointmentList";
import ProductArsenal from "./ProductArsenal";
import HistoryList from "./HistoryList";

const COLORS = {
  bg: "#030303",
  card: "rgba(13, 13, 13, 0.7)",
  accent: "#e11d48",
  border: "rgba(255, 255, 255, 0.05)",
  textMuted: "#666666",
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${COLORS.bg};
    color: #f0f0f0;
    font-family: 'Inter', sans-serif;
    margin: 0;
  }
  .sync { 
    font-family: 'Syncopate', sans-serif; 
    letter-spacing: 1px; 
    text-transform: uppercase; 
  }
`;

// --- COMPONENTES ESTILIZADOS ---
const RootLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ContentWrapper = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: 40px;
  @media (max-width: 1024px) {
    margin-left: 0;
    padding-top: 80px;
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

// Corrigido para TypeScript: Definindo a interface da prop
interface TacticalCardProps {
  $isFluid?: boolean;
}

const TacticalCard = styled(motion.div)<TacticalCardProps>`
  background: ${COLORS.card};
  backdrop-filter: blur(12px);
  border: 1px solid ${COLORS.border};
  border-radius: 24px;
  padding: 30px;
  position: relative;

  /* Se for fluid (produtos), a altura é livre. Se não, é 600px com scroll */
  ${(props) =>
    props.$isFluid
      ? "height: auto; min-height: 600px;"
      : "height: 600px; overflow-y: auto;"}

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${COLORS.border};
    border-radius: 10px;
  }
`;

const ProtocolHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  span {
    font-size: 0.6rem;
    color: ${COLORS.accent};
  }
`;

// --- COMPONENTE PRINCIPAL ---
export default function ClientDashboard() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [pontos, setPontos] = useState(0);

  useEffect(() => {
    if (isLoaded && user) {
      setPontos(7); // Simulação
    }
  }, [isLoaded, user]);

  if (!isLoaded)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#030303",
        }}
      >
        <Loader2 className="animate-spin" color={COLORS.accent} size={40} />
      </div>
    );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <AppointmentList />;
      case "agenda":
        return (
          <BookingForm
            clerkId={user?.id || ""}
            userName={user?.fullName || ""}
            onBookingSuccess={() => setActiveTab("overview")}
          />
        );
      case "products":
        return <ProductArsenal />;
      case "history":
        return <HistoryList />;
      case "profile":
        return <ProfileView user={user} />;
      default:
        return <AppointmentList />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <RootLayout>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userName={user?.firstName || "Agente"}
        />

        <ContentWrapper>
          <WelcomeBanner pontos={pontos} />

          <DashboardGrid>
            <section>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <TacticalCard
                    $isFluid={
                      activeTab === "products" || activeTab === "agenda"
                    }
                  >
                    <ProtocolHeader>
                      <span className="sync">
                        // PROTOCOLO_{activeTab.toUpperCase()}
                      </span>
                    </ProtocolHeader>
                    {renderTabContent()}
                  </TacticalCard>
                </motion.div>
              </AnimatePresence>
            </section>

            <aside
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <MiniCard title="COORDENADAS" icon={<MapPin size={16} />}>
                <p style={{ fontSize: "0.8rem", color: "#ccc" }}>
                  Unidade Maia - Guarulhos
                </p>
              </MiniCard>

              <MiniCard title="STATUS XP" icon={<ShieldCheck size={16} />}>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {pontos} XP
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    background: "#222",
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{
                      width: `${(pontos % 10) * 10}%`,
                      height: "100%",
                      background: COLORS.accent,
                    }}
                  />
                </div>
              </MiniCard>
            </aside>
          </DashboardGrid>
        </ContentWrapper>
      </RootLayout>
    </>
  );
}

// --- AUXILIARES ---
function ProfileView({ user }: { user: any }) {
  return (
    <div
      style={{
        padding: "20px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "12px",
      }}
    >
      <h3 className="sync" style={{ fontSize: "0.9rem" }}>
        {user?.fullName}
      </h3>
      <p style={{ fontSize: "0.7rem", color: COLORS.textMuted }}>
        {user?.primaryEmailAddress?.emailAddress}
      </p>
    </div>
  );
}

function MiniCard({ title, icon, children }: any) {
  return (
    <div
      style={{
        background: COLORS.card,
        padding: "20px",
        borderRadius: "20px",
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: COLORS.accent,
          marginBottom: "10px",
        }}
      >
        {icon}{" "}
        <span className="sync" style={{ fontSize: "0.6rem" }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
