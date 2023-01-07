(() => {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  // Popover for progress
  const popoverProgress = $('#popover-progress');
  const popoverProgressContent = $('#popover-progress-content');

  new bootstrap.Popover(popoverProgress, {
    placement: 'bottom',
    html: true,
    content: popoverProgressContent,
  });

  // Custom plyr video player
  let player = new Plyr('#player', {});
  const lessonSlug = $('#player').dataset.slug;

  player.on('ready', (e) => {
    if (!player.source) {
      player.destroy();
      player = new Plyr('#player', {
        controls: [],
        fullscreen: { enabled: false },
      });
    }
  });

  player.once('canplay', (e) => {
    if (localStorage.getItem(lessonSlug)) {
      const currentTime = +localStorage.getItem(lessonSlug);
      const duration = player.duration;

      player.currentTime = Math.min(currentTime, duration);
    }
  });

  player.on('timeupdate', (e) => {
    localStorage.setItem(lessonSlug, player.currentTime);
  });

  // Review
  const frmReview = $('#frm-review');
  const btnSubmitReview = $('#btn-submit-review');
  const txtReview = $('#txt-review');

  const frmDeleteReview = $('#frm-delete-review');
  const btnDeleteReview = $('#btn-delete-review');

  const defaultReview = txtReview.value;
  const defaultRating =
    $('input[name="rating"][type="radio"]:checked')?.value || 0;

  frmReview.oninput = (e) => {
    const rating = $('input[name="rating"][type="radio"]:checked')?.value || 0;
    const review = txtReview.value;

    btnSubmitReview.disabled =
      rating === defaultRating && review === defaultReview;
  };

  $('#modal-rating').addEventListener('hidden.bs.modal', (e) => {
    txtReview.value = defaultReview;

    $$('[name="rating"][type="radio"]').forEach((el) => {
      el.checked = el.value === defaultRating;
    });

    btnSubmitReview.disabled = true;
  });

  frmReview.onsubmit = async (e) => {
    btnSubmitReview.disabled = true;
  };

  if (frmDeleteReview) {
    frmDeleteReview.onsubmit = async (e) => {
      btnDeleteReview.disabled = true;
    };
  }
})();
