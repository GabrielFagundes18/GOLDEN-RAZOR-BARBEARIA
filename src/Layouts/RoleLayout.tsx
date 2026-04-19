import { useUser } from "@clerk/clerk-react"; // Ajuste conforme seu pacote
import { Navigate, Outlet } from "react-router-dom";
import styled from "styled-components";

// 1. Tipagem dos metadados do Clerk
interface UserMetadata {
  role?: 'admin' | 'barber' | 'customer';
}

// Estilos com Styled Components
const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
`;

const Sidebar = styled.aside`
  width: 256px;
  background-color: #09090b; // Zinco 950 (Estilo Ninja)
  color: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
`;

const Logo = styled.h1`
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 2rem;
  
  span {
    color: #2563eb;
  }
`;

export const RoleLayout = ({ allowedRole }: { allowedRole: 'admin' | 'barber' }) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Carregando...</div>;

  // 2. Forçamos o TypeScript a entender o tipo do publicMetadata
  const metadata = user?.publicMetadata as UserMetadata;
  const userRole = metadata?.role;

  // 3. Verificação de segurança
  if (userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return (
    <LayoutWrapper>
      <Sidebar>
        <Logo>Ninja<span>Barber</span></Logo>
        {/* Adicione seus NavLinks aqui depois */}
      </Sidebar>
      
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutWrapper>
  );
};