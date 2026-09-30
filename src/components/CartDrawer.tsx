import React from 'react';
import { useMarket } from '../context/MarketContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal } = useMarket();

  if (!isOpen) return null;

  const shippingCost = cartTotal >= 50 || cart.length === 0 ? 0 : 9.90;
  const grandTotal = cartTotal + shippingCost;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-stone-900">Meu Carrinho</h2>
              <span className="text-xs text-stone-500">
                ({cart.reduce((s, i) => s + i.quantity, 0)} itens)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <ShoppingBag className="w-12 h-12 text-stone-300 mb-3" />
                <p className="text-sm font-semibold text-stone-800">Seu carrinho está vazio</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Explore nosso catálogo com produtos frescos direto dos produtores e adicione à sua cesta!
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
                >
                  Explorar Mercado
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center text-xs text-stone-500 pb-2 border-b border-stone-100">
                  <span>Itens Selecionados</span>
                  <button
                    onClick={clearCart}
                    className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Esvaziar carrinho
                  </button>
                </div>

                {cart.map(item => {
                  const maxStock = item.product.stock;
                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-3.5 p-3 rounded-xl border border-stone-200/80 bg-white hover:border-stone-300 transition-colors"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-stone-900 truncate">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remover item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-stone-500 truncate">
                            {item.product.sellerName} · R$ {item.product.price.toFixed(2).replace('.', ',')} / {item.product.unit}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-50">
                          {/* Quantity stepper */}
                          <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-stone-200 text-stone-600 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-stone-800 font-mono tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= maxStock}
                              className="p-1 hover:bg-stone-200 text-stone-600 disabled:opacity-40 cursor-pointer"
                              title={item.quantity >= maxStock ? 'Limite de estoque atingido' : 'Adicionar mais um'}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Line total */}
                          <span className="text-xs font-bold text-stone-900 font-mono tabular-nums">
                            R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50/70 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Entrega Estimada</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-semibold">Grátis (Pedido &gt; R$ 50)</span>
                  ) : (
                    <span className="font-mono tabular-nums font-semibold text-stone-900">
                      R$ {shippingCost.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total do Pedido</span>
                  <span className="font-mono tabular-nums text-base text-emerald-800">
                    R$ {grandTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-3 px-4 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
