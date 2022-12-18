(() => {
  'use strict';

  const $ = document.querySelector.bind(document);

  const emailInput = $('#email');
  const sendOtpBtn = $('#btn-send-otp');
  const resetFrm = $('#frm-reset-password');
  const otpAlert = $('#alert-otp');
  const passwordInput = $('#password');
  const confirmPasswordInput = $('#confirm-password');

  emailInput.addEventListener('input', function (e) {
    if (this.checkValidity()) {
      sendOtpBtn.disabled = false;
      sendOtpBtn.classList.remove('btn-outline-secondary');
      sendOtpBtn.classList.add('btn-outline-primary');
    } else {
      sendOtpBtn.disabled = true;
      sendOtpBtn.classList.add('btn-outline-secondary');
      sendOtpBtn.classList.remove('btn-outline-primary');
    }
  });

  sendOtpBtn.addEventListener('click', async function (e) {
    sendOtpBtn.disabled = true;

    e.preventDefault();
    e.stopPropagation();

    const response = await fetch('/send-reset-password-otp', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: emailInput.value }),
    });

    const { message } = await response.json();

    if (response.status === 200) {
      otpAlert.classList.remove('alert-danger');
      otpAlert.classList.add('alert-success');

      (() => {
        let timer = 30;

        const interval = setInterval(() => {
          sendOtpBtn.textContent = `Resend OTP (${timer})`;
          timer -= 1;
        }, 1000);

        setTimeout(() => {
          clearInterval(interval);
          sendOtpBtn.textContent = 'Resend OTP';
          sendOtpBtn.disabled = false;
        }, timer * 1000);
      })();
    } else {
      otpAlert.classList.remove('alert-success');
      otpAlert.classList.add('alert-danger');

      sendOtpBtn.disabled = false;
    }

    otpAlert.textContent = message;
    otpAlert.classList.remove('d-none');
  });

  resetFrm.addEventListener('input', function (e) {
    if (passwordInput.value === confirmPasswordInput.value) {
      confirmPasswordInput.setCustomValidity('');
    } else {
      confirmPasswordInput.setCustomValidity(
        'Password and confirm password do not match'
      );
    }
  });

  resetFrm.addEventListener('submit', function (e) {
    if (passwordInput.value !== confirmPasswordInput.value) {
      e.preventDefault();
      e.stopPropagation();
      confirmPasswordInput.classList.add('is-invalid');
    }

    if (!this.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!otpAlert.classList.contains('d-none')) {
      otpAlert.classList.add('d-none');
    }

    this.classList.add('was-validated');
  });
})();
