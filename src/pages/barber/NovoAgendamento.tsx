import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  User,
  Clock,
  Loader2,
  ChevronLeft,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { format, addDays, isSameDay, isAfter, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { api } from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import toast from "react-hot-toast";

// --- ESTILOS (TACTICAL DARK RESPONSIVO) ---

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const GlassCard = styled(motion.div)`
  background: rgba(10, 10, 10, 0.96);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);

  @media (min-width: 768px) {
    padding: 2.5rem;
  }
`;

const StepBadge = styled.div`
  background: var(--primary-color);
  color: #000;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 900;
  font-size: 0.7rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
  width: fit-content;
  letter-spacing: 1px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 800;
  text-transform: uppercase;
  font-family: "Rajdhani", sans-serif;

  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
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
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    border-color: var(--primary-color);
    transform: translateY(-2px);
  }

  strong {
    display: block;
    font-size: 1rem;
    margin-bottom: 4px;
    font-weight: 700;
  }
  span {
    display: block;
    font-size: 0.75rem;
    opacity: 0.8;
  }
`;

const InputSearch = styled.input`
  width: 100%;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const DateTimeFlex = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1.5fr;
    gap: 2.5rem;
  }
`;

const DaysScroll = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
  }

  @media (min-width: 768px) {
    flex-direction: column;
    overflow-x: visible;
    max-height: 400px;
    overflow-y: auto;
  }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-height: 350px;
  overflow-y: auto;
  padding-right: 5px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
`;

const Summary = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 15px;
  border-left: 4px solid var(--primary-color);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const FinalBtn = styled.button`
  background: var(--primary-color);
  color: #000;
  padding: 1.2rem;
  border: none;
  border-radius: 12px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  font-size: 0.9rem;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: scale(1.02);
  }
