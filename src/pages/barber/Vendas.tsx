import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  RefreshCcw,
  Loader2,
  Package,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { api } from "../../services/api";

import { ArsenalItem } from "./ArsenalItem";
import { VendaModal } from "./VendaModal";

// --- Estilos de Alta Performance ---

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
`;

const Content = styled.main`
  flex: 1;
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    padding: 2.5rem;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`;

const TitleGroup = styled.div`
  h2 {
    color: #fff;
    font-family: "Rajdhani";
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    margin: 0;
    line-height: 1;
    letter-spacing: -1px;
    text-transform: uppercase;
  }
  p {
    color: #555;
    font-size: 0.75rem;
    letter-spacing: 3px;
    margin-top: 5px;
    font-weight: 600;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const PriceTag = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 1.5rem;
    border-right: 1px solid #222;
    padding-right: 1.5rem;
  }

  label {
    font-size: 0.6rem;
    color: #444;
    letter-spacing: 1px;
  }
  span {
    font-family: "Rajdhani";
    color: var(--success-color);
    font-weight: 700;
    font-size: 1.2rem;
  }
`;

const CartBadge = styled(motion.button)`
  background: var(--card-color);
  border: 1px solid var(--primary-color);
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  span {
    color: var(--primary-color);
    font-weight: 900;
    font-family: "Rajdhani";
    font-size: 1rem;
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 2rem;
`;

// --- Componente Principal ---

export const Vendas = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchArsenal = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/produtos");
      setProdutos(data);
    } catch (err) {
      toast.error("FALHA CRÍTICA: BANCO DE DADOS OFFLINE");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArsenal();
  }, [fetchArsenal]);

  // Memorização de cálculos para evitar lag no render
  const stats = useMemo(() => {
    const totalItens = carrinho.reduce(
      (acc, i) => acc + i.quantidade_carrinho,
      0,
    );
    const valorTotal = carrinho.reduce(
      (acc, i) => acc + i.preco * i.quantidade_carrinho,
      0,
    );
    return { totalItens, valorTotal };
  }, [carrinho]);

  const adicionarAoCarrinho = (produto: any) => {
    setCarrinho((prev) => {
      const existente = prev.find((i) => i.id === produto.id);
      if (existente && existente.quantidade_carrinho >= produto.estoque_qtd) {
        toast.warning("LIMITE DE ESTOQUE ATINGIDO");
        return prev;
      }
      toast.success(`${produto.nome.toUpperCase()} ADICIONADO`);
      if (existente) {
        return prev.map((i) =>
          i.id === produto.id
            ? { ...i, quantidade_carrinho: i.quantidade_carrinho + 1 }
            : i,
        );
      }
      return [...prev, { ...produto, quantidade_carrinho: 1 }];
    });
  };

  return (
    <Layout>
      <Toaster position="bottom-left" theme="dark" richColors expand={false} />

      <Content>
        <Header>
          <TitleGroup>
            <h2>
              Arsenal de{" "}
              <strong style={{ color: "var(--primary-color)" }}>
                Produtos
              </strong>
            </h2>
          </TitleGroup>

          <Controls>
            <PriceTag>
              <label>VALOR DO LOTE</label>
              <span>
                R${" "}
                {stats.valorTotal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </PriceTag>

            <CartBadge
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 15px var(--primary-glow)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
            >
              <ShoppingCart size={20} color="var(--primary-color)" />
              <span>{stats.totalItens} UNIDADES</span>
            </CartBadge>

            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4 }}
              onClick={fetchArsenal}
              style={{
                background: "none",
                border: "none",
                color: "#333",
                cursor: "pointer",
                padding: "5px",
              }}
            >
              <RefreshCcw
                size={22}
                className={loading ? "animate-spin text-primary" : ""}
              />
            </motion.button>
          </Controls>
        </Header>

        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "12rem",
              gap: "1rem",
            }}
          >
            <Loader2
              className="animate-spin"
              size={40}
              color="var(--primary-color)"
            />
            <span
              style={{
                fontSize: "0.7rem",
                letterSpacing: "4px",
                color: "#444",
              }}
            >
              CARREGANDO PROTOCOLOS...
            </span>
          </div>
        ) : produtos.length > 0 ? (
          <Grid
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="popLayout">
              {produtos.map((p) => (
                <ArsenalItem
                  key={p.id}
                  produto={p}
                  onVender={adicionarAoCarrinho}
                />
              ))}
            </AnimatePresence>
          </Grid>
        ) : (
          <div
            style={{ textAlign: "center", padding: "8rem 2rem", opacity: 0.2 }}
          >
            <Package size={80} style={{ marginBottom: "1.5rem" }} />
            <h3 style={{ letterSpacing: "2px" }}>ARSENAL VAZIO</h3>
          </div>
        )}
      </Content>

      <AnimatePresence>
        {showModal && (
          <VendaModal
            itens={carrinho}
            setCarrinho={setCarrinho}
            onClose={() => setShowModal(false)}
            onConfirm={async (cliente: string) => {
              await api.post("/sales", {
                cliente_nome: cliente,
                itens: carrinho.map((i) => ({
                  produto_id: i.id,
                  quantidade: i.quantidade_carrinho,
                  preco_unitario: i.preco,
                })),
                valor_total: stats.valorTotal,
              });
              setCarrinho([]);
              setShowModal(false);
              fetchArsenal();
            }}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};
