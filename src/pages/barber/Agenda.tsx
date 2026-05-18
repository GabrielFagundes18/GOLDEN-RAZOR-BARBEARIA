import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Loader2,
  Trash2,
  User,
  Search,
  Timer,
} from "lucide-react";
import { api } from "../../services/api";

interface Appointment {
  id: number;
  customerName: string;
  date: string;
  time: string;
  dateDay: string;
  service: string;
  price: string;
  duration: number;
  category: string;
  barberName: string;
  status: string;
}

export const AgendaDoDia: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedBarber, setSelectedBarber] = useState<string>("todos");
  const [searchName, setSearchName] = useState<string>("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchAgenda = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/schedules/daily");

      const list = Array.isArray(data) ? data : [];

      setAppointments(list);

      if (list.length > 0 && !selectedDate) {
        setSelectedDate(list[0].date);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchAgenda();
  }, [fetchAgenda]);

  const formatDataPTBR = (dateStr: string) => {
    const parts = dateStr.split("/");

    const date = new Date(
      Number(parts[2]),
      Number(parts[1]) - 1,
      Number(parts[0]),
    );

    const diaNome = new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
    }).format(date);

    const diaNum = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
    }).format(date);

    return {
      name: diaNome.replace(".", "").toUpperCase(),
      num: diaNum,
    };
  };

  const availableDates = useMemo(() => {
    const uniqueDates = Array.from(new Set(appointments.map((a) => a.date)));

    return uniqueDates
      .map((dateRaw) => ({
        raw: dateRaw,
        ...formatDataPTBR(dateRaw),
      }))
      .sort((a, b) => {
        const da = a.raw.split("/").reverse().join("");
        const db = b.raw.split("/").reverse().join("");

        return da.localeCompare(db);
      });
  }, [appointments]);

  const barberList = useMemo(() => {
    return [
      "todos",
      ...Array.from(new Set(appointments.map((a) => a.barberName))),
    ];
  }, [appointments]);

  const displayAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const matchDate = app.date === selectedDate;

      const matchBarber =
        selectedBarber === "todos" ||
        app.barberName === selectedBarber;

      const matchName = app.customerName
        .toLowerCase()
        .includes(searchName.toLowerCase());

      return matchDate && matchBarber && matchName;
    });
  }, [appointments, selectedDate, selectedBarber, searchName]);

  const handleAction = async (
    id: number,
    action: "complete" | "delete",
  ) => {
    if (
      action === "delete" &&
      !window.confirm("Excluir agendamento?")
    ) {
      return;
    }

    setProcessingId(id);

    try {
      if (action === "delete") {
        await api.delete(`/appointments/${id}`);
      } else {
        await api.patch(`/appointments/${id}/complete`);
      }

      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro na operação.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Wrapper>
      <Header>
        <Brand>
          <h1>Agenda</h1>
        </Brand>

        <FilterBox>
          <select
            value={selectedBarber}
            onChange={(e) => setSelectedBarber(e.target.value)}
          >
            {barberList.map((b) => (
              <option key={b} value={b}>
                {b === "todos" ? "Barbeiros: Todos" : b}
              </option>
            ))}
          </select>
        </FilterBox>
      </Header>

      <DateNav>
        {availableDates.map((d) => (
          <DateCard
            key={d.raw}
            $active={selectedDate === d.raw}
            onClick={() => {
              setSelectedDate(d.raw);
              setSearchName("");
            }}
          >
            <span className="name">{d.name}</span>
            <span className="num">{d.num}</span>

           
          </DateCard>
        ))}
      </DateNav>

      <SearchSection>
        <div className="search-container">
          <Search size={18} color="#444" />

          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </SearchSection>

      <MainContent>
        {loading ? (
          <LoadingContainer>
            <Loader2 className="spin" size={35} />
          </LoadingContainer>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate + selectedBarber + searchName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid"
            >
              {displayAppointments.length === 0 ? (
                <EmptyState>
                  Nenhum agendamento encontrado.
                </EmptyState>
              ) : (
                displayAppointments.map((app) => (
                  <AppointmentCard key={app.id}>
                    <div className="left-side">
                      <div className="time-info">
                        <span className="time">{app.time}</span>

                        <span className="duration">
                          <Timer size={10} />
                          {app.duration} min
                        </span>
                      </div>
                    </div>

                    <div className="main-info">
                      <div className="top">
                        <div className="category-tag">
                          {app.category}
                        </div>

                        <div className="price-tag">
                          R${" "}
                          {Number(app.price || 0).toLocaleString(
                            "pt-BR",
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </div>
                      </div>

                      <h3>{app.customerName}</h3>

                      <div className="details">
                        <span className="service">
                          {app.service}
                        </span>

                        <span className="barber">
                          <User size={12} />
                          {app.barberName}
                        </span>
                      </div>
                    </div>

                    <div className="actions">
                      <button
                        className="btn-del"
                        onClick={() =>
                          handleAction(app.id, "delete")
                        }
                        disabled={processingId === app.id}
                      >
                        <Trash2 size={16} />
                      </button>

                      <button
                        className="btn-check"
                        onClick={() =>
                          handleAction(app.id, "complete")
                        }
                        disabled={processingId === app.id}
                      >
                        {processingId === app.id ? (
                          <Loader2
                            className="animate-spin"
                            size={16}
                          />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                      </button>
                    </div>
                  </AppointmentCard>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </MainContent>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 3rem auto;
  padding: 1rem;
  color: #fff;
  
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const Brand = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  h1 {
    font-size: 2rem;
    font-weight: 900;
  }
`;

const FilterBox = styled.div`
  background: #111;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #222;
   
  select {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 0.8rem;
    outline: none;
  }

  option {
    background: #111;
    color: #fff;
  }
`;

const DateNav = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 15px 0 20px;
  width: 100%;
  padding-inline: 2px;

  @media (max-width: 768px) {
    gap: 10px;
    padding: 12px 0 18px;
    flex-wrap: wrap;
  }
`;

const DateCard = styled.div<{ $active: boolean }>`
  min-width: 65px;
  height: 85px;
  background: ${(p) => (p.$active ? "#ffcc00" : "#0a0a0a")};
  color: ${(p) => (p.$active ? "#000" : "#fff")};
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid ${(p) => (p.$active ? "#ffcc00" : "#1a1a1a")};
  position: relative;

  .name {
    font-size: 0.6rem;
    font-weight: 800;
    opacity: 0.7;
  }

  .num {
    font-size: 1.4rem;
    font-weight: 900;
  }

`;

const SearchSection = styled.div`
  margin-bottom: 1.5rem;

  .search-container {
    background: #0a0a0a;
    border: 1px solid #161616;
    border-radius: 15px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;

    input {
      background: transparent;
      border: none;
      color: #fff;
      flex: 1;
      outline: none;
      font-size: 0.9rem;
    }
  }
`;

const MainContent = styled.div`
  .grid {
    display: grid;
    gap: 12px;
  }
`;

const AppointmentCard = styled.div`
  background: #0a0a0a;
  border-radius: 20px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid #161616;
  position: relative;
  overflow: hidden;

  .left-side {
    text-align: center;
    min-width: 70px;
    border-right: 1px solid #161616;
    padding-right: 15px;

    .time {
      display: block;
      font-size: 1.2rem;
      font-weight: 900;
      color: #ffcc00;
    }

    .duration {
      font-size: 0.6rem;
      color: #555;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      margin-top: 4px;
    }
  }

  .main-info {
    flex: 1;
    min-width: 0;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-bottom: 5px;
    }

    .category-tag {
      font-size: 0.55rem;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 800;
    }

    .price-tag {
      font-size: 0.85rem;
      font-weight: 800;
      color: #22c55e;
      white-space: nowrap;
    }

    h3 {
      font-size: 1rem;
      font-weight: 700;
      margin: 2px 0 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .service {
        color: #aaa;
        font-size: 0.8rem;
      }

      .barber {
        font-size: 0.7rem;
        color: #444;
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 5px;

    button {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s;
    }

    .btn-del {
      background: #161111;
      color: #444;

      &:hover {
        background: #ef4444;
        color: #fff;
      }
    }

    .btn-check {
      background: #111612;
      color: #444;

      &:hover {
        background: #22c55e;
        color: #fff;
      }
    }
  }

  @media (max-width: 700px) {
    align-items: flex-start;

    .left-side {
      min-width: 60px;
    }

    .actions {
      button {
        width: 34px;
        height: 34px;
      }
    }
  }
`;

const LoadingContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  width: 100%;
  background: #0a0a0a;
  border: 1px solid #161616;
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
  color: #555;
  font-weight: 600;
`;

