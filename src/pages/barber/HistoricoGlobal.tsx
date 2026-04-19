import { useState, useEffect } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Scissors, 
  Calendar as CalendarIcon,
  Download
} from "lucide-react";

const Container = styled.div`
  padding: 2rem;
  background: var(--bg-color);
  min-height: 100vh;
  color: var(--text-color);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 4px;
  position: relative;

  h4 { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; }
  .value { color: var(--gold-color); font-size: 1.8rem; font-weight: 800; font-family: 'Rajdhani'; }
  .icon-bg { position: absolute; right: 1rem; bottom: 1rem; opacity: 0.1; color: var(--primary-color); }
`;

const TableWrapper = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr;
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;

  &.header { background: var(--bg-darker); color: var(--gold-color); font-weight: bold; font-size: 0.8rem; }
  &:last-child { border-bottom: none; }
`;

export const HistoricoGlobal = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalFaturado: 0, totalServicos: 0 });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/barber/relatorios/geral");
        setHistory(data.transacoes);
        setStats(data.resumo);
      } catch (err) {
        console.error("Erro ao carregar histórico");
      }
    };
    fetchHistory();
  }, []);

  return (
    <Container>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button onClick={() => navigate("/barber")} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> PAINEL
          </button>
          <h2 style={{ color: 'var(--text-color)', letterSpacing: '2px' }}>HISTÓRICO GLOBAL</h2>
        </div>
        <button style={{ background: 'var(--card-color)', border: '1px solid var(--border-bright)', color: 'white', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', gap: '8px' }}>
          <Download size={18} /> EXPORTAR PDF
        </button>
      </header>

      <StatsGrid>
        <StatCard>
          <h4>Faturamento Total</h4>
          <div className="value">R$ {stats.totalFaturado.toFixed(2)}</div>
          <DollarSign className="icon-bg" size={48} />
        </StatCard>
        <StatCard>
          <h4>Serviços Realizados</h4>
          <div className="value">{stats.totalServicos}</div>
          <Scissors className="icon-bg" size={48} />
        </StatCard>
        <StatCard>
          <h4>Média por Atendimento</h4>
          <div className="value">R$ {(stats.totalFaturado / (stats.totalServicos || 1)).toFixed(2)}</div>
          <TrendingUp className="icon-bg" size={48} />
        </StatCard>
      </StatsGrid>

      <TableWrapper>
        <TableRow className="header">
          <span>DATA</span>
          <span>CLIENTE</span>
          <span>SERVIÇO</span>
          <span>VALOR</span>
        </TableRow>
        {history.map((item, index) => (
          <TableRow key={index}>
            <span style={{ color: 'var(--text-muted)' }}>{new Date(item.data).toLocaleDateString()}</span>
            <span style={{ fontWeight: 'bold' }}>{item.cliente}</span>
            <span style={{ color: 'var(--primary-color)' }}>{item.servico}</span>
            <span style={{ color: 'var(--gold-color)', fontWeight: 'bold' }}>R$ {item.valor}</span>
          </TableRow>
        ))}
      </TableWrapper>
    </Container>
  );
};