import React from "react";
import styled from "styled-components";
import {
  Calendar,
  Users,
  ShoppingBag,
  PlusCircle,
  ArrowUpRight,
  History,
  Database,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";


const Layout = styled.div`
  display: flex;
  background: var(--bg-color);
  min-height: 100vh;
  color: var(--text-color);
  /* Scanlines sutis apenas no fundo */
  background-image: linear-gradient(var(--scanline-color) 1px, transparent 1px);
  background-size: 100% 4px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 3rem 4rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    padding: 2rem;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 4rem;

  
  h1 {
    font-family: "Rajdhani", sans-serif;
    font-size: 2.8rem;
    font-weight: 300;
    line-height: 1.1;
    color: var(--text-color);

    strong {
      font-weight: 700;
      color: #fff;
    }
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  padding: 2.5rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 2px;
    background: var(--primary-color);
    transition: 0.4s;
  }

  &:hover {
    border-color: var(--border-bright);
    background: rgba(255, 255, 255, 0.02);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

    &::after {
      width: 100%;
    }

    .icon-box {
      color: var(--primary-color);
      transform: scale(1.1);
    }

    .arrow-icon {
      transform: translate(3px, -3px);
      opacity: 1;
      color: var(--primary-color);
    }
  }

  .icon-box {
    color: var(--text-dark);
    margin-bottom: 2rem;
    transition: 0.4s;
  }

  .content {
    h3 {
      font-family: "Rajdhani", sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
      color: #fff;
    }
    p {
      color: var(--text-muted);
      font-size: 0.85rem;
      line-height: 1.5;
      max-width: 90%;
    }
  }

  .arrow-icon {
    position: absolute;
    top: 2.5rem;
    right: 2.5rem;
    opacity: 0.1;
    transition: 0.3s;
  }
`;

const DashboardBarbeiro: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Agenda",
      desc: "Gestão operacional de horários, bloqueios e disponibilidade da equipe.",
      icon: <Calendar size={24} />,
      path: "/barber/agenda",
    },
    {
      title: "Check-in",
      desc: "Fluxo rápido para novos agendamentos e entrada de clientes em tempo real.",
      icon: <PlusCircle size={24} />,
      path: "/barber/novo-agendamento",
    },
    {
      title: "Arsenal",
      desc: "Controle de estoque, checkout de produtos e métricas de vendas.",
      icon: <ShoppingBag size={24} />,
      path: "/barber/vendas",
    },
    {
      title: "Clientes",
      desc: "Base de dados estratégica com histórico de fidelidade e preferências.",
      icon: <Users size={24} />,
      path: "/barber/clientes",
    },
    {
      title: "Logs de Serviço",
      desc: "Histórico detalhado de todos os serviços realizados na unidade.",
      icon: <History size={24} />,
      path: "/barber/HistoricoGlobal",
    },
    {
      title: "Logs de Produto",
      desc: "Rastreabilidade de vendas e movimentação de inventário.",
      icon: <Database size={24} />,
      path: "/barber/HistoricoVendas",
    },
  ];

  return (
    <Layout>
      <Sidebar />
      <MainContent>
        <SectionHeader>
          
          <h1>
            Bem-vindo ao <strong>GOLDEN RAZOR.</strong>
          </h1>
        </SectionHeader>

        <ActionGrid>
          {actions.map((item, index) => (
            <ActionCard key={index} onClick={() => navigate(item.path)}>
              <div className="icon-box">{item.icon}</div>
              <div className="content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <ArrowUpRight className="arrow-icon" size={20} />
            </ActionCard>
          ))}
        </ActionGrid>
      </MainContent>
    </Layout>
  );
};

export default DashboardBarbeiro;
