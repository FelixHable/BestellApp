let cart = [];
const deliveryFee = 4.99;

function addToCart(title, price) {
  const item = cart.find(i => i.title === title);
  item ? item.quantity++ : cart.push({ title, price, quantity: 1 });
  updateCart();
}

function changeQuantity(title, change) {
  const item = cart.find(i => i.title === title);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter(i => i.title !== title);
  updateCart();
}

function renderCartItem(item) {
  const total = (item.price * item.quantity).toFixed(2).replace('.', ',');
  return `<div class="basket-item">
    <div class="basket-item-title">${item.title}</div>
    <div class="basket-item-controls">
      <div>
        <button class="quantity-btn" onclick="changeQuantity('${item.title}', -1)">-</button>
        <span style="margin:0 6px;">${item.quantity}</span>
        <button class="quantity-btn" onclick="changeQuantity('${item.title}', 1)">+</button>
      </div>
      <span style="font-weight:bold;">${total}€</span>
    </div>
  </div>`;
}

function updateCart() {
  const container = document.getElementById('cart-items');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;
  
  container.innerHTML = cart.length ? cart.map(renderCartItem).join('') 
    : '<p style="text-align:center;color:#aaa;font-size:13px;">Your basket is empty.</p>';

  document.getElementById('subtotal').innerText = subtotal.toFixed(2).replace('.', ',') + '€';
  document.getElementById('total-price').innerText = total.toFixed(2).replace('.', ',') + '€';
  updateCheckoutButton(total);
}

function updateCheckoutButton(total) {
  const btn = document.getElementById('checkout-btn');
  btn.innerText = `Buy now (${total.toFixed(2).replace('.', ',')}€)`;
  btn.disabled = cart.length === 0;
}

function showOrderConfirmation() {
  if (cart.length === 0) return;
  const overlay = document.createElement('div');
  overlay.id = 'order-modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal-card">
    <button class="modal-close-btn" onclick="closeOrderConfirmation()">×</button>
    <div class="modal-icon">🛵</div>
    <h2>Order Confirmed!</h2>
    <p>Your food is on the way.</p>
  </div>`;
  document.body.appendChild(overlay);
}

function closeOrderConfirmation() {
  document.getElementById('order-modal-overlay')?.remove();
  cart = [];
  updateCart();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('checkout-btn')?.addEventListener('click', showOrderConfirmation);
  updateCart();
});