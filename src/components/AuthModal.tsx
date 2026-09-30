import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { UserRole } from '../types/market';
import { X, ShoppingBag, Store, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'buyer',
  onSuccess
}) => {
  const { login, register, switchUser, users } = useMarket();
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isRegisterMode) {
      const res = register({
        name,
        email,
        password,
        role: selectedRole,
        storeName: selectedRole === 'seller' ? storeName : undefined,
        phone,
        address: selectedRole === 'buyer' ? address : undefined
      });
      if (!res.success) {
        setErrorMsg(res.message || 'Erro ao registrar conta.');
        return;
      }
    } else {
      const res = login({ email, password, role: selectedRole });
      if (!res.success) {
        setErrorMsg(res.message || 'Erro ao realizar login.');
        return;
      }
    }

    onClose();
    if (onSuccess) onSuccess();
  };

  const handleQuickDemo = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      switchUser(user);
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {isRegisterMode ? 'Criar Nova Conta' : 'Acessar o MercadoConecta'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Escolha seu perfil: Comprador ou Vendedor
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Separated Role Selection Tabs (Comprador vs Vendedor) */}
        <div className="grid grid-cols-2 p-3 gap-2 bg-stone-100/70 border-b border-stone-200">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('buyer');
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === 'buyer'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${selectedRole === 'buyer' ? 'text-emerald-600' : 'text-stone-400'}`} />
            <span>Área do Comprador</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('seller');
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === 'seller'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Store className={`w-4 h-4 ${selectedRole === 'seller' ? 'text-amber-600' : 'text-stone-400'}`} />
            <span>Área do Vendedor</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maria Santos"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            )}

            {isRegisterMode && selectedRole === 'seller' && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nome da sua Loja ou Produtor
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fazenda Bela Vista ou Padaria Artesanal"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                E-mail {selectedRole === 'seller' ? 'Comercial' : ''}
              </label>
              <input
                type="email"
                required
                placeholder={selectedRole === 'seller' ? 'vendedor@loja.com' : 'comprador@email.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {isRegisterMode && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Telefone / WhatsApp (Opcional)
                </label>
                <input
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            )}

            {isRegisterMode && selectedRole === 'buyer' && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Endereço de Entrega Principal
                </label>
                <input
                  type="text"
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                selectedRole === 'seller'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <span>{isRegisterMode ? 'Concluir Cadastro' : 'Entrar no Sistema'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg(null);
              }}
              className="text-xs text-stone-600 hover:text-stone-900 underline transition-colors cursor-pointer"
            >
              {isRegisterMode
                ? 'Já possui uma conta? Faça login aqui'
                : `Ainda não tem conta como ${selectedRole === 'seller' ? 'Vendedor' : 'Comprador'}? Cadastre-se grátis`}
            </button>
          </div>

          {/* One-Click Demo Accounts for Fast Testing */}
          <div className="mt-6 pt-5 border-t border-stone-200">
            <div className="flex items-center gap-1.5 mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Acesso Rápido de Teste (1 Clique)
              </span>
            </div>

            {selectedRole === 'buyer' ? (
              <button
                type="button"
                onClick={() => handleQuickDemo('buyer-1')}
                className="w-full text-left p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 flex items-center justify-between text-xs transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-emerald-950">Maria Eduarda (Compradora Demo)</p>
                  <p className="text-[11px] text-emerald-700">comprador@mercado.com</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </button>
            ) : (
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('seller-1')}
                  className="w-full text-left p-2 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-semibold text-amber-950">Carlos (Fazenda Fresca Orgânicos)</p>
                    <p className="text-[11px] text-amber-700">vendedor1@horti.com · Hortifrúti</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('seller-2')}
                  className="w-full text-left p-2 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-semibold text-amber-950">Helena (Pães & Grãos Artesanais)</p>
                    <p className="text-[11px] text-amber-700">vendedor2@padaria.com · Padaria</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
