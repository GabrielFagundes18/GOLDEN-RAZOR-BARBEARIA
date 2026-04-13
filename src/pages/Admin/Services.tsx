import { useFetch } from '../../hooks/useFetch';
import { Card, NinjaButton } from '../../components';
import { formatCurrency } from '../../utils/formatters';

export default function Services() {
  const { data: services } = useFetch<any[]>('/servicos');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Tabela de Serviços</h2>
        <NinjaButton style={{ padding: '10px 20px' }}>+ Adicionar</NinjaButton>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {services?.map(s => (
          <Card key={s.id} style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>{s.name}</h3>
            <p style={{ fontSize: '1.8rem', fontWeight: '800' }}>{formatCurrency(s.price)}</p>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '5px 10px', borderRadius: '4px' }}>Editar</button>
              <button style={{ background: 'transparent', color: '#ff4b4b', border: '1px solid #ff4b4b', padding: '5px 10px', borderRadius: '4px' }}>Excluir</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}