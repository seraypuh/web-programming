let cart = [];

const checkoutBtn = document.querySelector('.checkout-btn');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');

checkoutBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

const orderForm = document.getElementById('order-form');
orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Заказ успешно оформлен!');
    modal.style.display = 'none';
    orderForm.reset();
    cart = [];
    updateCart();
});

const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    console.log(cart);
    updateCart();
    });
});

const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.getElementById('total-price');

function updateCart() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
        totalPriceElement.textContent = '0';
        return;
    }
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <span><strong>${item.name}</strong> — $${item.price} x ${item.quantity} = $${itemTotal}</span>
            <div class="cart-controls">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <button onclick="changeQuantity(${index}, 1)">+</button>
                <button onclick="removeItem(${index})">Удалить</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    totalPriceElement.textContent = total;
}

function changeQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}