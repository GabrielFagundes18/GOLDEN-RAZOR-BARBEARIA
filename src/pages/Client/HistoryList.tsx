import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useUser } from "@clerk/clerk-react";
import { useFetch } from "../../hooks/useFetch";
import { CheckCircle, Clock, XCircle, Scissors, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- INTERFACES ---
interface HistoryItem {
  id: number;
  data: string;
  status: 'agendado' | 'concluido' | 'cancelado';
  servico_name: string;
  barbeiro_name: string;
  preco?: number;
}

// --- ESTILOS ---
const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  gap: 15px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 35px;
    bottom: -15px;
    width: 2px;
    background: rgba(255, 255, 255, 0.03);
  }

  &:last-child::before { display: none; }
`;

// Função auxiliar para definir cores baseadas no status
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'concluido': return '#22c55e'; // Verde
    case 'cancelado': return '#ef4444'; // Vermelho
    case 'agendado': return '#e11d48';  // Rosa/Vermelho Tema
    default: return '#666';
  }
};

const IconCircle = styled.div<{ $status: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$status === 'concluido' ? '#22c55e' : '#0f0f0f'};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border: 2px solid ${props => getStatusColor(props.$status)};
  box-shadow: 0 0 10px ${props => props.$status === 'concluido' ? 'rgba(34, 197, 94, 0.2)' : 'transparent'};
`;

const Content = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 15px;
  flex: 1;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const StatusLabel = styled.span<{ $status: string }>`
  font-size: 0.55rem;
  font-family: 'Syncopate', sans-serif;
  font-weight: 900;
  color: ${props => getStatusColor(props.$status)};
  letter-spacing: 1px;
`;

// --- COMPONENTE ---
export default function HistoryList() {
  const { user } = useUser();
  
  const { data: history, loading, error } = useFetch<HistoryItem[]>(
    user?.id ? `/agendamentos/historico?clerk_id=${user.id}` : null
  );

  if (loading) return <div className="sync" style={{ color: '#444', fontSize: '0.7rem' }}>ACESSANDO ARQUIVOS SECRETOS...</div>;
  
  if (error) return <div style={{ color: '#e11d48' }}>FALHA NA CONEXÃO COM O BANCO DE DADOS.</div>;

  if (!history || history.length === 0) {
    return (
      <div style={{ padding: '20px', color: '#444', textAlign: 'center', fontSize: '0.8rem' }}>
        SEM REGISTROS DE OPERAÇÕES ANTERIORES.
      </div>
    );
  }

  return (
    <HistoryContainer>
      {history.map((log) => (
        <TimelineItem 
          key={log.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <IconCircle $status={log.status}>
            {log.status === 'concluido' && <CheckCircle size={16} color="#000" />}
            {log.status === 'cancelado' && <XCircle size={16} color="#ef4444" />}
            {log.status === 'agendado' && <Clock size={16} color="#e11d48" />}
          </IconCircle>
          
          <Content>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <StatusLabel $status={log.status}>
                {log.status?.toUpperCase()}
              </StatusLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#444', fontSize: '0.7rem' }}>
                <Calendar size={12} />
                {format(parseISO(log.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
            </div>
            
            <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scissors size={14} color="#e11d48" />
              {log.servico_name}
            </h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '0.75rem' }}>
                Agente: <span style={{ color: '#aaa' }}>{log.barbeiro_name}</span>
              </p>
              
              {log.preco && (
                <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 'bold' }}>
                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(log.preco)}
                </span>
              )}
            </div>
          </Content>
        </TimelineItem>
      ))}
    </HistoryContainer>
  );
}