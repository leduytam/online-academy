const otpDigits = document.querySelectorAll('.otp-digit');
const otp = document.querySelector('#otp');
const btnSubmit = document.querySelector('#btn-submit');
const otpForm = document.querySelector('#otp-form');

btnSubmit.addEventListener('click', () => {
  otp.value = [...otpDigits].map((digit) => digit.value).join('');
  otpForm.submit();
});

for (let i = 0; i < otpDigits.length; i++) {
  otpDigits[i].addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
      otpDigits[i].value = '';

      if (i !== 0) {
        otpDigits[i - 1].focus();
      }
    }

    if (e.key === 'ArrowLeft' && i !== 0) {
      otpDigits[i - 1].focus();
    }

    if (e.key === 'ArrowRight' && i !== otpDigits.length - 1) {
      otpDigits[i + 1].focus();
    }

    if (e.keyCode > 47 && e.keyCode < 58) {
      otpDigits[i].value = e.key;
      if (i !== otpDigits.length - 1) otpDigits[i + 1].focus();
    }

    e.preventDefault();
  });
}
