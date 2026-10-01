import React, { useState } from 'react';
import { Product } from '../types/market';
import { useMarket } from '../context/MarketContext';
import { X, Plus, Minus, ShoppingBag, Store, Bot, Check, AlertCircle } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { products, addToCart, setIsChatOpen, sendChatMessage } = useMarket();
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!product) return null;

  // Retrieve latest live product instance to guarantee up-to-date stock and price
  const liveProduct = products.find(p => p.id === product.id) || product;
  const isOutOfStock = liveProduct.stock <= 0;
  const isLowStock = liveProduct.stock > 0 && liveProduct.stock <= 5;

  const handleAddToCart = () => {
    setErrorNotice(null);
    const res = addToCart(liveProduct, quantity);
    if (!res.success) {
      setErrorNotice(res.message || 'Quantidade não disponível em estoque.');
      return;
    }
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleAskChatbot = () => {
    onClose();
    setIsChatOpen(true);
    sendChatMessage(`Quantas unidades de "${liveProduct.name}" temos em estoque e qual o valor?`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col md:flex-row"
        role="dialog"
      >
        {/* Left Column: Image */}
        <div className="md:w-1/2 relative bg-stone-100 min-h-[260px] md:min-h-full">
          <img
            src={liveProduct.image}
            alt={liveProduct.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <button
            onClick={onClose}
            className="md:hidden absolute top-3 right-3 p-1.5 bg-white/90 text-stone-700 rounded-full shadow-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Right Column: Info & Purchase Action */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-emerald-800 tracking-wider">
                {liveProduct.category}
              </span>
              <button
                onClick={onClose}
                className="hidden md:block p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-stone-900 leading-snug">
              {liveProduct.name}
            </h2>

            {/* Seller attribution */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-2">
              <Store className="w-3.5 h-3.5 text-stone-400" />
              <span>Vendido por: <strong className="text-stone-800 font-semibold">{liveProduct.sellerName}</strong></span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-sm font-medium text-stone-500">R$</span>
              <span className="text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                {liveProduct.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-xs text-stone-400">/ {liveProduct.unit}</span>
            </div>

            {/* Stock details */}
            <div className="mt-3 text-xs">
              {isOutOfStock ? (
                <div className="p-2.5 rounded-lg bg-stone-100 text-stone-600 font-medium">
                  Produto esgotado no momento. O vendedor foi notificado para reposição.
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-700">Disponibilidade:</span>
                  <span className={isLowStock ? 'text-amber-700 font-bold' : 'text-emerald-700 font-medium'}>
                    {liveProduct.stock} {liveProduct.unit} disponíveis
                  </span>
                  {isLowStock && (
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      Últimas unidades!
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
              {liveProduct.description}
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
            {errorNotice && (
              <div className="p-2 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-1.5 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorNotice}</span>
              </div>
            )}

            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-stone-200 text-stone-600 disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-stone-800 font-mono tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(liveProduct.stock, q + 1))}
                    disabled={quantity >= liveProduct.stock}
                    className="p-2 hover:bg-stone-200 text-stone-600 disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                    addedSuccess ? 'bg-emerald-700' : 'bg-stone-900 hover:bg-emerald-700'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Item no Carrinho!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Adicionar ao Carrinho (R$ {(liveProduct.price * quantity).toFixed(2).replace('.', ',')})</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Inquire chatbot shortcut */}
            <button
              type="button"
              onClick={handleAskChatbot}
              className="w-full py-2 px-3 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tirar dúvidas sobre este item com a IA de Estoque</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
