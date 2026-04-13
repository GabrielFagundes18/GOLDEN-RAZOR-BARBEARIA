import { useFetch } from '../../hooks/useFetch';
import { Servico } from '../../types'; 

export function ListaDeServicos() {
  // Passamos <Servico[]> para o hook saber que 'data' é um array de serviços
  const { data: services, loading } = useFetch<Servico[]>('/servicos');

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      {services?.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          {/* O VS Code vai te sugerir 'price', 'duration', etc, ao digitar 'item.' */}
          <p>R$ {Number(item.price).toFixed(2)} - {item.duration} min</p>
        </div>
      ))}
    </div>
  );
}