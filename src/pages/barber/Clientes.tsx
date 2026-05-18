import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Search,
  Loader2,
  Award,
  Users,
  Mail,
  Phone,
  Hash,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";

// --- STYLED COMPONENTS ---

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  color: #fff;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const HeaderSection = styled.div`
  margin-bottom: 1.5rem;
  display: grid;
  gap: 1rem;

  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .title {
    h2 {
      font-family: "Rajdhani", sans-serif;
      font-size: clamp(1.5rem, 5vw, 2.2rem);
      text-transform: uppercase;
      margin: 0;
      color: #f1c40f;
      letter-spacing: 1px;
    }
    p {
      font-size: 0.8rem;
      color: #666;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
`;

const SearchBar = styled.div`
  background: #111;
  border: 1px solid #222;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #f1c40f;
    background: #161616;
    box-shadow: 0 0 0 2px rgba(241, 196, 15, 0.1);
  }

  input {
    background: none;
    border: none;
    color: white;
    width: 100%;
    outline: none;
    font-size: 1rem;
    &::placeholder { color: #444; }
  }

  @media (min-width: 768px) {
    width: 350px;
  }
`;

const TableContainer = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 768px) {
    display: block;
    background: #0a0a0a;
    border: 1px solid #1a1a1a;
    border-radius: 12px;
    overflow: hidden;
  }
`;

const TableHeader = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1.2fr 1.5fr 1fr 1fr 40px;
    padding: 1.2rem 1.5rem;
    background: #000;
    border-bottom: 1px solid #1a1a1a;
    color: #444;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: "Rajdhani", sans-serif;
  }
`;

const Row = styled(motion.div)`
  background: #0f0f0f;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  padding: 1.2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #f1c40f;
  }

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1.2fr 1.5fr 1fr 1fr 40px;
    padding: 1rem 1.5rem;
    border: none;
    border-bottom: 1px solid #111;
    border-radius: 0;
    align-items: center;
    background: transparent;

    &:hover {
      background: #111;
      border-color: transparent;
    }
  }

  .main-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .name-cell {
    .name {
      display: block;
      font-weight: 700;
      font-size: 1.1rem;
      color: #fff;
    }
    .id {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.65rem;
      color: #f1c40f;
      opacity: 0.7;
      margin-top: 4px;
      font-family: monospace;
    }
  }

  .info-group {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;

    @media (min-width: 480px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 768px) {
      display: contents;
    }
  }

  .cell {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #aaa;

    svg { flex-shrink: 0; color: #444; }

    .label {
      font-size: 0.6rem;
      text-transform: uppercase;
      font-weight: 900;
      color: #333;
      @media (min-width: 768px) { display: none; }
    }
  }

  .chevron-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #222;

    @media (min-width: 768px) {
      position: static;
      transform: none;
    }
  }
`;

const StatusBadge = styled.div<{ $isVip: boolean }>`
  background: ${(p) => (p.$isVip ? "rgba(241, 196, 15, 0.1)" : "#1a1a1a")};
  color: ${(p) => (p.$isVip ? "#f1c40f" : "#666")};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  border: 1px solid ${(p) => (p.$isVip ? "#f1c40f" : "#222")};
  width: fit-content;
  font-family: "Rajdhani", sans-serif;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2.5rem;
  padding-bottom: 2rem;

  button {
    background: #111;
    border: 1px solid #222;
    color: #f1c40f;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: #1a1a1a;
      border-color: #f1c40f;
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.2;
      cursor: not-allowed;
    }
  }

  span {
    font-family: "Rajdhani", sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: #fff;
    letter-spacing: 2px;
    min-width: 60px;
    text-align: center;
  }
`;

// --- COMPONENT ---

export const Clientes = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Erro ao buscar clientes:", err))
      .finally(() => setLoading(false));
  }, []);

  // Volta para página 1 ao filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filtered = customers.filter((c) =>
    c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica de Paginação
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Layout>
      <MainContent>
        <ContentWrapper>
          <HeaderSection>
            <div className="title">
              <h2>Clientes</h2>
              <p>{filtered.length} registros no total</p>
            </div>
            <SearchBar>
              <Search size={18} color="#444" />
              <input
                placeholder="Pesquisar por nome ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
          </HeaderSection>

          <TableContainer>
            <TableHeader>
              <div>Nome / Identificação</div>
              <div>Contato</div>
              <div>E-mail</div>
              <div>Frequência</div>
              <div>Fidelidade</div>
              <div></div>
            </TableHeader>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <div style={{ padding: "5rem", textAlign: "center" }}>
                  <Loader2 className="animate-spin" color="#f1c40f" size={32} />
                </div>
              ) : filtered.length > 0 ? (
                currentItems.map((c, i) => (
                  <Row
                    key={c.id}
                    onClick={() => navigate(`/barber/clientes/${c.id}/detalhes`)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="main-info">
                      <div className="name-cell">
                        <span className="name">{c.nome}</span>
                        <span className="id">
                          <Hash size={10} /> {c.id.substring(0, 8)}
                        </span>
                      </div>
                      <div className="mobile-only" style={{ display: window.innerWidth < 768 ? 'block' : 'none' }}>
                        <StatusBadge $isVip={Number(c.pontos) >= 10}>
                          {c.pontos} PTS
                        </StatusBadge>
                      </div>
                    </div>

                    <div className="info-group">
                      <div className="cell">
                        <Phone size={14} />
                        <span className="label">Tel:</span> {c.telefone || "N/A"}
                      </div>

                      <div className="cell">
                        <Mail size={14} />
                        <span className="label">E-mail:</span> {c.email || "---"}
                      </div>

                      <div className="cell">
                        <Award
                          size={14}
                          color={Number(c.cortes_realizados) > 5 ? "#f1c40f" : "#444"}
                        />
                        <span className="label">Visitas:</span> {c.cortes_realizados}
                      </div>
                    </div>

                    <div style={{ display: window.innerWidth >= 768 ? 'block' : 'none' }}>
                      <StatusBadge $isVip={Number(c.pontos) >= 10}>
                        {c.pontos} PONTOS {Number(c.pontos) >= 10 && "★"}
                      </StatusBadge>
                    </div>

                    <div className="chevron-icon">
                      <ChevronRight size={18} />
                    </div>
                  </Row>
                ))
              ) : (
                <div style={{ padding: "4rem", textAlign: "center", color: "#444" }}>
                  <Users size={48} style={{ opacity: 0.1, marginBottom: "1rem" }} />
                  <p>NENHUM CLIENTE ENCONTRADO</p>
                </div>
              )}
            </AnimatePresence>
          </TableContainer>

          {!loading && totalPages > 1 && (
            <Pagination>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <ChevronLeft size={20} />
              </button>
              
              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <ChevronRight size={20} />
              </button>
            </Pagination>
          )}
        </ContentWrapper>
      </MainContent>
    </Layout>
  );
};