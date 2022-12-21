(() => {
  const $ = document.querySelector.bind(document);

  // Popover for progress
  const popoverProgress = $('#popover-progress');
  const popoverProgressContent = $('#popover-progress-content');

  new bootstrap.Popover(popoverProgress, {
    placement: 'bottom',
    html: true,
    content: popoverProgressContent,
  });

  // Custom plyr video player
  const player = new Plyr('#player', {});
})();
