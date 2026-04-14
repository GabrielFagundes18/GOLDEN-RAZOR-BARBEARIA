import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Scissors,
  User,
  History,
  Package,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

// 1. TEMA REFINADO
const THEME = {
  bg: "#030303",
  surface: "rgba(10, 10, 10, 0.8)",
  accent: "#e11d48",
  accent_low: "rgba(225, 29, 72, 0.1)",
  border: "rgba(255, 255, 255, 0.03)",
  text_main: "#ffffff",
  text_dim: "#555555",
  glass: "blur(15px)",
};

// --- STYLED COMPONENTS RESPONSIVOS ---

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: ${THEME.bg};
    border-bottom: 1px solid ${THEME.border};
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    z-index: 999;
  }

  .logo-text {
    font-family: "Syncopate", sans-serif;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 2px;
  }
`;

const SidebarNav = styled.nav<{ $isOpen: boolean }>`
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: ${THEME.bg};
  border-right: 1px solid ${THEME.border};
  padding: 40px 16px;
  display: flex;
  flex-direction: column;
  z-index: 1001;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 1024px) {
    transform: ${({ $isOpen }) =>
      $isOpen ? "translateX(0)" : "translateX(-100%)"};
    width: 300px;
    box-shadow: ${({ $isOpen }) =>
      $isOpen ? "20px 0 50px rgba(0,0,0,0.8)" : "none"};
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
`;

const CloseButton = styled.button`
  display: none;
  @media (max-width: 1024px) {
    display: block;
    position: absolute;
    top: 20px;
    right: 16px;
    background: none;
    border: none;
    color: ${THEME.text_dim};
    cursor: pointer;
  }
`;

const LogoSection = styled.div`
  padding: 0 12px;
  margin-bottom: 50px;
  .brand {
    font-family: "Syncopate", sans-serif;
    font-size: 0.9rem;
    font-weight: 800;
    letter-spacing: 3px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
    &::before {
      content: "";
      width: 4px;
      height: 18px;
      background: ${THEME.accent};
      display: inline-block;
    }
  }
  .status {
    font-size: 0.5rem;
    color: ${THEME.text_dim};
    margin-top: 8px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
`;

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const NavButton = styled(motion.button)<{ $active: boolean }>`
  background: ${(props) => (props.$active ? THEME.accent_low : "transparent")};
  border: none;
  color: ${(props) => (props.$active ? "#fff" : THEME.text_dim)};
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 100%;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;

  .content {
    display: flex;
    align-items: center;
    gap: 14px;
    z-index: 2;
  }

  span {
    font-size: 0.62rem;
    font-family: "Syncopate", sans-serif;
    font-weight: 700;
    letter-spacing: 1px;
  }

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.03);
  }

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: "";
      position: absolute;
      left: 0;
      width: 2px;
      height: 40%;
      background: ${THEME.accent};
      box-shadow: 0 0 10px ${THEME.accent};
    }
  `}
`;

const FooterAccount = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${THEME.border};
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;

  .user-info {
    flex: 1;
    overflow: hidden;
    span {
      display: block;
      font-size: 0.7rem;
      color: #fff;
      font-weight: 600;
    }
    small {
      display: block;
      font-size: 0.55rem;
      color: ${THEME.accent};
    }
  }
`;

// --- COMPONENTE FINAL ---

export function Sidebar({ activeTab, setActiveTab, userName }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboardClient",
    },
    { id: "agenda", label: "Agendamento", icon: Scissors, path: "/agenda" },
    { id: "products", label: "Arsenal", icon: Package, path: "/produtos" },
    { id: "history", label: "Histórico", icon: History, path: "/history" },
    {
      id: "profile",
      label: "Perfil",
      icon: User,
      path: "/perfil",
    },
  ];

  // Fecha o menu ao mudar de rota (importante para mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleTabClick = (item: any) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <>
      {/* Header visível apenas no Mobile */}
      <MobileHeader>
        <span className="logo-text">GOLDEN RAZOR</span>
        <button
          onClick={() => setIsOpen(true)}
          style={{ background: "none", border: "none", color: "#fff" }}
        >
          <Menu size={24} />
        </button>
      </MobileHeader>

      {/* Overlay para fechar ao clicar fora */}
      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <SidebarNav $isOpen={isOpen}>
        <CloseButton onClick={() => setIsOpen(false)}>
          <X size={20} />
        </CloseButton>

        <LogoSection
          onClick={() => navigate("/dashboardClient")}
          style={{ cursor: "pointer" }}
        >
          <div className="brand">GOLDEN RAZOR</div>
          <div className="status">Sytem Status: Online</div>
        </LogoSection>

        <NavContainer>
          {menu.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.id === "overview" &&
                location.pathname === "/dashboardClient");

            return (
              <NavButton
                key={item.id}
                $active={active}
                onClick={() => handleTabClick(item)}
                whileTap={{ scale: 0.98 }}
              >
                <div className="content">
                  <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight size={12} />}
              </NavButton>
            );
          })}
        </NavContainer>

        <FooterAccount>
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-8 h-8" } }}
          />
          <div
            className="user-info"
            onClick={() => navigate("/dashboardClient/profile")}
            style={{ cursor: "pointer" }}
          >
            <span>{userName || "Membro"}</span>
            <small>Elite Member</small>
          </div>
        </FooterAccount>
      </SidebarNav>
    </>
  );
}
