/**
 * Aura Global Web Portal & E-Menu Application Controller
 */

let stores = [];
let currentStore = null;
let currentProducts = [];
let currentCategories = [];
let activeCategory = null;
let searchQuery = '';

let cart = [];
let currentOrderType = 'dine_in';
let selectedModalProduct = null;
let modalSelectedOptions = {};
let modalQty = 1;

let liveOrders = [];

// Initialize on document ready
document.addEventListener('DOMContentLoaded', async () => {
  await loadStores();
  await loadCmsContent();
  await loadOrders();
});

// Navigation Tab Switcher
function switchTab(tabId) {
  document.querySelectorAll('main > section').forEach((sec) => {
    sec.classList.add('hidden');
  });

  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.remove('bg-amber-50', 'text-amber-900', 'font-semibold');
  });

  const activeBtn = document.getElementById(`nav-${tabId}`);
  if (activeBtn) activeBtn.classList.add('bg-amber-50', 'text-amber-900', 'font-semibold');

  if (tabId === 'orders') {
    loadOrders();
  }
}

// ==================== STORE DATA & CATALOG ====================

async function loadStores() {
  try {
    const res = await fetch('/api/tma/stores');
    const data = await res.json();
    if (data.status && data.data) {
      stores = data.data;
      populateStoreSelector();
      if (stores.length > 0) {
        selectStore(stores[0].slug);
      }
    }
  } catch (err) {
    console.error('Failed to load stores:', err);
  }
}

function populateStoreSelector() {
  const sel = document.getElementById('store-selector');
  if (!sel) return;
  sel.innerHTML = stores.map((s) => `
    <option value="${s.slug}">${s.name}</option>
  `).join('');
}

async function onStoreChange(slug) {
  await selectStore(slug);
}

async function selectStore(slug) {
  try {
    const res = await fetch(`/api/tma/shop/${slug}`);
    const data = await res.json();
    if (data.status && data.data) {
      currentStore = data.data;
      currentProducts = data.products || [];
      currentCategories = data.categories || [];

      updateStoreHeader();
      renderCategories();
      renderProducts();
      renderTmaSimulator();
    }
  } catch (err) {
    console.error('Failed to select store:', err);
  }
}

function updateStoreHeader() {
  if (!currentStore) return;
  document.getElementById('store-name-display').innerText = currentStore.name;
  document.getElementById('store-tagline-display').innerText = currentStore.tagline || currentStore.description || '';
  document.getElementById('store-address-display').innerText = `📍 ${currentStore.address}`;
  document.getElementById('store-phone-display').innerText = `📞 ${currentStore.phone}`;
  document.getElementById('store-hours').innerText = currentStore.operating_hours || '6:30 AM - 8:30 PM';
  
  const bgImg = document.getElementById('store-bg-image');
  if (bgImg && currentStore.banner) {
    bgImg.style.backgroundImage = `url('${currentStore.banner}')`;
  }

  const selector = document.getElementById('store-selector');
  if (selector) selector.value = currentStore.slug;

  document.getElementById('cart-store-name').innerText = currentStore.name;
  document.getElementById('tma-bar-title').innerText = currentStore.name;
}

function renderCategories() {
  const container = document.getElementById('category-pills');
  if (!container) return;

  const allActive = activeCategory === null ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200';
  let html = `
    <button onclick="filterCategory(null)" class="cat-pill px-3.5 py-1.5 rounded-lg text-xs font-bold ${allActive} whitespace-nowrap transition">
      All Items (${currentProducts.length})
    </button>
  `;

  currentCategories.forEach((cat) => {
    const isCatActive = activeCategory === cat.id ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200';
    const count = currentProducts.filter((p) => Number(p.category_id) === Number(cat.id)).length;
    html += `
      <button onclick="filterCategory(${cat.id})" class="cat-pill px-3.5 py-1.5 rounded-lg text-xs font-bold ${isCatActive} whitespace-nowrap transition">
        ${cat.name} (${count})
      </button>
    `;
  });

  container.innerHTML = html;
}

function filterCategory(catId) {
  activeCategory = catId;
  renderCategories();
  renderProducts();
}

