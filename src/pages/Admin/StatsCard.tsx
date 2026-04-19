import styled from "styled-components";

const Card = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #f1f1f4;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.02),
    0 1px 2px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const Label = styled.span`
  color: #71717a;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
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

const Indicator = styled.span<{ type: "positive" | "neutral" }>`
  font-size: 0.813rem;
  font-weight: 500;
  color: ${(props) => (props.type === "positive" ? "#10b981" : "#6366f1")};
  background: ${(props) => (props.type === "positive" ? "#ecfdf5" : "#eef2ff")};
  padding: 2px 8px;
  border-radius: 9999px;
`;

export const StatsCard = ({ label, value, trend, isPositive = true }: any) => (
  <Card>
    <Label>{label}</Label>
    <Value>
      {value}
      <Indicator type={isPositive ? "positive" : "neutral"}>{trend}</Indicator>
    </Value>
  </Card>
);
