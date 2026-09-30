import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { ProductCard } from './ProductCard';
import { Product, MARKET_CATEGORIES } from '../types/market';
import { Search, SlidersHorizontal, Sparkles, Store, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface MarketStorefrontProps {
  onOpenProductDetails: (product: Product) => void;
  onOpenAuthForSeller: () => void;
}

export const MarketStorefront: React.FC<MarketStorefrontProps> = ({
  onOpenProductDetails,
  onOpenAuthForSeller
}) => {
  const { products, currentUser } = useMarket();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'stock' | 'sales'>('featured');

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'stock') return b.stock - a.stock;
    if (sortBy === 'sales') return (b.salesCount || 0) - (a.salesCount || 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  // Unique categories existing in products
  const availableCategories = ['all', ...MARKET_CATEGORIES];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Storefront Hero: 1 bold campaign focal point */}
      <section className="relative overflow-hidden bg-stone-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_marketplace_fresh_1790791080636.jpg"
            alt="Mercado de Produtos Frescos"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-stone-900/30" />
        </div>

        <div className="relative z-10 max-w-3xl px-6 py-12 sm:px-12 sm:py-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feira &amp; Empório Digital com Estoque em Tempo Real</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Alimentos frescos e artesanais direto dos melhores produtores locais.
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-xl leading-relaxed">
            Compre hortifrúti, pães artesanais, laticínios nobres e carnes selecionadas com garantia de procedência e entrega no mesmo dia.
          </p>

          {/* Quick Search Bar inside Hero */}
          <div className="pt-2 max-w-lg">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <input
                type="text"
                placeholder="Busque por maçã, pão, queijo, produtor..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-white text-stone-900 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hero Trust Badges bar */}
        <div className="relative z-10 border-t border-stone-800/80 bg-stone-950/40 px-6 sm:px-12 py-3 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Entrega Grátis acima de R$ 50</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Produtores Verificados e Auditados</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Estoque Atualizado a Cada Compra</span>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Interactive Filter Tabs (Segmented functional buttons) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          {/* Categories Tab Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat === 'all' ? 'Todos os Produtos' : cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs text-stone-500 font-medium">Ordenar:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="featured">Destaques</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="stock">Maior Estoque</option>
              <option value="sales">Mais Vendidos</option>
            </select>
          </div>
        </div>

        {/* Results Counter and Active Filter Feedback */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <div>
            Exibindo <strong className="text-stone-800 font-semibold">{sortedProducts.length}</strong> produtos
            {selectedCategory !== 'all' && (
              <span> em <strong className="text-stone-800 font-semibold">{selectedCategory}</strong></span>
            )}
            {searchQuery && (
              <span> para "<strong>{searchQuery}</strong>"</span>
            )}
          </div>

          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:underline cursor-pointer font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Product Grid: 3-column desktop with generous whitespace */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
            <Search className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-stone-800">Nenhum produto encontrado</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Tente buscar por termos mais genéricos ou selecionar outra categoria acima.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Ver Todos os Produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenProductDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Seller Callout Banner */}
      {currentUser?.role !== 'seller' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Área do Produtor &amp; Comerciante
              </span>
              <h3 className="text-lg font-bold text-stone-900">
                Você produz ou vende alimentos de qualidade?
              </h3>
              <p className="text-xs text-stone-600 max-w-xl">
                Crie sua conta de vendedor individual, cadastre seus produtos por categoria e comece a vender para centenas de clientes da região com controle automatizado de estoque.
              </p>
            </div>

            <button
              onClick={onOpenAuthForSeller}
              className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              Criar Conta de Vendedor
            </button>
          </div>
        </section>
      )}

    </div>
  );
};
