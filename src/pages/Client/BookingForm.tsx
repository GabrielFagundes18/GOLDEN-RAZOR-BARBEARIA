import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  User,
  Clock,
  Calendar as CalIcon,
  Loader2,
  Search,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  format,
  addDays,
  isSameDay,
  isAfter,
  startOfDay,
  parse,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { api } from "../../services/api";
import toast from "react-hot-toast";

// --- STYLED COMPONENTS (AESTHETIC: TACTICAL DARK) ---

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  color: #fff;
`;

const GlassCard = styled(motion.div)`
  background: rgba(10, 10, 10, 0.95);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
`;
const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.2rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StepBadge = styled.div`
  background: var(--primary-color);
  color: #000;
  padding: 2px 10px;
  border-radius: 4px;
  font-weight: 900;
  font-size: 0.7rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  width: fit-content;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
`;

const ItemCard = styled.button<{ active?: boolean; disabled?: boolean }>`
  background: ${(props) =>
    props.active ? "var(--primary-color)" : "rgba(255,255,255,0.03)"};
  border: 1px solid
    ${(props) =>
      props.active ? "var(--primary-color)" : "var(--border-color)"};
  color: ${(props) => (props.active ? "#000" : "#fff")};
  padding: 1.2rem;
  border-radius: 12px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  text-align: left;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};

  &:hover:not(:disabled) {
    border-color: var(--primary-color);
    transform: translateY(-2px);
  }

  strong {
    display: block;
    font-size: 1rem;
    margin-bottom: 4px;
  }
  span {
    display: block;
    font-size: 0.75rem;
    opacity: 0.7;
  }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
  }
