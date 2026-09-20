import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTelegram } from '../hooks/useTelegram';
import { useStoreCart } from '../hooks/useStoreCart';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5173/';

export default function EMenuPage() {
  const { storeSlug, billerId } = useParams();
  const identifier = storeSlug || billerId;
  const navigate = useNavigate();
  const { tg, initData } = useTelegram();
  const { cart, addItem, removeItem, clearCart, total, itemCount } = useStoreCart(identifier);

  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let url = `${API_BASE}/api/v1/emenu/store/${identifier}/menu`;
    axios.get(url)
      .then((res) => {
        if (res.data.status) {
          setStore(res.data.store);
          setCategories(res.data.data.categories || []);
          setProducts(res.data.data.products || []);
          if (res.data.data.categories?.length) {
            setActiveCategory(res.data.data.categories[0].id);
          }
        }
      })
      .catch(() => {
        navigate('/shop/not-found', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [identifier, navigate]);

  const handleCheckout = async () => {
    if (!cart.length) return;
    try {
      const res = await axios.post(
        `${API_BASE}/api/v1/emenu/store/${identifier}/checkout`,
        {
          cartItems: cart,
          customerData: { customerName: tg?.initDataUnsafe?.user?.first_name || 'Guest' }
        },
        { headers: { 'x-telegram-init-data': initData || '' } }
      );
      if (res.data.status) {
        clearCart();
        setCartOpen(false);
        if (tg) {
          tg.showAlert(`Order ${res.data.data.referenceNo} placed successfully!`);
          tg.close();
        } else {
          alert(`Order ${res.data.data.referenceNo} confirmed!`);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 space-y-4 animate-pulse">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    );
  }

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category_id === activeCategory)
    : products;

  return (
    <div className="flex flex-col flex-1 pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold truncate max-w-[260px]">
            {store?.company || store?.name}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{store?.phone || 'E-Menu'}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
          {(store?.company || store?.name || 'S')[0]}
        </div>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-[61px] z-10 bg-white dark:bg-gray-800 px-3 py-2 overflow-x-auto no-scrollbar flex space-x-2 border-b border-gray-100 dark:border-gray-700">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap min-h-[36px] transition-colors ${
              activeCategory === c.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="p-3 grid grid-cols-2 gap-3">
        {filteredProducts.map((product) => {
          const inCart = cart.find((i) => i.id === product.id);
          return (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-2.5 flex flex-col justify-between"
            >
              <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400 text-xs">No image</span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold line-clamp-2">{product.name}</p>
                <p className="text-sm font-bold text-blue-600 mt-1">${Number(product.price).toFixed(2)}</p>
              </div>
              <div className="mt-2.5">
                {inCart ? (
                  <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button onClick={() => removeItem(product.id)} className="w-7 h-7 flex items-center justify-center font-bold text-sm">−</button>
                    <span className="text-xs font-bold">{inCart.quantity}</span>
                    <button onClick={() => addItem(product)} className="w-7 h-7 flex items-center justify-center font-bold text-sm">+</button>
                  </div>
                ) : (
                  <button
                    onClick={() => addItem(product)}
                    className="w-full h-9 bg-blue-50 dark:bg-gray-700 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg text-xs font-semibold transition"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Cart Bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-3 flex justify-center z-30 pointer-events-none">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full max-w-[400px] h-12 bg-blue-600 text-white rounded-xl shadow-xl flex items-center justify-between px-4 pointer-events-auto active:scale-95 transition"
          >
            <span className="text-xs font-bold bg-blue-800 px-2.5 py-1 rounded-full">{itemCount} items</span>
            <span className="font-semibold text-sm">View Cart</span>
            <span className="font-bold text-sm">${total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart Modal / Sheet */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 flex flex-col justify-end">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl max-h-[80vh] flex flex-col p-4 w-full max-w-[430px] mx-auto animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
              <h2 className="text-base font-bold">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 p-1">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex-1 pr-2">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">${Number(item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold">−</button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => addItem(item)} className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t dark:border-gray-700">
              <div className="flex justify-between text-sm font-bold mb-3">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full h-11 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md active:opacity-90"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}