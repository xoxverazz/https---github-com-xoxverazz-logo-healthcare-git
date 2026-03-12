/* ShopEZ Premium Store JS — Varma Jewellers */
'use strict';

// ── Data ──────────────────────────────────────────────────────────────────────
const SHOP_ID = 1;
const WA_NUMBER = '9130705971';
const SHOP_NAME = 'Varma Jewellers';
const PRODUCTS_DATA = [{"id": 7, "name": "Gold Necklace", "price": 91990.0, "cat": "none", "img": "http://localhost:5000/api/upload/files/83ac63cec3334bf79f0955240248d2e9.png"}];

// ── State ─────────────────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('cart_' + SHOP_ID) || '[]');
let activeCat = 'all';
let searchQ = '';

// ── Page Loader ───────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('page-loader')?.classList.add('hidden'), 500);
});

// ── AOS (scroll animations) ───────────────────────────────────────────────────
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-animate'); } });
}, { threshold: 0.12 });
document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

// ── Navbar scroll ─────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 40);
  const st = document.getElementById('scrollTop');
  if (st) st.classList.toggle('visible', window.scrollY > 400);
});

// ── Mobile menu ───────────────────────────────────────────────────────────────
function toggleMenu() {
  document.getElementById('navLinks')?.classList.toggle('open');
}

// ── Image swap (thumbnail) ────────────────────────────────────────────────────
function swapImg(thumb, defaultSrc) {
  const card = thumb.closest('.product-card');
  if (!card) return;
  const mainId = card.dataset.id;
  const mainImg = document.getElementById('prod-img-' + mainId);
  if (mainImg) mainImg.src = thumb.src;
  card.querySelectorAll('.thumb').forEach(t => t.style.opacity = '0.6');
  thumb.style.opacity = '1';
}

// ── Cart ──────────────────────────────────────────────────────────────────────
function saveCart() { localStorage.setItem('cart_' + SHOP_ID, JSON.stringify(cart)); }

function addToCart(id, name, price, img) {
  id = parseInt(id);
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) { cart[idx].qty++; }
  else { cart.push({ id, name, price, img, qty: 1 }); }
  saveCart();
  renderCart();
  showToast('🛒 ' + name + ' added!', 'success');
  animCartBtn();
}

function animCartBtn() {
  const btn = document.getElementById('cartBtn');
  if (!btn) return;
  btn.style.transform = 'scale(1.2)';
  setTimeout(() => btn.style.transform = '', 200);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); renderCart();
}

function changeQty(id, delta) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart(); renderCart();
}

