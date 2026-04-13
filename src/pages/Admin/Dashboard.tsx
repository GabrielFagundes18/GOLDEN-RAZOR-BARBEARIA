import styled from 'styled-components';
import { Card } from '../../components';
import { formatCurrency } from '../../utils/formatters';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
`;

export default function Dashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: '30px', color: 'var(--primary)' }}>Visão Geral do Negócio</h2>
      <Grid>
        <Card style={{ borderLeft: '4px solid var(--primary)' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Faturamento Bruto</p>
          <h3 style={{ fontSize: '2rem', marginTop: '10px' }}>{formatCurrency(5420.50)}</h3>
        </Card>
        <Card style={{ borderLeft: '4px solid var(--secondary)' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Atendimentos/Mês</p>
          <h3 style={{ fontSize: '2rem', marginTop: '10px' }}>142</h3>
        </Card>
        <Card style={{ borderLeft: '4px solid #10b981' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Ticket Médio</p>
          <h3 style={{ fontSize: '2rem', marginTop: '10px' }}>{formatCurrency(38.00)}</h3>
        </Card>
      </Grid>
    </div>
  );
}