import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  User,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
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
import { Container, Card, THEME, ServiceList } from "./BookingStyles";

interface BookingFormProps {
  onBookingSuccess?: () => void;
  clerkId: string;
  userName: string;
}

export default function BookingForm({
  onBookingSuccess,
  clerkId,
  userName,
}: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userPoints, setUserPoints] = useState(0);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [dbBarbers, setDbBarbers] = useState<any[]>([]);
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);

  const [form, setForm] = useState({
    service: null as any,
    barber: null as any,
    date: new Date(),
    time: "",
  });

  const isRewardEligible = useMemo(() => userPoints >= 10, [userPoints]);

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
    async function loadInitialData() {
      try {
        const [s, b, p] = await Promise.all([
          api.get("/servicos"),
          api.get("/barbeiros"),
          api
            .get(`/perfil?clerk_id=${clerkId}`)
            .catch(() => ({ data: { pontos: 0 } })),
        ]);
        setDbServices(s.data);
        setDbBarbers(b.data);
        setUserPoints(p.data.pontos || 0);
      } catch (e) {
        console.error(e);
      }
    }
    if (clerkId) loadInitialData();
  }, [clerkId]);

  useEffect(() => {
    if (form.barber && form.date) {
      const dateStr = format(form.date, "yyyy-MM-dd");
      api
        .get(`/occupied-times?data=${dateStr}&barbeiro_id=${form.barber.id}`)
        .then((res) => setOccupiedTimes(res.data))
        .catch(() => setOccupiedTimes([]));
    }
  }, [form.date, form.barber]);

  const handleFinish = async () => {
    setLoading(true);
    setError(null);

    // LOGICA DO VALOR: Se atingiu 10 pontos, o valor enviado é 0 (Grátis)
    const valorParaOBanco = isRewardEligible ? 0 : Number(form.service.price);

    try {
      const [hours, minutes] = form.time.split(":");
      const finalDate = new Date(form.date);
      finalDate.setHours(parseInt(hours), parseInt(minutes), 0);

      await api.post("/agendar", {
        cliente: userName,
        clerk_id: clerkId,
        servico_id: Number(form.service.id),
        barbeiro_id: Number(form.barber.id),
        data: format(finalDate, "yyyy-MM-dd HH:mm:ss"),
        is_reward: isRewardEligible,
        valor: valorParaOBanco, // ESTE CAMPO ENVIA O PREÇO PARA O DB
      });

      if (onBookingSuccess) onBookingSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao salvar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = [];
    let day = startDate;
    while (day <= endDate) {
      const cloneDay = day;
      const isPast = isBefore(cloneDay, startOfDay(new Date()));
      const isSelected = isSameDay(cloneDay, form.date);
      days.push(
        <div
          key={cloneDay.toISOString()}
          onClick={() =>
            !isPast && setForm({ ...form, date: cloneDay, time: "" })
          }
          style={{
            padding: "12px 0",
            textAlign: "center",
            cursor: isPast ? "not-allowed" : "pointer",
            borderRadius: "4px",
            background: isSelected ? THEME.accent : "transparent",
            color: isPast ? "#333" : isSelected ? "#fff" : "#eee",
            fontSize: "0.8rem",
            opacity: isPast ? 0.3 : 1,
          }}
        >
          {format(cloneDay, "d")}
        </div>,
      );
      day = addDays(day, 1);
    }
    return days;
  };

  return (
    <Container>
      {/* BARRA DE FIDELIDADE */}
      <div
        style={{
          marginBottom: "20px",
          padding: "12px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid #111",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span className="sync" style={{ fontSize: "0.55rem", color: "#666" }}>
            PONTOS ACUMULADOS
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              color: isRewardEligible ? "#FFD700" : THEME.accent,
              fontWeight: "bold",
            }}
          >
            {userPoints}/10
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "4px",
            background: "#111",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{ width: `${Math.min((userPoints / 10) * 100, 100)}%` }}
            style={{
              height: "100%",
              background: isRewardEligible ? "#FFD700" : THEME.accent,
            }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {step === 1 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h2
                className="sync"
                style={{
                  fontSize: "0.7rem",
                  color: THEME.accent,
                  marginBottom: "15px",
                }}
              >
                [ 01 ] SELECIONAR SERVIÇO
              </h2>

              <ServiceList>
                {" "}
                {/* O novo container com scroll entra aqui */}
                {dbServices.map((s) => (
                  <Card
                    key={s.id}
                    $active={form.service?.id === s.id}
                    onClick={() => setForm({ ...form, service: s })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px",
                      gap: "15px",
                      flexShrink: 0, // Importante: evita que o card amasse dentro do scroll
                    }}
                  >
                    {/* ... resto do conteúdo do card (ícone, nome, preço) ... */}
                    <div style={{ flex: 1 }}>
                      <strong>{s.name}</strong>
                      <p
                        style={{ fontSize: "0.7rem", margin: 0, opacity: 0.6 }}
                      >
                        40 min
                      </p>
                    </div>
                    <span className="sync" style={{ fontSize: "0.8rem" }}>
                      R$ {Number(s.price).toFixed(0)}
                    </span>
                  </Card>
                ))}
              </ServiceList>
            </motion.div>
          )}

          {step === 2 && (
            <div>
              <h2
                className="sync"
                style={{ fontSize: "0.8rem", marginBottom: "15px" }}
              >
                BARBEIRO
              </h2>
              {dbBarbers.map((b) => (
                <Card
                  key={b.id}
                  $active={form.barber?.id === b.id}
                  onClick={() => setForm({ ...form, barber: b })}
                >
                  <User size={18} /> <strong>{b.name}</strong>
                </Card>
              ))}
            </div>
          )}

          {step === 3 && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft />
                </button>
                <span className="sync" style={{ fontSize: "0.7rem" }}>
                  {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                </span>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight />
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "4px",
                }}
              >
                {renderCalendarDays()}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                  marginTop: "15px",
                }}
              >
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    disabled={occupiedTimes.includes(t)}
                    onClick={() => setForm({ ...form, time: t })}
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      background: form.time === t ? THEME.accent : "#0a0a0a",
                      color: "#fff",
                      border: "1px solid #111",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                border: `1px solid ${THEME.accent}`,
              }}
            >
              <CheckCircle
                size={40}
                color={THEME.accent}
                style={{ marginBottom: "10px" }}
              />
              <h3 className="sync" style={{ fontSize: "0.8rem" }}>
                CONFIRMAR?
              </h3>
              <p style={{ fontSize: "0.75rem", marginTop: "10px" }}>
                {form.service?.name} com {form.barber?.name}
                <br />
                {format(form.date, "dd/MM/yyyy")} às {form.time}
                <br />
                <strong
                  style={{ color: isRewardEligible ? "#FFD700" : "#fff" }}
                >
                  VALOR:{" "}
                  {isRewardEligible
                    ? "GRÁTIS (10 PONTOS)"
                    : `R$ ${Number(form.service?.price).toFixed(2)}`}
                </strong>
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{ flex: 1, background: "#111", color: "#fff" }}
          >
            VOLTAR
          </button>
        )}
        <button
          disabled={loading}
          onClick={step === 4 ? handleFinish : () => setStep(step + 1)}
          style={{ flex: 2, background: THEME.accent, color: "#fff" }}
        >
          {loading ? "SALVANDO..." : step === 4 ? "FINALIZAR" : "PRÓXIMO"}
        </button>
      </div>
    </Container>
  );
}