function renderCart() {
  const badge = document.getElementById('cartBadge');
  const body  = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalAmt = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (badge) badge.textContent = totalQty;

  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty">🛒<p style="margin-top:16px;font-weight:600">Your cart is empty</p><p style="font-size:.83rem;color:#9ca3af;margin-top:6px">Start adding some products!</p></div>';
    if (footer) footer.style.display = 'none';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img || 'https://placehold.co/60x60/f3f4f6/9ca3af?text=No+Img'}" class="cart-item-img" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove">✕</button>
        </div>
      </div>
    </div>`).join('');

  if (footer) { footer.style.display = 'block'; }
  if (totalEl) { totalEl.textContent = '₹' + totalAmt.toFixed(2); }

  // WhatsApp checkout button
  if (WA_NUMBER) {
    const waBtn = document.getElementById('waCheckout');
    if (waBtn) {
      const msg = 'Hi! I want to order from ' + SHOP_NAME + ':\n' +
        cart.map(i => i.name + ' x' + i.qty + ' = ₹' + (i.price*i.qty).toFixed(2)).join('\n') +
        '\nTotal: ₹' + totalAmt.toFixed(2);
      waBtn.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    }
  }
}

function toggleCart() {
  document.getElementById('cartDrawer')?.classList.toggle('open');
  document.getElementById('cartOverlay')?.classList.toggle('active');
}

// ── Quick View ────────────────────────────────────────────────────────────────
function openQuickView(id) {
  const card = document.querySelector(`.product-card[data-id="${id}"]`);
  if (!card) return;
  const name = card.dataset.name;
  const price = card.dataset.price;
  const img = card.querySelector('.product-img')?.src || '';
  const desc = card.querySelector('.product-desc')?.textContent || '';

  document.getElementById('quickViewBody').innerHTML = `
    <div class="qv-grid">
      <img src="${img}" class="qv-img" alt="${name}" />
      <div>
        <h3 class="qv-name">${card.querySelector('.product-name')?.textContent || name}</h3>
        <p class="qv-desc">${desc}</p>
        <div class="qv-price">₹${parseFloat(price).toFixed(2)}</div>
        <button class="btn-add-cart" onclick="addToCart(${id},'${card.querySelector('.product-name')?.textContent.replace(/'/g,\"'\")||name}',${price},'${img}');closeQuickView()">
          🛒 Add to Cart
        </button>
      </div>
    </div>`;
  document.getElementById('quickViewModal')?.classList.add('open');
  document.getElementById('qvOverlay')?.classList.add('active');
}

function closeQuickView() {
  document.getElementById('quickViewModal')?.classList.remove('open');
  document.getElementById('qvOverlay')?.classList.remove('active');
}

// ── Checkout ──────────────────────────────────────────────────────────────────
function openCheckout() {
  if (!cart.length) { showToast('Cart is empty!', 'error'); return; }
  toggleCart();
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('orderSummary').innerHTML =
    `<div class="order-summary">` +
    cart.map(i=>`<div class="order-summary-item"><span>${i.name} x${i.qty}</span><span>₹${(i.price*i.qty).toFixed(2)}</span></div>`).join('') +
    `<div class="order-summary-total"><span>Total</span><span>₹${total.toFixed(2)}</span></div></div>`;
  document.getElementById('checkoutModal')?.classList.add('open');
  document.getElementById('coOverlay')?.classList.add('active');
}

function closeCheckout() {
  document.getElementById('checkoutModal')?.classList.remove('open');
  document.getElementById('coOverlay')?.classList.remove('active');
}

function submitOrder(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());

  const items = cart.map(i=>({'product_id':i.id,'quantity':i.qty}));
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  data.shop_id = SHOP_ID;
  data.items = items;

  const btn = e.target.querySelector('.btn-place-order');
  if (btn) { btn.textContent='Placing order...'; btn.disabled=true; }

  fetch('/api/orders', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(data)
  }).then(r=>r.json()).then(res=>{
    if (res.order_number) {
      showToast('🎉 Order placed! #'+res.order_number,'success');
      cart = [];
      saveCart(); renderCart();
      closeCheckout();
      if (btn) { btn.textContent='Place Order'; btn.disabled=false; }
      e.target.reset();
    } else {
      showToast(res.error||'Order failed','error');
      if (btn) { btn.textContent='🎉 Place Order'; btn.disabled=false; }
    }
  }).catch(()=>{
    showToast('Network error. Try WhatsApp instead.','error');
    if (btn) { btn.textContent='🎉 Place Order'; btn.disabled=false; }
  });
}

// ── Filter & Search ───────────────────────────────────────────────────────────
function filterCat(cat, btn) {
  activeCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyFilters();
}

function searchProducts() {
  searchQ = (document.getElementById('searchInput')?.value || '').toLowerCase();
  applyFilters();
}

function applyFilters() {
  const cards = document.querySelectorAll('.product-card');
  let visible = 0;
  cards.forEach(card => {
    const matchCat = activeCat === 'all' || card.dataset.cat === activeCat;
    const matchSearch = !searchQ || card.dataset.name.includes(searchQ);
    const show = matchCat && matchSearch;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  const countEl = document.getElementById('productsCount');
  if (countEl) countEl.textContent = visible + ' product' + (visible !== 1 ? 's' : '');
}

function sortProducts() {
  const val = document.getElementById('sortSelect')?.value || 'default';
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.product-card'));
  cards.sort((a, b) => {
    const pa = parseFloat(a.dataset.price), pb = parseFloat(b.dataset.price);
    const na = a.dataset.name || '', nb = b.dataset.name || '';
    if (val === 'price-asc') return pa - pb;
    if (val === 'price-desc') return pb - pa;
    if (val === 'name-asc') return na.localeCompare(nb);
    return 0;
  });
  cards.forEach(c => grid.appendChild(c));
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg, type='') {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Init ──────────────────────────────────────────────────────────────────────
renderCart();
applyFilters();
