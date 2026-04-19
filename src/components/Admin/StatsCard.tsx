import styled from "styled-components";

// Adicionamos 'isPositive' como opcional aqui
interface StatsCardProps {
  label: string;
  value: string | number;
  trend: string;
  isPositive?: boolean;
}

const Card = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #f1f1f4;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
`;

const Label = styled.span`
  color: #71717a;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Value = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: #09090b;
  margin-top: 0.5rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

// O estilo do indicador muda com base na prop isPositive
const Indicator = styled.span<{ $positive?: boolean }>`
  font-size: 0.813rem;
  font-weight: 500;
  color: ${(props) => (props.$positive ? "#10b981" : "#ef4444")};
  background: ${(props) => (props.$positive ? "#ecfdf5" : "#fef2f2")};
  padding: 2px 8px;
  border-radius: 9999px;
`;

export const StatsCard = ({
  label,
  value,
  trend,
  isPositive = true,
}: StatsCardProps) => (
  <Card>
    <Label>{label}</Label>
    <Value>
      {value}
      <Indicator $positive={isPositive}>{trend}</Indicator>
    </Value>
  </Card>
);
