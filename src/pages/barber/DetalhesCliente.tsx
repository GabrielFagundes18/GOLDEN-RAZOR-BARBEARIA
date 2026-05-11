import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  ArrowLeft,
  User,
  Scissors,
  Mail,
  Phone,
  Save,
  Loader2,
  History,
  Hash,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";

// --- Estilos ---
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  color: #fff;
  background: #0a0a0a;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 900px;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  font-size: 0.75rem;
  font-weight: 800;
  transition: 0.2s;
  &:hover {
    color: #f1c40f;
  }
`;

// Card de Identificação (Apenas Visual)
const InfoHeader = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #111 100%);
  border: 1px solid #333;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  .client-meta {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .id-badge {
    background: #000;
    padding: 5px 12px;
    border-radius: 4px;
    font-size: 0.6rem;
    color: #f1c40f;
    border: 1px solid #333;
    font-weight: bold;
  }
`;

// Card de Edição
const EditForm = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.65rem;
    font-weight: 900;
    color: #666;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  input {
    background: #0a0a0a;
    border: 1px solid #333;
    padding: 0.9rem;
    border-radius: 6px;
    color: #fff;
    font-size: 0.9rem;
    outline: none;
    transition: 0.3s;
    &:focus {
      border-color: #f1c40f;
      background: #000;
    }
  }
`;

const SaveBtn = styled.button`
  background: #f1c40f;
  color: #000;
  border: none;
  padding: 1.2rem;
  border-radius: 6px;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-top: 2rem;
  width: 100%;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: 0.3s;
  &:hover:not(:disabled) {
    background: #fff;
    transform: translateY(-2px);
  }
  &:disabled {
    opacity: 0.5;
  }
`;

export const DetalhesCliente = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    pontos: 0,
  });
  const [originalName, setOriginalName] = useState(""); // Para exibir no header fixo
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(`/customers/${id}/details`);
        const p = res.data.perfil;

        // Preenche os campos com o que já existe no banco
        setFormData({
          nome: p.nome || "",
          email: p.email || "",
          telefone: p.telefone || "",
          pontos: Number(p.pontos) || 0,
        });
        setOriginalName(p.nome);
        setHistorico(res.data.historico || []);
      } catch (err) {
        console.error("Erro ao carregar");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/customers/${id}`, formData);
      setOriginalName(formData.nome); // Atualiza o nome do header
      alert("✅ Alterações salvas!");
    } catch (err) {
      alert("❌ Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <MainContent>
          <Loader2 className="animate-spin" color="#f1c40f" size={40} />
        </MainContent>
      </Layout>
    );

  return (
    <Layout>
      <MainContent>
        <Container>
          <BackBtn onClick={() => navigate("/barber/clientes")}>
            <ArrowLeft size={14} /> VOLTAR PARA A LISTA
          </BackBtn>

          {/* HEADER DE IDENTIFICAÇÃO (Fixo para conferência) */}
          <InfoHeader>
            <div className="client-meta">
              <div
                style={{
                  background: "#f1c40f",
                  padding: "10px",
                  borderRadius: "50%",
                }}
              >
                <User size={24} color="#000" />
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "Rajdhani",
                    fontSize: "1.8rem",
                  }}
                >
                  {originalName}
                </h2>
                <span className="id-badge">ID: {id?.substring(0, 8)}...</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.6rem", color: "#666" }}>
                STATUS ATUAL
              </div>
              <div
                style={{
                  color: "#2ecc71",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <CheckCircle size={14} /> CLIENTE ATIVO
              </div>
            </div>
          </InfoHeader>

          {/* FORMULÁRIO DE EDIÇÃO (Já vem preenchido) */}
          <EditForm>
            <div
              style={{
                marginBottom: "1.5rem",
                borderBottom: "1px solid #333",
                paddingBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  color: "#f1c40f",
                }}
              >
                🔧 AJUSTAR INFORMAÇÕES
              </span>
            </div>

            <InputGrid>
              <Field>
                <label>
                  <User size={12} /> Nome do Cliente
                </label>
                <input
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </Field>

              <Field>
                <label>
                  <Hash size={12} /> Pontuação Fidelidade
                </label>
                <input
                  type="number"
                  value={formData.pontos}
                  onChange={(e) =>
                    setFormData({ ...formData, pontos: Number(e.target.value) })
                  }
                />
              </Field>

              <Field>
                <label>
                  <Mail size={12} /> E-mail de Contato
                </label>
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Field>

              <Field>
                <label>
                  <Phone size={12} /> Telefone / WhatsApp
                </label>
                <input
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                />
              </Field>
            </InputGrid>

            <SaveBtn onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              ATUALIZAR CADASTRO
            </SaveBtn>
          </EditForm>

          {/* HISTÓRICO (Para consulta rápida) */}
          <div
            style={{
              padding: "0.5rem 1rem",
              color: "#666",
              fontSize: "0.7rem",
              fontWeight: "bold",
            }}
          >
            <History size={12} style={{ verticalAlign: "middle" }} /> ÚLTIMAS
            PASSAGENS NA BARBEARIA
          </div>
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: "8px",
              border: "1px solid #333",
              overflow: "hidden",
            }}
          >
            {historico.length === 0 ? (
              <div
                style={{ padding: "2rem", textAlign: "center", color: "#444" }}
              >
                Sem histórico registrado.
              </div>
            ) : (
              historico.map((h: any, i) => (
                <HistoryRow key={i}>
                  <div style={{ color: "#666" }}>
                    {new Date(h.data).toLocaleDateString("pt-BR")}
                  </div>
                  <div style={{ fontWeight: "bold" }}>{h.servico}</div>
                  <div style={{ color: "#f1c40f" }}>
                    <Scissors size={12} /> {h.barbeiro}
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      color: "#2ecc71",
                      fontWeight: "900",
                    }}
                  >
                    R$ {Number(h.valor).toFixed(2)}
                  </div>
                </HistoryRow>
              ))
            )}
          </div>
        </Container>
      </MainContent>
    </Layout>
  );
};

const HistoryRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1.5fr 1fr 100px;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #222;
  align-items: center;
  font-size: 0.8rem;
  &:last-child {
    border-bottom: none;
  }
`;
