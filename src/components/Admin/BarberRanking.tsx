import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 12px;
  
  h3 {
    font-family: "Rajdhani";
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    color: var(--text-muted);
    font-size: 1rem;
  }
`;

const BarberItem = styled.div`
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
  margin-bottom: 15px;

  &:last-child { border: none; }

  .info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .name { font-size: 0.9rem; font-weight: 600; }
  .value { color: var(--gold-color); font-family: 'Rajdhani'; font-weight: 700; }
  
  .progress-bar {
    width: 100%;
    height: 4px;
    background: var(--bg-darker);
    border-radius: 2px;
    .fill {
      height: 100%;
      background: var(--primary-color);
      border-radius: 2px;
      box-shadow: 0 0 10px var(--primary-glow);
    }
  }
`;

interface Barber {
  nome: string;
  faturamento: string;
  porcentagem: number;
}

export const BarberRanking = ({ data }: { data: Barber[] }) => (
  <Container>
    <h3>Performance da Equipe</h3>
    {data.map((barber, i) => (
      <BarberItem key={i}>
        <div className="info">
          <span className="name">{barber.nome}</span>
          <span className="value">{barber.faturamento}</span>
        </div>
        <div className="progress-bar">
          <div className="fill" style={{ width: `${barber.porcentagem}%` }} />
        </div>
      </BarberItem>
    ))}
  </Container>
);