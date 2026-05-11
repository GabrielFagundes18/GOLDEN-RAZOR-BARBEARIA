import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Search,
  Loader2,
  Award,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";


const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  color: #fff;
  font-family: "Inter", sans-serif;
  background: #0a0a0a;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;

  .title h2 {
    font-family: "Rajdhani", sans-serif;
    font-size: 2.2rem;
    text-transform: uppercase;
    margin: 0;
  }
`;

const SearchBar = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 400px;

  input {
    background: none;
    border: none;
    color: white;
    width: 100%;
    outline: none;
    font-size: 0.9rem;
    &::placeholder {
      color: #666;
    }
  }
  &:focus-within {
    border-color: #f1c40f;
  }
`;

const TableContainer = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  // Layout ajustado para 5 colunas (sem o botão)
  grid-template-columns: 2fr 1.2fr 1.5fr 1fr 1fr;
  padding: 1rem 1.5rem;
  background: #000;
  border-bottom: 1px solid #333;
  color: #666;
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  font-family: "Rajdhani", sans-serif;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.5fr 1fr 1fr;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #333;
  align-items: center;
  transition: 0.2s;
  cursor: pointer; // Indica que a linha é clicável

  &:hover {
    background: rgba(
      241,
      196,
      15,
      0.05
    ); // Leve destaque dourado ao passar o mouse
  }

  .name-cell {
    display: flex;
    flex-direction: column;
    font-weight: 600;
    color: #fff;
    span {
      font-size: 0.55rem;
      color: #f1c40f;
      opacity: 0.6;
    }
  }

  .info-cell {
    font-size: 0.85rem;
    color: #aaa;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const StatusBadge = styled.span<{ $isVip: boolean }>`
  background: ${(props) =>
    props.$isVip ? "rgba(241, 196, 15, 0.1)" : "transparent"};
  color: ${(props) => (props.$isVip ? "#f1c40f" : "#666")};
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 900;
  border: 1px solid ${(props) => (props.$isVip ? "#f1c40f" : "#333")};
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
        const { data } = await api.get("/customers");
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
      <MainContent>
        <ContentWrapper>
          <HeaderSection>
            <div className="title">
              <h2>Base de Clientes</h2>
            </div>
            <SearchBar>
              <Search size={18} color="#666" />
              <input
                placeholder="Pesquisar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
          </HeaderSection>

          <TableContainer>
            <TableHeader>
              <div>Cliente / ID</div>
              <div>Telefone</div>
              <div>Email</div>
              <div>Serviços</div>
              <div>Status de Pontos</div>
            </TableHeader>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <div style={{ padding: "5rem", textAlign: "center" }}>
                  <Loader2 className="animate-spin" size={32} color="#f1c40f" />
                </div>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((c, index) => (
                  <Row
                    key={c.id}
                    onClick={() =>
                      navigate(`/barber/clientes/${c.id}/detalhes`)
                    } // Navegação na linha toda
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <div className="name-cell">
                      {c.nome}
                      <span>{c.id}</span>
                    </div>

                    <div className="info-cell">
                      <Phone size={12} /> {c.telefone || "---"}
                    </div>

                    <div className="info-cell">
                      <Mail size={12} /> {c.email}
                    </div>

                    <div className="info-cell">
                      <Award size={14} color="#f1c40f" />
                      {c.cortes_realizados} serviços
                    </div>

                    <div>
                      <StatusBadge $isVip={Number(c.pontos) >= 10}>
                        {c.pontos} PONTOS {Number(c.pontos) >= 10 && "★"}
                      </StatusBadge>
                    </div>
                  </Row>
                ))
              ) : (
                <div
                  style={{
                    padding: "4rem",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  <Users
                    size={40}
                    style={{ marginBottom: "1rem", opacity: 0.1 }}
                  />
                  <p>NENHUM RESULTADO ENCONTRADO</p>
                </div>
              )}
            </AnimatePresence>
          </TableContainer>
        </ContentWrapper>
      </MainContent>
    </Layout>
  );
};
