import React, { useState, useRef, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import { Bot, X, Send, Sparkles, AlertTriangle, ArrowRight, CornerDownLeft, RefreshCw } from 'lucide-react';

export const StockChatbot: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatMessages, isChatLoading, sendChatMessage, products } = useMarket();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isChatLoading) return;
    const msg = inputText;
    setInputText('');
    sendChatMessage(msg);
  };

  const handleChipClick = (query: string) => {
    sendChatMessage(query);
  };

  if (!isChatOpen) {
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3.5 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2.5 cursor-pointer group hover:scale-105"
        title="Consultar Estoque com IA"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-pulse" />
        </div>
        <span className="text-xs font-bold pr-1 hidden sm:inline-block">
          Dúvidas do Estoque?
        </span>
      </button>
    );
  }

  // Quick suggestions based on live market catalog
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col h-[560px] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-150">
      {/* Chatbot Header */}
      <div className="px-4 py-3.5 bg-stone-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white">Assistente de Estoque</h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                Groq IA
              </span>
            </div>
            <p className="text-[10px] text-stone-400">
              Conectado ao estoque ativo ({products.length} itens cadastrados)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(false)}
          className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="px-3 py-2 bg-stone-50 border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        <button
          onClick={() => handleChipClick('Tem maçã ou frutas frescas?')}
          className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-700 whitespace-nowrap cursor-pointer transition-colors"
        >
          🍎 Frutas frescas
        </button>
        <button
          onClick={() => handleChipClick('Quais produtos estão com estoque baixo ou acabando?')}
          className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-amber-800 whitespace-nowrap cursor-pointer transition-colors"
        >
          ⚠️ Itens acabando ({lowStockCount})
        </button>
        <button
          onClick={() => handleChipClick('Qual o produto mais barato do mercado?')}
          className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-700 whitespace-nowrap cursor-pointer transition-colors"
        >
          💰 Mais baratos
        </button>
        <button
          onClick={() => handleChipClick('O que tem na categoria Padaria?')}
          className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-700 whitespace-nowrap cursor-pointer transition-colors"
        >
          🥖 Padaria
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/40">
        {chatMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-xs'
                  : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs shadow-xs'
              }`}
            >
              {/* Parse simple markdown bold and bullet points */}
              <div className="space-y-1 whitespace-pre-wrap">
                {msg.content.split('\n').map((line, idx) => {
                  // Format bullet points
                  if (line.startsWith('•') || line.startsWith('-')) {
                    return (
                      <div key={idx} className="pl-1 text-stone-700">
                        {line}
                      </div>
                    );
                  }
                  return <div key={idx}>{line}</div>;
                })}
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-stone-400">
              <span>{msg.timestamp}</span>
              {msg.source && (
                <>
                  <span>·</span>
                  <span className="text-emerald-700 font-medium">{msg.source}</span>
                </>
              )}
            </div>
          </div>
        ))}

        {isChatLoading && (
          <div className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded-2xl w-fit text-xs text-stone-500 shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>Consultando catálogo e estoque em tempo real...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-stone-200 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Pergunte sobre produtos, preços ou estoque..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={isChatLoading}
            className="w-full pl-3.5 pr-10 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isChatLoading}
            className="absolute right-1.5 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-stone-400 mt-1.5 text-center">
          Alimentado por Groq IA · Respostas baseadas no inventário real do mercado
        </p>
      </form>
    </div>
  );
};
