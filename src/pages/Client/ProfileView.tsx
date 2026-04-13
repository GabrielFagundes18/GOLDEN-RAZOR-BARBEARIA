import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  MapPin,
  ShieldCheck,
  User as UserIcon,
  Settings,
  Award,
  Phone,
  Calendar,
  LogOut,
} from "lucide-react";

// Componentes internos
import { Sidebar } from "./Sidebar";
import WelcomeBanner from "./WelcomeBanner";
import BookingForm from "./BookingForm";
import AppointmentList from "./AppointmentList";
import ProductArsenal from "./ProductArsenal";
import HistoryList from "./HistoryList";

// --- CONFIGURAÇÃO DE ESTILO ---
const COLORS = {
  bg: "#030303",
  card: "rgba(13, 13, 13, 0.7)",
  accent: "#e11d48",
  border: "rgba(255, 255, 255, 0.05)",
  textMuted: "#666666",
  glow: "rgba(225, 29, 72, 0.15)",
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

const TacticalCard = styled(motion.div)`
  background: ${COLORS.card};
  backdrop-filter: blur(12px);
  border: 1px solid ${COLORS.border};
  border-radius: 24px;
  padding: 30px;
  min-height: 450px;
`;

// --- SUB-COMPONENTE: PERFIL DETALHADO ---
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${COLORS.border};
`;

const AvatarCircle = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid ${COLORS.accent};
  background: ${COLORS.glow};
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
`;

const InfoItem = styled.div`
  background: rgba(255, 255, 255, 0.02);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid ${COLORS.border};
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.55rem;
    color: ${COLORS.accent};
  }
  span {
    font-size: 0.85rem;
    font-weight: 500;
    color: #fff;
  }
`;

function ProfileView({ user }: { user: any }) {
  const phone = user?.primaryPhoneNumber?.phoneNumber || "Não informado";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("pt-BR")
    : "--/--/--";
  const lastLogin = user?.lastSignInAt
    ? new Date(user.lastSignInAt).toLocaleDateString("pt-BR")
    : "Hoje";

  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarCircle>
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="Avatar" />
          ) : (
            <UserIcon size={40} color={COLORS.accent} />
          )}
        </AvatarCircle>
        <div>
          <h3 className="sync" style={{ margin: 0, fontSize: "1.1rem" }}>
            {user?.fullName}
          </h3>
          <p style={{ margin: 0, fontSize: "0.7rem", color: COLORS.textMuted }}>
            ID DE ACESSO: {user?.id?.slice(-10).toUpperCase()}
          </p>
        </div>
      </ProfileHeader>

      <InfoGrid>
        <InfoItem>
          <label className="sync">
            <Phone size={10} /> WhatsApp / Telefone
          </label>
          <span>{phone}</span>
        </InfoItem>
        <InfoItem>
          <label className="sync">
            <Award size={10} /> E-mail Principal
          </label>
          <span>{user?.primaryEmailAddress?.emailAddress}</span>
        </InfoItem>
        <InfoItem>
          <label className="sync">
            <Calendar size={10} /> Agente desde
          </label>
          <span>{memberSince}</span>
        </InfoItem>
        <InfoItem>
          <label className="sync">
            <ShieldCheck size={10} /> Última Atividade
          </label>
          <span>{lastLogin}</span>
        </InfoItem>
      </InfoGrid>

      <button
        className="sync"
        style={{
          background: "transparent",
          border: `1px solid ${COLORS.border}`,
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "10px",
          fontSize: "0.6rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "fit-content",
        }}
        onClick={() => alert("Acesse as configurações do seu perfil no Clerk.")}
      >
        <Settings size={14} /> Ajustar Credenciais
      </button>
    </ProfileContainer>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function ClientDashboard() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [pontos, setPontos] = useState(0);

  // Busca de pontos/XP (vinda do Neon/PostgreSQL futuramente)
  useEffect(() => {
    if (isLoaded && user) {
      // Simulação de busca no banco
      const loadAgentData = async () => {
        // Exemplo: const res = await fetch(`/api/user/${user.id}`);
        setPontos(4); // Exemplo de valor inicial
      };
      loadAgentData();
    }
  }, [isLoaded, user]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <AppointmentList />;
      case "agenda":
        return (
          <BookingForm
            clerkId={user?.id || ""}
            userName={user?.fullName || "Agente"}
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

  if (!isLoaded)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.bg,
        }}
      >
        <Loader2 className="animate-spin" color={COLORS.accent} size={42} />
      </div>
    );

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

          <DashboardGrid>
            <section>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <TacticalCard>
                    <h2
                      className="sync"
                      style={{
                        fontSize: "0.6rem",
                        color: COLORS.accent,
                        marginBottom: "25px",
                      }}
                    >
                      // MÓDULO_SISTEMA: {activeTab.toUpperCase()}
                    </h2>
                    {renderTabContent()}
                  </TacticalCard>
                </motion.div>
              </AnimatePresence>
            </section>

            <aside
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <MiniCard title="LOCALIZAÇÃO" icon={<MapPin size={16} />}>
                <p
                  style={{ fontSize: "0.8rem", margin: "5px 0", color: "#888" }}
                >
                  Unidade Maia - Guarulhos
                </p>
                <button
                  className="sync"
                  style={{
                    width: "100%",
                    background: COLORS.accent,
                    border: "none",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.6rem",
                    fontWeight: "bold",
                    marginTop: "10px",
                  }}
                  onClick={() =>
                    window.open("https://maps.google.com", "_blank")
                  }
                >
                  ABRIR MAPA
                </button>
              </MiniCard>

              <MiniCard
                title="PROGRESSO TOTAL"
                icon={<ShieldCheck size={16} />}
              >
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "900",
                    color: "#fff",
                  }}
                >
                  {pontos} XP
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: COLORS.textMuted,
                    marginTop: "4px",
                  }}
                >
                  Faltam {10 - (pontos % 10)} para recompensa
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "#1a1a1a",
                    marginTop: "12px",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(pontos % 10) * 10}%` }}
                    style={{
                      height: "100%",
                      background: COLORS.accent,
                      boxShadow: `0 0 10px ${COLORS.accent}66`,
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


function MiniCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: any;
  children: any;
}) {
  return (
    <div
      style={{
        background: COLORS.card,
        padding: "25px",
        borderRadius: "24px",
        border: `1px solid ${COLORS.border}`,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: COLORS.accent,
          marginBottom: "15px",
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
