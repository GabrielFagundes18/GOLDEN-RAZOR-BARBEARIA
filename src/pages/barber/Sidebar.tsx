import React from "react";
import styled from "styled-components";
import {
  LayoutDashboard,
  History,
  LogOut,
  Scissors,
  Calendar,
  Users,
  ShoppingBag,
  Database,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";



interface NavLinkProps {
  $active?: boolean;
}

const NavLink = styled.button<NavLinkProps>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.7rem 1rem;
  width: 100%;
  border: none;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-size: 0.88rem;
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-bottom: 0.2rem;
  position: relative;

  /* Cores e Estados */
  color: ${(props) =>
    props.$active ? "var(--text-color)" : "var(--text-muted)"};
  background: ${(props) =>
    props.$active ? "rgba(225, 29, 72, 0.05)" : "transparent"};

  &:hover {
    color: var(--text-color);
    background: rgba(255, 255, 255, 0.03);
  }

  /* Indicador lateral minimalista */
  ${(props) =>
    props.$active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: -1rem;
      width: 3px;
      height: 16px;
      background: var(--primary-color);
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 10px var(--primary-glow);
    }
  `}

  svg {
    transition: 0.2s;
    color: ${(props) =>
      props.$active ? "var(--primary-color)" : "var(--text-dark)"};
  }
`;

const SidebarContainer = styled.aside`
  width: 260px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  background: #030303;
  position: sticky;
  top: 0;
  height: 100vh;

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 1rem;
    font-family: "Rajdhani", sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--text-color);
    margin-bottom: 3rem;

    span {
      color: var(--primary-color);
    }
  }

  .nav-group {
    margin-bottom: 1.5rem;

    label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--text-dark);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin: 0 0 0.8rem 1rem;
    }
  }
`;



const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarContainer>
      <div
        className="brand"
        onClick={() => navigate("/barber")}
        style={{ cursor: "pointer" }}
      >
        <Scissors size={20} color="var(--primary-color)" />
        GOLDEN <span> RAZOR</span>
      </div>

      <nav style={{ flex: 1 }}>
        <div className="nav-group">
          <label>Painel Principal</label>
          <NavLink
            $active={isActive("/barber")}
            onClick={() => navigate("/barber")}
          >
            <LayoutDashboard size={18} /> Overview
          </NavLink>
          <NavLink
            $active={isActive("/barber/agenda")}
            onClick={() => navigate("/barber/agenda")}
          >
            <Calendar size={18} /> Agenda de Cortes
          </NavLink>
          <NavLink
            $active={isActive("/barber/clientes")}
            onClick={() => navigate("/barber/clientes")}
          >
            <Users size={18} /> Base de Clientes
          </NavLink>
        </div>

        <div className="nav-group">
          <label>Inventário & Loja</label>
          <NavLink
            $active={isActive("/barber/vendas")}
            onClick={() => navigate("/barber/vendas")}
          >
            <ShoppingBag size={18} /> Arsenal de Vendas
          </NavLink>
        </div>

        <div className="nav-group">
          <label>Historicos</label>
          <NavLink
            $active={isActive("/barber/HistoricoGlobal")}
            onClick={() => navigate("/barber/HistoricoGlobal")}
          >
            <History size={18} /> Histórico de Serviços
          </NavLink>
          <NavLink
            $active={isActive("/barber/HistoricoVendas")}
            onClick={() => navigate("/barber/HistoricoVendas")}
          >
            <Database size={18} /> Histórico de Produtos
          </NavLink>
         
        </div>
      </nav>

      

      <NavLink
        $active={false}
        style={{ marginTop: "1rem", color: "var(--text-dark)", border: "none" }}
        onClick={() => navigate("/login")}
      >
        <LogOut size={18} /> Encerrar Sessão
      </NavLink>
    </SidebarContainer>
  );
};

export default Sidebar;
