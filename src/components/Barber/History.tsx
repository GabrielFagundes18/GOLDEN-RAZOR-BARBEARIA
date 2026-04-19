import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  h1 { margin-bottom: 2rem; }
`;

const History = () => {
  return (
    <Container>
      <h1>Relatório de Atendimentos</h1>
      <p style={{ color: '#666' }}>Em breve: visualize todos os seus serviços realizados e comissões.</p>
    </Container>
  );
};

export default History;