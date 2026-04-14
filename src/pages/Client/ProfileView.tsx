import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser, useClerk, UserProfile } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Shield, LogOut } from "lucide-react";
import { api } from "../../services/api";

// --- IMPORTAÇÕES DOS SEUS COMPONENTES ---
import { Sidebar } from "./Sidebar";

const COLORS = {
  accent: "#D4AF37",
  bg: "#0A0A0A",
  cardBg: "#111111",
  border: "rgba(212, 175, 55, 0.2)",
  textMain: "#FFFFFF",
  textMuted: "#A0A0A0",
};

// --- STYLED COMPONENTS ---

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${COLORS.bg};
  overflow-x: hidden;
  
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow-y: auto;

  @media (min-width: 1024px) {
    padding: 40px;
  }
`;

const ProfileGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;

  @media (min-width: 1024px) {
    grid-template-columns: 320px 1fr;
  }
`;

const MemberCard = styled(motion.div)`
  background: ${COLORS.cardBg};
  border: 1px solid ${COLORS.border};
  border-radius: 20px;
  padding: 30px;
  height: fit-content;
  text-align: center;
`;

const AvatarWrapper = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid ${COLORS.accent};
    object-fit: cover;
  }
`;

const PointsBadge = styled.div`
  background: linear-gradient(135deg, ${COLORS.accent} 0%, #8a6d3b 100%);
  color: #000;
  padding: 15px;
  border-radius: 12px;
  margin: 20px 0;
  h2 {
    font-size: 26px;
    margin: 0;
    font-weight: 900;
  }
  span {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 800;
  }
`;

const NavItem = styled.button<{ active?: boolean }>`
  width: 100%;
  background: ${(props) =>
    props.active ? "rgba(212, 175, 55, 0.15)" : "transparent"};
  border: none;
  color: ${(props) => (props.active ? COLORS.accent : COLORS.textMuted)};
  padding: 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: 0.3s;
  margin-bottom: 8px;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
`;

const GlassCard = styled.div`
  background: ${COLORS.cardBg};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 25px;
`;

const StatusTag = styled.span`
  background: rgba(212, 175, 55, 0.1);
  color: ${COLORS.accent};
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: bold;
  text-transform: uppercase;
`;

export default function ProfileView() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState<"perfil" | "seguranca">("perfil");
  const [data, setData] = useState({ pontos: 0, recentAppointments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/profile/${user.id}`);
        setData(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  if (!user) return null;

  return (
    <PageWrapper>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={user.firstName || "Operador"}
      />

      <MainContent>
        {/* Banner com pontos dinâmicos vindos da API */}
        

        <ProfileGrid>
          {/* CARTÃO DE IDENTIDADE */}
          <MemberCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AvatarWrapper>
              <img src={user.imageUrl} alt="Foto de Perfil" />
            </AvatarWrapper>
            <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{user.firstName}</h3>
            <p
              style={{
                color: COLORS.textMuted,
                fontSize: "13px",
                marginBottom: "25px",
              }}
            >
              {user.primaryEmailAddress?.emailAddress}
            </p>

            <PointsBadge>
              <span>Saldo Golden</span>
              <h2>{data.pontos}</h2>
            </PointsBadge>

            <nav>
              <NavItem
                active={activeTab === "perfil"}
                onClick={() => setActiveTab("perfil")}
              >
                <User size={18} /> Resumo e Estilo
              </NavItem>
              <NavItem
                active={activeTab === "seguranca"}
                onClick={() => setActiveTab("seguranca")}
              >
                <Shield size={18} /> Conta e Segurança
              </NavItem>
              <NavItem
                onClick={() => signOut()}
                style={{ color: "#ff4d4d", marginTop: "30px" }}
              >
                <LogOut size={18} /> Sair da Conta
              </NavItem>
            </nav>
          </MemberCard>

          {/* CONTEÚDO DINÂMICO */}
          <section style={{ width: "100%" }}>
            <AnimatePresence mode="wait">
              {activeTab === "perfil" ? (
                <motion.div
                  key="perfil"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3
                    style={{
                      letterSpacing: "2px",
                      color: COLORS.accent,
                      marginBottom: "20px",
                      fontSize: "0.9rem",
                    }}
                  >
                    MEU HISTÓRICO //
                  </h3>
                  <GlassCard>
                    {loading ? (
                      <p style={{ color: COLORS.textMuted }}>
                        Carregando dados...
                      </p>
                    ) : data.recentAppointments.length > 0 ? (
                      data.recentAppointments.map((app: any) => (
                        <div
                          key={app.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "18px 0",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <h4 style={{ margin: "0 0 5px 0" }}>
                              {app.servico}
                            </h4>
                            <p
                              style={{
                                fontSize: "13px",
                                color: COLORS.textMuted,
                                margin: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <Calendar size={14} />{" "}
                              {new Date(app.data).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <StatusTag>{app.status}</StatusTag>
                        </div>
                      ))
                    ) : (
                      <p
                        style={{
                          color: COLORS.textMuted,
                          textAlign: "center",
                          padding: "10px",
                        }}
                      >
                        Nenhum serviço registrado.
                      </p>
                    )}
                  </GlassCard>

                  <h3
                    style={{
                      letterSpacing: "2px",
                      color: COLORS.accent,
                      margin: "40px 0 20px 0",
                      fontSize: "0.9rem",
                    }}
                  >
                    DADOS CADASTRAIS //
                  </h3>
                  <GlassCard>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "25px",
                      }}
                    >
                      <div>
                        <small
                          style={{
                            color: COLORS.accent,
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: 700,
                          }}
                        >
                          NOME COMPLETO
                        </small>
                        <span style={{ fontSize: "1.1rem" }}>
                          {user.fullName}
                        </span>
                      </div>
                      <div>
                        <small
                          style={{
                            color: COLORS.accent,
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: 700,
                          }}
                        >
                          MEMBRO DESDE
                        </small>
                        <span style={{ fontSize: "1.1rem" }}>
                          {new Date(user.createdAt!).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div
                  key="seguranca"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3
                    style={{
                      letterSpacing: "2px",
                      color: COLORS.accent,
                      marginBottom: "20px",
                      fontSize: "0.9rem",
                    }}
                  >
                    CONFIGURAÇÕES DE CONTA //
                  </h3>
                  <GlassCard style={{ padding: "10px", overflow: "hidden" }}>
                    <UserProfile
                      routing="hash"
                      appearance={{
                        elements: {
                          rootBox: { width: "100%" },
                          card: {
                            background: "transparent",
                            boxShadow: "none",
                            border: "none",
                            width: "100%",
                          },
                          navbar: { display: "none" },
                          headerTitle: { color: COLORS.accent },
                          headerSubtitle: { color: COLORS.textMuted },
                          userPreviewMainIdentifier: { color: "#fff" },
                          userPreviewSecondaryIdentifier: {
                            color: COLORS.textMuted,
                          },
                          profileSectionTitleText: { color: COLORS.accent },
                          formButtonPrimary: {
                            backgroundColor: COLORS.accent,
                            color: "#000",
                            fontWeight: "bold",
                          },
                        },
                      }}
                    />
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </ProfileGrid>
      </MainContent>
    </PageWrapper>
  );
}
