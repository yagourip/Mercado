import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Order, CartItem, ChatMessage, UserRole } from '../types/market';
import { INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/initialData';

interface AuthCredentials {
  email: string;
  password: string;
  role: UserRole;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  storeName?: string;
  phone?: string;
  address?: string;
}

interface MarketContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  login: (credentials: AuthCredentials) => { success: boolean; message?: string };
  register: (data: RegisterData) => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (user: User) => void;
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: (details: { address: string; paymentMethod: 'pix' | 'credit_card' | 'boleto' }) => { success: boolean; orderId?: string; error?: string };
  addProduct: (productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'salesCount' | 'createdAt'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  sendChatMessage: (content: string) => Promise<void>;
  resetAllData: () => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mc_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS;
  });

  // Current logged in user (null by default so login & password + role choice are required before entering)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mc_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null; // Required login before entering!
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mc_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PRODUCTS;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mc_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ORDERS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mc_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Sou o Assistente de Estoque do MercadoConecta. 🥦🥖\nEstou conectado ao catálogo em tempo real. Pode me perguntar sobre produtos disponíveis, quantidades em estoque, preços ou recomendações!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Groq AI Agent'
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mc_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mc_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mc_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mc_cart', JSON.stringify(cart));
  }, [cart]);

  // Auth: Login
  const login = ({ email, password, role }: AuthCredentials) => {
    if (!email || !password) {
      return { success: false, message: 'Preencha o e-mail e a senha.' };
    }
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, message: 'Usuário não encontrado. Verifique o e-mail digitado ou crie uma conta.' };
    }
    if (found.role !== role) {
      return { 
        success: false, 
        message: `Esta conta está cadastrada como ${found.role === 'seller' ? 'Vendedor' : 'Comprador'}. Acesse a aba correspondente para entrar.` 
      };
    }
    setCurrentUser(found);
    return { success: true };
  };

  // Auth: Register
  const register = (data: RegisterData) => {
    if (!data.name || !data.email || !data.password) {
      return { success: false, message: 'Preencha todos os campos obrigatórios.' };
    }
    if (data.role === 'seller' && !data.storeName) {
      return { success: false, message: 'Informe o Nome da Loja para cadastrar como vendedor.' };
    }
    const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Este e-mail já está cadastrado no sistema.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      storeName: data.storeName,
      phone: data.phone,
      address: data.address
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    // Current stock check
    const currentProduct = products.find(p => p.id === product.id) || product;
    if (currentProduct.stock <= 0) {
      return { success: false, message: 'Este produto está esgotado no momento.' };
    }

    const existingCartItem = cart.find(item => item.product.id === product.id);
    const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;
    const requestedTotal = currentCartQty + quantity;

    if (requestedTotal > currentProduct.stock) {
      return { 
        success: false, 
        message: `Quantidade solicitada (${requestedTotal}) excede o estoque disponível (${currentProduct.stock} ${currentProduct.unit}).` 
      };
    }

    setCart(prev => {
      if (existingCartItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product: currentProduct, quantity }];
    });

    return { success: true };
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity > product.stock) {
      quantity = product.stock;
    }

    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Checkout with real-time stock deduction
  const checkout = (details: { address: string; paymentMethod: 'pix' | 'credit_card' | 'boleto' }) => {
    if (cart.length === 0) {
      return { success: false, error: 'O carrinho está vazio.' };
    }
    if (!currentUser) {
      return { success: false, error: 'Faça login como comprador para finalizar o pedido.' };
    }

    // Verify stock availability for all items before committing
    for (const item of cart) {
      const liveProduct = products.find(p => p.id === item.product.id);
      if (!liveProduct) {
        return { success: false, error: `Produto ${item.product.name} não foi encontrado no mercado.` };
      }
      if (item.quantity > liveProduct.stock) {
        return { 
          success: false, 
          error: `Estoque insuficiente para "${liveProduct.name}". Disponível: ${liveProduct.stock}, Solicitado: ${item.quantity}.` 
        };
      }
    }

    // Deduct stock in real-time
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const cartItem = cart.find(c => c.product.id === p.id);
        if (cartItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - cartItem.quantity),
            salesCount: (p.salesCount || 0) + cartItem.quantity
          };
        }
        return p;
      })
    );

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const newOrder: Order = {
      id: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      buyerAddress: details.address || currentUser.address || 'Endereço padrão de entrega',
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        unit: item.product.unit,
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
        image: item.product.image
      })),
      total,
      paymentMethod: details.paymentMethod,
      status: 'Aprovado',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    return { success: true, orderId: newOrder.id };
  };

  // Seller: Add product
  const addProduct = (productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'salesCount' | 'createdAt'>) => {
    if (!currentUser || currentUser.role !== 'seller') return;

    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.storeName || currentUser.name,
      salesCount: 0,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [newProd, ...prev]);
  };

  // Seller: Update product
  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  // Seller: Delete product
  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(c => c.product.id !== productId));
  };

  // Update order status (Seller or Admin)
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Chat message sender
  const sendChatMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      // Send real-time snapshot of the current inventory
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          inventory: products.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stock,
            unit: p.unit,
            sellerName: p.sellerName,
            description: p.description
          }))
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || 'Não foi possível obter uma resposta do estoque no momento.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'Groq Stock Agent'
      };

      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Tivemos uma pequena falha de conexão. Mas posso te adiantar que nosso catálogo está ativo com diversos produtos frescos!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Assistente Offline'
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Reset to initial demo data
  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(null);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    localStorage.removeItem('mc_users');
    localStorage.removeItem('mc_current_user');
    localStorage.removeItem('mc_products');
    localStorage.removeItem('mc_orders');
    localStorage.removeItem('mc_cart');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <MarketContext.Provider
      value={{
        currentUser,
        users,
        products,
        orders,
        cart,
        cartCount,
        cartTotal,
        isChatOpen,
        setIsChatOpen,
        chatMessages,
        isChatLoading,
        login,
        register,
        logout,
        switchUser,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        checkout,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        sendChatMessage,
        resetAllData
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
