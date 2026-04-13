import styled from 'styled-components';

export const NinjaButton = styled.button`
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: #000;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 800;
  text-transform: uppercase;
  transition: 0.3s;
  &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 242, 255, 0.4); }
`;

export const Card = styled.div`
  background: var(--surface);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: #0B0F19;
  border: 1px solid #334155;
  color: white;
  border-radius: 6px;
  margin-top: 8px;
  &:focus { border-color: var(--primary); outline: none; }
`;