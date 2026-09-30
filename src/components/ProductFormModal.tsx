import React, { useState, useEffect } from 'react';
import { Product, MARKET_CATEGORIES } from '../types/market';
import { X, Plus, Save } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: {
    name: string;
    category: string;
    price: number;
    stock: number;
    unit: string;
    description: string;
    image: string;
  }) => void;
  editingProduct?: Product | null;
}

const PRESET_IMAGES = [
  { label: 'Hortifrúti / Frutas', url: '/src/assets/images/product_fresh_fruits_1790791091358.jpg' },
  { label: 'Legumes & Verduras', url: '/src/assets/images/product_organic_veggies_1790791112536.jpg' },
  { label: 'Pães Artesanais & Confeitaria', url: '/src/assets/images/product_artisan_bread_1790791102447.jpg' },
  { label: 'Empório & Produtos Naturais', url: '/src/assets/images/hero_marketplace_fresh_1790791080636.jpg' }
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>(MARKET_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState('10.00');
  const [stock, setStock] = useState('15');
  const [unit, setUnit] = useState('un');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      if (MARKET_CATEGORIES.includes(editingProduct.category as any)) {
        setCategory(editingProduct.category);
        setCustomCategory('');
      } else {
        setCategory('Outra');
        setCustomCategory(editingProduct.category);
      }
      setPrice(editingProduct.price.toString());
      setStock(editingProduct.stock.toString());
      setUnit(editingProduct.unit);
      setDescription(editingProduct.description);
      setImage(editingProduct.image);
    } else {
      setName('');
      setCategory(MARKET_CATEGORIES[0]);
      setCustomCategory('');
      setPrice('12.50');
      setStock('20');
      setUnit('un');
      setDescription('');
      setImage(PRESET_IMAGES[0].url);
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === 'Outra' ? (customCategory.trim() || 'Geral') : category;
    const finalPrice = Math.max(0.01, parseFloat(price) || 1.0);
    const finalStock = Math.max(0, parseInt(stock, 10) || 0);

    onSave({
      name,
      category: finalCategory,
      price: finalPrice,
      stock: finalStock,
      unit,
      description,
      image
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        role="dialog"
      >
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <h2 className="text-base font-bold text-stone-900">
            {editingProduct ? 'Editar Produto do Catálogo' : 'Cadastrar Novo Produto para Venda'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nome do Produto *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Tomate Italiano Orgânico ou Pão Francês"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {MARKET_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Outra">+ Nova Categoria...</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Unidade de Medida *
              </label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="un">un (Unidade)</option>
                <option value="kg">kg (Quilograma)</option>
                <option value="pct">pct (Pacote)</option>
                <option value="dúzia">dúzia</option>
                <option value="peça">peça</option>
                <option value="litro">litro</option>
                <option value="bandeja">bandeja</option>
              </select>
            </div>
          </div>

          {category === 'Outra' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nome da Nova Categoria
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Artesanatos & Utensílios"
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Preço de Venda (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Estoque Inicial (Qtd) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Descrição do Produto
            </label>
            <textarea
              rows={3}
              placeholder="Descreva origem, características, frescor e recomendações de consumo..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Foto do Produto (Escolha uma prévia de estúdio ou informe link)
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {PRESET_IMAGES.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImage(p.url)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                    image === p.url ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.label}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                  />
                  <span className="text-[11px] font-medium text-stone-700 leading-tight">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Ou cole a URL direta de uma imagem personalizada"
              value={image}
              onChange={e => setImage(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-600 font-mono text-[11px]"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {editingProduct ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{editingProduct ? 'Salvar Alterações' : 'Cadastrar no Estoque'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
