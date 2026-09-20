import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTelegram } from '../context/TelegramContext';
import { useCart } from '../context/CartContext';
import { submitOrder, fetchStoreInfo } from '../services/emenuApi';

export default function CheckoutPage() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const { webApp, initData, haptic } = useTelegram();
  const { cart, updateQuantity, clearCart, totalAmount } = useCart();
  const [store, setStore] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStoreInfo(storeSlug).then((r) => r.status && setStore(r.data));
  }, [storeSlug]);

  // Hooking Telegram WebApp MainButton and BackButton
  useEffect(() => {
    if (!webApp) return;

    webApp.BackButton.show();
    webApp.BackButton.onClick(() => navigate(-1));

    if (cart.length > 0 && !submitting) {
      webApp.MainButton.setText(`CHECKOUT (${store?.currency_symbol || '$'}${totalAmount.toFixed(2)})`);
      webApp.MainButton.show();
      webApp.MainButton.onClick(handleOrderSubmission);
    } else {
      webApp.MainButton.hide();
    }

    return () => {
      webApp.BackButton.hide();
      webApp.MainButton.hide();
    };
  }, [webApp, cart, totalAmount, submitting, store]);

  const handleOrderSubmission = async () => {
    if (submitting || cart.length === 0) return;
    setSubmitting(true);
    haptic.impact('heavy');

    const items = cart.map((c) => ({ id: c.id, quantity: c.quantity }));
    const res = await submitOrder(storeSlug, { items, note }, initData);

    if (res.status) {
      haptic.notification('success');
      clearCart();
      navigate(`/shop/${storeSlug}/success`, { state: { order: res.data }, replace: true });
    } else {
      haptic.notification('error');
      alert(res.message || 'Checkout failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 flex flex-col flex-1 space-y-4">
      <h1 className="text-xl font-bold">Review Your Order</h1>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {cart.map((item) => (
          <div key={item.id} className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-zinc-500">
                {store?.currency_symbol || '$'}{Number(item.price).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { haptic.impact('light'); updateQuantity(item.id, item.quantity - 1); }}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="text-sm font-semibold">{item.quantity}</span>
              <button
                onClick={() => { haptic.impact('light'); updateQuantity(item.id, item.quantity + 1); }}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <textarea
        placeholder="Add special cooking instructions or notes..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs outline-none focus:ring-2 ring-[var(--theme-accent)]"
      />

      {/* Browser-only fallback trigger if not in Telegram runtime */}
      {!webApp && (
        <button
          onClick={handleOrderSubmission}
          disabled={submitting}
          className="w-full min-h-[48px] bg-[var(--theme-accent)] text-white font-bold rounded-xl shadow-lg"
        >
          {submitting ? 'Submitting...' : `Place Order • $${totalAmount.toFixed(2)}`}
        </button>
      )}
    </div>
  );
}