import { useState, useEffect } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import {
  User,
  Star,
  Search,
  Filter,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 2rem;
  background: var(--bg-color);
  min-height: 100vh;
  color: var(--text-color);
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SearchBar = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  transition: 0.3s;

  input {
    background: none;
    border: none;
    color: white;
    width: 100%;
    outline: none;
    &::placeholder {
      color: var(--text-muted);
    }
  }

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 10px var(--primary-glow);
  }
`;

const Table = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 80px;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: 0.2s;

  &:last-child {
    border-bottom: none;
  }
  &.header {
    background: var(--bg-darker);
    color: var(--text-muted);
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &:not(.header):hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const PointBadge = styled.span`
  color: var(--gold-color);
  font-weight: 800;
  text-shadow: 0 0 8px var(--gold-glow);
`;

const StatusBadge = styled.span<{ $isVip: boolean }>`
  background: ${(props) =>
    props.$isVip ? "var(--gold-glow)" : "rgba(255,255,255,0.05)"};
  color: ${(props) =>
    props.$isVip ? "var(--gold-bright)" : "var(--text-muted)"};
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  border: 1px solid
    ${(props) => (props.$isVip ? "var(--gold-color)" : "transparent")};
`;

const DetailBtn = styled.button`
  background: none;
  border: 1px solid var(--border-bright);
  color: var(--text-muted);
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--text-color);
    border-color: var(--primary-color);
    background: var(--primary-glow);
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
        // Rota que busca na tabela 'perfis'
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

  // Filtro em tempo real
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Container>
      <HeaderActions>
        <h2 style={{ color: "var(--gold-color)" }}>BASE DE CLIENTES</h2>
        <SearchBar>
          <Search size={18} color="var(--text-muted)" />
          <input
            placeholder="Buscar cliente pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
      </HeaderActions>

      <Table>
        <Row className="header">
          <span>Cliente</span>
          <span>Fidelidade</span>
          <span>Frequência</span>
          <span>Status</span>
          <span></span>
        </Row>

        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <Loader2 className="animate-spin" />
          </div>
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map((c) => (
            <Row key={c.clerk_id}>
              <span
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <User size={14} color="var(--primary-color)" /> {c.name}
              </span>
              <PointBadge>{c.pontos} PTS</PointBadge>
              <span style={{ color: "var(--text-muted)" }}>
                {c.cortes_realizados || 0} cortes
              </span>
              <div>
                <StatusBadge $isVip={c.pontos >= 100}>
                  {c.pontos >= 100 ? "⭐ VIP" : "PADRÃO"}
                </StatusBadge>
              </div>
              <DetailBtn
                onClick={() => navigate(`/barber/clientes/${c.clerk_id}`)}
              >
                <ChevronRight size={18} />
              </DetailBtn>
            </Row>
          ))
        ) : (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            Nenhum cliente encontrado.
          </div>
        )}
      </Table>
    </Container>
  );
};
