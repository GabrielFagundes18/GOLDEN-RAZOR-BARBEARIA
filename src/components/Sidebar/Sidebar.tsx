import React, { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import {
  LayoutDashboard,
  Users,
  Scissors,
  Calendar,
  DollarSign,
  LogOut,
  History,
  Package,
  Menu,
  User,
  Database,
  ChevronLeft,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";

const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  width: ${(props) => (props.$isOpen ? "280px" : "80px")};
  background: #080808;
  border-right: 1px solid rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    position: fixed;
    left: ${(props) => (props.$isOpen ? "0" : "-100%")};
    width: 280px;
    transition: left 0.3s ease;
  }
`;

const NavItem = styled.button<{ $active?: boolean; $isOpen: boolean }>`
  all: unset;
  display: flex;
  align-items: center;
  /* Ajuste de padding para manter o ícone centralizado quando fechado */
  padding: 0.8rem ${(props) => (props.$isOpen ? "1.2rem" : "0.8rem")};
  justify-content: ${(props) => (props.$isOpen ? "flex-start" : "center")};
  border-radius: 10px;
  cursor: pointer;
  /* Margem lateral reduzida quando fechado para evitar que o botão saia do container */
  margin: 0.2rem ${(props) => (props.$isOpen ? "0.8rem" : "0.4rem")};
  color:  "#a0a0a0";

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  width: ${(props) => (props.$isOpen ? "auto" : "40px")}; /* Garante um círculo/quadrado perfeito se fechado */

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
  }

  svg {
    min-width: 22px;
    font-size: 22px;
    stroke-width: ${(props) => (props.$active ? "2.5px" : "1.8px")};
    flex-shrink: 0; /* Impede o ícone de amassar */
  }

  span {
    margin-left: 14px;
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
    /* Substituímos display:none por propriedades que permitem animação */
    opacity: ${(props) => (props.$isOpen ? "1" : "0")};
    visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
    max-width: ${(props) => (props.$isOpen ? "200px" : "0")};
    transition: opacity 0.2s ease, max-width 0.3s ease;
    overflow: hidden;
  }
`;
const FloatingBtn = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 1001;
    background: transparent;
    border: none;
    width: 56px;
    height: 56px;
    align-items: center;
    justify-content: center;
    color: #ffffff;
  }
`;

const Overlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: ${(props) => (props.$visible ? "block" : "none")};
`;

const LogoWrapper = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  justify-content: space-between;

  .logo {
    font-family: "Rajdhani", sans-serif;
    font-weight: 700;
    color: #fff;
    font-size: 1.2rem;
    letter-spacing: 2px;
  }
`;

/* ================= MENUS POR ROLE ================= */

const menuByRole = {
  client: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/client" },
    { label: "Agendamento", icon: Scissors, path: "agenda" },
    { label: "Produtos", icon: Package, path: "produtos" },
    { label: "Histórico", icon: History, path: "historico" },
    { label: "Perfil", icon: User, path: "perfil" },
  ],

  barber: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/barber" },
    { label: "Novo Corte", icon: Scissors, path: "novo" },
    { label: "Agenda", icon: Calendar, path: "agenda" },
    { label: "Clientes", icon: Users, path: "clientes" },
    { label: "Vendas", icon: DollarSign, path: "vendas" },
    { label: "Histórico", icon: History, path: "historico" },
     { label: "Histórico de Vendas", icon: History, path: "HistoricoVendas" },
  ],

  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Agenda", icon: Calendar, path: "agenda" },
    { label: "Clientes", icon: Users, path: "clientes" },
    { label: "Equipe", icon: Scissors, path: "equipe" },
    { label: "Financeiro", icon: DollarSign, path: "financeiro" },
    { label: "Produtos", icon: Database, path: "produtos" },
    { label: "Histórico", icon: History, path: "historico" },
  ],
};

/* ================= COMPONENTE ================= */

export const Sidebar = memo(() => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();

  const role = (user?.publicMetadata?.role as string) || "client";
  const menuItems = menuByRole[role as keyof typeof menuByRole] || [];

  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebar_pref");
    return saved !== null ? JSON.parse(saved) : window.innerWidth > 768;
  });

  useEffect(() => {
    if (window.innerWidth > 768) {
      localStorage.setItem("sidebar_pref", JSON.stringify(isOpen));
    }
  }, [isOpen]);

  const toggle = useCallback(() => setIsOpen((prev: any) => !prev), []);

  const goTo = useCallback(
    (path: string) => {
      navigate(path);
      if (window.innerWidth <= 768) setIsOpen(false);
    },
    [navigate]
  );

  return (
    <>
      <FloatingBtn onClick={toggle}>
        <Menu size={24} />
      </FloatingBtn>

      <Overlay
        $visible={isOpen && window.innerWidth <= 768}
        onClick={() => setIsOpen(false)}
      />

      <SidebarContainer $isOpen={isOpen}>
        <LogoWrapper>
          {isOpen ? (
            <div className="logo">GOLDEN RAZOR</div>
          ) : (
            <Scissors color="#d4af37" size={24} />
          )}

          <button
            onClick={toggle}
            style={{
              background: "none",
              border: "none",
              color: "#d4af37",
              cursor: "pointer",
            }}
          >
            <ChevronLeft
              size={20}
              style={{
                transform: isOpen ? "none" : "rotate(180deg)",
                transition: "0.3s",
              }}
            />
          </button>
        </LogoWrapper>

        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);

            return (
              <NavItem
                key={item.path}
                $isOpen={isOpen}
                $active={isActive}
                onClick={() => goTo(item.path)}
                title={!isOpen ? item.label : ""}
              >
                <Icon size={22} />
                <span>{item.label}</span>
              </NavItem>
            );
          })}
        </nav>

        <div style={{ padding: "1rem" }}>
          <NavItem
            $isOpen={isOpen}
            onClick={() => signOut()}
            style={{ color: "#ff4d4d" }}
          >
            <LogOut size={25} />
            <span>Sair</span>
          </NavItem>
        </div>
      </SidebarContainer>
    </>
  );
});

export default Sidebar;