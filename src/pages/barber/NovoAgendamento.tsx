import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  User,
  Scissors,
  Clock,
  Calendar as CalIcon,
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { api } from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import toast from "react-hot-toast";

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  /* Fundo preto elegante */
  background: var(--bg-darker);
  color: var(--text-color);
  padding: 2rem;
  justify-content: center;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled.div`
  /* Card com transparência glass ou cor sólida */
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h3`
  font-family: "Rajdhani", sans-serif;
  font-size: 0.9rem;
  letter-spacing: 2px;
  /* Dourado moderno */
  color: var(--primary-color);
  text-transform: uppercase;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
  text-shadow: 0 0 10px var(--primary-glow);
`;

const InputSearch = styled.input`
  width: 100%;
  padding: 1rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  transition: all 0.3s ease;

  &::placeholder {
    color: var(--text-dark);
  }

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 8px var(--primary-glow);
    outline: none;
  }
`;

const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 1rem;
`;

const ChoiceBtn = styled.button<{ active: boolean; disabled?: boolean }>`
  /* Alterna entre Dourado e Cinza Escuro */
  background: ${(props) =>
    props.active ? "var(--primary-color)" : "var(--bg-color)"};
  border: 1px solid
    ${(props) =>
      props.active ? "var(--primary-color)" : "var(--border-color)"};
  color: ${(props) => (props.active ? "#000" : "var(--text-color)")};

  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};

  &:hover:not(:disabled) {
    border-color: var(--gold-bright);
    box-shadow: 0 0 12px var(--gold-glow);
  }

  small {
    color: ${(props) =>
      props.active ? "rgba(0,0,0,0.6)" : "var(--text-muted)"};
    display: block;
    font-size: 0.75rem;
  }
`;

const SummaryBox = styled.div`
  background: var(--bg-darker);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--primary-glow);
  margin-top: auto;

  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  strong {
    color: var(--gold-color);
    font-weight: 800;
  }
`;

const FinalizeBtn = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: var(--primary-color);
  color: #000; /* Texto preto sobre o dourado para legibilidade */
  border: none;
  border-radius: 12px;
  font-weight: 900;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: var(--gold-bright);
    box-shadow: 0 0 20px var(--primary-glow);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    filter: grayscale(1);
  }
