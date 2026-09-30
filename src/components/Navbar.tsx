import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { ShoppingBag, Bot, Store, User as UserIcon, LogOut, PackageCheck } from 'lucide-react';
import { UserRole } from '../types/market';

interface NavbarProps {
  currentTab: 'market' | 'seller' | 'orders';
  setCurrentTab: (tab: 'market' | 'seller' | 'orders') => void;
  onOpenAuth: (role?: UserRole) => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenCart
}) => {
  const { currentUser, logout, switchUser, users, cartCount, isChatOpen, setIsChatOpen } = useMarket();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('market')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              MercadoConecta
            </span>
          </button>
          <span className="hidden sm:inline-block text-stone-600">/</span>
          <span className="hidden sm:inline-block text-xs text-stone-400">
            {currentUser?.role === 'seller' ? 'Portal do Vendedor' : 'Comércio Local & Estoque'}
          </span>
        </div>

        {/* Zone 2: Navigation Links (4-6 links, clean typography with subtle hover) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={() => setCurrentTab('market')}
            className={`hover:text-white transition-colors cursor-pointer pb-0.5 ${
              currentTab === 'market' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
            }`}
          >
            Mercado
          </button>

          {currentUser?.role === 'seller' && (
            <button
              onClick={() => setCurrentTab('seller')}
              className={`hover:text-white transition-colors cursor-pointer pb-0.5 ${
                currentTab === 'seller' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
              }`}
            >
              Minha Loja & Estoque
            </button>
          )}

          {currentUser?.role === 'buyer' && (
            <button
              onClick={() => setCurrentTab('orders')}
              className={`hover:text-white transition-colors cursor-pointer pb-0.5 ${
                currentTab === 'orders' ? 'text-emerald-400 border-b-2 border-emerald-400' : ''
              }`}
            >
              Meus Pedidos
            </button>
          )}

          {/* Quick role switch / portal shortcut */}
          {(!currentUser || currentUser.role === 'buyer') && (
            <button
              onClick={() => onOpenAuth('seller')}
              className="text-stone-400 hover:text-stone-200 transition-colors cursor-pointer text-xs"
            >
              Quero Vender
            </button>
          )}

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Consultar Estoque (IA)</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Cart + Account/Login) */}
        <div className="flex items-center gap-3">
          {/* AI Stock Chat button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            title="Abrir Chatbot de Estoque"
            className="relative p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            <Bot className="w-5 h-5 text-emerald-400" />
            <span className="sr-only">Assistente de Estoque</span>
          </button>

          {/* Shopping Bag Button (Buyer focus) */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
            title="Ver Carrinho"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Carrinho</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold bg-emerald-500 text-stone-950 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 text-xs font-medium text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-semibold uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold leading-none truncate max-w-[120px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-stone-400 leading-tight">
                    {currentUser.role === 'seller' ? 'Vendedor' : 'Comprador'}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white text-stone-900 rounded-xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="p-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                    <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                    <div className="mt-1 inline-flex items-center text-[10px] font-medium px-2 py-0.5 bg-stone-100 text-stone-700 rounded">
                      {currentUser.role === 'seller' ? `Loja: ${currentUser.storeName}` : 'Conta de Comprador'}
                    </div>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'seller' ? (
                      <button
                        onClick={() => {
                          setCurrentTab('seller');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <Store className="w-4 h-4 text-emerald-600" />
                        Painel do Vendedor
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setCurrentTab('orders');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4 text-emerald-600" />
                        Meus Pedidos
                      </button>
                    )}
                  </div>

                  {/* Fast role demo switcher for easy testing */}
                  <div className="border-t border-stone-100 pt-2 pb-1">
                    <p className="text-[10px] uppercase font-semibold text-stone-400 px-2 mb-1 tracking-wider">
                      Alternar Conta Rápida
                    </p>
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u);
                          if (u.role === 'seller') setCurrentTab('seller');
                          if (u.role === 'buyer') setCurrentTab('market');
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded-md flex items-center justify-between cursor-pointer ${
                          currentUser.id === u.id ? 'bg-emerald-50 text-emerald-800 font-medium' : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span className="truncate">{u.name.split(' ')[0]} ({u.role === 'seller' ? 'Vendedor' : 'Comprador'})</span>
                        {currentUser.id === u.id && <span className="text-[10px] text-emerald-600 font-bold">Ativo</span>}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-stone-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da Conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('buyer')}
                className="px-3 py-1.5 text-xs font-medium text-stone-200 hover:text-white transition-colors cursor-pointer"
              >
                Entrar
              </button>
              <button
                onClick={() => onOpenAuth('seller')}
                className="px-3 py-1.5 text-xs font-semibold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
              >
                Cadastrar
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
