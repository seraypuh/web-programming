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
});