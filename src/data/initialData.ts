import { User, Product, Order } from '../types/market';

export const INITIAL_USERS: User[] = [
  {
    id: 'buyer-1',
    name: 'Maria Eduarda Oliveira',
    email: 'comprador@mercado.com',
    role: 'buyer',
    phone: '(11) 98765-4321',
    address: 'Av. Paulista, 1578 - Cerqueira César, São Paulo - SP',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'seller-1',
    name: 'Carlos Ferreira',
    storeName: 'Fazenda Fresca Orgânicos',
    email: 'vendedor1@horti.com',
    role: 'seller',
    phone: '(11) 97654-3210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'seller-2',
    name: 'Helena Ramos',
    storeName: 'Pães & Grãos Artesanais',
    email: 'vendedor2@padaria.com',
    role: 'seller',
    phone: '(11) 96543-2109',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'seller-3',
    name: 'Marcos Vinicius',
    storeName: 'Empório & Carnes Nobres',
    email: 'vendedor3@emporio.com',
    role: 'seller',
    phone: '(11) 95432-1098',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Maçãs Fuji Orgânicas Selecionadas',
    category: 'Hortifrúti',
    price: 9.80,
    stock: 24,
    unit: 'kg',
    sellerId: 'seller-1',
    sellerName: 'Fazenda Fresca Orgânicos',
    description: 'Maçãs Fuji colhidas frescas no sul de Minas Gerais. Doces, crocantes e 100% livres de agrotóxicos.',
    image: '/src/assets/images/product_fresh_fruits_1790791091358.jpg',
    featured: true,
    salesCount: 42,
    createdAt: '2026-09-20T10:00:00.000Z'
  },
  {
    id: 'prod-2',
    name: 'Cesta de Legumes da Estação',
    category: 'Hortifrúti',
    price: 24.50,
    stock: 12,
    unit: 'un',
    sellerId: 'seller-1',
    sellerName: 'Fazenda Fresca Orgânicos',
    description: 'Cesta balanceada contendo cenouras frescas, tomates holandeses, pimentões doces e abobrinha italiana.',
    image: '/src/assets/images/product_organic_veggies_1790791112536.jpg',
    featured: true,
    salesCount: 65,
    createdAt: '2026-09-21T11:00:00.000Z'
  },
  {
    id: 'prod-3',
    name: 'Pão de Fermentação Natural Sourdough',
    category: 'Padaria & Confeitaria',
    price: 18.90,
    stock: 8,
    unit: 'un',
    sellerId: 'seller-2',
    sellerName: 'Pães & Grãos Artesanais',
    description: 'Pão rústico artesanal com 36h de fermentação lenta, crosta dourada e miolo macio e aerado.',
    image: '/src/assets/images/product_artisan_bread_1790791102447.jpg',
    featured: true,
    salesCount: 88,
    createdAt: '2026-09-22T08:30:00.000Z'
  },
  {
    id: 'prod-4',
    name: 'Croissant Francês com Manteiga Especial',
    category: 'Padaria & Confeitaria',
    price: 7.50,
    stock: 3, // Low stock for testing
    unit: 'un',
    sellerId: 'seller-2',
    sellerName: 'Pães & Grãos Artesanais',
    description: 'Massa folhada artesanal laminada com manteiga de alta pureza. Textura leve e estaladiça.',
    image: '/src/assets/images/product_artisan_bread_1790791102447.jpg',
    featured: false,
    salesCount: 120,
    createdAt: '2026-09-23T07:15:00.000Z'
  },
  {
    id: 'prod-5',
    name: 'Queijo Minas Padrão Artesanal',
    category: 'Laticínios & Ovos',
    price: 32.00,
    stock: 15,
    unit: 'peça 500g',
    sellerId: 'seller-3',
    sellerName: 'Empório & Carnes Nobres',
    description: 'Produzido na Serra da Canastra com leite cru selecionado, maturado por 21 dias.',
    image: '/src/assets/images/hero_marketplace_fresh_1790791080636.jpg',
    featured: true,
    salesCount: 54,
    createdAt: '2026-09-24T09:40:00.000Z'
  },
  {
    id: 'prod-6',
    name: 'Ovos Caipiras Vermelhos de Galinha Livre',
    category: 'Laticínios & Ovos',
    price: 14.90,
    stock: 20,
    unit: 'dúzia',
    sellerId: 'seller-1',
    sellerName: 'Fazenda Fresca Orgânicos',
    description: 'Galinhas criadas soltas com alimentação 100% vegetal. Gemas amarelas bem encorpadas.',
    image: '/src/assets/images/hero_marketplace_fresh_1790791080636.jpg',
    featured: false,
    salesCount: 97,
    createdAt: '2026-09-25T14:20:00.000Z'
  },
  {
    id: 'prod-7',
    name: 'Bife Ancho Prime Angus Resfriado',
    category: 'Carnes & Aves',
    price: 68.00,
    stock: 7,
    unit: 'kg',
    sellerId: 'seller-3',
    sellerName: 'Empório & Carnes Nobres',
    description: 'Corte nobre com marmoreio grau 4+, extremamente macio para grelha ou churrasco.',
    image: '/src/assets/images/hero_marketplace_fresh_1790791080636.jpg',
    featured: true,
    salesCount: 31,
    createdAt: '2026-09-26T16:10:00.000Z'
  },
  {
    id: 'prod-8',
    name: 'Suco de Laranja Integral Prensado a Frio',
    category: 'Bebidas',
    price: 11.50,
    stock: 18,
    unit: 'garrafa 1L',
    sellerId: 'seller-1',
    sellerName: 'Fazenda Fresca Orgânicos',
    description: 'Sem adição de açúcar nem conservantes. 100% puro suco de laranjas colhidas no ponto ótimo.',
    image: '/src/assets/images/product_fresh_fruits_1790791091358.jpg',
    featured: false,
    salesCount: 46,
    createdAt: '2026-09-27T10:05:00.000Z'
  },
  {
    id: 'prod-9',
    name: 'Café Especial Mogiana em Grãos',
    category: 'Mercearia & Grãos',
    price: 28.90,
    stock: 14,
    unit: 'pct 250g',
    sellerId: 'seller-2',
    sellerName: 'Pães & Grãos Artesanais',
    description: 'Notas de caramelo e chocolate ao leite, acidez cítrica média e torra média balanceada.',
    image: '/src/assets/images/product_artisan_bread_1790791102447.jpg',
    featured: false,
    salesCount: 73,
    createdAt: '2026-09-28T11:45:00.000Z'
  },
  {
    id: 'prod-10',
    name: 'Detergente Ecológico Biodegradável Citrus',
    category: 'Limpeza & Casa',
    price: 9.90,
    stock: 2, // Low stock for testing
    unit: 'frasco 500ml',
    sellerId: 'seller-3',
    sellerName: 'Empório & Carnes Nobres',
    description: 'Fórmula natural de óleos cítricos, hipoalergênico e que não agride o meio ambiente.',
    image: '/src/assets/images/product_organic_veggies_1790791112536.jpg',
    featured: false,
    salesCount: 19,
    createdAt: '2026-09-29T15:30:00.000Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'PED-9041',
    buyerId: 'buyer-1',
    buyerName: 'Maria Eduarda Oliveira',
    buyerEmail: 'comprador@mercado.com',
    buyerAddress: 'Av. Paulista, 1578 - Cerqueira César, São Paulo - SP',
    items: [
      {
        productId: 'prod-1',
        name: 'Maçãs Fuji Orgânicas Selecionadas',
        price: 9.80,
        quantity: 2,
        unit: 'kg',
        sellerId: 'seller-1',
        sellerName: 'Fazenda Fresca Orgânicos',
        image: '/src/assets/images/product_fresh_fruits_1790791091358.jpg'
      },
      {
        productId: 'prod-3',
        name: 'Pão de Fermentação Natural Sourdough',
        price: 18.90,
        quantity: 1,
        unit: 'un',
        sellerId: 'seller-2',
        sellerName: 'Pães & Grãos Artesanais',
        image: '/src/assets/images/product_artisan_bread_1790791102447.jpg'
      }
    ],
    total: 38.50,
    paymentMethod: 'pix',
    status: 'Em Preparação',
    createdAt: '2026-09-30T09:15:00.000Z'
  }
];
