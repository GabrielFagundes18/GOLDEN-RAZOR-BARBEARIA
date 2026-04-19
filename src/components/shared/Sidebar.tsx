import styled from 'styled-components';
import { LayoutDashboard, Users, Scissors, LogOut, Clock } from 'lucide-react';

const SidebarContainer = styled.aside`
  width: 260px;
  background-color: #09090b;
  height: 100vh;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
`;

const NavItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #a1a1aa;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: 0.2s;

  &:hover { background: #18181b; color: white; }
  &.active { background: #2563eb; color: white; }
`;

export const Sidebar = ({ role }: { role: 'admin' | 'barber' }) => {
  return (
    <SidebarContainer>
      <h2 style={{ color: 'white', marginBottom: '2rem' }}>Ninja<span>Barber</span></h2>
      
      {role === 'admin' ? (
        <>
          <NavItem href="/admin/dashboard" className="active"><LayoutDashboard size={20}/> Dashboard</NavItem>
          <NavItem href="/admin/employees"><Users size={20}/> Equipe</NavItem>
          <NavItem href="/admin/services"><Scissors size={20}/> Serviços</NavItem>
        </>
      ) : (
        <>
          <NavItem href="/barber/dashboard" className="active"><Clock size={20}/> Minha Agenda</NavItem>
          <NavItem href="/barber/history"><LayoutDashboard size={20}/> Histórico</NavItem>
        </>
      )}
      
      <NavItem href="#" style={{ marginTop: 'auto' }}><LogOut size={20}/> Sair</NavItem>
    </SidebarContainer>
  );
};