let cart = [
  { name: 'Veggie mushroom black burger', price: 16.90, quantity: 1 },
  { name: 'Pizza Margherita', price: 11.90, quantity: 1 },
  { name: 'Mini green Salad', price: 7.90, quantity: 1 }
];

const deliveryFee = 4.99;

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';

  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;

    const itemElement = document.createElement('div');
    itemElement.classList.add('basket-item');
    itemElement.innerHTML = `
      <div class="basket-item-title">${item.quantity} x ${item.name}</div>
      <div class="basket-item-controls">
        <span>${(item.price * item.quantity).toFixed(2).replace('.', ',')}€</span>
        <div>
          <button onclick="changeQuantity(${index}, -1)">-</button>
          <button onclick="changeQuantity(${index}, 1)">+</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  const total = subtotal + deliveryFee;

  document.getElementById('subtotal').innerText = `${subtotal.toFixed(2).replace('.', ',')}€`;
  document.getElementById('total-price').innerText = `${total.toFixed(2).replace('.', ',')}€`;
  document.getElementById('checkout-btn').innerText = `Buy now (${total.toFixed(2).replace('.', ',')}€)`;
}

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartUI();
}

function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

// Initialisiere Warenkorb beim Laden
document.addEventListener('DOMContentLoaded', updateCartUI);