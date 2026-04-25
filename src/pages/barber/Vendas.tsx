import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Loader2, RefreshCcw, ShoppingCart } from "lucide-react";
import { api } from "../../services/api";

import { ArsenalItem } from "./ArsenalItem";
import { VendaModal } from "./VendaModal";

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;
const Content = styled.main`
  flex: 1;
  padding: 3rem;
  max-width: 1400px;
  margin: 0 auto;
`;
const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const CartBadge = styled.div`
  background: var(--card-color);
  border: 1px solid var(--primary-color);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: 0.3s;
  &:hover {
    background: var(--primary-glow);
  }
  span {
    color: var(--primary-color);
    font-weight: 900;
    font-family: "Rajdhani";
  }
`;

export const Vendas = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchArsenal = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/produtos");
      setProdutos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArsenal();
  }, []);

  const adicionarAoCarrinho = (produto: any) => {
    setCarrinho((prev) => {
      const existente = prev.find((i) => i.id === produto.id);
      if (existente) {
        if (existente.quantidade_carrinho >= produto.estoque_qtd) {
          alert("Estoque insuficiente!");
          return prev;
        }
        return prev.map((i) =>
          i.id === produto.id
            ? { ...i, quantidade_carrinho: i.quantidade_carrinho + 1 }
            : i,
        );
      }
      return [...prev, { ...produto, quantidade_carrinho: 1 }];
    });
  };

  const confirmarVendaLote = async (cliente: string) => {
    await api.post("/vendas/lote", {
      cliente_nome: cliente,
      itens: carrinho.map((i) => ({
        produto_id: i.id,
        quantidade: i.quantidade_carrinho,
        preco_unitario: i.preco,
      })),
      valor_total: carrinho.reduce(
        (acc, i) => acc + i.preco * i.quantidade_carrinho,
        0,
      ),
    });
    setCarrinho([]);
    fetchArsenal();
  };

  return (
    <Layout>
      <Content>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "3rem",
          }}
        >
          <div>
            <h2
              style={{
                color: "#fff",
                fontFamily: "Rajdhani",
                fontSize: "2rem",
              }}
            >
              ARSENAL DE{" "}
              <strong style={{ color: "var(--primary-color)" }}>
                SUPRIMENTOS
              </strong>
            </h2>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <CartBadge
              onClick={() => carrinho.length > 0 && setShowModal(true)}
            >
              <ShoppingCart size={20} color="var(--primary-color)" />
              <span>
                {carrinho.reduce((acc, i) => acc + i.quantidade_carrinho, 0)}{" "}
                ITENS
              </span>
            </CartBadge>
            <button
              onClick={fetchArsenal}
              style={{
                background: "none",
                border: "none",
                color: "#555",
                cursor: "pointer",
              }}
            >
              <RefreshCcw />
            </button>
          </div>
        </header>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--primary-color)",
              marginTop: "5rem",
            }}
          >
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <Grid initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {produtos.map((p) => (
              <ArsenalItem
                key={p.id}
                produto={p}
                onVender={adicionarAoCarrinho}
              />
            ))}
          </Grid>
        )}

        <AnimatePresence>
          {showModal && (
            <VendaModal
              itens={carrinho}
              setCarrinho={setCarrinho}
              onClose={() => setShowModal(false)}
              onConfirm={confirmarVendaLote}
            />
          )}
        </AnimatePresence>
      </Content>
    </Layout>
  );
};
