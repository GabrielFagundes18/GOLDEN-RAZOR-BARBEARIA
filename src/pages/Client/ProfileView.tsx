import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser, useClerk, UserProfile } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import {

  Calendar,

  Shield,
  LogOut,
  User as UserIcon,
  Scissors,
  ChevronRight,
  MapPin,
  Star,
  Zap,
} from "lucide-react";
import { api } from "../../services/api";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  color: #fff;
  font-family: "Inter", sans-serif;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 80px 20px 20px;
  }
`;

const WelcomeHeader = styled.div`
  margin-bottom: 40px;
  h1 {
    font-size: 2.5rem;
    font-weight: 900;
    letter-spacing: -1px;
    margin: 0;
  }
  span {
    color: #d4af37;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 3px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 30px;
  position: relative;
  overflow: hidden;
`;

const PointsCard = styled(Card)`
  background: linear-gradient(135deg, #d4af37 0%, #aa8a2e 100%);
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .label {
    font-weight: 800;
    font-size: 0.7rem;
    text-transform: uppercase;
    opacity: 0.8;
  }
  .value {
    font-size: 4rem;
    font-weight: 900;
    line-height: 1;
    margin: 10px 0;
  }
`;

const TabButton = styled.button<{ active: boolean }>`
  all: unset;
  width: 100%;
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: 0.2s;
  background: ${(props) =>
    props.active ? "rgba(214, 175, 55, 0.1)" : "transparent"};
  color: ${(props) => (props.active ? "#d4af37" : "#888")};
  border: 1px solid
    ${(props) => (props.active ? "rgba(214, 175, 55, 0.2)" : "transparent")};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
`;

const AppointmentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  margin-bottom: 12px;
  border: 1px solid transparent;
  transition: 0.3s;

  &:hover {
    border-color: #d4af37;
    background: rgba(214, 175, 55, 0.02);
  }

  .info {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .icon-box {
    background: #1a1a1a;
    padding: 10px;
    border-radius: 12px;
    color: #d4af37;
  }
`;

const Badge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  background: ${(props) =>
    props.status === "concluido" ? "#10b98120" : "#d4af3720"};
  color: ${(props) => (props.status === "concluido" ? "#10b981" : "#d4af37")};
`;

// --- COMPONENTE PRINCIPAL ---
export default function ProfileView() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState("overview");
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function syncAndFetch() {
      if (!isLoaded || !user) return;
      try {
        // 1. Sync
        await api.post("/perfis/sync", {
          clerk_id: user.id,
          nome: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        });
        // 2. Fetch
        const res = await api.get(`/profile/${user.id}`);
        setDbData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    syncAndFetch();
  }, [isLoaded, user]);

  if (!isLoaded || loading)
    return <div style={{ background: "#0a0a0a", height: "100vh" }} />;

  return (
    <PageContainer>
      <ContentArea>
        <WelcomeHeader>
          <span>MEMBRO EXCLUSIVO // ARSENAL</span>
          <h1>Fala, {user?.firstName} </h1>
        </WelcomeHeader>

        <Grid>
          {/* COLUNA ESQUERDA: PERFIL E PONTOS */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <PointsCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Zap size={24} style={{ marginBottom: 10 }} />
              <div className="label">Saldo de Fidelidade</div>
              <div className="value">{dbData?.pontos || 0}</div>
              <div className="label">Troque por cortes grátis</div>
            </PointsCard>

            <Card>
              <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <img
                  src={user?.imageUrl}
                  alt="Avatar"
                  style={{
                    width: 80,
                    borderRadius: "50%",
                    border: "2px solid #d4af37",
                  }}
                />
                <h3 style={{ margin: "15px 0 5px" }}>{user?.fullName}</h3>
                <p style={{ color: "#666", fontSize: "0.8rem" }}>
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>

              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
              >
                <UserIcon size={18} /> Resumo da Conta
              </TabButton>
              <TabButton
                active={activeTab === "settings"}
                onClick={() => setActiveTab("settings")}
              >
                <Shield size={18} /> Configurações
              </TabButton>
              <TabButton
                active={false}
                onClick={() => signOut()}
                style={{ color: "#ef4444" }}
              >
                <LogOut size={18} /> Sair da Conta
              </TabButton>
            </Card>
          </div>

          {/* COLUNA DIREITA: CONTEÚDO DINÂMICO */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <AnimatePresence mode="wait">
              {activeTab === "overview" ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "25px",
                      }}
                    >
                      <h4 style={{ margin: 0, letterSpacing: "1px" }}>
                        ÚLTIMOS AGENDAMENTOS
                      </h4>
                      <Scissors size={18} color="#d4af37" />
                    </div>

                    {dbData?.recentAppointments?.length > 0 ? (
                      dbData.recentAppointments.map((app: any) => (
                        <AppointmentRow key={app.id}>
                          <div className="info">
                            <div className="icon-box">
                              <Calendar size={20} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700 }}>
                                {app.servico}
                              </div>
                              <div
                                style={{ fontSize: "0.75rem", color: "#666" }}
                              >
                                {new Date(app.data).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "15px",
                            }}
                          >
                            <Badge status={app.status}>{app.status}</Badge>
                            <ChevronRight size={16} color="#333" />
                          </div>
                        </AppointmentRow>
                      ))
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px",
                          color: "#444",
                        }}
                      >
                        <p>Você ainda não realizou nenhum corte.</p>
                        <button
                          style={{
                            background: "#d4af37",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Agendar Agora
                        </button>
                      </div>
                    )}
                  </Card>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                      marginTop: "20px",
                    }}
                  >
                    <Card>
                      <Star size={20} color="#d4af37" />{" "}
                      <h5 style={{ margin: "10px 0" }}>Membro desde</h5>{" "}
                      <p style={{ color: "#888" }}>
                        {new Date(user?.createdAt || "").getFullYear()}
                      </p>
                    </Card>
                    <Card>
                      <MapPin size={20} color="#d4af37" />{" "}
                      <h5 style={{ margin: "10px 0" }}>Unidade Favorita</h5>{" "}
                      <p style={{ color: "#888" }}>Arsenal Matriz</p>
                    </Card>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Card style={{ padding: 0, overflow: "hidden" }}>
                    <UserProfile routing="hash" />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Grid>
      </ContentArea>
    </PageContainer>
  );
}
