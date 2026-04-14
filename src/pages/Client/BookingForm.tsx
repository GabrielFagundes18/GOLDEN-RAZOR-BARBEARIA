import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  User,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const loadProfile = async () => {
    try {
      const resProfile = await api.get(`/profile/${clerkId}`);
      setUserPoints(resProfile.data.pontos || 0);
    } catch (pErr) {
      setUserPoints(0);
    }
  };

  useEffect(() => {
    async function loadInitialData() {
      if (!clerkId) return;
      setError(null);
      try {
        const [resServices, resBarbers] = await Promise.all([
          api.get("/servicos").catch(() => ({ data: [] })),
          api.get("/barbeiros").catch(() => ({ data: [] })),
        ]);
        setDbServices(resServices.data);
        setDbBarbers(resBarbers.data);
        await loadProfile();
      } catch (err) {
        setError("Erro ao conectar com a central de dados.");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [clerkId]);

  useEffect(() => {
    if (form.barber?.id && form.date) {
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
  }, [form.date, form.barber]);

  const handleFinish = async () => {
    if (!form.service || !form.barber || !form.time) return;
    setSubmitting(true);
    setError(null);

    try {
      const [hours, minutes] = form.time.split(":");
      const finalDate = new Date(form.date);
      finalDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const payload = {
        cliente: userName || "Agente Elite",
        clerk_id: clerkId,
        servico_id: Number(form.service.id),
        barbeiro_id: Number(form.barber.id),
        data: format(finalDate, "yyyy-MM-dd HH:mm:ss"),
        is_reward: isRewardEligible,
        valor: isRewardEligible ? 0 : Number(form.service.price),
      };

      await api.post("/agendar", payload);
      await loadProfile(); // Atualiza pontos após agendar
      if (onBookingSuccess) onBookingSuccess();
      setStep(5);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Conflito na rede. Tente outro horário.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      service: null,
      barber: null,
      date: new Date(),
      time: "",
    });
    setStep(1);
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
      const isCurrentMonth = cloneDay.getMonth() === currentMonth.getMonth();

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
            borderRadius: "8px",
            background: isSelected ? THEME.accent : "transparent",
            color: isPast
              ? "#222"
              : isSelected
                ? "#fff"
                : isCurrentMonth
                  ? "#eee"
                  : "#444",
            fontSize: "0.8rem",
            opacity: isPast ? 0.2 : 1,
            transition: "0.2s",
            border: isSelected
              ? `1px solid ${THEME.accent}`
              : "1px solid transparent",
          }}
        >
          {format(cloneDay, "d")}
        </div>,
      );
      day = addDays(day, 1);
    }
    return days;
  };

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
        }}
      >
        <Loader2 className="animate-spin" size={32} color={THEME.accent} />
        <p
          style={{ marginTop: "15px", fontSize: "0.7rem", color: "#666" }}
          className="sync"
        >
          SINCRONIZANDO PROTOCOLOS...
        </p>
      </Container>
    );
  }

  return (
    <Container>
      {/* BARRA DE FIDELIDADE */}
      <div
        style={{
          marginBottom: "25px",
          padding: "18px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            alignItems: "center",
          }}
        >
          <span className="sync" style={{ fontSize: "0.6rem", color: "#666" }}>
            LOYALTY_STATUS
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: isRewardEligible ? "#FFD700" : "#fff",
              fontWeight: "900",
              fontFamily: "Syncopate",
            }}
          >
            {userPoints}/10 PTS
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            background: "#111",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {step === 1 && (
            <>
              <h2
                className="sync"
                style={{
                  fontSize: "0.65rem",
                  color: THEME.accent,
                  marginBottom: "15px",
                }}
              >
                [ 01 ] SELECIONE O SERVIÇO
              </h2>
              <ServiceList>
                {dbServices.length > 0 ? (
                  dbServices.map((s) => (
                    <Card
                      key={String(s.id)}
                      $active={form.service?.id === s.id}
                      onClick={() => setForm({ ...form, service: s })}
                    >
                      <Scissors
                        size={18}
                        color={THEME.accent}
                        style={{ marginRight: "12px" }}
                      />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: "block" }}>
                          {s.name?.toUpperCase()}
                        </strong>
                        <p style={{ fontSize: "0.6rem", opacity: 0.5 }}>
                          DURAÇÃO: 40 MIN
                        </p>
                      </div>
                      <span className="sync" style={{ fontSize: "0.8rem" }}>
                        R$ {Number(s.price).toFixed(0)}
                      </span>
                    </Card>
                  ))
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "0.7rem",
                      color: "#444",
                    }}
                  >
                    NENHUM SERVIÇO DISPONÍVEL
                  </p>
                )}
              </ServiceList>
            </>
          )}

          {step === 2 && (
            <>
              <h2
                className="sync"
                style={{
                  fontSize: "0.65rem",
                  color: THEME.accent,
                  marginBottom: "15px",
                }}
              >
                [ 02 ] ESCOLHA O BARBEIRO
              </h2>
              {dbBarbers.map((b) => (
                <Card
                  key={b.id}
                  $active={form.barber?.id === b.id}
                  onClick={() => setForm({ ...form, barber: b })}
                >
                  <User
                    size={18}
                    color={THEME.accent}
                    style={{ marginRight: "10px" }}
                  />
                  <strong>{b.name.toUpperCase()}</strong>
                </Card>
              ))}
            </>
          )}

          {step === 3 && (
            <>
              <h2
                className="sync"
                style={{
                  fontSize: "0.65rem",
                  color: THEME.accent,
                  marginBottom: "15px",
                }}
              >
                [ 03 ] DATA E HORÁRIO
              </h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  style={{ background: "none", border: "none", color: "#fff" }}
                >
                  <ChevronLeft />
                </button>
                <span className="sync" style={{ fontSize: "0.7rem" }}>
                  {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                </span>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  style={{ background: "none", border: "none", color: "#fff" }}
                >
                  <ChevronRight />
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "4px",
                  marginBottom: "20px",
                }}
              >
                {renderCalendarDays()}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                }}
              >
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    disabled={occupiedTimes.includes(t)}
                    onClick={() => setForm({ ...form, time: t })}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      background: form.time === t ? THEME.accent : "#0a0a0a",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.05)",
                      opacity: occupiedTimes.includes(t) ? 0.2 : 1,
                      cursor: occupiedTimes.includes(t)
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                border: `1px solid ${THEME.accent}`,
                borderRadius: "16px",
                background: "rgba(225, 29, 72, 0.05)",
              }}
            >
              <h3
                className="sync"
                style={{ fontSize: "0.8rem", marginBottom: "20px" }}
              >
                RESUMO DO AGENDAMENTO
              </h3>
              <div style={{ fontSize: "0.8rem", textAlign: "left" }}>
                <p>
                  <strong>SERVIÇO:</strong> {form.service?.name}
                </p>
                <p>
                  <strong>BARBEIRO:</strong> {form.barber?.name}
                </p>
                <p>
                  <strong>DATA:</strong> {format(form.date, "dd/MM/yyyy")} às{" "}
                  {form.time}
                </p>
                <p
                  style={{
                    marginTop: "15px",
                    color: isRewardEligible ? "#FFD700" : "#fff",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  TOTAL:{" "}
                  {isRewardEligible
                    ? "GRÁTIS (RESGATE)"
                    : `R$ ${Number(form.service?.price).toFixed(2)}`}
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <CheckCircle
                size={50}
                color="#22c55e"
                style={{ marginBottom: "20px" }}
              />
              <h2
                className="sync"
                style={{
                  fontSize: "0.9rem",
                  color: "#fff",
                  marginBottom: "10px",
                }}
              >
                AGENDAMENTO CONCLUÍDO!
              </h2>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "#666",
                  marginBottom: "30px",
                }}
              >
                PROTOCOLO ENVIADO PARA O SISTEMA.
              </p>
              <button
                onClick={resetForm}
                style={{
                  width: "100%",
                  background: "#fff",
                  color: "#000",
                  borderRadius: "12px",
                  padding: "15px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: "Syncopate",
                  fontSize: "0.6rem",
                }}
              >
                NOVO AGENDAMENTO
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step < 5 && (
        <div style={{ display: "flex", gap: "12px", marginTop: "30px" }}>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                borderRadius: "12px",
                padding: "15px",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
              }}
            >
              VOLTAR
            </button>
          )}
          <button
            disabled={
              submitting ||
              (step === 1 && !form.service) ||
              (step === 2 && !form.barber) ||
              (step === 3 && !form.time)
            }
            onClick={step === 4 ? handleFinish : () => setStep(step + 1)}
            style={{
              flex: 2,
              background: THEME.accent,
              color: "#fff",
              borderRadius: "12px",
              padding: "15px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : step === 4 ? (
              "CONFIRMAR"
            ) : (
              "PRÓXIMO"
            )}
          </button>
        </div>
      )}

      {error && (
        <p
          style={{
            color: THEME.accent,
            fontSize: "0.7rem",
            marginTop: "15px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}
    </Container>
  );
}
