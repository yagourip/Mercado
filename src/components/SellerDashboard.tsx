import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { Product, Order } from '../types/market';
import { ProductFormModal } from './ProductFormModal';
import { Plus, Edit2, Trash2, Package, TrendingUp, AlertTriangle, CheckCircle, Search, Store, ArrowUpDown } from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { currentUser, products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useMarket();

  const [activeTab, setActiveTab] = useState<'inventory' | 'sales'>('inventory');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter products owned by current seller
  const sellerProducts = products.filter(p => p.sellerId === currentUser?.id);

  // Compute seller stats
  const totalItemsSold = sellerProducts.reduce((sum, p) => sum + (p.salesCount || 0), 0);
  const lowStockCount = sellerProducts.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = sellerProducts.filter(p => p.stock === 0).length;

  // Compute sales from orders that contain this seller's products
  const sellerOrders = orders.filter(order =>
    order.items.some(item => item.sellerId === currentUser?.id)
  );

  const totalRevenue = sellerOrders.reduce((sum, order) => {
    const orderSellerItemsTotal = order.items
      .filter(item => item.sellerId === currentUser?.id)
      .reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
    return sum + orderSellerItemsTotal;
  }, 0);

  // Filter products by search and category
  const filteredProducts = sellerProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(sellerProducts.map(p => p.category)));

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
  };

  const handleQuickRestock = (product: Product, amount: number) => {
    updateProduct(product.id, { stock: product.stock + amount });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Seller Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl shadow-xs">
            <Store className="w-7 h-7 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900">
                {currentUser?.storeName || 'Minha Loja'}
              </h1>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Loja Ativa
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Responsável: <strong className="text-stone-700 font-medium">{currentUser?.name}</strong> · {currentUser?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Faturamento da Loja</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900 font-mono tabular-nums">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Total acumulado em pedidos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Produtos no Catálogo</span>
            <Package className="w-4 h-4 text-stone-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {sellerProducts.length}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">{totalItemsSold} unidades vendidas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Estoque Baixo (&le; 5 un)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700 font-mono tabular-nums">
            {lowStockCount}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Requer reposição em breve</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Pedidos Recebidos</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {sellerOrders.length}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Acompanhe na aba Vendas</p>
        </div>
      </div>

      {/* Tabs Switcher: Catálogo & Estoque vs Vendas Recebidas */}
      <div className="border-b border-stone-200 flex gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'inventory'
              ? 'text-amber-700 border-b-2 border-amber-600'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Catálogo & Gestão de Estoque ({sellerProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'sales'
              ? 'text-amber-700 border-b-2 border-amber-600'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Pedidos & Vendas Recebidas ({sellerOrders.length})
        </button>
      </div>

      {/* Tab 1: Inventory Table & Controls */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar produto ou categoria..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            {/* Category Filter Pills (Functional button filters) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Todas ({sellerProducts.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Inventory Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-stone-500">
                <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-800">Nenhum produto cadastrado</p>
                <p className="text-xs text-stone-500 mt-1">
                  Adicione seus produtos com foto, categoria, preço e quantidade em estoque.
                </p>
                <button
                  onClick={handleOpenCreate}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Primeiro Produto</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Produto</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4 text-right">Preço Unitário</th>
                      <th className="py-3 px-4 text-center">Estoque Atual</th>
                      <th className="py-3 px-4 text-center">Vendas</th>
                      <th className="py-3 px-4 text-right">Ações de Gestão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {filteredProducts.map(p => {
                      const isLow = p.stock > 0 && p.stock <= 5;
                      const isOut = p.stock === 0;

                      return (
                        <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded-lg object-cover bg-stone-100 shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-stone-900 block">{p.name}</span>
                                <span className="text-[11px] text-stone-400 line-clamp-1">{p.description}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-[11px] text-stone-600 font-medium">
                              {p.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-stone-900">
                            R$ {p.price.toFixed(2).replace('.', ',')}
                            <span className="text-[10px] text-stone-400 font-normal"> / {p.unit}</span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-1 font-mono tabular-nums font-bold">
                              <span className={isOut ? 'text-stone-400' : isLow ? 'text-amber-700' : 'text-emerald-700'}>
                                {p.stock} {p.unit}
                              </span>
                              {isOut && (
                                <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                                  Esgotado
                                </span>
                              )}
                              {isLow && (
                                <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                  Baixo
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono tabular-nums text-stone-600">
                            {p.salesCount || 0} un
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick restock shortcut */}
                              <button
                                onClick={() => handleQuickRestock(p, 5)}
                                title="Adicionar +5 unidades ao estoque"
                                className="px-2 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors cursor-pointer border border-amber-200"
                              >
                                +5 Estoque
                              </button>

                              <button
                                onClick={() => handleOpenEdit(p)}
                                title="Editar produto"
                                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja excluir "${p.name}"?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                title="Excluir produto"
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Sales & Received Orders */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          {sellerOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              <TrendingUp className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-800">Nenhum pedido recebido ainda</p>
              <p className="text-xs text-stone-500 mt-1">
                Quando os compradores realizarem compras dos seus itens, elas aparecerão aqui em tempo real.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sellerOrders.map(order => {
                const myItems = order.items.filter(item => item.sellerId === currentUser?.id);
                const orderMyTotal = myItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-stone-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 font-mono text-sm">{order.id}</span>
                          <span className="text-xs text-stone-400">·</span>
                          <span className="text-xs text-stone-500">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Cliente: <strong className="text-stone-800">{order.buyerName}</strong> ({order.buyerEmail})
                        </p>
                        <p className="text-xs text-stone-500">
                          Entrega: {order.buyerAddress}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[11px] text-stone-400 block">Total desta loja:</span>
                          <span className="text-sm font-bold text-emerald-800 font-mono tabular-nums">
                            R$ {orderMyTotal.toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        {/* Status update selector */}
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="Aprovado">Aprovado</option>
                          <option value="Em Preparação">Em Preparação</option>
                          <option value="A Caminho">A Caminho</option>
                          <option value="Entregue">Entregue</option>
                        </select>
                      </div>
                    </div>

                    {/* Order line items from this seller */}
                    <div className="divide-y divide-stone-50">
                      {myItems.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-md object-cover bg-stone-100"
                            />
                            <div>
                              <span className="font-semibold text-stone-800">{item.name}</span>
                              <span className="text-stone-400 ml-2">Qtd: {item.quantity} {item.unit}</span>
                            </div>
                          </div>
                          <span className="font-mono tabular-nums font-semibold text-stone-900">
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
};
