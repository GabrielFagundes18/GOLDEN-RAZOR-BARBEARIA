// src/types/index.ts

export interface Servico {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
  category?: string;
  image_url?: string;
  is_active: boolean;
}

// Você também pode já deixar pronto o do Barbeiro, por exemplo:
export interface Barbeiro {
  id: number;
  name: string;
  avatar_url?: string;
} 