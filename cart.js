// Simple cart stored in localStorage, shared across pages

function getCart() {
  return JSON.parse(localStorage.getItem('bakery_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('bakery_cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart(cart);
  showToast(`${name} added to cart`);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

function checkout() {
  saveCart([]);
  renderCart();
  const confirmEl = document.getElementById('order-confirm');
  if (confirmEl) {
    confirmEl.style.display = 'block';
    setTimeout(() => confirmEl.style.display = 'none', 4000);
  }
}

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const totalAmt = document.getElementById('total-amount');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearBtn = document.getElementById('clear-btn');

  if (!itemsEl) return; // not on order page

  const cart = getCart();

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p style="color:var(--muted);font-size:.9rem;">No items yet.</p>';
    if (totalEl) totalEl.style.display = 'none';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = cart.map(i =>
    `<div class="cart-item">
      <span>${i.name} × ${i.qty}</span>
      <span>$${(i.price * i.qty).toFixed(2)}</span>
    </div>`
  ).join('');

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  if (totalAmt) totalAmt.textContent = total.toFixed(2);
  if (totalEl) totalEl.style.display = 'block';
  if (checkoutBtn) checkoutBtn.style.display = 'block';
  if (clearBtn) clearBtn.style.display = 'block';
}

function showToast(msg) {
  const toast = document.getElementById('cart-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.add('hidden'), 2200);
}

// Init cart display on page load
document.addEventListener('DOMContentLoaded', renderCart);