`;

// --- LOGICA DO COMPONENTE ---

export const NovoAgendamento: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [occupied, setOccupied] = useState<any[]>([]);

  const { data: servicos } = useFetch<any[]>("/services");
  const { data: barbeiros } = useFetch<any[]>("/barbers");
  const { data: clientes } = useFetch<any[]>("/clients/all");

  const [form, setForm] = useState({
    cliente_id: "",
    cliente_nome: "",
    service: null as any,
    barber: null as any,
    date: startOfDay(new Date()),
    time: "",
  });

  useEffect(() => {
    if (form.barber?.id) {
      api
        .get(`/bookings/occupied`, {
          params: {
            data: format(form.date, "yyyy-MM-dd"),
            barbeiro_id: form.barber.id,
          },
        })
        .then((res) => setOccupied(res.data || []))
        .catch(() => setOccupied([]));
    }
  }, [form.date, form.barber]);

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

  const isTimeBlocked = (slot: string) => {
    const [slotH, slotM] = slot.split(":").map(Number);
    const slotStartTotal = slotH * 60 + slotM;
    const myServiceDuration = parseInt(form.service?.duration || 40);
    const slotEndTotal = slotStartTotal + myServiceDuration;

    const now = new Date();
    const slotDate = new Date(form.date);
    slotDate.setHours(slotH, slotM, 0, 0);
    if (isSameDay(form.date, now) && isAfter(now, slotDate)) return true;

    return occupied.some((occ) => {
      const [occH, occM] = occ.hora_inicio.split(":").map(Number);
      const occStart = occH * 60 + occM;
      const occEnd = occStart + parseInt(occ.duracao || 40);
      return (
        (slotStartTotal >= occStart && slotStartTotal < occEnd) ||
        (slotEndTotal > occStart && slotStartTotal < occStart)
      );
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const [h, m] = form.time.split(":");
      const d = new Date(form.date);
      d.setHours(Number(h), Number(m), 0);

      await api.post("/bookings/manual", {
        cliente: form.cliente_nome,
        clerk_id: form.cliente_id || `AVULSO_${Date.now()}`,
        servico_id: form.service.id,
        barbeiro_id: form.barber.id,
        data: d.toISOString(),
      });

      toast.success("AGENDAMENTO REALIZADO!");
      navigate(-1);
    } catch (err) {
      toast.error("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <GlassCard
            key="s1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <StepBadge>Fase 01 - Cliente</StepBadge>
            <Header>
              <Title>
                <User size={20} color="var(--primary-color)" /> Quem é o
                cliente?
              </Title>
            </Header>
            <InputSearch
              placeholder="Nome do cliente..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setForm({
                  ...form,
                  cliente_nome: e.target.value,
                  cliente_id: "",
                });
              }}
            />
            <MainGrid>
              {clientes
                ?.filter((c) =>
                  c.nome.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .slice(0, 12)
                .map((c) => (
                  <ItemCard
                    key={c.id}
                    active={form.cliente_id === c.id}
                    onClick={() => {
                      setForm({
                        ...form,
                        cliente_id: c.id,
                        cliente_nome: c.nome,
                      });
                      setSearchTerm(c.nome);
                    }}
                  >
                    <strong>{c.nome}</strong>
                    <span>Fiel à barbearia</span>
                  </ItemCard>
                ))}
            </MainGrid>
            <FinalBtn
              disabled={!form.cliente_nome}
              onClick={() => setStep(2)}
              style={{ marginTop: "2rem", width: "100%" }}
            >
              Continuar para Serviços
            </FinalBtn>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard
            key="s2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepBadge>Fase 02 - Serviço</StepBadge>
            <Header>
              <Title>
                <Scissors size={20} color="var(--primary-color)" /> O que
                faremos hoje?
              </Title>
              <ChevronLeft
                onClick={() => setStep(1)}
                style={{ cursor: "pointer" }}
              />
            </Header>
            <MainGrid>
              {servicos?.map((s: any) => (
                <ItemCard
                  key={s.id}
                  active={form.service?.id === s.id}
                  onClick={() => {
                    setForm({ ...form, service: s });
                    setStep(3);
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

        {step === 3 && (
          <GlassCard
            key="s3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepBadge>Fase 03 - Barbeiro</StepBadge>
            <Header>
              <Title>
                <User size={20} color="var(--primary-color)" /> Escolha o
                profissional
              </Title>
              <ChevronLeft
                onClick={() => setStep(2)}
                style={{ cursor: "pointer" }}
              />
            </Header>
            <MainGrid>
              {barbeiros
                ?.filter((b) => b.ativo)
                .map((b: any) => (
                  <ItemCard
                    key={b.id}
                    active={form.barber?.id === b.id}
                    onClick={() => {
                      setForm({ ...form, barber: b });
                      setStep(4);
                    }}
                  >
                    <strong>{b.name}</strong>
                    <span>Disponível</span>
                  </ItemCard>
                ))}
            </MainGrid>
          </GlassCard>
        )}

        {step === 4 && (
          <GlassCard
            key="s4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <StepBadge>Fase 04 - Data e Hora</StepBadge>
            <Header>
              <Title>
                <Clock size={20} color="var(--primary-color)" /> Quando agendar?
              </Title>
              <ChevronLeft
                onClick={() => setStep(3)}
                style={{ cursor: "pointer" }}
              />
            </Header>

            <DateTimeFlex>
              <div>
                <span
                  style={{
                    fontSize: "0.65rem",
                    opacity: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Selecione o Dia
                </span>
                <DaysScroll style={{ marginTop: "10px" }}>
                  {Array.from({ length: 7 }).map((_, i) => {
                    const d = addDays(new Date(), i);
                    if (d.getDay() === 0) return null;
                    return (
                      <ItemCard
                        key={i}
                        active={isSameDay(d, form.date)}
                        onClick={() => setForm({ ...form, date: d, time: "" })}
                        style={{ minWidth: "90px", flexShrink: 0 }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <strong>{format(d, "dd/MM")}</strong>
                          <span style={{ fontSize: "0.6rem" }}>
                            {format(d, "eee", { locale: ptBR })}
                          </span>
                        </div>
                      </ItemCard>
                    );
                  })}
                </DaysScroll>
              </div>

              <div>
                <span
                  style={{
                    fontSize: "0.65rem",
                    opacity: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Horários Livres
                </span>
                <TimeGrid style={{ marginTop: "10px" }}>
                  {timeSlots.map((t) => {
                    const blocked = isTimeBlocked(t);
                    return (
                      <ItemCard
                        key={t}
                        disabled={blocked}
                        active={form.time === t}
                        onClick={() =>
                          !blocked && setForm({ ...form, time: t })
                        }
                        style={{ textAlign: "center" }}
                      >
                        {t}
                      </ItemCard>
                    );
                  })}
                </TimeGrid>
              </div>
            </DateTimeFlex>

            <Summary>
              <div style={{ textAlign: "left" }}>
                <h3
                  style={{
                    color: "var(--primary-color)",
                    margin: 0,
                    fontSize: "1.1rem",
                  }}
                >
                  {form.service?.name}
                </h3>
                <p
                  style={{ margin: "4px 0", opacity: 0.7, fontSize: "0.85rem" }}
                >
                  Com {form.barber?.name} • {format(form.date, "dd/MM")} às{" "}
                  {form.time || "--:--"}
                </p>
              </div>
              <FinalBtn
                disabled={!form.time || loading}
                onClick={handleSave}
                style={{ minWidth: "200px" }}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Finalizar Agendamento <CheckCircle2 size={18} />
                  </>
                )}
              </FinalBtn>
            </Summary>
          </GlassCard>
        )}
      </AnimatePresence>
    </Container>
  );
};
