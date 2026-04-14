import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser, useClerk, UserProfile } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Shield, LogOut } from "lucide-react";
import { api } from "../../services/api";

import { Sidebar } from "./Sidebar";

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-color);
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow-y: auto;
  /* Ajuste para Sidebar Desktop se necessário */
  margin-left: 260px;

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 100px 20px 40px 20px;
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
  background: var(--card-color);
  border: 1px solid var(--border-color);
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
    border: 2px solid var(--gold-color);
    object-fit: cover;
    box-shadow: 0 0 15px var(--gold-glow);
  }
`;

const PointsBadge = styled.div`
  background: linear-gradient(
    135deg,
    var(--gold-color) 0%,
    var(--gold-bright) 100%
  );
  color: #000;
  padding: 15px;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 10px 20px -5px var(--gold-glow);

  h2 {
    font-size: 26px;
    margin: 0;
    font-weight: 900;
  }
  span {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 1px;
  }
`;

const NavItem = styled.button<{ active?: boolean }>`
  width: 100%;
  background: ${(props) =>
    props.active ? "var(--primary-glow)" : "transparent"};
  border: none;
  color: ${(props) =>
    props.active ? "var(--primary-color)" : "var(--text-muted)"};
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
    background: var(--scanline-color);
    color: var(--text-color);
  }
`;

const GlassCard = styled.div`
  background: var(--card-glass);
  border: 1px solid var(--border-color);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
`;

const StatusTag = styled.span`
  background: var(--primary-glow);
  color: var(--primary-color);
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
        <ProfileGrid>
          <MemberCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AvatarWrapper>
              <img src={user.imageUrl} alt="Foto de Perfil" />
            </AvatarWrapper>
            <h3
              style={{
                margin: 0,
                fontSize: "1.2rem",
                color: "var(--text-color)",
              }}
            >
              {user.firstName}
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
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
                style={{ color: "var(--error-color)", marginTop: "30px" }}
              >
                <LogOut size={18} /> Sair da Conta
              </NavItem>
            </nav>
          </MemberCard>

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
                      color: "var(--primary-color)",
                      marginBottom: "20px",
                      fontSize: "0.9rem",
                      fontWeight: 900,
                    }}
                  >
                    MEU HISTÓRICO //
                  </h3>
                  <GlassCard>
                    {loading ? (
                      <p style={{ color: "var(--text-muted)" }}>
                        Acessando banco de dados...
                      </p>
                    ) : data.recentAppointments.length > 0 ? (
                      data.recentAppointments.map((app: any) => (
                        <div
                          key={app.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "18px 0",
                            borderBottom: "1px solid var(--border-color)",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                margin: "0 0 5px 0",
                                color: "var(--text-color)",
                              }}
                            >
                              {app.servico}
                            </h4>
                            <p
                              style={{
                                fontSize: "13px",
                                color: "var(--text-muted)",
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
                          color: "var(--text-muted)",
                          textAlign: "center",
                          padding: "10px",
                        }}
                      >
                        Nenhum registro encontrado no arsenal.
                      </p>
                    )}
                  </GlassCard>

                  <h3
                    style={{
                      letterSpacing: "2px",
                      color: "var(--primary-color)",
                      margin: "40px 0 20px 0",
                      fontSize: "0.9rem",
                      fontWeight: 900,
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
                            color: "var(--primary-color)",
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: 900,
                            fontSize: "10px",
                          }}
                        >
                          NOME COMPLETO
                        </small>
                        <span
                          style={{
                            fontSize: "1.1rem",
                            color: "var(--text-color)",
                          }}
                        >
                          {user.fullName}
                        </span>
                      </div>
                      <div>
                        <small
                          style={{
                            color: "var(--primary-color)",
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: 900,
                            fontSize: "10px",
                          }}
                        >
                          MEMBRO DESDE
                        </small>
                        <span
                          style={{
                            fontSize: "1.1rem",
                            color: "var(--text-color)",
                          }}
                        >
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
                      color: "var(--primary-color)",
                      marginBottom: "20px",
                      fontSize: "0.9rem",
                      fontWeight: 900,
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
                          headerTitle: { color: "var(--primary-color)" },
                          headerSubtitle: { color: "var(--text-muted)" },
                          userPreviewMainIdentifier: {
                            color: "var(--text-color)",
                          },
                          userPreviewSecondaryIdentifier: {
                            color: "var(--text-muted)",
                          },
                          profileSectionTitleText: {
                            color: "var(--primary-color)",
                          },
                          formButtonPrimary: {
                            backgroundColor: "var(--primary-color)",
                            color: "#fff",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          },
                          formFieldLabel: { color: "var(--text-muted)" },
                          formFieldInput: {
                            background: "var(--bg-darker)",
                            border: "1px solid var(--border-color)",
                            color: "var(--text-color)",
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
