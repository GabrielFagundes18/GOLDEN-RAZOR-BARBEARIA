import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Plus, Trash2, Loader2, X, Search, Power, User } from "lucide-react";
import { api } from "../../services/api";

// --- ESTILOS ---
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  color: #fff;
  font-family: "Inter", sans-serif;
`;

const Main = styled.main`
  flex: 1;
  padding: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-family: "Rajdhani", sans-serif;
    font-size: 2.5rem;
    color: #d4af37;
    margin: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const Card = styled.div<{ $ativo: boolean }>`
  background: ${(props) => (props.$ativo ? "#111" : "rgba(30, 10, 10, 0.3)")};
  border: 1px solid ${(props) => (props.$ativo ? "#222" : "#411")};
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;

  /* O segredo para não sumir: apenas mudamos a aparência */
  opacity: ${(props) => (props.$ativo ? 1 : 0.6)};
  filter: ${(props) => (props.$ativo ? "none" : "grayscale(0.5)")};

  &:hover {
    border-color: #d4af37;
    transform: translateY(-5px);
  }
`;

const StatusBtn = styled.button<{ $ativo: boolean }>`
  background: ${(props) =>
    props.$ativo ? "rgba(0, 255, 100, 0.1)" : "rgba(255, 77, 77, 0.1)"};
  color: ${(props) => (props.$ativo ? "#00ff64" : "#ff4d4d")};
  border: 1px solid ${(props) => (props.$ativo ? "#00ff64" : "#ff4d4d")};
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;

  &:hover {
    background: ${(props) => (props.$ativo ? "#00ff64" : "#ff4d4d")};
    color: #000;
  }
`;

const CommissionBox = styled.div`
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.1);
  padding: 15px;
  border-radius: 12px;
  margin-top: 20px;
  text-align: center;

  span {
    display: block;
    color: #d4af37;
    font-size: 0.65rem;
    font-weight: 800;
    margin-bottom: 5px;
  }
  strong {
    font-size: 1.8rem;
    font-family: "Rajdhani";
    color: #fff;
  }
`;

export const Equipe = () => {
  const [barbeiros, setBarbeiros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Datas padrão (Mês atual)
  const [start, setStart] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
  );
  const [end, setEnd] = useState(new Date().toISOString().split("T")[0]);

  const [form, setForm] = useState({
    name: "",
    especialidade: "",
    comissao: 50,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Chama a rota que agora não tem mais o filtro WHERE ativo = true
      const { data } = await api.get("/barbeirosAdmin", {
        params: { start, end },
      });
      setBarbeiros(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [start, end]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async (id: number) => {
    try {
      const res = await api.patch(`/barbeirosAdmin/${id}/status`);

      // Atualiza o estado LOCAL. Isso garante que o card continue na lista.
      setBarbeiros((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ativo: res.data.ativo } : b)),
      );
    } catch (err) {
      alert("Erro ao atualizar status.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja remover este profissional permanentemente?"))
      return;
    try {
      await api.delete(`/barbeirosAdmin/${id}`);
      loadData();
    } catch (err) {
      alert("Erro ao deletar.");
    }
  };

  const handleSave = async () => {
    if (!form.name) return;
    try {
      await api.post("/barbeirosAdmin", {
        name: form.name,
        especialidade: form.especialidade,
        comissao_percentual: form.comissao,
      });
      setModalOpen(false);
      setForm({ name: "", especialidade: "", comissao: 50 });
      loadData();
    } catch (err) {
      alert("Erro ao cadastrar.");
    }
  };

  return (
    <Layout>
      <Main>
        <Header>
          <h1>EQUIPE</h1>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              background: "#d4af37",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "900",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Plus size={20} /> NOVO BARBEIRO
          </button>
        </Header>

        {/* Filtros de Data */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "30px",
            background: "#111",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "10px",
                color: "#555",
                display: "block",
                marginBottom: "5px",
              }}
            >
              DATA INICIAL
            </label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{
                width: "100%",
                background: "#000",
                border: "1px solid #222",
                color: "#fff",
                padding: "10px",
                borderRadius: "6px",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "10px",
                color: "#555",
                display: "block",
                marginBottom: "5px",
              }}
            >
              DATA FINAL
            </label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{
                width: "100%",
                background: "#000",
                border: "1px solid #222",
                color: "#fff",
                padding: "10px",
                borderRadius: "6px",
              }}
            />
          </div>
          <button
            onClick={loadData}
            style={{
              background: "#222",
              color: "#fff",
              border: "none",
              padding: "0 20px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            <Search size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px" }}>
            <Loader2 className="animate-spin" size={40} color="#d4af37" />
          </div>
        ) : (
          <Grid>
            {barbeiros.map((b) => {
              const bruto = Number(b.faturamento_periodo || 0);
              const comissao =
                bruto * (Number(b.comissao_percentual || 50) / 100);

              return (
                <Card key={b.id} $ativo={b.ativo}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        background: "#000",
                        border: "1px solid #d4af37",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <User color={b.ativo ? "#d4af37" : "#333"} size={28} />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <StatusBtn
                        $ativo={b.ativo}
                        onClick={() => handleToggleStatus(b.id)}
                      >
                        <Power size={14} />
                        {b.ativo ? "ATIVO" : "OFFLINE"}
                      </StatusBtn>
                      <Trash2
                        size={18}
                        color="#333"
                        style={{ cursor: "pointer", marginTop: "8px" }}
                        onClick={() => handleDelete(b.id)}
                      />
                    </div>
                  </div>

                  <h3 style={{ margin: "0 0 5px 0", fontSize: "1.4rem" }}>
                    {b.name}
                  </h3>
                  <p style={{ color: "#555", fontSize: "0.8rem", margin: 0 }}>
                    {b.especialidade || "Barbeiro Master"}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "20px",
                      borderTop: "1px solid #222",
                      paddingTop: "15px",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "10px", color: "#444" }}>
                        CORTES
                      </span>
                      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        {b.total_cortes || 0}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "10px", color: "#444" }}>
                        BRUTO
                      </span>
                      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        R$ {bruto.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <CommissionBox>
                    <span>COMISSÃO A PAGAR ({b.comissao_percentual}%)</span>
                    <strong>R$ {comissao.toFixed(2)}</strong>
                  </CommissionBox>
                </Card>
              );
            })}
          </Grid>
        )}
      </Main>

      {/* Modal de Cadastro */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#111",
              padding: "30px",
              borderRadius: "16px",
              border: "1px solid #d4af37",
              width: "400px",
            }}
          >
            <h2 style={{ color: "#d4af37", marginTop: 0 }}>
              NOVO PROFISSIONAL
            </h2>
            <input
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                width: "100%",
                padding: "12px",
                background: "#000",
                border: "1px solid #222",
                color: "#fff",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            />
            <input
              placeholder="Especialidade"
              value={form.especialidade}
              onChange={(e) =>
                setForm({ ...form, especialidade: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                background: "#000",
                border: "1px solid #222",
                color: "#fff",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            />
            <input
              placeholder="Comissão %"
              type="number"
              value={form.comissao}
              onChange={(e) =>
                setForm({ ...form, comissao: Number(e.target.value) })
              }
              style={{
                width: "100%",
                padding: "12px",
                background: "#000",
                border: "1px solid #222",
                color: "#fff",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  background: "#d4af37",
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              >
                SALVAR
              </button>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  flex: 1,
                  background: "#222",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Equipe;
