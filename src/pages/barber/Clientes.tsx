import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  User,
  Search,
  Loader2,
  ChevronRight,
  Star,
  Award,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import Sidebar from "./Sidebar";

const Layout = styled.div`
  display: flex;
  background: var(--bg-color); // Ajustado
  min-height: 100vh;
  color: var(--text-color); // Ajustado
  font-family: "Inter", sans-serif;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient(var(--scanline-color) 1px, transparent 1px);
  background-size: 100% 4px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  .title {
    span {
      color: var(--primary-color);
      font-size: 0.6rem;
      font-weight: 900;
      letter-spacing: 3px;
    }
    h2 {
      font-family: "Rajdhani", sans-serif;
      font-size: 2.2rem;
      text-transform: uppercase;
      margin: 0;
      color: var(--text-color);
    }
  }
`;

const SearchBar = styled.div`
  background: var(--card-color); 
  border: 1px solid var(--border-color); 
  padding: 0.8rem 1.2rem;
  border-radius: 4px; 
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  transition: 0.3s;

  input {
    background: none;
    border: none;
    color: white;
    width: 100%;
    outline: none;
    font-size: 0.9rem;
    &::placeholder {
      color: var(--text-dark); 
    }
  }

  &:focus-within {
    border-color: var(--primary-color); 
    box-shadow: 0 0 15px var(--primary-glow); 
  }
`;

const TableContainer = styled.div`
  background: var(--card-color); 
  border: 1px solid var(--border-color); 
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 80px;
  padding: 1rem 1.5rem;
  background: #000;
  border-bottom: 1px solid var(--border-color); 
  color: var(--text-muted); 
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: "Rajdhani", sans-serif;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 80px;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color); 
  align-items: center;
  transition: 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  .name-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text-color);
  }

  .points-cell {
    font-family: "Syncopate", sans-serif;
    font-size: 0.75rem;
    color: var(--gold-color); 
  }

  .stats-cell {
    font-size: 0.8rem;
    color: var(--text-muted); 
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
`;

const StatusBadge = styled.span<{ $isVip: boolean }>`
  background: ${(props) =>
    props.$isVip ? "var(--gold-glow)" : "rgba(255, 255, 255, 0.02)"};
  color: ${(props) =>
    props.$isVip ? "var(--gold-bright)" : "var(--text-dark)"};
  padding: 5px 12px;
  border-radius: 2px;
  font-size: 0.65rem;
  font-weight: 900;
  border: 1px solid
    ${(props) => (props.$isVip ? "var(--gold-color)" : "var(--border-color)")};
  display: flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  text-transform: uppercase;
`;

const ActionBtn = styled.button`
  background: #000;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  width: 35px;
  height: 35px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: #fff;
    border-color: var(--primary-color);
    background: var(--primary-color);
    box-shadow: 0 0 15px var(--primary-glow);
  }
`;

export const Clientes = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/loja/clientes");
        setCustomers(data);
      } catch (err) {
        console.error("Erro ao carregar clientes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) =>
    (c.nome || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      <Sidebar />
      <MainContent>
        <ContentWrapper>
          <HeaderSection>
            <div className="title">
              <span>ADMINISTRAÇÃO</span>
              <h2>Base de Clientes</h2>
            </div>

            <SearchBar>
              <Search size={18} color="var(--text-dark)" />
              <input
                placeholder="Filtrar por nome do cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
          </HeaderSection>

          <TableContainer>
            <TableHeader>
              <div>Cliente</div>
              <div>Fidelidade</div>
              <div>Histórico</div>
              <div>Nível</div>
              <div>Ação</div>
            </TableHeader>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <div
                  style={{
                    padding: "5rem",
                    textAlign: "center",
                    color: "var(--primary-color)",
                  }}
                >
                  <Loader2 className="animate-spin" size={32} />
                  <p
                    style={{
                      fontFamily: "Rajdhani",
                      marginTop: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    CARREGANDO DADOS...
                  </p>
                </div>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((c, index) => (
                  <Row
                    key={c.clerk_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className="name-cell">
                      <User size={14} color="var(--primary-color)" />
                      {c.nome}
                    </div>

                    <div className="points-cell">
                      {c.pontos} <span style={{ fontSize: "0.6rem" }}>PTS</span>
                    </div>

                    <div className="stats-cell">
                      <Award
                        size={12}
                        style={{ marginRight: 6 }}
                        color="var(--text-dark)"
                      />
                      {c.cortes_realizados || 0} Serviços
                    </div>

                    <div>
                      <StatusBadge $isVip={c.pontos >= 10}>
                        {c.pontos >= 10 ? (
                          <>
                            <Star
                              size={10}
                              fill="var(--gold-bright)"
                              color="var(--gold-bright)"
                            />{" "}
                            Com benefícios
                          </>
                        ) : (
                          "Sem benefícios "
                        )}
                      </StatusBadge>
                    </div>

                    <div>
                      <ActionBtn
                        onClick={() =>
                          navigate(`/barber/clientes/${c.clerk_id}`)
                        }
                      >
                        <ChevronRight size={18} />
                      </ActionBtn>
                    </div>
                  </Row>
                ))
              ) : (
                <div
                  style={{
                    padding: "4rem",
                    textAlign: "center",
                    color: "var(--text-dark)",
                  }}
                >
                  <Users
                    size={40}
                    style={{ marginBottom: "1rem", opacity: 0.1 }}
                  />
                  <p style={{ fontFamily: "Rajdhani", letterSpacing: "1px" }}>
                    NENHUM AGENTE ENCONTRADO
                  </p>
                </div>
              )}
            </AnimatePresence>
          </TableContainer>
        </ContentWrapper>
      </MainContent>
    </Layout>
  );
};