function onSearchProducts(query) {
  searchQuery = (query || '').toLowerCase().trim();
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let filtered = currentProducts;

  if (activeCategory !== null) {
    filtered = filtered.filter((p) => Number(p.category_id) === Number(activeCategory));
  }

  if (searchQuery) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchQuery) ||
      (p.details && p.details.toLowerCase().includes(searchQuery)) ||
      (p.code && p.code.toLowerCase().includes(searchQuery))
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400 text-xs">
        No menu items found in this section.
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((prod) => `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
      <div class="relative h-44 overflow-hidden bg-slate-100">
        <img src="${prod.image}" alt="${prod.name}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">
        <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900/80 text-white backdrop-blur-xs font-mono">
          $${Number(prod.price).toFixed(2)}
        </span>
      </div>
      <div class="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
        <div>
          <h4 class="font-bold text-slate-900 text-sm leading-snug">${prod.name}</h4>
          <p class="text-[11px] text-slate-500 line-clamp-2 mt-1">${prod.details || ''}</p>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[10px] text-slate-400 font-mono">${prod.code || ''}</span>
          <button onclick="openProductModal(${prod.id})" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg transition active:scale-95 flex items-center gap-1">
            <span>+ Add</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ==================== PRODUCT CUSTOMIZATION MODAL ====================

function openProductModal(productId) {
  const prod = currentProducts.find((p) => p.id === productId);
  if (!prod) return;

  selectedModalProduct = prod;
  modalSelectedOptions = {};
  modalQty = 1;

  document.getElementById('modal-product-img').src = prod.image;
  document.getElementById('modal-product-name').innerText = prod.name;
  document.getElementById('modal-product-price').innerText = `$${Number(prod.price).toFixed(2)}`;
  document.getElementById('modal-product-desc').innerText = prod.details || '';
  document.getElementById('modal-qty').innerText = modalQty;

  const container = document.getElementById('modal-options-container');
  if (prod.options && prod.options.length > 0) {
    container.innerHTML = prod.options.map((optGroup) => {
      // Pick first choice as default
      modalSelectedOptions[optGroup.name] = optGroup.choices[0].label;
      return `
        <div class="space-y-1.5">
          <label class="block font-bold text-slate-700">${optGroup.name}:</label>
          <div class="flex flex-wrap gap-1.5">
            ${optGroup.choices.map((c, i) => `
              <button type="button" onclick="selectModalOption('${optGroup.name}', '${c.label}')" id="opt-btn-${optGroup.name.replace(/\s+/g, '')}-${i}" class="modal-opt-btn px-2.5 py-1 rounded-md text-[11px] font-medium border ${i === 0 ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200'}">
                ${c.label} ${c.priceDelta ? `(+$${Number(c.priceDelta).toFixed(2)})` : ''}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  } else {
    container.innerHTML = `<p class="text-slate-400 italic">No customizable options for this item.</p>`;
  }

  updateModalTotal();
  document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.add('hidden');
  selectedModalProduct = null;
}

function selectModalOption(groupName, choiceLabel) {
  modalSelectedOptions[groupName] = choiceLabel;
  // Re-highlight options
  if (selectedModalProduct && selectedModalProduct.options) {
    selectedModalProduct.options.forEach((optGroup) => {
      if (optGroup.name === groupName) {
        optGroup.choices.forEach((c, i) => {
          const btn = document.getElementById(`opt-btn-${groupName.replace(/\s+/g, '')}-${i}`);
          if (btn) {
            if (c.label === choiceLabel) {
              btn.className = 'modal-opt-btn px-2.5 py-1 rounded-md text-[11px] font-medium border bg-amber-600 text-white border-amber-600';
            } else {
              btn.className = 'modal-opt-btn px-2.5 py-1 rounded-md text-[11px] font-medium border bg-slate-50 text-slate-700 border-slate-200';
            }
          }
        });
      }
    });
  }
  updateModalTotal();
}

function adjustModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  document.getElementById('modal-qty').innerText = modalQty;
  updateModalTotal();
}

function updateModalTotal() {
  if (!selectedModalProduct) return;
  let unit = Number(selectedModalProduct.price);
  if (selectedModalProduct.options) {
    selectedModalProduct.options.forEach((optGroup) => {
      const selected = modalSelectedOptions[optGroup.name];
      const match = optGroup.choices.find((c) => c.label === selected);
      if (match && match.priceDelta) {
        unit += Number(match.priceDelta);
      }
    });
  }
  const total = unit * modalQty;
  document.getElementById('modal-total-calc').innerText = `$${total.toFixed(2)}`;
}

function confirmAddToCart() {
  if (!selectedModalProduct) return;

  let unit = Number(selectedModalProduct.price);
  if (selectedModalProduct.options) {
    selectedModalProduct.options.forEach((optGroup) => {
      const selected = modalSelectedOptions[optGroup.name];
      const match = optGroup.choices.find((c) => c.label === selected);
      if (match && match.priceDelta) {
        unit += Number(match.priceDelta);
      }
    });
  }

  // Check if identical item with options exists
  const optionsKey = JSON.stringify(modalSelectedOptions);
  const existingIndex = cart.findIndex((it) => it.id === selectedModalProduct.id && JSON.stringify(it.selectedOptions) === optionsKey);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += modalQty;
    cart[existingIndex].subtotal = Number((cart[existingIndex].quantity * cart[existingIndex].price).toFixed(2));
  } else {
    cart.push({
      id: selectedModalProduct.id,
      code: selectedModalProduct.code,
      name: selectedModalProduct.name,
      image: selectedModalProduct.image,
      price: Number(unit.toFixed(2)),
      quantity: modalQty,
      subtotal: Number((unit * modalQty).toFixed(2)),
      selectedOptions: { ...modalSelectedOptions }
    });
  }

  closeProductModal();
  updateCartUI();
  toggleCartDrawer(true);
}

// ==================== CART & CHECKOUT ====================

function toggleCartDrawer(forceOpen = null) {
  const drawer = document.getElementById('cart-drawer');
  if (forceOpen === true) {
    drawer.classList.remove('hidden');
  } else if (forceOpen === false) {
    drawer.classList.add('hidden');
  } else {
    drawer.classList.toggle('hidden');
  }
}

function updateCartUI() {
  const count = cart.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = cart.reduce((sum, it) => sum + it.subtotal, 0);

  document.getElementById('cart-counter').innerText = count;
  document.getElementById('tma-cart-count').innerText = count;
  document.getElementById('tma-cart-total').innerText = `$${subtotal.toFixed(2)}`;

  const isDelivery = currentOrderType === 'delivery';
  const deliveryFee = isDelivery ? 2.00 : 0.00;
  const grandTotal = subtotal + deliveryFee;

  document.getElementById('cart-subtotal').innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById('cart-delivery').innerText = `$${deliveryFee.toFixed(2)}`;
  document.getElementById('cart-grandtotal').innerText = `$${grandTotal.toFixed(2)}`;
  document.getElementById('btn-total-badge').innerText = `($${grandTotal.toFixed(2)})`;

  const list = document.getElementById('cart-items-list');
  if (cart.length === 0) {
    list.innerHTML = `
      <div class="text-center py-10 text-slate-400 space-y-2">
        <div class="text-2xl">🧺</div>
        <p>Your order basket is empty.</p>
        <p class="text-[10px]">Add delicious drinks or pastries from our menu!</p>
      </div>
    `;
    document.getElementById('checkout-btn').disabled = true;
    document.getElementById('checkout-btn').classList.add('opacity-50', 'cursor-not-allowed');
    return;
  }

  document.getElementById('checkout-btn').disabled = false;
  document.getElementById('checkout-btn').classList.remove('opacity-50', 'cursor-not-allowed');

  list.innerHTML = cart.map((item, idx) => {
    const opts = Object.entries(item.selectedOptions || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    return `
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div class="flex items-start justify-between">
          <div>
            <h5 class="font-bold text-slate-900">${item.name}</h5>
            ${opts ? `<p class="text-[10px] text-slate-500 italic">${opts}</p>` : ''}
          </div>
          <span class="font-bold text-amber-600 font-mono">$${item.subtotal.toFixed(2)}</span>
        </div>
        <div class="flex items-center justify-between pt-1">
          <span class="text-[11px] text-slate-400">$${item.price.toFixed(2)} each</span>
          <div class="flex items-center gap-1.5">
            <button onclick="changeCartQty(${idx}, -1)" class="w-6 h-6 rounded bg-white border border-slate-200 font-bold text-slate-600 flex items-center justify-center shadow-xs">-</button>
            <span class="w-5 text-center font-bold">${item.quantity}</span>
            <button onclick="changeCartQty(${idx}, 1)" class="w-6 h-6 rounded bg-white border border-slate-200 font-bold text-slate-600 flex items-center justify-center shadow-xs">+</button>
            <button onclick="removeCartItem(${idx})" class="ml-2 text-slate-400 hover:text-red-600 text-xs">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function changeCartQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].subtotal = Number((cart[index].quantity * cart[index].price).toFixed(2));
  }
  updateCartUI();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function setOrderType(type) {
  currentOrderType = type;
  ['dine_in', 'takeaway', 'delivery'].forEach((t) => {
    const btn = document.getElementById(`type-${t}`);
    if (t === type) {
      btn.className = 'py-1.5 px-2 rounded-lg border font-medium text-center bg-amber-600 text-white border-amber-600';
    } else {
      btn.className = 'py-1.5 px-2 rounded-lg border font-medium text-center bg-white text-slate-700 border-slate-200';
    }
  });

  const label = document.getElementById('table-address-label');
  const input = document.getElementById('order-location');
  if (type === 'dine_in') {
    label.innerText = 'Table Number';
    input.placeholder = 'Table #04';
  } else if (type === 'takeaway') {
    label.innerText = 'Pickup Notes';
    input.placeholder = 'Pickup in 10 mins';
  } else {
    label.innerText = 'Delivery Address';
    input.placeholder = 'Street 51, BKK1, Phnom Penh';
  }

  updateCartUI();
}

async function submitOrderCheckout() {
  if (cart.length === 0) return;

  const btn = document.getElementById('checkout-btn');
  btn.disabled = true;
  btn.innerText = 'Processing Order...';

  try {
    const customerName = document.getElementById('order-customer-name').value || 'Sophea Kim';
    const customerTg = document.getElementById('order-customer-tg').value || '@sopheakim';
    const location = document.getElementById('order-location').value || 'Table #01';
    const note = document.getElementById('order-note').value || '';

    const payload = {
      storeSlug: currentStore.slug,
      orderType: currentOrderType,
      items: cart,
      note: note,
      idempotencyKey: `idemp-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      customer: {
        name: customerName,
        username: customerTg,
        telegramId: Number(document.getElementById('tma-user-id')?.value || 7812938),
        address: location,
        note: note
      }
    };

    const res = await fetch(`/api/tma/shop/${currentStore.slug}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result.status && result.data) {
      // Clear Cart
      cart = [];
      updateCartUI();
      toggleCartDrawer(false);

      // Show Confirmation Modal
      showOrderSuccess(result.data);
      loadOrders();
    } else {
      alert(`Order error: ${result.message || result.error || 'Failed to place order'}`);
    }
  } catch (err) {
    alert(`Order submission error: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerText = 'Place Order Now';
  }
}

function showOrderSuccess(order) {
  document.getElementById('success-ref').innerText = order.referenceNo;
  document.getElementById('success-store').innerText = order.store_name || currentStore.name;
  document.getElementById('success-tg-status').innerText = order.store_notification === 'Sent' ? 'Dispatched to Shop Channel' : 'Simulated Dispatch';
  
  if (order.dispatchInfo && order.dispatchInfo.messageText) {
    document.getElementById('success-tg-message').innerText = order.dispatchInfo.messageText.replace(/<[^>]*>/g, '');
  } else {
    document.getElementById('success-tg-message').innerText = `Order ${order.referenceNo} recorded for ${order.store_name}. Total: $${order.grandTotal}`;
  }

  document.getElementById('order-success-modal').classList.remove('hidden');
}

function closeSuccessModal() {
  document.getElementById('order-success-modal').classList.add('hidden');
}

// ==================== LIVE ORDERS & KITCHEN ====================

async function loadOrders() {
  try {
    const res = await fetch('/api/tma/orders');
    const data = await res.json();
    if (data.status && data.data) {
      liveOrders = data.data;
      renderOrdersStream();

      const badge = document.getElementById('order-badge');
      if (badge) {
        const pendingCount = liveOrders.filter((o) => o.status === 'Pending' || o.status === 'Preparing').length;
        if (pendingCount > 0) {
          badge.innerText = pendingCount;
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }
    }
  } catch (err) {
    console.error('Failed to load orders:', err);
  }
}

function renderOrdersStream() {
  const container = document.getElementById('orders-stream');
  if (!container) return;

  if (liveOrders.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
        No orders placed yet. Place an order from the Store Menu or Telegram App!
      </div>
    `;
    return;
  }

  container.innerHTML = liveOrders.map((order) => {
    const statusColors = {
      Pending: 'bg-amber-100 text-amber-800 border-amber-300',
      Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      Preparing: 'bg-purple-100 text-purple-800 border-purple-300',
      Ready: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      Completed: 'bg-slate-100 text-slate-800 border-slate-300',
      Cancelled: 'bg-red-100 text-red-800 border-red-300'
    };

    const nextStatusMap = {
      Pending: 'Confirmed',
      Confirmed: 'Preparing',
      Preparing: 'Ready',
      Ready: 'Completed'
    };

    const nextStatus = nextStatusMap[order.status];

    return `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900 text-sm font-mono">${order.referenceNo}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[order.status] || 'bg-slate-100'}">
                ${order.status}
              </span>
              <span class="text-slate-400">•</span>
              <span class="text-slate-600 font-semibold">${order.store_name}</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">${new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Telegram: ${order.store_notification}
            </span>
            ${order.store_notification === 'Failed' ? `
              <button onclick="retryTelegramNotification('${order.id}')" class="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 font-bold transition">
                Retry Alert
              </button>
            ` : ''}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Customer info -->
          <div class="space-y-1">
            <span class="text-[10px] font-bold uppercase text-slate-400">Customer</span>
            <p class="font-bold text-slate-800">${order.customer?.name || 'Telegram Guest'}</p>
            <p class="text-slate-500">${order.customer?.username || '@guest'}</p>
            <p class="text-slate-500">${order.customer?.address || 'Table #01'}</p>
            ${order.customer?.note ? `<p class="italic text-slate-600 mt-1">Note: "${order.customer.note}"</p>` : ''}
          </div>

          <!-- Items Breakdown -->
          <div class="space-y-1 md:col-span-2">
            <span class="text-[10px] font-bold uppercase text-slate-400">Items Ordered (${order.items?.length || 0})</span>
            <div class="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              ${(order.items || []).map((it) => {
                const optText = Object.entries(it.selectedOptions || {}).map(([k, v]) => `${k}: ${v}`).join(', ');
                return `
                  <div class="flex justify-between text-[11px]">
                    <div>
                      <strong class="text-slate-800">${it.quantity}x ${it.name}</strong>
                      ${optText ? `<span class="text-slate-400 block text-[10px]">(${optText})</span>` : ''}
                    </div>
                    <span class="font-mono text-slate-700">$${Number(it.subtotal).toFixed(2)}</span>
                  </div>
                `;
              }).join('')}
              <div class="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200 text-xs">
                <span>Grand Total:</span>
                <span class="text-amber-600 font-mono">$${Number(order.grandTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Kitchen Actions -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-100">
          <div class="text-[11px] text-slate-400">
            Dining: <strong class="uppercase text-slate-700">${order.orderType}</strong>
          </div>
          <div class="flex items-center gap-2">
            ${nextStatus ? `
              <button onclick="updateOrderStatus('${order.id}', '${nextStatus}')" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition active:scale-95">
                Mark as ${nextStatus} →
              </button>
            ` : `
              <span class="text-emerald-600 font-bold">✓ Order Fulfilled</span>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`/api/tma/orders/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.status) {
      loadOrders();
    }
  } catch (err) {
    alert(`Failed to update status: ${err.message}`);
  }
}

async function retryTelegramNotification(orderId) {
  try {
    const res = await fetch(`/api/tma/orders/${orderId}/retry-notification`, {
      method: 'POST'
    });
    const data = await res.json();
    if (data.status) {
      alert(`Notification retried: ${data.notification_status}`);
      loadOrders();
    }
  } catch (err) {
    alert(`Failed to retry notification: ${err.message}`);
  }
}

// ==================== TMA SIMULATOR ====================

function renderTmaSimulator() {
  const container = document.getElementById('tma-products-list');
  if (!container) return;

  container.innerHTML = currentProducts.slice(0, 4).map((prod) => `
    <div class="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-xs">
      <div class="flex items-center gap-2 overflow-hidden">
        <img src="${prod.image}" alt="${prod.name}" class="w-10 h-10 rounded-lg object-cover flex-shrink-0">
        <div class="overflow-hidden">
          <p class="font-bold text-slate-900 truncate text-[11px]">${prod.name}</p>
          <p class="text-[10px] text-amber-600 font-bold">$${Number(prod.price).toFixed(2)}</p>
        </div>
      </div>
      <button onclick="openProductModal(${prod.id})" class="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] flex-shrink-0">
        + Add
      </button>
    </div>
  `).join('');
}

function syncTmaUser() {
  const name = document.getElementById('tma-full-name').value;
  const username = document.getElementById('tma-username').value;
  const greeting = document.getElementById('tma-user-greeting');
  if (greeting) greeting.innerText = `Hello, ${name} 👋`;

  document.getElementById('order-customer-name').value = name;
  document.getElementById('order-customer-tg').value = username;

  alert('Telegram user context synchronized!');
}

// ==================== CMS CONTENT ====================

async function loadCmsContent() {
  try {
    const res = await fetch('/api/cms/all');
    const json = await res.json();
    if (json.status && json.data) {
      const data = json.data;

      // Hero
      if (data.heroSlides && data.heroSlides[0]) {
        const slide = data.heroSlides[0];
        document.getElementById('cms-hero-badge').innerText = slide.badge_en;
        document.getElementById('cms-hero-title').innerText = slide.title_en;
        document.getElementById('cms-hero-subtitle').innerText = slide.subtitle_en;
        document.getElementById('cms-hero').style.backgroundImage = `linear-gradient(to right, rgba(2,6,23,0.95), rgba(2,6,23,0.7)), url('${slide.image_url}')`;
        document.getElementById('cms-hero').style.backgroundSize = 'cover';
      }

      // Team
      if (data.teamMembers) {
        document.getElementById('team-grid').innerHTML = data.teamMembers.map((m) => `
          <div class="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
            <img src="${m.photo_url}" alt="${m.name}" class="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-amber-500/20 shadow-sm">
            <div>
              <h4 class="font-bold text-slate-900 text-sm">${m.name}</h4>
              <p class="text-[11px] text-amber-600 font-semibold">${m.position_en}</p>
            </div>
            <p class="text-[11px] text-slate-500">${m.bio_en}</p>
          </div>
        `).join('');
      }

      // Testimonials
      if (data.testimonials) {
        document.getElementById('testimonials-grid').innerHTML = data.testimonials.map((t) => `
          <div class="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div class="flex items-center gap-3">
              <img src="${t.avatar_url}" alt="${t.author_name}" class="w-10 h-10 rounded-full object-cover">
              <div>
                <h5 class="font-bold text-slate-900 text-xs">${t.author_name}</h5>
                <p class="text-[10px] text-slate-400">${t.author_role_en}</p>
              </div>
              <div class="ml-auto text-amber-500 text-xs">★★★★★</div>
            </div>
            <p class="text-xs text-slate-600 italic">"${t.quote_en}"</p>
          </div>
        `).join('');
      }

      // FAQs
      if (data.faqs) {
        document.getElementById('faq-list').innerHTML = data.faqs.map((f) => `
          <div class="border border-slate-100 rounded-xl p-3 bg-slate-50">
            <h5 class="font-bold text-slate-800 text-xs">${f.question_en}</h5>
            <p class="text-slate-600 text-[11px] mt-1">${f.answer_en}</p>
          </div>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Failed to load CMS content:', err);
  }
}

async function submitInquiry(event) {
  event.preventDefault();
  const name = document.getElementById('inq-name').value;
  const email = document.getElementById('inq-email').value;
  const phone = document.getElementById('inq-phone').value;
  const subject = document.getElementById('inq-subject').value;
  const message = document.getElementById('inq-message').value;

  try {
    const res = await fetch('/api/cms/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, subject, message })
    });
    const data = await res.json();
    if (data.status) {
      document.getElementById('inq-status').classList.remove('hidden');
      event.target.reset();
      setTimeout(() => document.getElementById('inq-status').classList.add('hidden'), 4000);
    }
  } catch (err) {
    alert(`Inquiry error: ${err.message}`);
  }
}

// ==================== API DIAGNOSTICS ====================

async function testApi(endpoint, method = 'GET') {
  const consoleEl = document.getElementById('api-console');
  const labelEl = document.getElementById('api-test-label');
  const statusEl = document.getElementById('api-test-status');

  labelEl.innerText = `${method} ${endpoint}`;
  consoleEl.innerText = 'Executing request...';
  statusEl.innerText = 'Loading...';
  statusEl.className = 'text-amber-500 font-mono';

  const start = performance.now();
  try {
    const res = await fetch(endpoint, { method });
    const json = await res.json();
    const duration = Math.round(performance.now() - start);

    statusEl.innerText = `${res.status} ${res.statusText} (${duration}ms)`;
    statusEl.className = res.ok ? 'text-emerald-500 font-mono' : 'text-red-500 font-mono';
    consoleEl.innerText = JSON.stringify(json, null, 2);
  } catch (err) {
    statusEl.innerText = 'Error';
    statusEl.className = 'text-red-500 font-mono';
    consoleEl.innerText = String(err);
  }
}
