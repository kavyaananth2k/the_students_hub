/**
 * The Students Hub - Shop & Revision Resources System
 * E-commerce cart, catalogue filtering, search, and checkout flow
 */

const STUDY_PRODUCTS = [
  {
    id: 'prod-1',
    title: '11+ Ultimate Exam Pack (GL & CEM Format)',
    category: '11plus',
    badge: 'Best Seller',
    format: 'Physical + PDF Instant',
    price: 29.99,
    originalPrice: 39.99,
    rating: 5,
    reviews: 142,
    image: 'assets/images/study-packs.jpg',
    description: 'Full 11+ preparation suite containing 8 authentic mock exam papers (Maths, Verbal Reasoning, Non-Verbal Reasoning & English) with step-by-step parent mark schemes.',
  },
  {
    id: 'prod-2',
    title: 'GCSE Mathematics Higher (Grade 8/9 Accelerator)',
    category: 'gcse',
    badge: 'Popular',
    format: 'Workbook & Video Solutions',
    price: 24.99,
    originalPrice: 34.00,
    rating: 5,
    reviews: 98,
    image: 'assets/images/study-packs.jpg',
    description: 'Targeted high-difficulty algebraic reasoning, vector proofs, trigonometry, and calculus preparation with QR code video explanations by senior examiners.',
  },
  {
    id: 'prod-3',
    title: 'GCSE Triple Science Mastery Workbook Pack',
    category: 'gcse',
    badge: 'Comprehensive',
    format: '3 Spiral Books + Digital',
    price: 34.99,
    originalPrice: 48.00,
    rating: 5,
    reviews: 86,
    image: 'assets/images/study-packs.jpg',
    description: 'Complete syllabus revision for Biology, Chemistry, and Physics (AQA & Edexcel). Includes required practicals, equations cheat-sheets, and 1200+ practice questions.',
  },
  {
    id: 'prod-4',
    title: 'A-Level Pure & Applied Mathematics Blueprint',
    category: 'alevel',
    badge: 'A* Targeted',
    format: 'Physical Binder + Online Access',
    price: 32.50,
    originalPrice: 42.00,
    rating: 5,
    reviews: 64,
    image: 'assets/images/study-packs.jpg',
    description: 'Master differentiation, integration, mechanics, and hypothesis testing. Designed specifically for students aiming for Oxford, Cambridge, and Russell Group STEM courses.',
  },
  {
    id: 'prod-5',
    title: '11+ Vocabulary & Verbal Reasoning Flashcards',
    category: '11plus',
    badge: 'Essential',
    format: '500 Premium Cards Box',
    price: 18.99,
    originalPrice: 24.99,
    rating: 5,
    reviews: 115,
    image: 'assets/images/study-packs.jpg',
    description: '500 high-yield vocabulary cards with etymology, mnemonics, synonyms, antonyms, and grammar school exam contexts.',
  },
  {
    id: 'prod-6',
    title: 'Key Stage 2 SATS Accelerator Pack (Year 6)',
    category: 'primary',
    badge: 'National Curriculum',
    format: 'Study Book + Practice Papers',
    price: 19.99,
    originalPrice: 26.00,
    rating: 4.9,
    reviews: 73,
    image: 'assets/images/study-packs.jpg',
    description: 'Rigorous SATS preparation for Year 6 Arithmetic, Reasoning, and Reading Comprehension to secure Greater Depth standard.',
  },
  {
    id: 'prod-7',
    title: 'GCSE English Language & Literature Model Essays',
    category: 'gcse',
    badge: 'Grade 9 Exemplars',
    format: 'Curated Guide + Audio Breakdown',
    price: 22.00,
    originalPrice: 30.00,
    rating: 5,
    reviews: 57,
    image: 'assets/images/study-packs.jpg',
    description: 'Annotated Grade 9 exemplar responses for Shakespeare, 19th-century fiction, poetry anthology comparison, and unseen transactional writing.',
  },
  {
    id: 'prod-8',
    title: 'Junior Coding & Python Bootcamp Workbook',
    category: 'stem',
    badge: 'STEM Tech',
    format: 'Printed Lab Book + Code Repo',
    price: 26.50,
    originalPrice: 35.00,
    rating: 4.9,
    reviews: 41,
    image: 'assets/images/study-packs.jpg',
    description: 'Step-by-step project guide for young students learning Python programming, game development with Pygame, and beginner algorithms.',
  },
];

