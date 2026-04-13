import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  Scissors,
  User,
  History,
  Package,
  Menu,
  X,
} from "lucide-react";

const THEME = {
  bg: "#050505",
  surface: "#0a0a0a",
  accent: "#e11d48",
  border: "rgba(255, 255, 255, 0.05)",
  text_dim: "#666666",
  primary_glow: "rgba(225, 29, 72, 0.08)",
};

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName?: string | null;
}

// --- STYLED COMPONENTS ---

const SidebarNav = styled.nav<{ $isOpen: boolean }>`
  width: 260px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: ${THEME.bg};
  border-right: 1px solid ${THEME.border};
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) {
    transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(-100%)")};
    width: 280px;
    box-shadow: 20px 0 50px rgba(0, 0, 0, 0.8);
  }
`;

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

  .logo-mobile {
    font-family: "Syncopate", sans-serif;
    font-size: 0.7rem;
    letter-spacing: 2px;
    color: #fff;
  }
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const NavButton = styled(motion.button)<{ $active: boolean }>`
  background: ${(props) => (props.$active ? THEME.primary_glow : "transparent")};
  border: none;
  border-left: 3px solid ${(props) => (props.$active ? THEME.accent : "transparent")};
  color: ${(props) => (props.$active ? "#fff" : THEME.text_dim)};
  padding: 16px 20px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  width: 100%;
  border-radius: 0 8px 8px 0;
  
  span {
    font-size: 0.65rem;
    font-family: "Syncopate", sans-serif;
    font-weight: 700;
    letter-spacing: 1px;
  }

  svg {
    color: ${(props) => (props.$active ? THEME.accent : THEME.text_dim)};
  }
`;

const LogoSection = styled.div`
  margin-bottom: 60px;
  text-align: center;
  h1 { font-family: "Syncopate", sans-serif; font-size: 1rem; letter-spacing: 4px; color: #fff; margin: 0; }
  .line { height: 2px; background: ${THEME.accent}; width: 40px; margin: 12px auto; box-shadow: 0 0 10px ${THEME.accent}; }

  @media (max-width: 1024px) {
    margin-bottom: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    .line { margin: 12px 0; }
  }
`;

const FooterAccount = styled.div`
  margin-top: auto;
  border-top: 1px solid ${THEME.border};
  padding-top: 25px;
  display: flex;
  align-items: center;
  gap: 12px;

  .user-info {
    display: flex;
    flex-direction: column;
    span { font-size: 0.75rem; font-weight: 800; color: #fff; text-transform: uppercase; }
    small { font-size: 0.6rem; color: ${THEME.text_dim}; }
  }
`;

const Overlay = styled(motion.div)`
  display: none;
  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 998;
  }
`;

export function Sidebar({ activeTab, setActiveTab, userName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { id: "overview", label: "Início", icon: LayoutDashboard },
    { id: "agenda", label: "Agendar", icon: Scissors },
    { id: "products", label: "Arsenal", icon: Package },
    { id: "history", label: "Histórico", icon: History },
    { id: "profile", label: "Minha Conta", icon: User },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      <MobileHeader>
        <span className="logo-mobile">GOLDEN RAZOR</span>
        <MenuButton onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </MenuButton>
      </MobileHeader>

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
        <LogoSection>
          <div>
            <h1>GOLDEN RAZOR</h1>
            <div className="line" />
          </div>
          {isOpen && (
            <MenuButton onClick={() => setIsOpen(false)} style={{ display: 'block' }}>
              <X size={24} color={THEME.accent} />
            </MenuButton>
          )}
        </LogoSection>

        <div style={{ flex: 1 }}>
          {menu.map((item) => (
            <NavButton
              key={item.id}
              $active={activeTab === item.id}
              onClick={() => handleTabClick(item.id)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.97 }}
            >
              <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span>{item.label}</span>
            </NavButton>
          ))}
        </div>

        <FooterAccount>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: 38,
                  height: 38,
                  border: `2px solid ${THEME.accent}`,
                },
              },
            }}
          />
          <div 
  className="user-info" 
  onClick={() => setActiveTab("profile")} 
  style={{ cursor: "pointer" }} 
>
  <span>{userName || "Agente"}</span>
  <small style={{ color: THEME.accent }}>Ver Perfil</small>
</div>
        </FooterAccount>
      </SidebarNav>
    </>
  );
}