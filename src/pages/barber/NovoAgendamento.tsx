import { useState, useEffect } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Scissors, Clock, Check } from "lucide-react";

const Container = styled.div`
  padding: 2rem;
  background: var(--bg-color);
  min-height: 100vh;
  color: var(--text-color);
`;

const FormCard = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background: var(--card-color);
  border: 1px solid var(--border-color);
  padding: 2.5rem;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--gold-color);
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }
  input, select {
    width: 100%;
    background: var(--bg-darker);
    border: 1px solid var(--border-bright);
    padding: 12px;
    color: white;
    outline: none;
    transition: 0.3s;
    &:focus { border-color: var(--primary-color); box-shadow: 0 0 10px var(--primary-glow); }
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 15px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: 0.3s;

  &:hover {
    background: var(--secondary-color);
    box-shadow: 0 0 20px var(--primary-glow);
    transform: translateY(-2px);
  }
`;

export const NovoAgendamento = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cliente: "",
    servico_id: "",
    barbeiro_id: "",
    data: "",
    hora: ""
  });

  // Aqui você deve buscar os dados reais do seu banco
  const [servicos, setServicos] = useState([{id: 1, name: 'Corte'}, {id: 2, name: 'Barba'}]);
  const [barbeiros, setBarbeiros] = useState([{id: 1, name: 'Gabriel'}, {id: 2, name: 'Lucas'}]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataFormatada = `${formData.data}T${formData.hora}:00`;
      
      await api.post("/agendamentos/manual", {
        cliente: formData.cliente,
        servico_id: formData.servico_id,
        barbeiro_id: formData.barbeiro_id,
        data: dataFormatada,
        clerk_id: "OFFLINE_CLIENT" // Para diferenciar agendamentos manuais
      });

      alert("Agendamento realizado com sucesso!");
      navigate("/barber/agenda");
    } catch (error) {
      alert("Erro ao agendar. Verifique o horário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <button 
        onClick={() => navigate("/barber")}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}
      >
        <ArrowLeft size={16} /> VOLTAR AO PAINEL
      </button>

      <FormCard onSubmit={handleSubmit}>
        <h2 style={{ color: 'var(--gold-color)', marginBottom: '2rem', textAlign: 'center' }}>NOVO AGENDAMENTO</h2>
        
        <InputGroup>
          <label><User size={16}/> Nome do Cliente</label>
          <input 
            required
            placeholder="Ex: João Silva" 
            onChange={(e) => setFormData({...formData, cliente: e.target.value})}
          />
        </InputGroup>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputGroup>
            <label><Scissors size={16}/> Serviço</label>
            <select required onChange={(e) => setFormData({...formData, servico_id: e.target.value})}>
              <option value="">Selecione...</option>
              {servicos.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </InputGroup>

          <InputGroup>
            <label><User size={16}/> Barbeiro</label>
            <select required onChange={(e) => setFormData({...formData, barbeiro_id: e.target.value})}>
              <option value="">Selecione...</option>
              {barbeiros.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </InputGroup>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputGroup>
            <label><Calendar size={16}/> Data</label>
            <input 
              type="date" 
              required 
              onChange={(e) => setFormData({...formData, data: e.target.value})}
            />
          </InputGroup>

          <InputGroup>
            <label><Clock size={16}/> Horário</label>
            <input 
              type="time" 
              required 
              onChange={(e) => setFormData({...formData, hora: e.target.value})}
            />
          </InputGroup>
        </div>

        <SubmitBtn type="submit" disabled={loading}>
          {loading ? "Processando..." : <><Check size={20}/> Confirmar Agendamento</>}
        </SubmitBtn>
      </FormCard>
    </Container>
  );
};