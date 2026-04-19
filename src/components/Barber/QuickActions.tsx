import styled from "styled-components";
import { ShoppingBag, PlusCircle } from "lucide-react";

const ActionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Button = styled.button`
  background: #09090b;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
  &.secondary {
    background: white;
    color: #09090b;
    border: 1px solid #e4e4e7;
  }
`;

export const QuickActions = () => (
  <ActionGrid>
    <Button onClick={() => alert("Abrir modal de agendamento")}>
      <PlusCircle size={18} /> Novo Horário
    </Button>
    <Button
      className="secondary"
      onClick={() => alert("Abrir PDV de produtos")}
    >
      <ShoppingBag size={18} /> Vender Produto
    </Button>
  </ActionGrid>
);
