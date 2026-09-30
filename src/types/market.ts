export type UserRole = 'buyer' | 'seller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  sellerId: string;
  sellerName: string;
  description: string;
  image: string;
  featured?: boolean;
  salesCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  sellerId: string;
  sellerName: string;
  image: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerAddress: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  status: 'Aprovado' | 'Em Preparação' | 'A Caminho' | 'Entregue';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

export const MARKET_CATEGORIES = [
  'Hortifrúti',
  'Padaria & Confeitaria',
  'Laticínios & Ovos',
  'Carnes & Aves',
  'Bebidas',
  'Mercearia & Grãos',
  'Limpeza & Casa'
] as const;
