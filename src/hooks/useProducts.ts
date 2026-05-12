import { useState, useMemo } from "react";
import { useFetch } from "./useFetch";

export interface Product {
  id: string | number;
  nome: string;
  marca: string;
  categoria: string;
  preco: number | string;
  imagem_url: string;
  estoque_qtd: number;
  info?: string;
  em_estoque?: boolean;
}

export function useProducts() {
  const { data: products, loading, error } = useFetch<Product[]>("/produtos");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODOS");

  // 1. Memoiza as categorias únicas para o filtro
  const categories = useMemo(() => {
    if (!products) return ["TODOS"];
    const rawCats = products
      .map((p) => p?.categoria)
      .filter((cat): cat is string => Boolean(cat));
    return ["TODOS", ...Array.from(new Set(rawCats))];
  }, [products]);

  // 2. Filtra os produtos baseado no termo de busca e categoria ativa
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const nome = p?.nome?.toLowerCase() || "";
      const marca = p?.marca?.toLowerCase() || "";
      const cat = p?.categoria || "";
      const term = searchTerm.toLowerCase();
      
      const matchesSearch = nome.includes(term) || marca.includes(term);
      const matchesCategory = activeCategory === "TODOS" || cat === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  // 3. Produtos em destaque para o Carrossel (Apenas os que estão em estoque)
  const featuredProducts = useMemo(() => {
    return products?.filter((p) => p.em_estoque || p.estoque_qtd > 0).slice(0, 6) || [];
  }, [products]);

  return {
    products,
    filteredProducts,
    featuredProducts,
    categories,
    loading,
    error,
    filters: {
      searchTerm,
      setSearchTerm,
      activeCategory,
      setActiveCategory,
    },
  };
}