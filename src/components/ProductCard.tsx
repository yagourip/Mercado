import React, { useState } from 'react';
import { Product } from '../types/market';
import { useMarket } from '../context/MarketContext';
import { Plus, Check, ShoppingBag, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, cart } = useMarket();
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const cartItem = cart.find(i => i.product.id === product.id);
  const currentInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setErrorNotice(null);

    const res = addToCart(product, 1);
    if (!res.success) {
      setErrorNotice(res.message || 'Limite de estoque atingido');
      setTimeout(() => setErrorNotice(null), 3000);
      return;
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(product)}
      className="group relative bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-stone-100 text-stone-400">
            <ShoppingBag className="w-8 h-8 mb-1 text-stone-300" />
            <span className="text-xs font-medium text-stone-500">{product.category}</span>
          </div>
        )}

        {/* Quiet unboxed stock overlay tag */}
        <div className="absolute top-2.5 right-2.5">
          {isOutOfStock ? (
            <span className="text-[11px] font-semibold tracking-tight text-white bg-stone-900/85 backdrop-blur-xs px-2 py-0.5 rounded-md">
              Esgotado
            </span>
          ) : isLowStock ? (
            <span className="text-[11px] font-semibold tracking-tight text-amber-900 bg-amber-100/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-amber-300">
              Restam {product.stock} {product.unit}
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separator (Zero-Pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 tracking-tight">
            <span className="uppercase text-[11px] font-semibold text-emerald-800 tracking-wider">
              {product.category}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="truncate">{product.sellerName}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom Price & Add Action Row */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-medium text-stone-500">R$</span>
              <span className="text-lg font-bold text-stone-900 font-mono tabular-nums">
                {product.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[11px] text-stone-400">/{product.unit}</span>
            </div>

            {/* Unboxed stock detail */}
            <div className="text-[11px] text-stone-500 mt-0.5">
              {!isOutOfStock ? (
                <span>{product.stock} {product.unit} em estoque</span>
              ) : (
                <span className="text-stone-400">Sem estoque</span>
              )}
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                : justAdded
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-900 text-white hover:bg-emerald-700 shadow-xs'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Adicionado</span>
              </>
            ) : isOutOfStock ? (
              <span>Indisponível</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
                {currentInCart > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-stone-700 text-white rounded-full text-[10px]">
                    {currentInCart}
                  </span>
                )}
              </>
            )}
          </button>
        </div>

        {errorNotice && (
          <div className="mt-2 text-[11px] text-rose-700 flex items-center gap-1 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span className="truncate">{errorNotice}</span>
          </div>
        )}
      </div>
    </div>
  );
};
