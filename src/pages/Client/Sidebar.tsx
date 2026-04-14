import  { useEffect, useState } from "react";
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

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: var(--bg-color);
    border-bottom: 1px solid var(--border-color);
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
    color: var(--text-color);
  }
`;

const SidebarNav = styled.nav<{ $isOpen: boolean }>`
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: var(--bg-color);
  border-right: 1px solid var(--border-color);
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
    color: var(--text-muted);
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
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 10px;
    &::before {
      content: "";
      width: 4px;
      height: 18px;
      background: var(--primary-color);
      display: inline-block;
      box-shadow: 0 0 10px var(--primary-glow);
    }
  }
  .status {
    font-size: 0.5rem;
    color: var(--text-muted);
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
  background: ${(props) =>
    props.$active ? "var(--primary-glow)" : "transparent"};
  border: none;
  color: ${(props) =>
    props.$active ? "var(--text-color)" : "var(--text-muted)"};
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
    color: var(--text-color);
    background: var(--scanline-color);
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
      background: var(--primary-color);
      box-shadow: 0 0 10px var(--primary-color);
    }
  `}
`;

const FooterAccount = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-bright);
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
      font-size: 0.9rem;
      color: var(--text-color);
      font-weight: 600;
    }
    small {
      display: block;
      font-size: 0.55rem;
      color: var(--primary-color);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
  }
`;

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
    { id: "products", label: "Produtos", icon: Package, path: "/produtos" },
    { id: "history", label: "Histórico", icon: History, path: "/history" },
    {
      id: "profile",
      label: "Perfil",
      icon: User,
      path: "/perfil",
    },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleTabClick = (item: any) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <>
      <MobileHeader>
        <span className="logo-text">GOLDEN RAZOR</span>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-color)",
          }}
        >
          <Menu size={24} />
        </button>
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
        <CloseButton onClick={() => setIsOpen(false)}>
          <X size={20} />
        </CloseButton>

        <LogoSection
          onClick={() => navigate("/dashboardClient")}
          style={{ cursor: "pointer" }}
        >
          <div className="brand">GOLDEN RAZOR</div>
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
            appearance={{
              elements: {
                avatarBox: "w-12 h-12 rounded-full",
              },
            }}
          />
          <div
            className="user-info"
            onClick={() => navigate("/perfil")}
            style={{ cursor: "pointer" }}
          >
            <span>{userName}</span>
            <small>VER PERFIL</small>
          </div>
        </FooterAccount>
      </SidebarNav>
    </>
  );
}
