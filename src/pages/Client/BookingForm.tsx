import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Scissors,
  User,
  Clock,
  Calendar as CalIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { api } from "../../services/api";
import toast from "react-hot-toast";

// --- ESTILOS RESPONSIVOS ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: transparent;
  color: var(--text-color);
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const DateTimeWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SectionCard = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h3`
  font-family: "Rajdhani", sans-serif;
  font-size: 0.85rem;
  letter-spacing: 1.5px;
  color: var(--primary-color);
  text-transform: uppercase;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 0 10px var(--primary-glow);
`;

const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 8px;

  /* No mobile, os botões de horário e data podem ser menores */
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
`;

// Scroll customizado para a lista de horários não esticar a tela
const ScrollableGrid = styled(ChoiceGrid)`
  max-height: 220px;
  overflow-y: auto;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 10px;
  }
`;

const ChoiceBtn = styled.button<{ active: boolean; disabled?: boolean }>`
  background: ${(props) =>
    props.active ? "var(--primary-color)" : "rgba(255,255,255,0.03)"};
  border: 1px solid
    ${(props) =>
      props.active ? "var(--primary-color)" : "var(--border-color)"};
  color: ${(props) => (props.active ? "#000" : "var(--text-color)")};
  padding: 10px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};

  &:hover:not(:disabled) {
    border-color: var(--gold-bright);
    box-shadow: 0 0 10px var(--gold-glow);
  }

  small {
    display: block;
    font-size: 0.7rem;
    opacity: 0.7;
  }
`;

const SummaryBox = styled.div`
  background: var(--bg-darker);
  padding: 1.2rem;
  border-radius: 16px;
  border: 1px solid var(--primary-glow);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }

  .item {
    font-size: 0.8rem;
    color: var(--text-muted);
    strong {
      color: var(--gold-color);
      display: block;
      font-size: 0.9rem;
    }
  }
`;

const FinalizeBtn = styled.button`
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: #000;
  border: none;
  border-radius: 12px;
  font-weight: 900;
  font-size: 0.9rem;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: var(--gold-bright);
    box-shadow: 0 0 15px var(--primary-glow);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

// --- COMPONENTE ---

// ... (mantenha os estilos anteriores)

