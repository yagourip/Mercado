import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { X, CheckCircle, QrCode, CreditCard, FileText, MapPin, AlertCircle, ShoppingBag } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  const { cart, cartTotal, currentUser, checkout } = useMarket();
  const [address, setAddress] = useState(currentUser?.address || 'Av. Paulista, 1578 - Cerqueira César, São Paulo - SP');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{ id: string; total: number } | null>(null);

  if (!isOpen) return null;

  const shippingCost = cartTotal >= 50 || cart.length === 0 ? 0 : 9.90;
  const grandTotal = cartTotal + shippingCost;

  const handleConfirmOrder = () => {
    if (!address.trim()) {
      setErrorMessage('Por favor, confirme o endereço de entrega.');
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = checkout({ address, paymentMethod });
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Falha ao processar o pedido.');
        return;
      }

      setCompletedOrder({ id: res.orderId!, total: grandTotal });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              {completedOrder ? 'Pedido Confirmado!' : 'Checkout Seguro'}
            </h2>
            <p className="text-xs text-stone-500">
              {completedOrder ? 'Seu pedido foi registrado no estoque' : 'Revise seus dados e finalize sua compra'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Completed Receipt View */}
        {completedOrder ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900">Obrigado pela sua compra!</h3>
              <p className="text-xs text-stone-500 mt-1">
                O estoque foi atualizado automaticamente e os vendedores foram notificados.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Número do Pedido:</span>
                <span className="font-bold text-stone-900 font-mono">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Valor Total Pago:</span>
                <span className="font-bold text-emerald-800 font-mono tabular-nums">
                  R$ {completedOrder.total.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Forma de Pagamento:</span>
                <span className="font-semibold text-stone-800 uppercase text-[11px]">
                  {paymentMethod === 'pix' ? 'Pix (Aprovado)' : paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 'Boleto Bancário'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Endereço de Entrega:</span>
                <span className="font-medium text-stone-800 text-right truncate max-w-[200px]">
                  {address}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOrderCompleted(completedOrder.id);
                }}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
              >
                Acompanhar em Meus Pedidos
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                Voltar ao Mercado
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Delivery address */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Endereço de Entrega</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Rua, Número, Bairro, Cidade - UF"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-semibold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Pix Instantâneo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'credit_card'
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-semibold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-stone-700" />
                  <span className="text-xs">Cartão Crédito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('boleto')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'boleto'
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-semibold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <FileText className="w-4 h-4 text-stone-700" />
                  <span className="text-xs">Boleto</span>
                </button>
              </div>

              {/* Payment preview info */}
              {paymentMethod === 'pix' && (
                <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-800">Chave Pix Copia e Cola Gerada</span>
                    <span className="text-[10px] text-stone-400">Aprovação imediata</span>
                  </div>
                  <p className="font-mono text-[11px] bg-white p-2 rounded border border-stone-200 text-stone-700 truncate">
                    00020126580014br.gov.bcb.pix0136mercadoconecta-9283-492a-891b
                  </p>
                </div>
              )}
            </div>

            {/* Summary Box */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Produtos ({cart.reduce((s, i) => s + i.quantity, 0)} itens):</span>
                <span className="font-mono tabular-nums">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span>Entrega:</span>
                <span>{shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-1.5 border-t border-stone-200">
                <span>Total a Pagar:</span>
                <span className="font-mono tabular-nums text-emerald-800">
                  R$ {grandTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Confirm CTA */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmOrder}
              className="w-full py-3 px-4 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isSubmitting ? 'Atualizando Estoque...' : 'Confirmar e Pagar'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
