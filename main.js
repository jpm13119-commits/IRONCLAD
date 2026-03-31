/* ===================================================
   IRONCLAD — main.js
   Handles: Products, Cart, Filters, Nav, Toast, UI
   =================================================== */

// ───────── PRODUCT DATA ─────────
const PRODUCTS = [
  {
    id: 1, category: 'belts',
    name: 'Titan Power Belt',
    desc: '10mm single-prong lever belt. IPF-approved leather with steel hardware.',
    price: 89.99, emoji: '🏋️', badge: 'Best Seller'
  },
  {
    id: 2, category: 'belts',
    name: 'Operator Lever Belt',
    desc: 'Quick-release lever system. 13mm thickness for maximum core support.',
    price: 119.99, emoji: '⚫', badge: null
  },
  {
    id: 3, category: 'straps',
    name: 'Deadlift Straps Pro',
    desc: 'Cotton/nylon blend. 24" loop straps with anti-slip neoprene padding.',
    price: 24.99, emoji: '🪢', badge: 'New'
  },
  {
    id: 4, category: 'straps',
    name: 'Figure-8 Straps',
    desc: 'Eliminates grip failure entirely. Perfect for max pulls.',
    price: 34.99, emoji: '∞', badge: null
  },
  {
    id: 5, category: 'gloves',
    name: 'Iron Grip Gloves',
    desc: 'Full-palm leather with wrist wrap support. No slipping.',
    price: 39.99, emoji: '🥊', badge: null
  },
  {
    id: 6, category: 'gloves',
    name: 'Tactical Half Gloves',
    desc: 'Open-finger design with silicone grip zones and arch support.',
    price: 29.99, emoji: '✋', badge: null
  },
  {
    id: 7, category: 'accessories',
    name: 'Wrist Wraps 24"',
    desc: 'Competition-grade thumb loop wraps. Stiff support for max lifts.',
    price: 19.99, emoji: '🩹', badge: 'Top Rated'
  },
  {
    id: 8, category: 'accessories',
    name: 'Knee Sleeves (pair)',
    desc: '7mm neoprene compression. Warmth and stability on every squat.',
    price: 49.99, emoji: '🦵', badge: null
  },
  {
    id: 9, category: 'accessories',
    name: 'Gym Chalk Block',
    desc: '2lb magnesium carbonate block. Maximum grip, minimum mess.',
    price: 14.99, emoji: '🧊', badge: null
  },
  {
    id: 10, category: 'accessories',
    name: 'Shaker Bottle',
    desc: 'BPA-free 28oz with stainless steel BlenderBall. Ironclad edition.',
    price: 17.99, emoji: '🥛', badge: null
  }
];

// ───────── STATE ─────────
let cart = JSON.parse(localStorage.getItem('ironcladCart') || '[]');
let activeFilter = 'all';

// ───────── DOM REFS ─────────
const productsGrid  = document.getElementById('productsGrid');
const cartDrawer    = document.getElementById('cartDrawer');
const cartOverlay   = document.getElementById('cartOverlay');
const cartBtn       = document.getElementById('cartBtn');
const cartClose     = document.getElementById('cartClose');
const cartItemsEl   = document.getElementById('cartItems');
const cartFooterEl  = document.getElementById('cartFooter');
const cartCountEl   = document.getElementById('cartCount');
const cartTotalEl   = document.getElementById('cartTotal');
const navbar        = document.getElementById('navbar');
const hamburger     = document.getElementById('hamburger');
const navLinks      = document.getElementById('navLinks');
const toast         = document.getElementById('toast');
const filterBtns    = document.querySelectorAll('.filter-btn');

// ───────── RENDER PRODUCTS ─────────
function renderProducts(filter = 'all') {
  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  productsGrid.innerHTML = '';

  if (filtered.length === 0) {
    productsGrid.innerHTML = '<p style="color:var(--gray-3);text-align:center;grid-column:1/-1;padding:40px 0">No products found.</p>';
    return;
  }

  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 0.07}s`;
    card.dataset.category = p.category;
    card.innerHTML = `
      <div class="product-img">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <span style="position:relative;z-index:1;font-size:3.5rem">${p.emoji}</span>
      </div>
      <div class="product-body">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button class="add-to-cart" data-id="${p.id}" aria-label="Add ${p.name} to cart">
            Add to Cart
          </button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  // Attach add-to-cart events
  productsGrid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
}

// ───────── CART FUNCTIONS ─────────
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else { saveCart(); updateCartUI(); }
}

function saveCart() {
  localStorage.setItem('ironcladCart', JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
  // Count badge
  const count = getCartItemCount();
  cartCountEl.textContent = count;
  cartCountEl.style.display = count === 0 ? 'none' : 'flex';

  // Items list
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty. Time to gear up.</p>';
    cartFooterEl.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-icon">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)" aria-label="Decrease">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)" aria-label="Increase">+</button>
            <span class="remove-item" onclick="removeFromCart(${item.id})">Remove</span>
          </div>
        </div>
      </div>
    `).join('');
    cartFooterEl.style.display = 'block';
    cartTotalEl.textContent = `$${getCartTotal().toFixed(2)}`;
  }
}

// ───────── CART DRAWER TOGGLE ─────────
function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ───────── FILTER TABS ─────────
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts(activeFilter);
  });
});

// ───────── NAVBAR SCROLL ─────────
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ───────── MOBILE MENU ─────────
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ───────── SMOOTH SCROLL FOR ANCHOR LINKS ─────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ───────── TOAST ─────────
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ───────── NEWSLETTER ─────────
function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const msgEl = document.getElementById('newsletterMsg');
  if (!input.value) return;

  msgEl.textContent = '✓ You\'re in! Welcome to the Ironclad Army.';
  msgEl.style.color = 'var(--silver)';
  input.value = '';

  setTimeout(() => { msgEl.textContent = ''; }, 5000);
}

// ───────── INTERSECTION OBSERVER (fade-in on scroll) ─────────
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

function observeElements() {
  document.querySelectorAll('.feature-item, .about-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ───────── INIT ─────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  observeElements();
});
