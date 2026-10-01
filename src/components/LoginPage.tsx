import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { UserRole } from '../types/market';
import { ShoppingBag, Store, ArrowRight, ShieldCheck, CheckCircle2, Lock, Mail, User as UserIcon, Phone, MapPin, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, register, switchUser, users } = useMarket();
  const [role, setRole] = useState<UserRole>('buyer');
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isRegister) {
      const res = register({
        name,
        email,
        password,
        role,
        storeName: role === 'seller' ? storeName : undefined,
        phone,
        address: role === 'buyer' ? address : undefined
      });

      if (!res.success) {
        setErrorMsg(res.message || 'Erro ao realizar cadastro.');
        return;
      }
      onLoginSuccess(role);
    } else {
      const res = login({ email, password, role });
      if (!res.success) {
        setErrorMsg(res.message || 'Credenciais inválidas.');
        return;
      }
      onLoginSuccess(role);
    }
  };

  const handleQuickDemo = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      switchUser(user);
      onLoginSuccess(user.role);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-stone-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <img
          src="/src/assets/images/hero_marketplace_fresh_1790791080636.jpg"
          alt="Mercado Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter blur-xs"
        />
        <div className="absolute inset-0 bg-stone-900/40" />
      </div>

      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="bg-stone-900 text-white p-6 sm:p-8 text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MercadoConecta · Acesso Obrigatório</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Identifique-se para Entrar
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-md mx-auto">
            Selecione se deseja acessar como <strong>Comprador</strong> ou <strong>Vendedor</strong> e informe seu e-mail e senha.
          </p>
        </div>

        {/* Step 1: Mandatory Role Selection */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
              1. Selecione o Tipo de Acesso:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option Buyer */}
              <button
                type="button"
                onClick={() => {
                  setRole('buyer');
                  setErrorMsg(null);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  role === 'buyer'
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    role === 'buyer' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  {role === 'buyer' && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Selecionado
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Sou Comprador</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Comprar produtos de mercearia, hortifrúti e padaria com consulta inteligente de estoque.
                  </p>
                </div>
              </button>

              {/* Option Seller */}
              <button
                type="button"
                onClick={() => {
                  setRole('seller');
                  setErrorMsg(null);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  role === 'seller'
                    ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    role === 'seller' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    <Store className="w-5 h-5" />
                  </div>
                  {role === 'seller' && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Selecionado
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Sou Vendedor</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Cadastrar produtos por categorias, definir preços, repor estoque e gerenciar vendas.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Auth Mode Toggle (Entrar / Cadastrar) */}
          <div className="flex border-b border-stone-200 pb-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMsg(null);
              }}
              className={`pb-2 px-3 text-xs font-bold transition-colors cursor-pointer ${
                !isRegister
                  ? role === 'seller' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Já sou cadastrado (Entrar)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMsg(null);
              }}
              className={`pb-2 px-3 text-xs font-bold transition-colors cursor-pointer ${
                isRegister
                  ? role === 'seller' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Criar nova conta de {role === 'seller' ? 'Vendedor' : 'Comprador'}
            </button>
          </div>

          {/* Feedback Error Notice */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Santos"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {isRegister && role === 'seller' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome da sua Loja ou Produtor *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fazenda Terra Viva ou Padaria Central"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                E-mail {role === 'seller' ? 'Comercial' : ''} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder={role === 'seller' ? 'vendedor@loja.com' : 'comprador@email.com'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Senha de Acesso *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="Informe sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Telefone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {isRegister && role === 'buyer' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Endereço para Entrega
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 px-4 text-xs font-bold rounded-xl text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                role === 'seller'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <span>{isRegister ? 'Finalizar Cadastro e Entrar' : `Entrar como ${role === 'seller' ? 'Vendedor' : 'Comprador'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-stone-200 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Acesso Rápido de Teste (Sem Digitar):</span>
            </div>

            {role === 'buyer' ? (
              <button
                type="button"
                onClick={() => handleQuickDemo('buyer-1')}
                className="w-full p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between text-xs transition-colors cursor-pointer text-left"
              >
                <div>
                  <p className="font-bold text-emerald-950">Entrar como Compradora Demo: Maria Eduarda</p>
                  <p className="text-[11px] text-emerald-700">comprador@mercado.com · Senha padrão</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('seller-1')}
                  className="p-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 flex items-center justify-between text-xs transition-colors cursor-pointer text-left"
                >
                  <div>
                    <p className="font-bold text-amber-950 truncate max-w-[120px]">Carlos</p>
                    <p className="text-[10px] text-amber-700 truncate max-w-[120px]">Fazenda Fresca</p>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('seller-2')}
                  className="p-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 flex items-center justify-between text-xs transition-colors cursor-pointer text-left"
                >
                  <div>
                    <p className="font-bold text-amber-950 truncate max-w-[120px]">Helena</p>
                    <p className="text-[10px] text-amber-700 truncate max-w-[120px]">Pães Artesanais</p>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('seller-3')}
                  className="p-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 flex items-center justify-between text-xs transition-colors cursor-pointer text-left"
                >
                  <div>
                    <p className="font-bold text-amber-950 truncate max-w-[120px]">Marcos</p>
                    <p className="text-[10px] text-amber-700 truncate max-w-[120px]">Empório & Carnes</p>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
