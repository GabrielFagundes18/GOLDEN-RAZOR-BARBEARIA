import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, UserRound, Scissors } from 'lucide-react'; // Instale lucide-react

const Nav = styled.aside`
  width: 260px;
  height: 100vh;
  background: var(--surface);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: fixed;
`;

const NavLink = styled(Link)<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${props => props.active ? 'var(--primary)' : '#94a3b8'};
  background: ${props => props.active ? 'rgba(0, 242, 255, 0.05)' : 'transparent'};
  border-radius: 8px;
  margin-bottom: 8px;
  transition: 0.2s;
  font-weight: 500;

  &:hover {
    color: var(--primary);
    background: rgba(0, 242, 255, 0.1);
  }
`;

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <Nav>
      <h2 style={{ color: 'var(--primary)', marginBottom: '30px', padding: '0 16px' }}>NINJA DB</h2>
      <NavLink to="/dashboard" active={pathname === '/dashboard'}><LayoutDashboard size={20}/> Resumo</NavLink>
      <NavLink to="/dashboard/agenda" active={pathname === '/dashboard/agenda'}><CalendarDays size={20}/> Agenda</NavLink>
      <NavLink to="/dashboard/clientes" active={pathname === '/dashboard/clientes'}><UserRound size={20}/> Clientes</NavLink>
      <NavLink to="/dashboard/servicos" active={pathname === '/dashboard/servicos'}><Scissors size={20}/> Serviços</NavLink>
    </Nav>
  );
}