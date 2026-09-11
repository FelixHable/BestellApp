// ===== BurgerHouse — Vanilla JS Ordering App =====

const menuData = [
  {
    category: "Burger & Sandwiches",
    icon: "img/burgericon.png",
    items: [
      { id: 1, title: "Veggie mushroom black burger", price: 16.9, desc: "Mixed green salad, Tomatoes, Edamame, Mushrooms", img: "img/veggieblackmushroomburger.jpg" },
      { id: 2, title: "All meat burger", price: 15.9, desc: "Beef, Bacon, Dill pickles, Smoked cheese, Ketchup, BBQ souse", img: "img/allmeatburger.jpg" },
      { id: 3, title: "Beef red burger", price: 14.9, desc: "Beef, Cheese, Tomatoes, Lettuce, Onion", img: "img/beafredburger.jpg" },
      { id: 4, title: "Big chicken burger", price: 15.9, desc: "Chicken, Cheese, Tomatoes, Lettuce, Onion, Bell pepper", img: "img/bigchikenburger.jpg" }
    ]
  },
  {
    category: "Pizza (30cm)",
    icon: "img/pizzaicon.png",
    items: [
      { id: 5, title: "Pizza Margherita", price: 11.9, desc: "Tomato Sauce, Mozzarella", img: "img/pizzamagherita.jpg" },
      { id: 6, title: "Pizza Chorizo", price: 13.9, desc: "Tomato slices, Mozzarella, Chorizo", img: "img/pizzachorizo.jpg" },
      { id: 7, title: "Funghi", price: 12.9, desc: "Red onion, Olives, Button Mushrooms, Mozzarella", img: "img/funghi.jpg" },
      { id: 8, title: "Quattro Formaggi with Chicken", price: 15.9, desc: "Chicken, Mozzarella, Gorgonzola, Fontina, Parmigiano Reggiano", img: "img/quattrofromaggiwithchiken.jpg" }
    ]
  },
  {
    category: "Salad",
    icon: "img/saladicon.png",
    items: [
      { id: 9, title: "Warm beef arugula salad", price: 16.9, desc: "Beef, Arugula, Field salad, Greek feta, Cherry tomatoes, Sun-dried Tomatoes, Balsamic-vinegar dressing", img: "img/warmbeefarugulasalad.jpg" },
      { id: 10, title: "Mini green Salad", price: 7.9, desc: "Green salad, Cucumber, Carrots, Parsley, Radishes", img: "img/minigreensalad.jpg" },
      { id: 11, title: "Green Salad with sea food", price: 16.9, desc: "Mixed greens, Cherry tomatoes, Red onion, Mussels, Squid rings, Shrimp, Dijon mustard-lemon dressing with dill", img: "img/greensalatwithseafood.jpg" },
      { id: 12, title: "Vegan green salad with tofu", price: 14.9, desc: "Green salad, Cherry tomatoes, Cucumber, Baby spinach, Edamame, Radishes, Bittercress, Tofu, Peanuts", img: "img/vegangreensaladwithtofu.jpg" }
    ]
  }
];

const restaurantInfo = {
  name: "BurgerHouse",
  rating: 4.1,
  reviews: 132,
  tagline: "The best of Burgers, Pizza, and Greens, all in one great place.",
  logo: "img/burgericonhead.png",
  hero: "img/Headerimg.jpg",
  deliveryFee: 4.99
};

// ===== State =====
let cart = loadCart();
const DELIVERY_FEE = restaurantInfo.deliveryFee;

function loadCart() {
  try { return JSON.parse(localStorage.getItem("burgerhouse_cart") || "[]"); }
  catch { return []; }
}
function saveCart() { localStorage.setItem("burgerhouse_cart", JSON.stringify(cart)); }

// ===== Helpers =====
function formatPrice(value) {
  return value.toFixed(2).replace(".", ",") + "€";
}
function getQty(id) {
  const item = cart.find(i => i.id === id);
  return item ? item.qty : 0;
}
function subtotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}
function total() {
  return cart.length ? subtotal() + DELIVERY_FEE : 0;
}
function itemCount() {
  return cart.reduce((n, i) => n + i.qty, 0);
}

// ===== Cart Actions =====
function addToCart(item) {
  const existing = cart.find(i => i.id === item.id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  saveCart();
  renderAll();
}
function incQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) { item.qty++; saveCart(); renderAll(); }
}
function decQty(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty--;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  renderAll();
}
function clearCart() {
  cart = [];
  saveCart();
  renderAll();
}

// ===== Render Hero =====
function renderHero() {
  document.getElementById("heroImg").src = restaurantInfo.hero;
  document.getElementById("logoImg").src = restaurantInfo.logo;
  document.getElementById("ratingValue").textContent = restaurantInfo.rating;
  document.getElementById("ratingCount").textContent = `(${restaurantInfo.reviews})`;
  document.getElementById("tagline").textContent = restaurantInfo.tagline;
}