// Cart State Management
class HubCart {
  constructor() {
    this.storageKey = 'thestudentshub_cart_v1';
    this.items = this.loadCart();
    this.appliedDiscount = 0;
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      this.updateBadges();
    } catch (e) {
      console.error(e);
    }
  }

  addItem(productId) {
    const product = STUDY_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const existing = this.items.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    this.saveCart();
    this.renderDrawerItems();
    if (window.showHubToast) {
      window.showHubToast(`Added "${product.title}" to your study cart!`);
    }
  }

  updateQuantity(productId, delta) {
    const item = this.items.find((i) => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.saveCart();
    this.renderDrawerItems();
  }

  removeItem(productId) {
    this.items = this.items.filter((i) => i.id !== productId);
    this.saveCart();
    this.renderDrawerItems();
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateBadges() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getTotalCount();
    badges.forEach((b) => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  renderDrawerItems() {
    const container = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    if (!container || !subtotalEl) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <p style="font-weight: 700; color: var(--primary-900); margin-bottom: 0.25rem;">Your study basket is empty</p>
          <p style="font-size: 0.85rem;">Browse our 11+, GCSE, and A-Level revision packs to get started!</p>
        </div>
      `;
      subtotalEl.textContent = '£0.00';
      return;
    }

    let html = '';
    this.items.forEach((item) => {
      html += `
        <div class="cart-item-row" data-id="${item.id}">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.title}</div>
            <div class="cart-item-price">£${(item.price * item.quantity).toFixed(2)}</div>
            <div class="cart-item-controls">
              <button class="qty-btn" onclick="hubCart.updateQuantity('${item.id}', -1)">-</button>
              <span class="cart-item-qty">${item.quantity}</span>
              <button class="qty-btn" onclick="hubCart.updateQuantity('${item.id}', 1)">+</button>
              <button class="cart-remove-item" onclick="hubCart.removeItem('${item.id}')">Remove</button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    const subtotal = this.getSubtotal();
    subtotalEl.textContent = `£${subtotal.toFixed(2)}`;
  }
}

// Global Cart Instance
window.hubCart = new HubCart();

// Catalogue Renderer
function renderProductGrid(items) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
        <p style="font-size: 1.1rem; font-weight: 700; color: var(--primary-900);">No matching revision resources found.</p>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Try searching for "11+", "Maths", "Science", or select another category.</p>
      </div>
    `;
    return;
  }

  let html = '';
  items.forEach((prod) => {
    html += `
      <div class="product-card" data-category="${prod.category}">
        <div class="product-thumb-wrap">
          <img src="${prod.image}" alt="${prod.title}" loading="lazy">
          <span class="product-badge-float">${prod.badge}</span>
          <span class="product-type-pill">${prod.format}</span>
        </div>
        <div class="product-body">
          <div class="product-cat">${prod.category.toUpperCase()} PREPARATION</div>
          <h3 class="product-title">${prod.title}</h3>
          <p class="product-desc">${prod.description}</p>
          <div class="product-meta-row">
            <div class="product-price">
              <span class="original">£${prod.originalPrice.toFixed(2)}</span>
              £${prod.price.toFixed(2)}
            </div>
            <button class="btn btn-primary btn-sm" onclick="hubCart.addItem('${prod.id}')">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              Add to Basket
            </button>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// Initialise Shop Page Listeners
document.addEventListener('DOMContentLoaded', () => {
  window.hubCart.updateBadges();

  // Initial catalogue render if on shop page
  const productsGrid = document.getElementById('products-grid');
  if (productsGrid) {
    renderProductGrid(STUDY_PRODUCTS);

    // Category Filter Pills
    const catPills = document.querySelectorAll('.cat-pill');
    catPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        catPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const cat = pill.getAttribute('data-cat');
        if (cat === 'all') {
          renderProductGrid(STUDY_PRODUCTS);
        } else {
          const filtered = STUDY_PRODUCTS.filter((p) => p.category === cat);
          renderProductGrid(filtered);
        }
      });
    });

    // Instant Search Filter
    const searchInput = document.getElementById('shop-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const activeCatPill = document.querySelector('.cat-pill.active');
        const currentCat = activeCatPill ? activeCatPill.getAttribute('data-cat') : 'all';

        let filtered = STUDY_PRODUCTS;
        if (currentCat !== 'all') {
          filtered = filtered.filter((p) => p.category === currentCat);
        }

        if (query) {
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(query) ||
              p.description.toLowerCase().includes(query) ||
              p.category.toLowerCase().includes(query)
          );
        }

        renderProductGrid(filtered);
      });
    }
  }

  // Cart Drawer Open/Close Listeners
  const cartTriggers = document.querySelectorAll('.cart-button-trigger');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartCloseBtn = document.getElementById('cart-close-btn');

  function openCart() {
    if (cartDrawer && cartOverlay) {
      window.hubCart.renderDrawerItems();
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  cartTriggers.forEach((btn) => btn.addEventListener('click', openCart));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Simulated Checkout Modal
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutCloseBtn = document.getElementById('checkout-close-btn');
  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener('click', () => {
      if (window.hubCart.items.length === 0) {
        if (window.showHubToast) window.showHubToast('Your study basket is empty!');
        return;
      }
      closeCart();
      checkoutModal.classList.add('active');
    });
  }

  if (checkoutCloseBtn && checkoutModal) {
    checkoutCloseBtn.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentName = document.getElementById('chk-name').value;
      const email = document.getElementById('chk-email').value;

      checkoutModal.classList.remove('active');
      window.hubCart.items = [];
      window.hubCart.saveCart();

      if (window.showHubToast) {
        window.showHubToast(
          `🎉 Order confirmed for ${parentName}! Download links sent to ${email}.`
        );
      }
    });
  }
});
