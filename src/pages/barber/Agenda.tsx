import styled from "styled-components";
import { useBarberStore } from "../../hooks/useBarber";
import { Clock, User, Scissors, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 2rem;
  background: var(--bg-color);
  min-height: 100vh;
  color: var(--text-color);
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  &:hover {
    color: var(--primary-color);
  }
`;

const Table = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 100px 1.5fr 1fr 1fr 120px;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;

  &:hover {
    background: var(--bg-darker);
  }
`;

const FinishButton = styled.button`
  background: transparent;
  color: var(--success-color);
  border: 1px solid var(--success-color);
  padding: 8px;
  borderradius: 4px;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--success-color);
    color: white;
    box-shadow: 0 0 10px var(--success-color);
  }
`;

export const AgendaDoDia = () => {
  const { appointments, loading, finishService } = useBarberStore();
  const navigate = useNavigate();

  return (
    <Container>
      <BackBtn onClick={() => navigate("/barber")}>
        <ArrowLeft size={20} /> Voltar ao Painel
      </BackBtn>
      <h2 style={{ color: "var(--gold-color)", marginBottom: "2rem" }}>
        AGENDAMENTOS DE HOJE
      </h2>

      <Table>
        {appointments.map((app) => (
          <Row key={app.id}>
            <span style={{ fontWeight: "bold", color: "var(--primary-color)" }}>
              {app.time}
            </span>
            <span>
              <User size={14} /> {app.customerName}
            </span>
            <span style={{ color: "var(--text-muted)" }}>{app.service}</span>
            <span style={{ color: "var(--gold-color)" }}>
              <Scissors size={14} /> {app.barberName}
            </span>
            <FinishButton onClick={() => finishService(app.id, app.client_id)}>
              <CheckCircle size={18} />
            </FinishButton>
          </Row>
        ))}
      </Table>
    </Container>
  );
};
