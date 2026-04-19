import styled from "styled-components";
import { CheckCircle, Clock, User } from "lucide-react";

const Container = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e4e4e7;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f4f4f5;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #fafafa;
  }
`;

const TimeLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: #09090b;
  font-variant-numeric: tabular-nums;
`;

const ClientInfo = styled.div`
  .name {
    font-weight: 600;
    color: #18181b;
    display: block;
  }
  .service {
    color: #71717a;
    font-size: 0.85rem;
  }
`;

const ActionButton = styled.button`
  background: #f4f4f5;
  color: #18181b;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #10b981;
    color: white;
  }
`;

interface Props {
  appointments: any[];
  onFinish: (appId: number, clientId: string) => void;
}

export const DailySchedule = ({ appointments, onFinish }: Props) => {
  if (appointments.length === 0) {
    return (
      <Container
        style={{ padding: "3rem", textAlign: "center", color: "#71717a" }}
      >
        <p>Não há mais agendamentos para hoje.</p>
      </Container>
    );
  }

  return (
    <Container>
      {appointments.map((item) => (
        <Row key={item.id}>
          <TimeLabel>
            <Clock size={16} color="#71717a" />
            {item.time}
          </TimeLabel>
          <ClientInfo>
            <span className="name">{item.customerName}</span>
            <span className="service">{item.service}</span>
          </ClientInfo>
          <ActionButton onClick={() => onFinish(item.id, item.client_id)}>
            <CheckCircle size={18} /> Finalizar
          </ActionButton>
        </Row>
      ))}
    </Container>
  );
};
