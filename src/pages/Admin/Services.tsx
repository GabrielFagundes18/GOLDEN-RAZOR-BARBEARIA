import styled from 'styled-components';
import { Servico } from '../../types';

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ServiceCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  
  .price { font-weight: bold; color: #16a34a; font-size: 1.2rem; }
`;

const AdminServices = () => {
  const meusServicos: Servico[] = [
    { id: 1, name: "Corte", price: 50, duration: 30, is_active: true },
    { id: 2, name: "Barba", price: 35, duration: 20, is_active: true }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2>Gerenciar Serviços</h2>
        <button style={{ background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none' }}>
          + Novo Serviço
        </button>
      </div>

      <ServiceGrid>
        {meusServicos.map(s => (
          <ServiceCard key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.duration} min</p>
            <span className="price">R$ {s.price.toFixed(2)}</span>
            <div style={{ marginTop: '1rem', color: s.is_active ? 'green' : 'red' }}>
              {s.is_active ? '● Ativo' : '● Inativo'}
            </div>
          </ServiceCard>
        ))}
      </ServiceGrid>
    </div>
  );
};

export default AdminServices;