`;

const Summary = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 15px;
  border-left: 4px solid var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const FinalBtn = styled.button`
  background: var(--primary-color);
  color: #000;
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
`;

// --- COMPONENTE PRINCIPAL ---

export default function BookingSystem({ clerkId, userName, onSuccess }: any) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [db, setDb] = useState({ services: [], barbers: [] });
  const [occupied, setOccupied] = useState<any[]>([]); // Array de objetos {hora_inicio, duracao}
  const [isReward, setIsReward] = useState(false); // Adicione isso no topo do componente
  const [form, setForm] = useState({
    service: null as any,
    barber: null as any,
    date: startOfDay(new Date()),
    time: "",
  });

  // 1. Carregar dados do banco
  useEffect(() => {
    async function init() {
      try {
        const [s, b] = await Promise.all([
          api.get("/services"),
          api.get("/barbers"),
        ]);
        setDb({ services: s.data, barbers: b.data });
      } catch {
        toast.error("Erro ao carregar base de dados.");
      }
    }
    init();
  }, []);

  // 2. Buscar horários ocupados toda vez que mudar barbeiro ou data
  useEffect(() => {
    if (form.barber?.id) {
      api
        .get(`/bookings/occupied`, {
          params: {
            data: format(form.date, "yyyy-MM-dd"),
            barbeiro_id: form.barber.id,
          },
        })
        .then((res) => setOccupied(res.data || []));
    }
  }, [form.date, form.barber]);

  // 3. Gerar slots de 20 em 20 minutos (08:00 - 20:00)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 8; h < 20; h++) {
      for (let m = 0; m < 60; m += 40) {
        slots.push(
          `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
        );
      }
    }
    return slots;
  }, []);

  // 4. LÓGICA DE COLISÃO (O CORAÇÃO DO SISTEMA)
  const isTimeBlocked = (slot: string) => {
    const [slotH, slotM] = slot.split(":").map(Number);
    const slotStartTotal = slotH * 60 + slotM;
    const myServiceDuration = parseInt(form.service?.duration || 30);
    const slotEndTotal = slotStartTotal + myServiceDuration;

    return occupied.some((occ) => {
      const [occH, occM] = occ.hora_inicio.split(":").map(Number);
      const occStart = occH * 60 + occM;
      const occEnd = occStart + parseInt(occ.duracao);

      // Bloqueia se:
      // 1. O início do slot cai dentro de um agendamento existente
      // 2. O fim do novo serviço invade o início de um agendamento existente
      const overlap =
        (slotStartTotal >= occStart && slotStartTotal < occEnd) ||
        (slotEndTotal > occStart && slotStartTotal < occStart);
      return overlap;
    });
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const [h, m] = form.time.split(":");
      const finalDate = new Date(form.date);
      finalDate.setHours(Number(h), Number(m), 0);

      await api.post("/bookings", {
        cliente: userName,
        usuario_id: clerkId,
        servico_id: form.service.id,
        barbeiro_id: form.barber.id,
        data: format(finalDate, "yyyy-MM-dd HH:mm:ss"),
        valor: form.service.price,
      });

      toast.success("AGENDAMENTO REALIZADO!");
      onSuccess?.();
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <GlassCard
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepBadge>Fase 01</StepBadge>
            <Header>
              <Title>
                <Scissors size={20} color="var(--primary-color)" /> O que vamos
                fazer hoje?
              </Title>
            </Header>
            <MainGrid>
              {db.services.map((s: any) => (
                <ItemCard
                  key={s.id}
                  active={form.service?.id === s.id}
                  onClick={() => {
                    setForm({ ...form, service: s });
                    setStep(2);
                  }}
                >
                  <strong>{s.name}</strong>
                  <span>
                    {s.duration} min • R$ {s.price}
                  </span>
                </ItemCard>
              ))}
            </MainGrid>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepBadge>Fase 02</StepBadge>
            <Header>
              <Title>
                <User size={20} color="var(--primary-color)" /> Com qual
                profissional?
              </Title>
              <ChevronLeft
                onClick={() => setStep(1)}
                style={{ cursor: "pointer" }}
              />
            </Header>
            <MainGrid>
              {db.barbers
                .filter((b: any) => b.ativo)
                .map((b: any) => (
                  <ItemCard
                    key={b.id}
                    active={form.barber?.id === b.id}
                    onClick={() => {
                      setForm({ ...form, barber: b });
                      setStep(3);
                    }}
                  >
                    <strong>{b.name}</strong>
                    <span>{b.especialidade || "Especialista"}</span>
                  </ItemCard>
                ))}
            </MainGrid>
          </GlassCard>
        )}

        {step === 3 && (
          <GlassCard
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <StepBadge>Finalização</StepBadge>
            <Header>
              <Title>
                <Clock size={20} color="var(--primary-color)" /> Escolha a
                Janela de Tempo
              </Title>
              <ChevronLeft
                onClick={() => setStep(2)}
                style={{ cursor: "pointer" }}
              />
            </Header>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.5fr",
                gap: "1.5rem",
              }}
            >
              {/* Calendário */}
              <div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    opacity: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Próximos Dias
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "10px",
                  }}
                >
                  {Array.from({ length: 7 }).map((_, i) => {
                    const d = addDays(new Date(), i);
                    if (d.getDay() === 1) return null; // Ignora segunda
                    return (
                      <ItemCard
                        key={i}
                        active={isSameDay(d, form.date)}
                        onClick={() => setForm({ ...form, date: d, time: "" })}
                        style={{ padding: "10px" }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <strong>{format(d, "dd/MM")}</strong>
                          <span style={{ fontSize: "0.6rem" }}>
                            {format(d, "eeee", { locale: ptBR })}
                          </span>
                        </div>
                      </ItemCard>
                    );
                  })}
                </div>
              </div>

              {/* Horários */}
              <div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    opacity: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Horários Disponíveis
                </span>
                <TimeGrid style={{ marginTop: "10px" }}>
                  {timeSlots.map((t) => {
                    const isOccupied = isTimeBlocked(t);
                    const now = new Date();
                    const [h, m] = t.split(":").map(Number);
                    const slotDate = new Date(form.date);
                    slotDate.setHours(h, m, 0, 0);

                    const isPast =
                      isSameDay(form.date, now) && isAfter(now, slotDate);
                    const disabled = isOccupied || isPast;

                    return (
                      <ItemCard
                        key={t}
                        disabled={disabled}
                        active={form.time === t}
                        onClick={() =>
                          !disabled && setForm({ ...form, time: t })
                        }
                        style={{ textAlign: "center", padding: "10px" }}
                      >
                        {t}
                      </ItemCard>
                    );
                  })}
                </TimeGrid>
              </div>
            </div>

            <Summary>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "0.7rem",
                    opacity: 0.5,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "8px",
                  }}
                >
                  Detalhamento do Agendamento
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px 20px",
                  }}
                >
                  {/* Coluna 1: Serviço e Barbeiro */}
                  <div>
                    <h3
                      style={{
                        color: "var(--primary-color)",
                        margin: 0,
                        fontSize: "1.1rem",
                      }}
                    >
                      {form.service?.name}
                    </h3>
                    <p style={{ fontSize: "0.9rem", margin: "4px 0" }}>
                      <User
                        size={14}
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />
                      {form.barber?.name}
                    </p>
                  </div>

                  {/* Coluna 2: Tempo e Valor */}
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      <Clock
                        size={14}
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />
                      {form.service?.duration} minutos
                    </p>
                    <p
                      style={{
                        margin: "4px 0",
                        color: "#00ff9d",
                        fontWeight: 900,
                      }}
                    >
                      R$ {Number(form.service?.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Linha de Baixo: Data e Recompensa */}
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                      paddingTop: "10px",
                      marginTop: "5px",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>
                      <CalIcon
                        size={14}
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />
                      {format(form.date, "dd 'de' MMMM", { locale: ptBR })} às{" "}
                      <span style={{ color: "var(--primary-color)" }}>
                        {form.time || "--:--"}
                      </span>
                    </p>

                    <div
                      style={{ marginTop: "8px", display: "flex", gap: "10px" }}
                    >
                      <span
                        style={{
                          fontSize: "0.65rem",
                          background: "rgba(255,255,255,0.1)",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        + {Math.floor(Number(form.service?.price || 0) / 10)}{" "}
                        PTS FIDELIDADE
                      </span>
                      {typeof isReward !== "undefined" && isReward && (
                        <span
                          style={{
                            fontSize: "0.65rem",
                            background: "var(--primary-color)",
                            color: "#000",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                          }}
                        >
                          RESGATE DE RECOMPENSA
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <FinalBtn
                disabled={!form.time || loading}
                onClick={handleFinish}
                style={{ minWidth: "160px", justifyContent: "center" }}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    CONFIRMAR <CheckCircle2 size={18} />
                  </>
                )}
              </FinalBtn>
            </Summary>
          </GlassCard>
        )}
      </AnimatePresence>
    </Container>
  );
}
