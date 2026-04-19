import styled from "styled-components";
import {
  Calendar,
  History,
  Users,
  ShoppingBag,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardWrapper = styled.div`
  padding: 2rem;
  background: var(--bg-color);
  min-height: 100vh;
  color: var(--text-color);
  background-image: linear-gradient(var(--scanline-color) 1px, transparent 1px);
  background-size: 100% 4px;
`;

const WelcomeHeader = styled.div`
  margin-bottom: 3rem;
  border-left: 4px solid var(--primary-color);
  padding-left: 1.5rem;

  h1 {
    font-size: 2.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  }
  p {
    color: var(--text-muted);
    font-size: 1.1rem;
  }
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const NavCard = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  padding: 2rem;
  border-radius: 4px; /* Pontas mais retas para um look mais sério */
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--primary-color);
    transform: scaleX(0);
    transition: transform 0.3s;
  }

  &:hover {
    border-color: var(--primary-color);
    background: var(--bg-darker);
    box-shadow: 0 0 20px var(--primary-glow);
    transform: translateY(-5px);

    &::before {
      transform: scaleX(1);
    }
    .icon-box {
      color: var(--gold-color);
    }
    .arrow {
      transform: translateX(5px);
      color: var(--primary-color);
    }
  }

  .icon-box {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    transition: 0.3s;
  }

  h3 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: var(--gold-color);
  }

  p {
    color: var(--text-muted);
    line-height: 1.5;
    font-size: 0.95rem;
  }

  .footer {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
    .arrow {
      transition: 0.3s;
      color: var(--text-dark);
    }
  }
`;

const DashboardBarbeiro = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Agenda do Dia",
      desc: "Controle os atendimentos de hoje em tempo real.",
      icon: <Calendar size={32} />,
      path: "/barber/agenda",
    },
    {
      title: "Novo Agendamento",
      desc: "Insira novos horários manualmente para clientes presenciais.",
      icon: <PlusCircle size={32} />,
      path: "/barber/novo-agendamento",
    },
    {
      title: "Gestão de Clientes",
      desc: "Histórico de cortes, fidelidade e perfis cadastrados.",
      icon: <Users size={32} />,
      path: "/barber/clientes",
    },
    {
      title: "Venda de Produtos",
      desc: "Checkout rápido para pomadas, óleos e acessórios.",
      icon: <ShoppingBag size={32} />,
      path: "/barber/vendas",
    },
    {
      title: "Histórico Global",
      desc: "Relatórios de faturamento e serviços concluídos.",
      icon: <History size={32} />,
      path: "/barber/historico",
    },
  ];

  return (
    <DashboardWrapper>
      <WelcomeHeader>
        <h1>Central de Comando</h1>
        <p>Dashboard Administrativo | Unidade Guarulhos</p>
      </WelcomeHeader>

      <NavGrid>
        {menuItems.map((item, index) => (
          <NavCard key={index} onClick={() => navigate(item.path)}>
            <div className="icon-box">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <div className="footer">
              <ArrowRight className="arrow" />
            </div>
          </NavCard>
        ))}
      </NavGrid>
    </DashboardWrapper>
  );
};

export default DashboardBarbeiro;
