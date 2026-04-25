import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  ShoppingCart,
  CheckCircle,
  Loader2,
  Trash2,
  Search,
} from "lucide-react";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

const ModalContainer = styled(motion.div)`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 550px;
  position: relative;
`;

const CartList = styled.div`
  max-height: 250px;
  overflow-y: auto;
  margin: 1.5rem 0;
  padding-right: 5px;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
  }
`;

const CartItem = styled.div`
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  padding: 0.8rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TotalBox = styled.div`
  background: var(--bg-darker);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid var(--success-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const VendaModal = ({ itens, setCarrinho, onClose, onConfirm }: any) => {
  const [cliente, setCliente] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalGeral = itens.reduce(
    (acc: number, cur: any) => acc + cur.preco * cur.quantidade_carrinho,
    0,
  );

  const handleFinalize = async () => {
    setLoading(true);
    try {
      await onConfirm(cliente);
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      alert("Erro ao processar venda");
    } finally {
      setLoading(false);
    }
  };

  const removerItem = (id: any) => {
    setCarrinho((prev: any) => prev.filter((i: any) => i.id !== id));
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {!success ? (
          <>
            <h2 style={{ fontFamily: "Rajdhani", color: "var(--text-color)" }}>
              FINALIZAR ARSENAL
            </h2>

            <CartList>
              {itens.map((item: any) => (
                <CartItem key={item.id}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        color: "var(--text-color)",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {item.nome}
                    </span>
                    <span
                      style={{
                        color: "var(--primary-color)",
                        fontSize: "0.7rem",
                      }}
                    >
                      {item.quantidade_carrinho}x R$ {item.preco}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{ color: "var(--text-color)", fontWeight: "bold" }}
                    >
                      R$ {(item.preco * item.quantidade_carrinho).toFixed(2)}
                    </span>
                    <Trash2
                      size={16}
                      color="var(--error-color)"
                      style={{ cursor: "pointer" }}
                      onClick={() => removerItem(item.id)}
                    />
                  </div>
                </CartItem>
              ))}
            </CartList>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  fontSize: "0.6rem",
                  color: "var(--text-muted)",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                CLIENTE DESTINATÁRIO
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "var(--bg-color)",
                  border: "1px solid var(--border-color)",
                  color: "#fff",
                  borderRadius: "6px",
                }}
                placeholder="Nome do cliente..."
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
            </div>

            <TotalBox>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                VALOR TOTAL
              </span>
              <span
                style={{
                  fontSize: "1.5rem",
                  color: "var(--success-color)",
                  fontWeight: "900",
                  fontFamily: "Rajdhani",
                }}
              >
                R$ {totalGeral.toFixed(2)}
              </span>
            </TotalBox>

            <button
              disabled={loading || itens.length === 0 || !cliente}
              onClick={handleFinalize}
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "15px",
                background: "var(--primary-color)",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <ShoppingCart size={18} /> CONFIRMAR VENDA
                </>
              )}
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <CheckCircle
              size={60}
              color="var(--success-color)"
              style={{ margin: "0 auto 1rem" }}
            />
            <h3 style={{ color: "var(--text-color)" }}>VENDA CONCLUÍDA!</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
              Estoque atualizado com sucesso.
            </p>
          </div>
        )}
      </ModalContainer>
    </Overlay>
  );
};
