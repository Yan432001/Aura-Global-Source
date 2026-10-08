import React, { useState } from 'react';
import {
  CloseOutlined,
  HeartFilled,
  HeartOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { message } from 'antd';

/**
 * Helper to derive ingredients for products when not explicitly specified
 */
export const getProductIngredients = (item) => {
  if (item?.ingredients && Array.isArray(item.ingredients)) {
    return item.ingredients;
  }
  if (item?.ingredients && typeof item.ingredients === 'string') {
    return item.ingredients.split(',').map((s) => s.trim());
  }

  const name = (item?.name || '').toLowerCase();
  const cat = (item?.category || '').toLowerCase();

  if (name.includes('pancake')) {
    return ['Organic stoneground flour', 'Farm-fresh buttermilk', 'Free-range eggs', 'Pure vanilla extract', 'Vermont Grade-A maple syrup', 'Cultured butter'];
  }
  if (name.includes('croissant')) {
    return ['Unbleached French wheat flour (T55)', 'AOP Charentes-Poitou butter (84% fat)', 'Purified spring water', 'Cane sugar', 'Natural sea salt', 'Wild yeast'];
  }
  if (name.includes('latte') || name.includes('coffee') || cat.includes('coffee')) {
    return ['Single-origin highland Arabica beans', 'Artisan organic whole milk (or plant base)', 'Filtered mineral water', 'Raw demerara cane sugar (optional)'];
  }
  if (name.includes('burger')) {
    return ['Grass-fed beef prime cut patty', 'Toasted brioche bun', 'Aged smoked cheddar', 'Organic crisp romaine', 'Heirloom tomato', 'House chipotle aioli'];
  }
  if (name.includes('steak')) {
    return ['Australian grass-fed Ribeye (MB2+)', 'Cold-pressed extra virgin olive oil', 'Fresh rosemary & thyme sprigs', 'Maldon smoked sea salt flakes', 'Green peppercorn reduction'];
  }
  if (name.includes('pizza')) {
    return ['Caputo 00 flour slow-fermented dough', 'San Marzano D.O.P. crushed tomatoes', 'Buffalo mozzarella di Campana', 'Fresh sweet basil leaves', 'EVOO'];
  }
  if (name.includes('tart') || name.includes('chocolate')) {
    return ['Valrhona 70% dark Belgian chocolate', 'French heavy whipping cream', 'Cocoa sable pastry crust', 'Roasted Piedmont hazelnuts', 'Edible 24k gold flakes'];
  }
  if (name.includes('bagel')) {
    return ['High-protein malted wheat flour', 'Philadelphia cream cheese', 'Toasted sesame & poppy seeds', 'Wildflower honey', 'Sea salt'];
  }
  if (name.includes('matcha') || cat.includes('tea')) {
    return ['First-harvest Uji ceremonial matcha', 'Filtered spring water (80°C)', 'Organic oat or whole milk', 'Agave nectar'];
  }
  if (name.includes('toast') || name.includes('roll')) {
    return ['Artisan sourdough brioche', 'Cinnamon Ceylon bark', 'Vanilla cream glaze', 'Organic butter', 'Sea salt'];
  }

  return ['Organic whole grains', 'Fresh botanical herbs', 'Cold-pressed oil', 'Natural sea salt', 'Filtered spring water'];
};

/**
 * Helper to derive allergens for products
 */
export const getProductAllergens = (item) => {
  if (item?.allergens && Array.isArray(item.allergens)) {
    return item.allergens;
  }
  if (item?.allergens && typeof item.allergens === 'string') {
    return item.allergens.split(',').map((s) => s.trim());
  }

  const name = (item?.name || '').toLowerCase();
  const cat = (item?.category || '').toLowerCase();
  const list = [];

  if (name.includes('croissant') || name.includes('bread') || name.includes('sourdough') || name.includes('pancake') || name.includes('toast') || name.includes('burger') || name.includes('pasta') || name.includes('pizza') || name.includes('bagel') || name.includes('roll') || name.includes('muffin') || name.includes('crepe') || name.includes('tart')) {
    list.push({ name: 'Gluten (Wheat)', icon: '🌾' });
  }

  if (name.includes('latte') || name.includes('cheese') || name.includes('butter') || name.includes('cream') || name.includes('croissant') || name.includes('tart') || name.includes('pancake') || name.includes('omelet') || name.includes('brioche') || cat.includes('coffee')) {
    list.push({ name: 'Dairy (Milk)', icon: '🥛' });
  }

  if (name.includes('pancake') || name.includes('omelet') || name.includes('toast') || name.includes('crepe') || name.includes('brioche') || name.includes('muffin')) {
    list.push({ name: 'Eggs', icon: '🥚' });
  }

  if (name.includes('hazelnut') || name.includes('almond') || name.includes('pistachio') || name.includes('tart')) {
    list.push({ name: 'Tree Nuts', icon: '🥜' });
  }

  if (list.length === 0) {
    list.push({ name: 'Nut-Free', icon: '🌱' });
  }

  return list;
};

/**
 * ProductDetailModal
 * Comprehensive product modal popup that appears when clicking a product card.
 * Shows larger high-res image, ingredients list, allergens tags, preparation notes,
 * calories/portion, and interactive quantity stepper with Add to Cart action.
 */
export default function ProductDetailModal({
  open,
  product,
  onClose,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite,
  accentColor = '#2F6FED',
  currencySymbol = '$',
  triggerHaptic,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [specialNote, setSpecialNote] = useState('');

  if (!open || !product) return null;

  const ingredients = getProductIngredients(product);
  const allergens = getProductAllergens(product);

  const price = Number(product.price || 0);
  const totalPrice = (price * quantity).toFixed(2);

  const handleAdd = () => {
    triggerHaptic?.('success');
    onAddToCart?.(product, quantity, {
      size: selectedSize,
      note: specialNote.trim() || undefined,
    });
    message.success(`Added ${quantity}x "${product.name}" to order! 🎉`);
    onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="w-full sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* 1. HERO IMAGE WITH FLOATING BADGES & CLOSE BUTTON         */}
        {/* ======================================================== */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-100 shrink-0 overflow-hidden group">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&fit=crop&q=80';
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center font-bold text-sm shadow-md cursor-pointer transition active:scale-90 z-10"
          >
            <CloseOutlined />
          </button>

          {/* Favorite Toggle Button */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic?.('light');
                onToggleFavorite(product.id, product.name, e);
              }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Bookmark to favorites'}
              className={`absolute top-3.5 left-3.5 w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90 z-10 cursor-pointer shadow-md ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500'
              }`}
              title={isFavorite ? 'Bookmarked in Favorites' : 'Add to Favorites'}
            >
              {isFavorite ? <HeartFilled className="text-sm" /> : <HeartOutlined className="text-sm" />}
            </button>
          )}

          {/* Floating Category & Prep Time */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-bold pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 uppercase tracking-wider text-[11px]">
              {product.category || 'Menu Special'}
            </span>
            {(product.time || product.prepTime) && (
              <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center gap-1 text-[11px]">
                <ClockCircleOutlined />
                <span>{product.time || product.prepTime}</span>
              </span>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. PRODUCT DETAILS & NUTRITION BODY                       */}
        {/* ======================================================== */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title & Price Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2
                id="product-modal-title"
                className="font-serif font-black text-xl sm:text-2xl text-slate-900 leading-snug tracking-tight m-0"
              >
                {product.name}
              </h2>
              {product.code && (
                <span className="text-[11px] font-mono text-slate-400 font-semibold">
                  SKU: {product.code}
                </span>
              )}
            </div>

            <div className="text-right shrink-0">
              <span className="font-mono font-black text-2xl text-[var(--modal-accent,#2F6FED)]" style={{ '--modal-accent': accentColor }}>
                {currencySymbol}{price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <div className="text-xs text-slate-400 line-through font-mono">
                  {currencySymbol}{Number(product.originalPrice).toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
            {product.description || product.details || 'Handcrafted daily using organic seasonal ingredients and artisan techniques.'}
          </p>

          {/* Portion & Calorie Stats */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">📦</span>
              <div>
                <span className="text-[10.5px] text-slate-400 font-semibold block uppercase">Portion</span>
                <span className="font-bold text-slate-800">{product.portion || 'Standard Serving'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🔥</span>
              <div>
                <span className="text-[10.5px] text-slate-400 font-semibold block uppercase">Energy</span>
                <span className="font-bold text-slate-800">{product.calories || '320 kcal'}</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. INGREDIENTS LIST                                      */}
          {/* ======================================================== */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>🌱 Ingredients</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Fresh Daily</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-slate-100/90 text-slate-700 text-[11px] font-semibold border border-slate-200/70"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. ALLERGENS WARNING & CERTIFICATION                     */}
          {/* ======================================================== */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>⚠️ Allergen Information</span>
            </span>
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {allergens.map((alg, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-amber-900 border border-amber-200 text-[11px] font-bold shadow-2xs"
                  >
                    <span>{alg.icon}</span>
                    <span>{alg.name}</span>
                  </span>
                ))}
              </div>
              <p className="text-[10.5px] text-amber-800/90 m-0 leading-normal">
                Please notify kitchen staff if you have severe dietary allergies or sensitivities. Prepared in an environment handling dairy and nuts.
              </p>
            </div>
          </div>

          {/* Barista / Chef Special Instructions */}
          <div className="space-y-1 pt-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase block">
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Less ice, extra hot, dressing on side..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2F6FED]"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. BOTTOM ACTION BAR: QUANTITY STEPPER + ADD TO CART     */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 shrink-0 flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => {
                triggerHaptic?.('light');
                setQuantity((q) => Math.max(1, q - 1));
              }}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-2xs transition active:scale-90 cursor-pointer"
              title="Decrease quantity"
            >
              <MinusOutlined style={{ fontSize: 10 }} />
            </button>
            <span className="font-mono font-black text-sm text-slate-900 w-6 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic?.('light');
                setQuantity((q) => q + 1);
              }}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-2xs transition active:scale-90 cursor-pointer"
              title="Increase quantity"
            >
              <PlusOutlined style={{ fontSize: 10 }} />
            </button>
          </div>

          {/* Primary Add to Order Button */}
          <button
            type="button"
            onClick={handleAdd}
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
            }}
            className="flex-1 py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-between shadow-lg active:scale-98 transition cursor-pointer hover:opacity-95"
          >
            <span className="flex items-center gap-2">
              <ShoppingCartOutlined className="text-base" />
              <span>Add to Order</span>
            </span>
            <span className="font-mono font-black text-base">
              {currencySymbol}{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
