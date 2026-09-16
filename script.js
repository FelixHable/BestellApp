// Global Variables & Constants
const DELIVERY_FEE = 4.99;
let cart = [];

const MENU_DATA = [
  {
    category: "Burger & Sandwiches",
    icon: "img/burgericon.png",
    items: [
      { id: "b1", title: "Veggie mushroom black burger", price: 16.90, img: "img/veggieblackmushroomburger.jpg", ingredients: "Mixed green salad, Tomatoes, Edamame, Mushrooms" },
      { id: "b2", title: "All meat burger", price: 15.90, img: "img/allmeatburger.jpg", ingredients: "Beef, Bacon, Dill pickles, Smoked cheese, Ketchup, BBQ souse" },
      { id: "b3", title: "Beef red burger", price: 14.90, img: "img/beafredburger.jpg", ingredients: "Beef, Cheese, Tomatoes, Lettuce, Onion" },
      { id: "b4", title: "Big chicken burger", price: 15.90, img: "img/bigchikenburger.jpg", ingredients: "Chicken, Cheese, Tomatoes, Lettuce, Onion, Bell pepper" }
    ]
  },
  {
    category: "Pizza (30cm)",
    icon: "img/pizzaicon.png",
    items: [
      { id: "p1", title: "Pizza Margherita", price: 11.90, img: "img/pizzamagherita.jpg", ingredients: "Tomato Sauce, Mozzarella" },
      { id: "p2", title: "Pizza Chorizo", price: 13.90, img: "img/pizzachorizo.jpg", ingredients: "Tomato slices, Mozzarella, Chorizo" },
      { id: "p3", title: "Funghi", price: 12.90, img: "img/funghi.jpg", ingredients: "Red onion, Olives, Button Mushrooms, Mozzarella" },
      { id: "p4", title: "Quattro Formaggi with Chicken", price: 15.90, img: "img/quattrofromaggiwithchiken.jpg", ingredients: "Chicken, Mozzarella, Gorgonzola, Fontina, Parmigiano Reggiano" }
    ]
  },
  {
    category: "Salad",
    icon: "img/saladicon.png",
    items: [
      { id: "s1", title: "Warm beef arugula salad", price: 16.90, img: "img/warmbeefarugulasalad.jpg", ingredients: "Beef, Arugula, Field salad, Greek feta, Cherry tomatoes, Sun-dried Tomatoes, Balsamic-vinegar dressing" },
      { id: "s2", title: "Mini green Salad", price: 7.90, img: "img/minigreensalad.jpg", ingredients: "Green salad, Cucumber, Carrots, Parsley, Radishes" },
      { id: "s3", title: "Green Salad with sea food", price: 16.90, img: "img/greensalatwithseafood.jpg", ingredients: "Mixed greens, Cherry tomatoes, Red onion, Mussels, Squid rings, Shrimp, Dijon mustard-lemon dressing with dill" },
      { id: "s4", title: "Vegan green salad with tofu", price: 14.90, img: "img/vegangreensaladwithtofu.jpg", ingredients: "Green salad, Cherry tomatoes, Cucumber, Baby spinach, Edamame, Radishes, Bittercress, Tofu, Peanuts" }
    ]
  }
];

// Helper & Formatters
function formatPrice(val) {
  return val.toFixed(2).replace('.', ',') + '€';
}

function findMenuItemById(id) {
  for (const cat of MENU_DATA) {
    const item = cat.items.find(i => i.id === id);
    if (item) return item;
  }
  return null;
}

function getCategoryHeaderTemplate(category) {
  return `
    <div class="category-header-wrapper">
      <div class="category-header-content">
        <span class="cat-icon"><img src="${category.icon}" alt="${category.category}"></span>
        <span class="cat-title">${category.category}</span>
      </div>
    </div>
  `;
}

function getMenuItemTemplate(item) {
  return `
    <div class="menu-card">
      <img src="${item.img}" alt="${item.title}">
      <div class="card-details">
        <div class="card-title-row">
          <h3>${item.title}</h3>
          <span class="price">${formatPrice(item.price)}</span>
        </div>
        <p class="ingredients">${item.ingredients}</p>
        <button class="add-btn" onclick="addToCart('${item.id}')">+ Add to basket</button>
      </div>
    </div>
  `;
}

function getCartItemTemplate(item) {
  const itemTotal = item.price * item.qty;
  return `
    <div class="basket-item">
      <div class="basket-item-title">${item.title}</div>
      <div class="basket-item-controls">
        <div>
          <button class="quantity-btn" onclick="changeQty('${item.id}', -1)">−</button>
          <span style="margin: 0 6px;">${item.qty}</span>
          <button class="quantity-btn" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
        <span>${formatPrice(itemTotal)}</span>
      </div>
    </div>
  `;
}

// Dynamic Rendering Functions
function renderMenu() {
  const menuContainer = document.getElementById("menu-section");
  if (!menuContainer) return;

  let html = "";
  MENU_DATA.forEach(cat => {
    html += getCategoryHeaderTemplate(cat);
    html += `<div class="menu-list">`;
    cat.items.forEach(item => {
      html += getMenuItemTemplate(item);
    });
    html += `</div>`;
  });
  menuContainer.innerHTML = html;
}

function renderBasketTotals(subtotal) {
  const total = subtotal + DELIVERY_FEE;
  document.getElementById("subtotal").textContent = formatPrice(subtotal);
  document.getElementById("delivery-fee").textContent = formatPrice(DELIVERY_FEE);
  document.getElementById("total-price").textContent = formatPrice(total);
  document.getElementById("checkout-btn").textContent = `Buy now (${formatPrice(total)})`;
}

function updateBadge(totalItems) {
  const badge = document.getElementById("nav-badge");
  if (!badge) return;
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "flex" : "none";
}

function renderBasket() {
  const emptyEl = document.getElementById("cart-empty");
  const contentEl = document.getElementById("cart-content");
  const container = document.getElementById("cart-items");
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  updateBadge(totalItems);

  if (cart.length === 0) {
    emptyEl.style.display = "flex";
    contentEl.style.display = "none";
    return;
  }

  emptyEl.style.display = "none";
  contentEl.style.display = "flex";

  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    subtotal += item.price * item.qty;
    return getCartItemTemplate(item);
  }).join("");

  renderBasketTotals(subtotal);
}

// Cart Actions
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    const menuItem = findMenuItemById(id);
    if (menuItem) {
      cart.push({ id: menuItem.id, title: menuItem.title, price: menuItem.price, qty: 1 });
    }
  }
  renderBasket();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  renderBasket();
}

// UI Interactions & Modals
function toggleMobileBasket(open) {
  const basket = document.getElementById("basketSidebar");
  const backdrop = document.getElementById("basketBackdrop");

  if (open) {
    basket.classList.add("open");
    backdrop.classList.add("open");
  } else {
    basket.classList.remove("open");
    backdrop.classList.remove("open");
  }
}

function checkout() {
  if (cart.length === 0) return;
  cart = [];
  renderBasket();
  toggleMobileBasket(false);
  document.getElementById("orderModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("orderModal").style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderBasket();
  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.id === "orderModal") closeModal();
    });
  }
});