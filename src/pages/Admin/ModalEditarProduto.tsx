import React, { useState } from "react";
import styled from "styled-components";
import {
  X,
  Save,
  Trash2,
  Image as ImageIcon,
  Tag,
  Hash,
  DollarSign,
  Briefcase,
} from "lucide-react";

// --- ESTILOS EXCLUSIVOS PARA O EDIT (Evita conflito com outros modais) ---
const EditOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
  backdrop-filter: blur(8px);
`;

const EditContainer = styled.div`
  background: #0a0a0a;
  border: 1px solid #d4af37;
  padding: 2.5rem;
  border-radius: 16px;
  width: 95%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.15);
  color: white;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d4af37;
    border-radius: 10px;
  }
`;

const EditHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  h2 {
    font-family: "Rajdhani", sans-serif;
    color: #d4af37;
    font-size: 1.8rem;
    margin: 0;
    text-transform: uppercase;
  }
  p {
    color: #666;
    font-size: 0.8rem;
    margin: 0;
  }
`;

const EditSectionTitle = styled.h3`
  font-size: 0.7rem;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 1.5rem 0 1rem 0;
  border-bottom: 1px solid #222;
  padding-bottom: 5px;
`;

const EditGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const EditFormGroup = styled.div`
  margin-bottom: 1.2rem;
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #d4af37;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  input {
    width: 100%;
    background: #111;
    border: 1px solid #222;
    color: #fff;
    padding: 14px;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    &:focus {
      border-color: #d4af37;
      background: #000;
      outline: none;
    }
  }
`;

const EditPreview = styled.div`
  width: 100%;
  height: 120px;
  background: #000;
  border: 1px dashed #333;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const BtnSave = styled.button`
  flex: 2;
  background: #d4af37;
  color: #000;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-weight: 900;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:hover {
    background: #fff;
  }
`;

const BtnDelete = styled.button`
  flex: 1;
  background: transparent;
  color: #ff4d4d;
  border: 1px solid #300;
  padding: 16px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover {
    background: #300;
  }
`;

interface EditProps {
  produto: any;
  onClose: () => void;
  onSave: (id: number, data: any) => void;
  onDelete: (id: number) => void;
}

export const ModalEditarProduto = ({
  produto,
  onClose,
  onSave,
  onDelete,
}: EditProps) => {
  // Inicializa o estado com os dados do produto ou um objeto vazio para não quebrar
  const [formData, setFormData] = useState({
    nome: produto?.nome || "",
    preco: produto?.preco || 0,
    categoria: produto?.categoria || "",
    marca: produto?.marca || "",
    imagem_url: produto?.imagem_url || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produto?.id) return;
    onSave(produto.id, formData);
  };

  if (!produto) return null;

  return (
    <EditOverlay>
      <EditContainer>
        <EditHeader>
          <div>
            <h2>Editar Produto</h2>
            <p>Ajuste os detalhes técnicos e financeiros</p>
          </div>
          <X color="#444" size={28} cursor="pointer" onClick={onClose} />
        </EditHeader>

        <form onSubmit={handleSubmit}>
          <EditSectionTitle>Visual e Imagem</EditSectionTitle>
          <EditPreview>
            {formData.imagem_url ? (
              <img src={formData.imagem_url} alt="Preview" />
            ) : (
              <div style={{ color: "#333", textAlign: "center" }}>
                <ImageIcon size={32} />
                <p style={{ fontSize: "0.6rem", margin: 0 }}>SEM PREVIEW</p>
              </div>
            )}
          </EditPreview>

          <EditFormGroup>
            <label>
              <ImageIcon size={14} /> URL da Imagem
            </label>
            <input
              value={formData.imagem_url}
              onChange={(e) =>
                setFormData({ ...formData, imagem_url: e.target.value })
              }
              placeholder="https://link-da-imagem.com"
            />
          </EditFormGroup>

          <EditSectionTitle>Dados Principais</EditSectionTitle>
          <EditFormGroup>
            <label>
              <Hash size={14} /> Nome do Produto
            </label>
            <input
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
            />
          </EditFormGroup>

          <EditGrid>
            <EditFormGroup>
              <label>
                <Briefcase size={14} /> Marca
              </label>
              <input
                value={formData.marca}
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
              />
            </EditFormGroup>
            <EditFormGroup>
              <label>
                <Tag size={14} /> Categoria
              </label>
              <input
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
              />
            </EditFormGroup>
          </EditGrid>

          <EditSectionTitle>Preço de Venda</EditSectionTitle>
          <EditFormGroup style={{ maxWidth: "220px" }}>
            <label>
              <DollarSign size={14} /> Preço Final (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preco: parseFloat(e.target.value) || 0,
                })
              }
            />
          </EditFormGroup>

          <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
            <BtnSave type="submit">
              <Save size={20} /> SALVAR ALTERAÇÕES
            </BtnSave>

            <BtnDelete
              type="button"
              onClick={() => {
                if (window.confirm("Deseja realmente excluir este produto?"))
                  onDelete(produto.id);
              }}
            >
              <Trash2 size={18} /> EXCLUIR
            </BtnDelete>
          </div>
        </form>
      </EditContainer>
    </EditOverlay>
  );
};
