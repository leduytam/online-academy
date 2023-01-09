const cards = document.querySelectorAll('.course-card');
for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', (e) => {
        if (e.target.classList.contains('wish-list-button') || e.target.classList.contains('fa-heart') || e.target.classList.contains('fa-regular')) {
            return;
        }
        const isEnrolled = cards[i].getAttribute('data-isEnrolled');
        const slug = cards[i].getAttribute('data-slug');
        if (isEnrolled == 'true') {
            window.location.href = `/courses/${slug}/lessons`;
        } else {
            window.location.href = `/courses/${slug}`;
        }
    });
}

const carouselItem = document.querySelectorAll('.carousel-item');
for (let i = 0; i < carouselItem.length; i++) {
  carouselItem[i].addEventListener('click', () => {
    const slug = carouselItem[i].getAttribute('data-slug');
    window.location.href = `/courses/${slug}`;
  });
}

$(document).on('click', '.wish-list-button', function () {
  const id = $(this).data('id');
  $.ajax({
    url: `/api/v1/student/wishlist`,
    type: 'POST',
    data: {
      courseId: id,
    },
    success: function (result) {
      if (result.code == 200) {
        if (!result.isWishListed) {
          $(`.wish-list-button[data-id=${id}]`).html(
            '<span class="fa-regular fa-heart" style="color: white;"></span>'
          );
        } else {
          $(`.wish-list-button[data-id=${id}]`).html(
            '<span class="fa fa-heart" style="color: red;"></span>'
          );
        }
      }
    },
  });
});
