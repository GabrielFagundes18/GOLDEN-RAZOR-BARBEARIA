import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  User,
  ShoppingCart,
  CheckCircle,
  Loader2,
  Package,
} from "lucide-react";
import { api } from "../../services/api";

// --- Estilos Refatorados com Variáveis de Tema ---

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(12px);
`;

const ModalContainer = styled(motion.div)`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  padding: 3rem;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  position: relative;
  box-shadow:
    0 50px 100px rgba(0, 0, 0, 0.9),
    0 0 30px var(--primary-glow);
  overflow: visible;
`;

const TitleSection = styled.div`
  text-align: left;
  margin-bottom: 2rem;
  span {
    color: var(--primary-color);
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 3px;
    display: block;
    opacity: 0.8;
  }
  h2 {
    font-family: "Rajdhani", sans-serif;
    font-size: 1.8rem;
    text-transform: uppercase;
    color: var(--text-color);
  }
`;

const ProductHighlight = styled.div`
  background: var(--bg-darker);
  border: 1px solid var(--border-bright);
  padding: 1.2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid var(--gold-color);

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    small {
      color: var(--text-dark);
      font-size: 0.6rem;
      font-weight: 800;
    }
    strong {
      color: var(--text-color);
      font-size: 0.9rem;
      text-transform: uppercase;
    }
  }

  .price {
    font-family: "Rajdhani";
    font-size: 1.4rem;
    color: var(--gold-bright);
    font-weight: 700;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1.5rem;
  position: relative;

  label {
    font-size: 0.65rem;
    color: var(--text-muted);
    font-weight: 800;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .field-wrapper {
    position: relative;
    input {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      padding: 1rem 1rem 1rem 3rem;
      color: var(--text-color);
      border-radius: 8px;
      width: 100%;
      transition: 0.3s;
      &:focus {
        border-color: var(--primary-color);
        outline: none;
        box-shadow: 0 0 15px var(--gold-glow);
      }
    }
    svg {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  width: 100%;
  background: var(--card-color);
  border: 1px solid var(--primary-color);
  top: 110%;
  z-index: 5000;
  border-radius: 8px;
  list-style: none;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
`;

const SuggestionItem = styled.li`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: 0.2s;
  &:hover {
    background: var(--primary-color);
    .name,
    .email {
      color: #000;
    }
  }
  .name {
    color: var(--text-color);
    font-weight: 700;
    font-size: 0.85rem;
  }
  .email {
    font-size: 0.7rem;
    color: var(--text-muted);
  }
`;

const TotalContainer = styled.div`
  background: var(--bg-darker);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;

  .label {
    font-size: 0.65rem;
    font-weight: 900;
    color: var(--text-dark);
  }

  .value {
    font-family: "Rajdhani";
    font-size: 1.8rem;
    font-weight: 900;
    color: var(--success-color);
  }
`;

const ActionButton = styled.button`
  width: 100%;
  margin-top: 2rem;
  padding: 1.2rem;
  background: var(--primary-color);
  color: #000; // Preto para contraste no dourado
  border: none;
  border-radius: 8px;
  font-weight: 900;
  font-family: "Rajdhani", sans-serif;
  font-size: 1rem;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: 0.3s;

  &:hover:not(:disabled) {
    background: var(--gold-bright);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px var(--gold-glow);
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
    filter: grayscale(1);
  }
`;

const SuccessOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  h3 {
    font-family: "Rajdhani";
    font-size: 1.5rem;
    color: var(--success-color);
  }
  p {
    font-size: 0.85rem;
    color: var(--text-muted);
  }
`;

// --- Componente ---

export const VendaModal = ({ produto, onClose, onConfirm }: any) => {
  const [qtd, setQtd] = useState(1);
  const [cliente, setCliente] = useState("");
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (cliente.length > 2) {
        api
          .get(`/barber/clientes/search?nome=${cliente}`)
          .then((res) => {
            setSugestoes(res.data);
            setShowSugestoes(true);
          })
          .catch(() => setShowSugestoes(false));
      } else {
        setShowSugestoes(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [cliente]);

  const handleFinalize = async () => {
    setLoading(true);
    try {
      await onConfirm(produto.id, qtd, cliente, produto.preco * qtd);
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      alert("Erro na operação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContainer
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <X
            size={20}
            onClick={onClose}
            style={{
              position: "absolute",
              right: 25,
              top: 25,
              cursor: "pointer",
              color: "var(--text-dark)",
            }}
          />

          {!success ? (
            <>
              <TitleSection>
                <span>OPERACIONAL_MOD_02</span>
                <h2>Efetuar Venda</h2>
              </TitleSection>

              <ProductHighlight>
                <div className="info">
                  <small>PRODUTO SELECIONADO</small>
                  <strong>{produto.nome}</strong>
                </div>
                <div className="price">
                  R$ {Number(produto.preco).toFixed(2)}
                </div>
              </ProductHighlight>

              <InputGroup>
                <label>
                  <User size={12} /> CLIENTE DESTINATÁRIO
                </label>
                <div className="field-wrapper">
                  <Search size={18} color="var(--primary-color)" />
                  <input
                    placeholder="Buscar cliente no banco..."
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    onFocus={() => cliente.length > 2 && setShowSugestoes(true)}
                  />
                </div>
                {showSugestoes && sugestoes.length > 0 && (
                  <SuggestionsList>
                    {sugestoes.map((s, i) => (
                      <SuggestionItem
                        key={i}
                        onMouseDown={() => {
                          setCliente(s.nome);
                          setShowSugestoes(false);
                        }}
                      >
                        <span className="name">{s.nome}</span>
                        <span className="email">{s.email}</span>
                      </SuggestionItem>
                    ))}
                  </SuggestionsList>
                )}
              </InputGroup>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: "1.5rem",
                }}
              >
                <InputGroup>
                  <label>
                    <Package size={12} /> QTD
                  </label>
                  <div className="field-wrapper" style={{ paddingLeft: 0 }}>
                    <input
                      type="number"
                      min="1"
                      value={qtd}
                      onChange={(e) => setQtd(Number(e.target.value))}
                      style={{ paddingLeft: "1rem", textAlign: "center" }}
                    />
                  </div>
                </InputGroup>

                <TotalContainer>
                  <div className="label">
                    TOTAL DA
                    <br />
                    OPERAÇÃO
                  </div>
                  <div className="value">
                    R$ {(produto.preco * qtd).toFixed(2)}
                  </div>
                </TotalContainer>
              </div>

              <ActionButton
                disabled={!cliente || loading}
                onClick={handleFinalize}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={20} /> FINALIZAR VENDA
                  </>
                )}
              </ActionButton>
            </>
          ) : (
            <SuccessOverlay>
              <CheckCircle size={60} color="var(--success-color)" />
              <h3>VENDA REGISTRADA</h3>
              <p>O estoque foi atualizado e o protocolo de venda foi salvo.</p>
            </SuccessOverlay>
          )}
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  );
};
