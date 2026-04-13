import styled from 'styled-components';
import { Sidebar } from '../Sidebar';

const DashboardWrapper = styled.div`
  display: flex;
  background-color: var(--bg);
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px; /* Largura da sidebar */
  padding: 40px;
`;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardWrapper>
      <Sidebar />
      <MainContent>{children}</MainContent>
    </DashboardWrapper>
  );
}