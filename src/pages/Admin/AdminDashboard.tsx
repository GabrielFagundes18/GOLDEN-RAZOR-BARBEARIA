import React from 'react';
import styled from 'styled-components';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

const AdminContainer = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Sidebar = styled.aside`
  background: #09090b;
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainContent = styled.main`
  background: #f4f4f5;
  padding: 2.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  
  .label { color: #71717a; font-size: 0.8rem; text-transform: uppercase; font-weight: 600; }
  .value { font-size: 2rem; font-weight: 800; margin: 0.5rem 0; color: #18181b; }
  .trend { color: #10b981; font-size: 0.85rem; font-weight: 600; }
`;

const TableSection = styled.section`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e4e4e7;
  
  h3 { margin-bottom: 1.5rem; }
`;

const CustomTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th { text-align: left; padding: 12px; border-bottom: 2px solid #f4f4f5; color: #71717a; }
  td { padding: 12px; border-bottom: 1px solid #f4f4f5; }
`;

export const AdminDashboard = () => {
  return (
    <AdminContainer>
      <Sidebar>
        <h2 style={{ color: '#2563eb' }}>Ninja Barber</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span>Dashboard</span>
          <span style={{ opacity: 0.5 }}>Equipe</span>
          <span style={{ opacity: 0.5 }}>Serviços</span>
          <span style={{ opacity: 0.5 }}>Configurações</span>
        </nav>
      </Sidebar>

      <MainContent>
        <h2 style={{ marginBottom: '2rem' }}>Visão Geral do Negócio</h2>
        
        <StatsGrid>
          <StatCard>
            <div className="label">Receita Estimada</div>
            <div className="value">R$ 4.250</div>
            <div className="trend">+12% este mês</div>
          </StatCard>
          <StatCard>
            <div className="label">Clientes Novos</div>
            <div className="value">48</div>
            <div className="trend">+5% este mês</div>
          </StatCard>
          <StatCard>
            <div className="label">Cortes Realizados</div>
            <div className="value">112</div>
            <div className="trend">Meta: 150</div>
          </StatCard>
        </StatsGrid>

        <TableSection>
          <h3>Últimos Agendamentos da Equipe</h3>
          <CustomTable>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Barbeiro</th>
                <th>Serviço</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gabriel Oliveira</td>
                <td>Marcos Ninja</td>
                <td>Corte + Barba</td>
                <td><span style={{ color: '#16a34a' }}>Concluído</span></td>
              </tr>
              <tr>
                <td>Ricardo Souza</td>
                <td>João Barber</td>
                <td>Degradê</td>
                <td><span style={{ color: '#ca8a04' }}>Pendente</span></td>
              </tr>
            </tbody>
          </CustomTable>
        </TableSection>
      </MainContent>
    </AdminContainer>
  );
};