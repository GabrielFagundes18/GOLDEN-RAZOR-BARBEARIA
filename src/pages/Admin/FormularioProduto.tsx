import React, { useState, useMemo } from "react";
import styled from "styled-components";
import {
  X,
  Info,
  Tag,
  Video,
  Image as ImageIcon,
  DollarSign,
  Calculator,
  TrendingUp,
} from "lucide-react";

// 1. CORREÇÃO: Definindo a interface correta (removi o import do react-router-dom)
interface FormProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

// --- ESTILOS ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(8px);
`;

const FormContainer = styled.div`
  background: #0a0a0a;
  border: 1px solid #d4af37;
  border-radius: 16px;
  width: 95%;
  max-width: 750px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2.5rem;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.15);
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d4af37;
    border-radius: 10px;
  }
`;

const TabNav = styled.div`
  display: flex;
  gap: 25px;
  border-bottom: 1px solid #222;
  margin-bottom: 25px;
  button {
    background: none;
    border: none;
    color: #666;
    padding: 12px 0;
    cursor: pointer;
    font-family: "Rajdhani", sans-serif;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 1rem;
    transition: 0.3s;
    &.active {
      color: #d4af37;
      border-bottom: 2px solid #d4af37;
    }
    &:hover {
      color: #fff;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #d4af37;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  input,
  textarea,
  select {
    width: 100%;
    background: #111;
    border: 1px solid #222;
    color: #fff;
    padding: 14px;
    border-radius: 8px;
    font-size: 0.95rem;
    &:focus {
      border-color: #d4af37;
      outline: none;
      background: #000;
    }
  }
`;

const ProfitCard = styled.div<{ isNegative: boolean }>`
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;

  .box {
    display: flex;
    flex-direction: column;
    span {
      color: #555;
      font-size: 0.65rem;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    strong {
      font-size: 1.1rem;
      color: #fff;
    }
    &.highlight strong {
      color: ${(props) => (props.isNegative ? "#ff4d4d" : "#2ecc71")};
    }
  }
`;

// --- COMPONENTE PRINCIPAL ---
export const FormularioProduto = ({ onClose, onSave }: FormProps) => {
  const [tab, setTab] = useState("basico");
  const [formData, setFormData] = useState({
    nome: "",
    preco_venda: 0,
    preco_custo: 0,
    categoria: "",
    marca: "",
    estoque_qtd: 0,
    info: "",
    descricao_longa: "",
    imagem_url: "",
    video_url: "",
    tags: "",
    especificacoes: "{}",
  });

  const analise = useMemo(() => {
    const venda = Number(formData.preco_venda) || 0;
    const custo = Number(formData.preco_custo) || 0;
    const lucroUn = venda - custo;
    const margem = venda > 0 ? (lucroUn / venda) * 100 : 0;
    const investimentoInicial = custo * (formData.estoque_qtd || 0);

    return { lucroUn, margem, investimentoInicial, isNegative: lucroUn < 0 };
  }, [formData.preco_venda, formData.preco_custo, formData.estoque_qtd]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalData = {
        ...formData,
        preco: formData.preco_venda,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        especificacoes: JSON.parse(formData.especificacoes || "{}"),
      };
      onSave(finalData);
    } catch (err) {
      alert(
        'Erro no formato das especificações (JSON inválido). Use o formato: {"Chave": "Valor"}',
      );
    }
  };

  return (
    <ModalOverlay>
      <FormContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div>
            <h2
              style={{
                color: "#d4af37",
                margin: 0,
                fontFamily: "Rajdhani",
                fontSize: "1.8rem",
              }}
            >
              NOVO PRODUTO
            </h2>
            <p style={{ color: "#444", margin: 0, fontSize: "0.8rem" }}>
              Cadastre itens com análise de ROI
            </p>
          </div>
          <X color="#444" size={28} cursor="pointer" onClick={onClose} />
        </div>

        <TabNav>
          <button
            type="button"
            className={tab === "basico" ? "active" : ""}
            onClick={() => setTab("basico")}
          >
            1. Comercial
          </button>
          <button
            type="button"
            className={tab === "detalhes" ? "active" : ""}
            onClick={() => setTab("detalhes")}
          >
            2. Descritivo
          </button>
          <button
            type="button"
            className={tab === "midia" ? "active" : ""}
            onClick={() => setTab("midia")}
          >
            3. Mídia & SEO
          </button>
        </TabNav>

        <form onSubmit={handleSubmit}>
          {tab === "basico" && (
            <>
              <FormGroup>
                <label>
                  <Tag size={14} /> Nome Identificador
                </label>
                <input
                  required
                  placeholder="Ex: Pomada Efeito Seco 100g"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </FormGroup>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "15px",
                }}
              >
                <FormGroup>
                  <label>
                    <DollarSign size={14} /> Custo de Compra (un)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preco_custo: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <label>
                    <TrendingUp size={14} /> Preço de Venda (un)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preco_venda: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <label>Estoque Inicial</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estoque_qtd: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </FormGroup>
              </div>

              <ProfitCard isNegative={analise.isNegative}>
                <div className="box">
                  <span>Investimento Inicial</span>
                  <strong>
                    {analise.investimentoInicial.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
                <div className="box highlight">
                  <span>Lucro p/ Unidade</span>
                  <strong>
                    {analise.lucroUn.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
                <div className="box highlight">
                  <span>Margem de Lucro</span>
                  <strong>{analise.margem.toFixed(1)}%</strong>
                </div>
              </ProfitCard>

              <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
                <FormGroup style={{ flex: 1 }}>
                  <label>Categoria</label>
                  <input
                    placeholder="Ex: Barba"
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup style={{ flex: 1 }}>
                  <label>Marca</label>
                  <input
                    placeholder="Ex: Barber Pro"
                    onChange={(e) =>
                      setFormData({ ...formData, marca: e.target.value })
                    }
                  />
                </FormGroup>
              </div>
            </>
          )}

          {tab === "detalhes" && (
            <>
              <FormGroup>
                <label>
                  <Info size={14} /> Resumo de Prateleira (Breve)
                </label>
                <textarea
                  rows={2}
                  placeholder="Texto que aparece na listagem rápida..."
                  onChange={(e) =>
                    setFormData({ ...formData, info: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <label>Descrição Técnica Completa</label>
                <textarea
                  rows={6}
                  placeholder="Detalhes sobre composição, modo de uso..."
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descricao_longa: e.target.value,
                    })
                  }
                />
              </FormGroup>
              <FormGroup>
                <label>
                  <Calculator size={14} /> Especificações (JSON)
                </label>
                <input
                  placeholder='{"Peso": "100g", "Fixação": "Alta"}'
                  value={formData.especificacoes}
                  onChange={(e) =>
                    setFormData({ ...formData, especificacoes: e.target.value })
                  }
                />
              </FormGroup>
            </>
          )}

          {tab === "midia" && (
            <>
              <FormGroup>
                <label>
                  <ImageIcon size={14} /> Link da Foto Principal
                </label>
                <input
                  placeholder="https://..."
                  onChange={(e) =>
                    setFormData({ ...formData, imagem_url: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <label>
                  <Video size={14} /> Link do Vídeo (Opcional)
                </label>
                <input
                  placeholder="YouTube ou Vimeo link"
                  onChange={(e) =>
                    setFormData({ ...formData, video_url: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <label>Palavras-Chave (SEO)</label>
                <input
                  placeholder="separe por vírgulas..."
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </FormGroup>
            </>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "35px" }}>
            <button
              type="submit"
              style={{
                flex: 2,
                background: "#d4af37",
                color: "#000",
                border: "none",
                padding: "18px",
                borderRadius: "8px",
                fontWeight: "900",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              CADASTRAR E PUBLICAR PRODUTO
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid #333",
                color: "#666",
                cursor: "pointer",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            >
              VOLTAR
            </button>
          </div>
        </form>
      </FormContainer>
    </ModalOverlay>
  );
};