export default function ClienteBooking({ clerkId, userName, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [dbData, setDbData] = useState({ services: [], barbers: [] });
  const [occupied, setOccupied] = useState<string[]>([]); // Horários vindos do banco
  const [form, setForm] = useState({
    service: null as any,
    barber: null as any,
    date: new Date(),
    time: "",
  });

  // 1. Carrega Serviços e Barbeiros
  useEffect(() => {
    async function load() {
      try {
        const [s, b] = await Promise.all([
          api.get("/services"),
          api.get("/barbers"),
        ]);
        setDbData({ services: s.data, barbers: b.data });
      } catch (err) {
        toast.error("Erro ao carregar dados do arsenal.");
      }
    }
    load();
  }, []);

  // 2. VERIFICAÇÃO DE AGENDA DO BARBEIRO
  // Sempre que mudar o barbeiro ou a data, consultamos o banco
  useEffect(() => {
    if (form.barber?.id) {
      setOccupied([]); // Limpa enquanto carrega
      api
        .get(`/bookings/occupied`, {
          params: {
            data: format(form.date, "yyyy-MM-dd"),
            barbeiro_id: form.barber.id,
          },
        })
        .then((res) => {
          // O backend deve retornar um array de strings: ["08:00", "10:40"]
          setOccupied(res.data);
        })
        .catch(() => toast.error("Falha ao sincronizar agenda."));
    }
  }, [form.date, form.barber]);

  // 3. Lógica para desabilitar horários passados (se for hoje)
  const isTimePast = (time: string) => {
    const isToday = isSameDay(form.date, new Date());
    if (!isToday) return false;

    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const scheduleTime = new Date();
    scheduleTime.setHours(hours, minutes, 0);

    return scheduleTime <= now;
  };

 const handleFinish = async () => {
    if (!form.service || !form.barber || !form.time) {
      return toast.error("Selecione todos os campos.");
    }
    
    setLoading(true);
    try {
      const [h, m] = form.time.split(":");
      const finalDate = new Date(form.date);
      finalDate.setHours(Number(h), Number(m), 0);

      // 1. Envia para a API
      await api.post("/bookings", {
        cliente: userName,
        usuario_id: clerkId,
        servico_id: form.service.id,
        barbeiro_id: form.barber.id,
        data: format(finalDate, "yyyy-MM-dd HH:mm:ss"),
      });

      // 2. Notifica o sucesso
      toast.success("Missão agendada com sucesso!");

      // 3. Executa o callback de sucesso (se existir)
      if (onSuccess) onSuccess();

      // 4. RECARREGA A PÁGINA (Dá um pequeno delay para o usuário ver o Toast)
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err: any) {
      const msg = err.response?.data?.error || "Erro ao agendar.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const availableSlots = [
    "08:00", "08:40", "09:20", "10:00", "10:40", "11:20",
    "13:00", "13:40", "14:20", "15:00", "15:40", "16:20",
    "17:00", "17:40", "18:20", "19:00"
  ];

  return (
    <Container>
      <DateTimeWrapper>
       
        <SectionCard>
          <Title><Scissors size={14} /> Serviço</Title>
          <ChoiceGrid>
            {dbData.services.map((s: any) => (
              <ChoiceBtn
                key={s.id}
                active={form.service?.id === s.id}
                onClick={() => setForm({ ...form, service: s })}
              >
                {s.name} <small>R$ {Number(s.price).toFixed(2)}</small>
              </ChoiceBtn>
            ))}
          </ChoiceGrid>
        </SectionCard>

        {/* Barbeiro */}
        <SectionCard>
          <Title><User size={14} /> Barbeiro</Title>
          <ChoiceGrid>
            {dbData.barbers.map((b: any) => (
              <ChoiceBtn
                key={b.id}
                active={form.barber?.id === b.id}
                onClick={() => setForm({ ...form, barber: b, time: "" })} // Limpa o time ao trocar barbeiro
              >
                {b.name}
              </ChoiceBtn>
            ))}
          </ChoiceGrid>
        </SectionCard>
      </DateTimeWrapper>

      <DateTimeWrapper>
        {/* Escolha do Dia */}
        <SectionCard>
          <Title><CalIcon size={14} /> Escolha o Dia</Title>
          <ChoiceGrid style={{ gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))" }}>
            {Array.from({ length: 14 }).map((_, i) => { // Aumentado para 14 dias
              const d = addDays(new Date(), i);
              if (d.getDay() === 0) return null; // Pula domingos
              return (
                <ChoiceBtn
                  key={i}
                  active={isSameDay(d, form.date)}
                  onClick={() => setForm({ ...form, date: d, time: "" })}
                >
                  {format(d, "dd/MM")}
                  <small>{format(d, "eee", { locale: ptBR })}</small>
                </ChoiceBtn>
              );
            })}
          </ChoiceGrid>
        </SectionCard>

        {/* Horários Dinâmicos */}
        <SectionCard>
          <Title><Clock size={14} /> Horário</Title>
          {!form.barber ? (
            <p style={{ fontSize: '0.8rem', opacity: 0.5, textAlign: 'center' }}>
              Selecione um barbeiro primeiro.
            </p>
          ) : (
            <ScrollableGrid>
              {availableSlots.map((t) => {
                const isOccupied = occupied.includes(t);
                const isPast = isTimePast(t);
                const isDisabled = isOccupied || isPast;

                return (
                  <ChoiceBtn
                    key={t}
                    active={form.time === t}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && setForm({ ...form, time: t })}
                  >
                    {t}
                    {isOccupied && <small style={{ color: '#ff4444' }}>Ocupado</small>}
                    {isPast && !isOccupied && <small>Indisponível</small>}
                  </ChoiceBtn>
                );
              })}
            </ScrollableGrid>
          )}
        </SectionCard>
      </DateTimeWrapper>

      {/* Resumo e Finalização */}
      <SummaryBox>
        <div className="details">
          <div className="item">Serviço: <strong>{form.service?.name || "--"}</strong></div>
          <div className="item">Barbeiro: <strong>{form.barber?.name || "--"}</strong></div>
          <div className="item">
            Data: <strong>
              {form.time ? `${format(form.date, "dd/MM")} às ${form.time}` : "--"}
            </strong>
          </div>
        </div>
        <FinalizeBtn 
          disabled={loading || !form.time || !form.barber || !form.service} 
          onClick={handleFinish}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Confirmar Missão"}
        </FinalizeBtn>
      </SummaryBox>
    </Container>
  );
}
