import React from 'react';
import { useMarket } from '../context/MarketContext';
import { PackageCheck, Clock, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';

interface BuyerOrdersProps {
  onBackToMarket: () => void;
}

export const BuyerOrders: React.FC<BuyerOrdersProps> = ({ onBackToMarket }) => {
  const { orders, currentUser } = useMarket();

  // Filter orders made by current user
  const myOrders = orders.filter(o => o.buyerId === currentUser?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'text-blue-800 bg-blue-50 border-blue-200';
      case 'Em Preparação':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'A Caminho':
        return 'text-purple-800 bg-purple-50 border-purple-200';
      case 'Entregue':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      default:
        return 'text-stone-800 bg-stone-100 border-stone-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Meus Pedidos</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Acompanhe o status e histórico de compras realizadas no mercado
          </p>
        </div>
        <button
          onClick={onBackToMarket}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
        >
          <span>Ir para a Vitrine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-800">Você ainda não fez nenhum pedido</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Nossos produtores parceiros têm itens frescos prontos para envio. Visite a vitrine e monte seu carrinho!
          </p>
          <button
            onClick={onBackToMarket}
            className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
          >
            Explorar Produtos
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-stone-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 font-mono text-sm">{order.id}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>Entrega: {order.buyerAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 block">Total</span>
                    <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                      />
                      <div>
                        <p className="font-semibold text-stone-900">{item.name}</p>
                        <p className="text-[11px] text-stone-500">
                          {item.sellerName} · {item.quantity} {item.unit} x R$ {item.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono tabular-nums font-semibold text-stone-800">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
                <span>Pagamento via {order.paymentMethod.toUpperCase()}</span>
                <span className="text-emerald-700 font-medium">✓ Pedido Registrado no Estoque</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
