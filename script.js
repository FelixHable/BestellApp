let cart = [];
const DELIVERY_FEE = 4.99;

function addToCart(title, price) {
  const item = cart.find(i => i.title === title);
  if (item) {
    item.qty++;
  } else {
    cart.push({ title: title, price: price, qty: 1 });
  }
  renderBasket();
}

function changeQty(title, delta) {
  const item = cart.find(i => i.title === title);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.title !== title);
  }
  renderBasket();
}

function formatPrice(val) {
  return val.toFixed(2).replace('.', ',') + '€';
}

function renderBasket() {
  const container = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const deliveryEl = document.getElementById("delivery-fee");
  const totalEl = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (cart.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #ccc; font-size: 13px; padding: 15px 0;">Your basket is empty.</p>`;
    subtotalEl.textContent = "0,00€";
    deliveryEl.textContent = "0,00€";
    totalEl.textContent = "0,00€";
    checkoutBtn.textContent = "Buy now (0,00€)";
    checkoutBtn.disabled = true;
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    return `
      <div class="basket-item">
        <div class="basket-item-title">${item.title}</div>
        <div class="basket-item-controls">
          <div>
            <button class="quantity-btn" onclick="changeQty('${item.title}', -1)">−</button>
            <span style="margin: 0 6px;">${item.qty}</span>
            <button class="quantity-btn" onclick="changeQty('${item.title}', 1)">+</button>
          </div>
          <span>${formatPrice(itemTotal)}</span>
        </div>
      </div>
    `;
  }).join("");

  const total = subtotal + DELIVERY_FEE;
  subtotalEl.textContent = formatPrice(subtotal);
  deliveryEl.textContent = formatPrice(DELIVERY_FEE);
  totalEl.textContent = formatPrice(total);
  checkoutBtn.textContent = `Buy now (${formatPrice(total)})`;
  checkoutBtn.disabled = false;
}

function checkout() {
  if (cart.length === 0) return;
  cart = [];
  renderBasket();
  document.getElementById("orderModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("orderModal").style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Close modal when clicking outside of it
document.addEventListener("DOMContentLoaded", () => {
  renderBasket();
  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.id === "orderModal") closeModal();
    });
  }
});