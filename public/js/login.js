(() => {
  'use strict';

  const $ = document.querySelector.bind(document);

  $('#frm-login').addEventListener('submit', function (e) {
    if (!this.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.classList.add('was-validated');
  });
})();
