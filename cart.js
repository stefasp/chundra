// cart.js — Chundra
// Manages cart state in localStorage.
// Each item in the cart is stored as { productId, quantity }.
// Quantities are capped at 1 (art pieces are unique).

const CART_KEY = 'chundra_cart';

const Cart = {
  // ── Read ──────────────────────────────────────────────────────
  getItems() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  },

  getCount() {
    return this.getItems().length;
  },

  hasItem(productId) {
    return this.getItems().some(item => item.productId === productId);
  },

  // ── Write ─────────────────────────────────────────────────────
  addItem(productId) {
    if (this.hasItem(productId)) return false; // already in cart
    const items = this.getItems();
    items.push({ productId });
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    this._notify();
    return true;
  },

  removeItem(productId) {
    const items = this.getItems().filter(i => i.productId !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    this._notify();
  },

  clear() {
    localStorage.removeItem(CART_KEY);
    this._notify();
  },

  // ── Derived ───────────────────────────────────────────────────
  getProducts() {
    // Returns full product objects for items in cart
    return this.getItems()
      .map(item => PRODUCTS[item.productId])
      .filter(Boolean);
  },

  getSubtotal() {
    return this.getProducts().reduce((sum, p) => {
      return sum + (p.priceSale ?? p.price);
    }, 0);
  },

  // ── Events ────────────────────────────────────────────────────
  _notify() {
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { count: this.getCount() }
    }));
  },
};
