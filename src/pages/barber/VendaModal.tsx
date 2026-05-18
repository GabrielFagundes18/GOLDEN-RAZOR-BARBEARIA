import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ShoppingCart, 
  CheckCircle, 
  Loader2, 
  Trash2, 
  User, 
  Package,
  ArrowRight
} from "lucide-react";

// --- Estilos Baseados no seu :root ---

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
`;

const SidebarContainer = styled(motion.div)`
  background: var(--bg-color);
  width: 100%;
  max-width: 440px;
  height: 100vh;
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.8);
  position: relative;
  outline: none;

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const Header = styled.div`
  padding: 1.8rem;
  background: var(--bg-darker);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-group {
    display: flex;
    align-items: center;
    gap: 12px;
    h2 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--gold-color);
      margin: 0;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 10px; }
`;

const ItemCard = styled(motion.div)`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 14px 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .info {
    .name { color: var(--text-color); font-weight: 600; font-size: 0.9rem; margin-bottom: 2px; }
    .details { color: var(--text-muted); font-size: 0.75rem; }
  }

  .price-section {
    display: flex;
    align-items: center;
    gap: 15px;
    .value { 
      color: var(--gold-bright); 
      font-weight: 700; 
      font-size: 0.95rem;
      font-family: 'Rajdhani', sans-serif;
    }
  }
`;

const Footer = styled.div`
  padding: 2rem;
  background: var(--bg-darker);
  border-top: 1px solid var(--border-color);
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  label {
    display: block;
    color: var(--text-muted);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 10px;
  }
  .input-wrapper {
    position: relative;
    input {
      width: 100%;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      padding: 14px 14px 14px 42px;
      color: var(--text-color);
      border-radius: 4px;
      font-size: 0.9rem;
      transition: 0.3s;
      &:focus { 
        border-color: var(--primary-color);
        box-shadow: 0 0 12px var(--primary-glow);
        outline: none;
      }
    }
    svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--gold-color); opacity: 0.6; }
  }
`;

const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.8rem;
  .label { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
  .total { 
    color: var(--gold-color); 
    font-size: 2.4rem; 
    font-weight: 800; 
    line-height: 0.9;
    font-family: 'Rajdhani', sans-serif;
    text-shadow: 0 0 20px var(--gold-glow);
  }
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 18px;
  background: var(--primary-color);
  color: var(--bg-darker);
  border: none;
  border-radius: 4px;
  font-weight: 800;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  &:disabled { 
    background: var(--text-dark); 
    color: var(--text-muted);
    cursor: not-allowed;
    opacity: 0.2;
  }
`;

// --- Componente Principal ---

interface VendaModalProps {
  itens: any[];
  setCarrinho: React.Dispatch<React.SetStateAction<any[]>>;
  onClose: () => void;
  onConfirm: (cliente: string) => Promise<void>;
}

export const VendaModal = ({ itens = [], setCarrinho, onClose, onConfirm }: VendaModalProps) => {
  const [cliente, setCliente] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redutor com tratamento de erro para evitar NaN/Tela Branca
  const totalGeral = itens.reduce((acc, cur) => {
    const preco = Number(cur.preco) || 0;
    const qtd = Number(cur.quantidade_carrinho) || 0;
    return acc + (preco * qtd);
  }, 0);

  const handleFinalize = async () => {
    if (!cliente || itens.length === 0) return;
    setLoading(true);
    try {
      await onConfirm(cliente);
      setSuccess(true);
      setTimeout(onClose, 2500);
    } catch (err) {
      console.error("Erro na transação:", err);
    } finally {
      setLoading(false);
    }
  };

  const removerItem = (id: any) => {
    setCarrinho((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <SidebarContainer
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Header>
            <div className="title-group">
              <ShoppingCart size={20} color="var(--gold-color)" />
              <h2>Logística de Carga</h2>
            </div>
            <X 
              onClick={onClose} 
              size={22} 
              style={{ cursor: 'pointer', color: 'var(--text-dark)' }} 
            />
          </Header>

          {!success ? (
            <>
              <Content>
                {itens.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '6rem', color: 'var(--text-dark)' }}>
                    <Package size={50} style={{ marginBottom: '1.5rem', opacity: 0.15 }} />
                    <p style={{ fontSize: '0.75rem', letterSpacing: '3px', fontWeight: 600 }}>ARSENAL VAZIO</p>
                  </div>
                ) : (
                  itens.map((item) => (
                    <ItemCard 
                      key={item.id} 
                      layout 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="info">
                        <div className="name">{item.nome || "Item sem Identificação"}</div>
                        <div className="details">
                          {item.quantidade_carrinho} UN × R$ {Number(item.preco || 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="price-section">
                        <div className="value">
                          R$ {(Number(item.preco || 0) * Number(item.quantidade_carrinho || 0)).toFixed(2)}
                        </div>
                        <Trash2 
                          size={16} 
                          color="var(--error-color)" 
                          style={{ cursor: 'pointer', opacity: 0.5 }}
                          onClick={() => removerItem(item.id)}
                        />
                      </div>
                    </ItemCard>
                  ))
                )}
              </Content>

              <Footer>
                <InputGroup>
                  <label>Identificação do Operador</label>
                  <div className="input-wrapper">
                    <User size={18} />
                    <input 
                      placeholder="NOME OU MATRÍCULA..." 
                      value={cliente}
                      onChange={e => setCliente(e.target.value)}
                      autoFocus
                    />
                  </div>
                </InputGroup>

                <Summary>
                  <div className="label">Total a Liquidar</div>
                  <div className="total">R$ {totalGeral.toFixed(2)}</div>
                </Summary>

                <ActionButton
                  disabled={loading || itens.length === 0 || !cliente}
                  onClick={handleFinalize}
                  whileHover={!loading ? { scale: 1.01, boxShadow: '0 0 20px var(--gold-glow)' } : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>AUTORIZAR DESPACHO <ArrowRight size={18} /></>
                  )}
                </ActionButton>
              </Footer>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
              <motion.div 
                initial={{ scale: 0, rotate: -20 }} 
                animate={{ scale: 1, rotate: 0 }} 
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <CheckCircle size={90} color="var(--success-color)" strokeWidth={1.5} />
              </motion.div>
              <h2 style={{ 
                color: 'var(--text-color)', 
                marginTop: '2.5rem', 
                fontFamily: 'Rajdhani', 
                fontSize: '1.8rem',
                letterSpacing: '2px'
              }}>
                CARGA DESPACHADA
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                O sistema central foi atualizado com sucesso.
              </p>
            </div>
          )}
        </SidebarContainer>
      </Overlay>
    </AnimatePresence>
  );
};