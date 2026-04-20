import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Loader2, PackageSearch, RefreshCcw } from "lucide-react";
import { api } from "../../services/api";

// Componentes internos
import Sidebar from "./Sidebar";
import { ArsenalItem } from "./ArsenalItem";
import { VendaModal } from "./VendaModal";

// --- Estilos de Luxo ---

const Layout = styled.div`
  display: flex;
  background: var(--bg-darker);
  min-height: 100vh;
  width: 100%;
  /* Efeito de scanline sutil para textura cyberpunk */
  background-image: linear-gradient(var(--scanline-color) 1px, transparent 1px);
  background-size: 100% 3px;
`;

const Content = styled.main`
  flex: 1;
  padding: 3rem;
  max-width: 1600px;
  margin: 0 auto;
  overflow-y: auto;

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 3rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1.5rem;
    position: relative;

    /* Detalhe dourado na borda inferior */
    &::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100px;
      height: 2px;
      background: var(--primary-color);
      box-shadow: 0 0 10px var(--primary-glow);
    }

    .title-group {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      .icon-wrapper {
        background: var(--card-color);
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid var(--border-bright);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      }

      div {
        span {
          color: var(--text-dark);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
        }
        h2 {
          font-family: "Rajdhani", sans-serif;
          font-size: 2.5rem;
          color: var(--text-color);
          text-transform: uppercase;
          line-height: 1;
          margin-top: 5px;

          strong {
            color: var(--gold-color);
          }
        }
      }
    }
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;

  .stat-card {
    background: var(--card-glass);
    border: 1px solid var(--border-color);
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 1rem;

    small {
      color: var(--text-muted);
      font-size: 0.6rem;
      text-transform: uppercase;
      display: block;
    }
    span {
      color: var(--gold-bright);
      font-family: "Rajdhani";
      font-weight: 700;
      font-size: 1.2rem;
    }
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: var(--primary-color);
  gap: 1.5rem;

  .loader-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .orbit {
      position: absolute;
      width: 80px;
      height: 80px;
      border: 2px solid var(--gold-glow);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  span {
    font-family: "Rajdhani";
    font-size: 1rem;
    letter-spacing: 3px;
    font-weight: 700;
    text-shadow: 0 0 10px var(--primary-glow);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem;
  border: 1px dashed var(--border-color);
  border-radius: 20px;
  color: var(--text-muted);
  font-family: "Rajdhani";

  h3 {
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

export const Vendas = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchArsenal = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/produtos");
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao carregar o arsenal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArsenal();
  }, []);

  const concluirVenda = async (
    id: number,
    quantidade: number,
    cliente: string,
    total: number,
  ) => {
    try {
      await api.post("/vendas", {
        produto_id: id,
        quantidade,
        cliente_nome: cliente,
        valor_total: total,
      });

      setSelectedProduct(null);
      fetchArsenal();
    } catch (err: any) {
      throw err; 
    }
  };

  return (
    <Layout>
      <Sidebar />

      <Content>
        <header>
          <div className="title-group">
            <div className="icon-wrapper">
              <ShoppingBag size={35} color="var(--primary-color)" />
            </div>
            <div>
              
              <h2>
                Arsenal de <strong>Suprimentos</strong>
              </h2>
            </div>
          </div>

          <StatsBar>
            <div className="stat-card">
              <PackageSearch size={18} color="var(--text-dark)" />
              <div>
                <small>Itens no Inventário</small>
                <span>{produtos.length}</span>
              </div>
            </div>
            <button
              onClick={fetchArsenal}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-dark)",
              }}
            >
              <RefreshCcw size={20} />
            </button>
          </StatsBar>
        </header>

        {loading ? (
          <LoadingState>
            <div className="loader-container">
              <div className="orbit" />
              <Loader2 size={32} className="animate-spin" />
            </div>
            <span>SINCRONIZANDO DATABASE...</span>
          </LoadingState>
        ) : produtos.length > 0 ? (
          <Grid
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {produtos.map((p) => (
              <ArsenalItem
                key={p.id}
                produto={p}
                onVender={() => setSelectedProduct(p)}
              />
            ))}
          </Grid>
        ) : (
          <EmptyState>
            <h3>Nenhum suprimento detectado</h3>
            <p>
              Verifique o cadastro de produtos ou sua conexão com o servidor.
            </p>
          </EmptyState>
        )}

        <AnimatePresence>
          {selectedProduct && (
            <VendaModal
              produto={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onConfirm={concluirVenda}
            />
          )}
        </AnimatePresence>
      </Content>
    </Layout>
  );
};