`;

export const NovoAgendamento: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cliente_id: "",
    cliente_nome: "",
    service: null as any,
    barber: null as any,
    date: new Date(),
    time: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [occupied, setOccupied] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: servicos } = useFetch<any[]>("/services");
  const { data: barbeiros } = useFetch<any[]>("/barbers");
  const { data: clientes } = useFetch<any[]>("/clients/all");

  useEffect(() => {
    if (form.barber?.id) {
      api
        .get(`/bookings/occupied`, {
          params: {
            data: format(form.date, "yyyy-MM-dd"),
            barbeiro_id: form.barber.id,
          },
        })
        .then((res) => setOccupied(res.data))
        .catch(() => setOccupied([]));
    }
  }, [form.date, form.barber]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const [h, m] = form.time.split(":");
      const d = new Date(form.date);
      d.setHours(Number(h), Number(m));
      await api.post("/bookings/manual", {
        cliente: form.cliente_nome,
        clerk_id: form.cliente_id || `AVULSO_${Date.now()}`,
        servico_id: form.service.id,
        barbeiro_id: form.barber.id,
        data: d.toISOString(),
      });
      toast.success("Agendamento confirmado.", {
        style: {
          border: "1px solid #059669",
          padding: "16px",
          color: "#064e3b",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#059669",
          secondary: "#FFFAEE",
        },
      });
    } catch {
      toast.error("Ops! Algo deu errado no agendamento.", {
        style: {
          border: "1px solid #DC2626",
          padding: "16px",
          color: "#991B1B",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#DC2626",
          secondary: "#FEF2F2",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <MainGrid>
        {/* COLUNA ESQUERDA */}
        <div>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "#666",
              marginBottom: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <ArrowLeft size={16} /> VOLTAR
          </button>

          <SectionCard>
            <Title>
              <User size={16} /> 1. Quem é o Cliente?
            </Title>
            <InputSearch
              placeholder="Digite o nome..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setForm({ ...form, cliente_nome: e.target.value });
              }}
            />
            {searchTerm && !form.cliente_id && (
              <div
                style={{
                  marginTop: "10px",
                  background: "#000",
                  borderRadius: "8px",
                }}
              >
                {clientes
                  ?.filter((c) =>
                    c.nome.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .slice(0, 3)
                  .map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setForm({
                          ...form,
                          cliente_id: c.id,
                          cliente_nome: c.nome,
                        });
                        setSearchTerm(c.nome);
                      }}
                      style={{
                        padding: "12px",
                        cursor: "pointer",
                        borderBottom: "1px solid #111",
                      }}
                    >
                      {c.nome}{" "}
                      <small style={{ color: "#666", marginLeft: "8px" }}>
                        {c.pontos} pts
                      </small>
                    </div>
                  ))}
              </div>
            )}
          </SectionCard>

          <SectionCard>
            <Title>
              <Scissors size={16} /> 2. Qual o Serviço?
            </Title>
            <ChoiceGrid>
              {servicos?.map((s) => (
                <ChoiceBtn
                  key={s.id}
                  active={form.service?.id === s.id}
                  onClick={() => setForm({ ...form, service: s })}
                >
                  {s.name} <br /> <small>R$ {s.price}</small>
                </ChoiceBtn>
              ))}
            </ChoiceGrid>
          </SectionCard>

          <SectionCard>
            <Title>
              <User size={16} /> 3. Qual Barbeiro?
            </Title>
            <ChoiceGrid>
              {barbeiros?.map((b) => (
                <ChoiceBtn
                  key={b.id}
                  active={form.barber?.id === b.id}
                  onClick={() => setForm({ ...form, barber: b })}
                >
                  {b.name}
                </ChoiceBtn>
              ))}
            </ChoiceGrid>
          </SectionCard>
        </div>

        {/* COLUNA DIREITA */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <SectionCard style={{ flex: 1 }}>
            <Title>
              <CalIcon size={16} /> 4. Data e Hora
            </Title>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "5px",
                marginBottom: "1.5rem",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => {
                const d = addDays(new Date(), i);
                if (d.getDay() === 0) return null;
                return (
                  <ChoiceBtn
                    key={i}
                    active={isSameDay(d, form.date)}
                    onClick={() => setForm({ ...form, date: d, time: "" })}
                    style={{ fontSize: "0.7rem" }}
                  >
                    {format(d, "dd/MM")}
                  </ChoiceBtn>
                );
              })}
            </div>

            <Title>
              <Clock size={16} /> Horários
            </Title>
            <ChoiceGrid style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {[
                "08:00",
                "08:40",
                "09:20",
                "10:00",
                "10:40",
                "11:20",
                "13:00",
                "13:40",
                "14:20",
                "15:00",
                "15:40",
                "16:20",
                "17:00",
                "17:40",
                "18:20",
                "19:00",
              ].map((t) => (
                <ChoiceBtn
                  key={t}
                  active={form.time === t}
                  disabled={occupied.includes(t)}
                  onClick={() => setForm({ ...form, time: t })}
                >
                  {t}
                </ChoiceBtn>
              ))}
            </ChoiceGrid>

            <SummaryBox>
              <div>
                <span>Serviço:</span>{" "}
                <strong>{form.service?.name || "--"}</strong>
              </div>
              <div>
                <span>Valor:</span>{" "}
                <strong>R$ {form.service?.price || "0.00"}</strong>
              </div>
              <div
                style={{
                  borderTop: "1px solid #333",
                  paddingTop: "8px",
                  marginTop: "8px",
                }}
              >
                <span>Total:</span>{" "}
                <strong style={{ fontSize: "1.2rem" }}>
                  R$ {form.service?.price || "0.00"}
                </strong>
              </div>
            </SummaryBox>

            <FinalizeBtn
              disabled={!form.time || !form.service || !form.barber || loading}
              onClick={handleSave}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "FINALIZAR AGORA"
              )}
            </FinalizeBtn>
          </SectionCard>
        </div>
      </MainGrid>
    </Layout>
  );
};
