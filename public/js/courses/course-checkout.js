const cardPaymentRadio = document.getElementById('paymentCourse-card');
const paypalPaymentRadio = document.getElementById('paymentCourse-paypal');
const cardCollapse = document.getElementById('paymentCollapse__1');
const paypalCollapse = document.getElementById('paymentCollapse__2');
cardPaymentRadio.addEventListener('click', () => {
  paypalCollapse.classList.remove('show');
  paypalPaymentRadio.checked = false;
  cardCollapse.classList.add('show');
});
paypalPaymentRadio.addEventListener('click', () => {
  cardCollapse.classList.remove('show');
  cardPaymentRadio.checked = false;
  paypalCollapse.classList.add('show');
});

const slug = window.location.pathname.split('/')[2];
const enrollButton = document.getElementById('course-checkout-button');

enrollButton.addEventListener('click', async () => {
  const form = document.getElementById('course-checkout-form');
  const formData = new FormData(form);
  const cardName = formData.get('cardName');
  const cardNumber = formData.get('cardNumber');
  const cardCvv = formData.get('cardCvv');
  const cardExpiry = formData.get('cardExpiry');

  const checkoutError = document.getElementById('course-checkout-error');
  
  const isPaymentCard = cardPaymentRadio.checked;

  if (isPaymentCard) {
    if (!cardName || !cardNumber || !cardCvv || !cardExpiry) {
      checkoutError.classList.remove('d-none');
      checkoutError.innerText = 'Please fill all the fields';
      return;
    }
    else {
      if (!checkoutError.classList.contains('d-none')) {
        checkoutError.classList.add('d-none');
      }
      checkoutError.innerText = '';
    }
  }
  else {
    if (!checkoutError.classList.contains('d-none')) {
      checkoutError.classList.add('d-none');
    }
    checkoutError.innerText = '';
  }

  await axios.post(`/api/v1/courses/${slug}/enroll`)
})