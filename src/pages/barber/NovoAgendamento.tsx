import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isBefore,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { api } from "../../services/api";
import { useFetch } from "../../hooks/useFetch";

interface IService {
  id: number;
  name: string;
  price: number;
}

interface IBarber {
  id: number;
  name: string;
}

interface ICliente {
  clerk_id: string;
  nome: string;
  pontos?: number;
}

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  color: var(--text-color);
  font-family: "Inter", sans-serif;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 650px;
  margin-bottom: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 800;
  transition: 0.2s;
  &:hover {
    color: var(--primary-color);
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 650px;
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2.5rem;
  position: relative;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--bg-color);
  div {
    height: 100%;
    background: var(--primary-color);
    box-shadow: 0 0 15px var(--primary-glow);
    transition: 0.4s;
  }
`;

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TitleSection = styled.div`
  margin-bottom: 0.5rem;
  span {
    color: var(--primary-color);
    font-size: 0.6rem;
    font-weight: 900;
    letter-spacing: 3px;
  }
  h2 {
    font-family: "Rajdhani", sans-serif;
    font-size: 1.8rem;
    text-transform: uppercase;
    color: var(--text-color);
  }
`;

const SelectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.div<{ $active: boolean }>`
  padding: 0.8rem 1rem;
  background: ${(props) =>
    props.$active ? "var(--primary-color)" : "var(--bg-darker)"};
  border: 1px solid
    ${(props) =>
      props.$active ? "var(--primary-color)" : "var(--border-color)"};
  color: ${(props) => (props.$active ? "#000" : "var(--text-color)")};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: 0.2s ease;
  strong {
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
  }
  span {
    font-size: 0.65rem;
    font-weight: 700;
    opacity: 0.7;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-top: 10px;
`;

const CalendarDay = styled.div<{
  $isPast: boolean;
  $isSelected: boolean;
  $isCurrentMonth: boolean;
}>`
  padding: 10px 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 6px;
  cursor: ${(props) => (props.$isPast ? "not-allowed" : "pointer")};
  background: ${(props) =>
    props.$isSelected ? "var(--primary-color)" : "var(--bg-darker)"};
  color: ${(props) =>
    props.$isPast
      ? "#444"
      : props.$isSelected
        ? "#000"
        : props.$isCurrentMonth
          ? "#fff"
          : "#444"};
  border: 1px solid
    ${(props) =>
      props.$isSelected ? "var(--primary-color)" : "var(--border-color)"};
  &:hover {
    border-color: var(--primary-color);
  }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const TimeOption = styled.button<{ $active: boolean }>`
  padding: 10px;
  background: ${(props) =>
    props.$active ? "var(--primary-color)" : "var(--bg-darker)"};
  border: 1px solid
    ${(props) =>
      props.$active ? "var(--primary-color)" : "var(--border-color)"};
  color: ${(props) => (props.$active ? "#000" : "var(--text-color)")};
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
  &:disabled {
    opacity: 0.1;
    cursor: not-allowed;
  }
`;

const ReviewCard = styled.div`
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 12px;
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    span {
      color: var(--text-dark);
      font-size: 0.7rem;
      font-weight: 800;
    }
    strong {
      font-size: 0.8rem;
    }
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: var(--primary-color);
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 900;
  font-family: "Syncopate", sans-serif;
  font-size: 0.7rem;
  cursor: pointer;
  transition: 0.3s;
  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
`;

export const NovoAgendamento: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);

  const { data: servicos } = useFetch<IService[]>("/servicos");
  const { data: barbeiros } = useFetch<IBarber[]>("/barbeiros");
  const { data: clientesBanco } = useFetch<ICliente[]>("/clientes");

  const [form, setForm] = useState({
    cliente_id: "",
    cliente_nome: "",
    cliente_pontos: 0,
    service: null as IService | null,
    barber: null as IBarber | null,
    date: new Date(),
    time: "",
  });

  const isRewardEligible = useMemo(
    () => form.cliente_pontos >= 10,
    [form.cliente_pontos],
  );

  const timeSlots = useMemo(() => {
    const slots = [];
    let current = new Date();
    current.setHours(9, 0, 0, 0);
    const end = new Date();
    end.setHours(19, 0, 0, 0);
    while (current <= end) {
      slots.push(format(current, "HH:mm"));
      current = new Date(current.getTime() + 40 * 60000);
    }
    return slots;
  }, []);

  useEffect(() => {
    if (form.barber?.id && form.date && step === 5) {
      const dateStr = format(form.date, "yyyy-MM-dd");
      api
        .get(`/occupied-times`, {
          params: { data: dateStr, barbeiro_id: form.barber.id },
        })
        .then((res) =>
          setOccupiedTimes(Array.isArray(res.data) ? res.data : []),
        )
        .catch(() => setOccupiedTimes([]));
    }
  }, [form.date, form.barber, step]);

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      const [hours, minutes] = form.time.split(":");
      const finalDate = new Date(form.date);
      finalDate.setHours(parseInt(hours), parseInt(minutes), 0);

      await api.post("/agendamentos/manual", {
        cliente: form.cliente_nome,
        clerk_id: form.cliente_id || `MANUAL_${Date.now()}`,
        servico_id: Number(form.service?.id),
        barbeiro_id: Number(form.barber?.id),
        data: finalDate.toISOString(),
        is_reward: isRewardEligible,
        valor: isRewardEligible ? 0 : Number(form.service?.price),
      });
      setStep(7);
    } catch {
      alert("Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  };

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  return (
    <Layout>
      <MainContent>
        <HeaderContainer>
          <BackButton
            onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
          >
            <ArrowLeft size={16} /> PASSO {step > 1 ? step - 1 : "INICIAL"}
          </BackButton>
        </HeaderContainer>

        <FormCard>
          <ProgressBar>
            <motion.div animate={{ width: `${(step / 6) * 100}%` }} />
          </ProgressBar>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {step === 1 && (
                <StepWrapper>
                  <TitleSection>
                    <span>01/06</span>
                    <h2>Cliente</h2>
                  </TitleSection>
                  <div style={{ position: "relative" }}>
                    <input
                      style={{
                        width: "100%",
                        padding: "1rem",
                        background: "var(--bg-darker)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      placeholder="Nome do cliente..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setForm({ ...form, cliente_nome: e.target.value });
                        setShowSuggestions(true);
                      }}
                    />
                    {showSuggestions && searchTerm && (
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          background: "var(--card-color)",
                          zIndex: 100,
                          border: "1px solid var(--primary-color)",
                          borderRadius: "8px",
                          marginTop: "5px",
                        }}
                      >
                        {clientesBanco
                          ?.filter((c) =>
                            c.nome
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()),
                          )
                          .map((c) => (
                            <div
                              key={c.clerk_id}
                              onMouseDown={() => {
                                setForm({
                                  ...form,
                                  cliente_nome: c.nome,
                                  cliente_id: c.clerk_id,
                                  cliente_pontos: c.pontos || 0,
                                });
                                setShowSuggestions(false);
                                setSearchTerm(c.nome);
                              }}
                              style={{
                                padding: "1rem",
                                cursor: "pointer",
                                borderBottom: "1px solid var(--border-color)",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>{c.nome}</span>
                              <small>{c.pontos || 0} PTS</small>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  {form.cliente_nome && (
                    <div
                      style={{
                        padding: "10px",
                        background: "var(--gold-glow)",
                        border: "1px solid var(--gold-color)",
                        borderRadius: "8px",
                        textAlign: "center",
                        fontSize: "0.65rem",
                        fontWeight: 900,
                        color: "var(--gold-color)",
                      }}
                    >
                      {isRewardEligible
                        ? "CONTA FIDELIDADE: ELIGÍVEL PARA CORTE GRÁTIS"
                        : `PONTOS: ${form.cliente_pontos}/10`}
                    </div>
                  )}
                </StepWrapper>
              )}

              {step === 2 && (
                <StepWrapper>
                  <TitleSection>
                    <span>02/06</span>
                    <h2>Serviço</h2>
                  </TitleSection>
                  <SelectGrid>
                    {servicos?.map((s) => (
                      <OptionCard
                        key={s.id}
                        $active={form.service?.id === s.id}
                        onClick={() => setForm({ ...form, service: s })}
                      >
                        <strong>{s.name}</strong>
                        <span>R$ {Number(s.price).toFixed(0)}</span>
                      </OptionCard>
                    ))}
                  </SelectGrid>
                </StepWrapper>
              )}

              {step === 3 && (
                <StepWrapper>
                  <TitleSection>
                    <span>03/06</span>
                    <h2>Barbeiro</h2>
                  </TitleSection>
                  <SelectGrid>
                    {barbeiros?.map((b) => (
                      <OptionCard
                        key={b.id}
                        $active={form.barber?.id === b.id}
                        onClick={() => setForm({ ...form, barber: b })}
                      >
                        <strong>{b.name}</strong>
                        <span>Disponível</span>
                      </OptionCard>
                    ))}
                  </SelectGrid>
                </StepWrapper>
              )}

              {step === 4 && (
                <StepWrapper>
                  <TitleSection>
                    <span>04/06</span>
                    <h2>Data</h2>
                  </TitleSection>
                  <div
                    style={{
                      background: "var(--bg-darker)",
                      padding: "1rem",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#fff",
                        }}
                        onClick={() =>
                          setCurrentMonth(subMonths(currentMonth, 1))
                        }
                      >
                        <ChevronLeft />
                      </button>
                      <span style={{ fontWeight: 800, fontSize: "0.8rem" }}>
                        {format(currentMonth, "MMMM yyyy", {
                          locale: ptBR,
                        }).toUpperCase()}
                      </span>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#fff",
                        }}
                        onClick={() =>
                          setCurrentMonth(addMonths(currentMonth, 1))
                        }
                      >
                        <ChevronRight />
                      </button>
                    </div>
                    <CalendarGrid>
                      {["D", "S", "T", "Q", "Q", "S", "S"].map((d) => (
                        <div
                          key={d}
                          style={{
                            textAlign: "center",
                            fontSize: "0.6rem",
                            color: "var(--primary-color)",
                            fontWeight: 900,
                          }}
                        >
                          {d}
                        </div>
                      ))}
                      {calendarDays.map((day) => {
                        const isPast =
                          isBefore(day, startOfDay(new Date())) ||
                          day.getDay() === 0;
                        return (
                          <CalendarDay
                            key={day.toISOString()}
                            $isPast={isPast}
                            $isSelected={isSameDay(day, form.date)}
                            $isCurrentMonth={
                              day.getMonth() === currentMonth.getMonth()
                            }
                            onClick={() =>
                              !isPast &&
                              setForm({ ...form, date: day, time: "" })
                            }
                          >
                            {format(day, "d")}
                          </CalendarDay>
                        );
                      })}
                    </CalendarGrid>
                  </div>
                </StepWrapper>
              )}

              {step === 5 && (
                <StepWrapper>
                  <TitleSection>
                    <span>05/06</span>
                    <h2>Horário</h2>
                  </TitleSection>
                  <TimeGrid>
                    {timeSlots.map((t) => (
                      <TimeOption
                        key={t}
                        disabled={occupiedTimes.includes(t)}
                        $active={form.time === t}
                        onClick={() => setForm({ ...form, time: t })}
                      >
                        {t}
                      </TimeOption>
                    ))}
                  </TimeGrid>
                </StepWrapper>
              )}

              {step === 6 && (
                <StepWrapper>
                  <TitleSection>
                    <span>06/06</span>
                    <h2>Revisão</h2>
                  </TitleSection>
                  <ReviewCard>
                    <div className="row">
                      <span>CLIENTE</span>
                      <strong>{form.cliente_nome}</strong>
                    </div>
                    <div className="row">
                      <span>SERVIÇO</span>
                      <strong>{form.service?.name}</strong>
                    </div>
                    <div className="row">
                      <span>PROFISSIONAL</span>
                      <strong>{form.barber?.name}</strong>
                    </div>
                    <div className="row">
                      <span>DATA</span>
                      <strong>{format(form.date, "dd/MM/yyyy")}</strong>
                    </div>
                    <div className="row">
                      <span>HORÁRIO</span>
                      <strong>{form.time}</strong>
                    </div>
                    <div
                      style={{
                        marginTop: "10px",
                        paddingTop: "10px",
                        borderTop: "1px solid #333",
                        display: "flex",
                        justifyContent: "space-between",
                        color: "var(--primary-color)",
                      }}
                    >
                      <span style={{ fontWeight: 900 }}>VALOR FINAL</span>
                      <strong style={{ fontSize: "1.2rem" }}>
                        {isRewardEligible
                          ? "GRÁTIS"
                          : `R$ ${Number(form.service?.price).toFixed(2)}`}
                      </strong>
                    </div>
                  </ReviewCard>
                </StepWrapper>
              )}

              {step === 7 && (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <CheckCircle
                    size={60}
                    color="var(--primary-color)"
                    style={{ marginBottom: "1rem" }}
                  />
                  <h2 style={{ fontFamily: "Rajdhani", color: "#fff" }}>
                    CONCLUÍDO!
                  </h2>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-dark)",
                      marginTop: "10px",
                    }}
                  >
                    Agendamento registrado no sistema.
                  </p>
                  <SubmitBtn
                    onClick={() => window.location.reload()}
                    style={{ marginTop: "2rem" }}
                  >
                    NOVO REGISTRO
                  </SubmitBtn>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 7 && (
            <div style={{ marginTop: "2.5rem" }}>
              <SubmitBtn
                disabled={
                  submitting ||
                  (step === 1 && !form.cliente_nome) ||
                  (step === 2 && !form.service) ||
                  (step === 3 && !form.barber) ||
                  (step === 5 && !form.time)
                }
                onClick={step === 6 ? handleFinish : () => setStep(step + 1)}
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : step === 6 ? (
                  "CONFIRMAR E SALVAR"
                ) : (
                  "PRÓXIMO PASSO"
                )}
              </SubmitBtn>
            </div>
          )}
        </FormCard>
      </MainContent>
    </Layout>
  );
};