// ===== Render Menu =====
function renderMenu() {
  const menuEl = document.getElementById("menu");
  menuEl.innerHTML = menuData.map(cat => `
    <section class="category">
      <div class="category__icon-wrap">
        <div class="category__icon"><img src="${cat.icon}" alt="${cat.category}" /></div>
      </div>
      <div class="category__title">${cat.category}</div>
    </section>
    <div class="category__items">
      ${cat.items.map(item => renderCard(item)).join("")}
    </div>
  `).join("");
}

function renderCard(item) {
  const qty = getQty(item.id);
  const mediaContent = qty === 0
    ? `<button class="card__add" data-action="add" data-id="${item.id}">+ Add to basket</button>`
    : `<div class="stepper">
         <button data-action="dec" data-id="${item.id}">−</button>
         <span class="stepper__count">${qty}</span>
         <button data-action="inc" data-id="${item.id}">+</button>
       </div>`;
  return `
    <div class="card">
      <div class="card__body">
        <h3 class="card__title">${item.title}</h3>
        <p class="card__desc">${item.desc}</p>
        <div class="card__price">${formatPrice(item.price)}</div>
      </div>
      <div class="card__media">
        <img class="card__img" src="${item.img}" alt="${item.title}" />
        ${mediaContent}
      </div>
    </div>`;
}

// ===== Render Basket =====
function renderBasket() {
  const sidebar = document.getElementById("basketSidebar");
  if (sidebar) sidebar.innerHTML = basketHTML();
  
  const overlayInner = document.getElementById("basketOverlayInner");
  if (overlayInner) {
    overlayInner.innerHTML = `
      <div class="overlay__header">
        <h2 class="basket__title">Your Basket</h2>
        <button class="overlay__close" data-action="closeOverlay">✕</button>
      </div>
      ${basketHTML(true)}
    `;
  }
}

function basketHTML(isOverlay = false) {
  const itemsHTML = cart.length === 0
    ? `<p class="basket__empty">Your basket is empty.</p>`
    : `<div class="basket__list">
        ${cart.map(item => `
          <div class="basket-item">
            <div class="basket-item__title">${item.qty}x ${item.title}</div>
            <div class="basket-item__controls">
              <div class="basket-item__stepper">
                <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
                <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
              </div>
              <div class="basket-item__price">${formatPrice(item.price * item.qty)}</div>
            </div>
          </div>`).join("")}
      </div>`;

  return `
    <div class="basket">
      ${!isOverlay ? `<h2 class="basket__title">Your Basket</h2>` : ""}
      ${itemsHTML}
      <div class="basket__summary">
        <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal())}</span></div>
        <div class="summary-row"><span>Delivery fee</span><span>${cart.length > 0 ? formatPrice(DELIVERY_FEE) : '0,00€'}</span></div>
        <div class="summary-row summary-row--total"><span>Total</span><span>${formatPrice(total())}</span></div>
      </div>
      <button class="basket__checkout" data-action="checkout" ${cart.length === 0 ? "disabled" : ""}>
        BUY NOW (${formatPrice(total())})
      </button>
    </div>`;
}

// ===== Render Bottom Bar Badge =====
function renderNavBadge() {
  const badge = document.getElementById("navCartBadge");
  const count = itemCount();
  if (!badge) return;
  if (count > 0) {
    badge.hidden = false;
    badge.textContent = count;
  } else {
    badge.hidden = true;
  }
}

// ===== Overlay & Modal Toggles =====
function openOverlay() { document.getElementById("basketOverlay").hidden = false; }
function closeOverlay() { document.getElementById("basketOverlay").hidden = true; }

function checkout() {
  if (cart.length === 0) return;
  clearCart();
  closeOverlay();
  document.getElementById("orderModal").hidden = false;
}

function closeModal() {
  document.getElementById("orderModal").hidden = true;
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Return smoothly to menu view
}

// ===== Event Listeners =====
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = parseInt(btn.dataset.id, 10);
  const item = findItem(id);

  switch (action) {
    case "add": if (item) addToCart(item); break;
    case "inc": incQty(id); break;
    case "dec": decQty(id); break;
    case "checkout": checkout(); break;
    case "closeOverlay": closeOverlay(); break;
  }
});

// Click outside background overlay to close
document.getElementById("basketOverlay")?.addEventListener("click", (e) => {
  if (e.target.id === "basketOverlay") closeOverlay();
});
document.getElementById("orderModal")?.addEventListener("click", (e) => {
  if (e.target.id === "orderModal") closeModal();
});

document.getElementById("navBasketBtn")?.addEventListener("click", openOverlay);
document.getElementById("modalClose")?.addEventListener("click", closeModal);

function findItem(id) {
  for (const cat of menuData) {
    const found = cat.items.find(i => i.id === id);
    if (found) return found;
  }
  return null;
}

// ===== Render All =====
function renderAll() {
  renderMenu();
  renderBasket();
  renderNavBadge();
}

// ===== Init =====
renderHero();
renderAll();