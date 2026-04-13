import { useFetch } from '../../hooks/useFetch';
import { Card } from '../../components';
import { formatDate } from '../../utils/formatters';

export default function Agenda() {
  const { data: appointments, loading } = useFetch<any[]>('/agendamentos');

  return (
    <div>
      <h2 style={{ marginBottom: '25px' }}>Agenda Próxima</h2>
      {loading ? <p>Carregando dados do servidor...</p> : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {appointments?.map(app => (
            <Card key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{app.customer_name}</strong>
                <p style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{app.service_name}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 'bold', display: 'block' }}>{formatDate(app.appointment_date)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}