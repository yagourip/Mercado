import React from 'react';
import { useMarket } from '../context/MarketContext';
import { Bot, RotateCcw } from 'lucide-react';

interface FooterProps {
  onOpenAuth: (role: 'buyer' | 'seller') => void;
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth, onOpenChat }) => {
  const { resetAllData } = useMarket();

  return (
    <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <span className="text-base font-bold text-white tracking-tight">
              MercadoConecta
            </span>
            <p className="text-stone-400 leading-relaxed text-xs">
              Conectando compradores a produtores e pequenos comerciantes locais com controle de estoque transparente e IA assistiva.
            </p>
          </div>

          {/* Column 2: Compradores */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Para Compradores
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onOpenAuth('buyer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Entrar como Comprador
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('buyer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Criar Conta de Cliente
                </button>
              </li>
              <li>
                <span className="text-stone-500">Entrega Expressa Regional</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Vendedores */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Para Vendedores
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onOpenAuth('seller')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Portal do Vendedor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('seller')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cadastrar Loja / Fazenda
                </button>
              </li>
              <li>
                <span className="text-stone-500">Gestão de Catálogo & Estoque</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Chatbot & Suporte */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Inteligência Artificial
            </h4>
            <p className="text-stone-400 leading-relaxed text-xs">
              Tire dúvidas sobre produtos e estoque atual diretamente com nosso agente Groq IA.
            </p>
            <button
              onClick={onOpenChat}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 text-emerald-400 hover:bg-stone-700 transition-colors text-xs font-medium cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Abrir Assistente do Estoque</span>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} MercadoConecta. Sistema de Mercado e Gestão de Estoque.</p>

          <button
            onClick={() => {
              if (confirm('Deseja restaurar os produtos e usuários de teste padrão?')) {
                resetAllData();
              }
            }}
            className="flex items-center gap-1 hover:text-stone-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar Catálogo e Contas Demo</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
