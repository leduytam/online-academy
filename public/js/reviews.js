'use strict';

(() => {
  const $ = document.querySelector.bind(document);

  const reviews = $('#reviews');
  const btnLoadMore = $('#btn-load-more');

  const slug = reviews.dataset.slug;

  btnLoadMore.onclick = async () => {
    btnLoadMore.disabled = true;

    const { data } = await axios.get(
      `/courses/${slug}/reviews?skip=${reviews.children.length}`
    );

    if (!data) {
      btnLoadMore.style.display = 'none';
      return;
    }

    reviews.innerHTML += data;

    btnLoadMore.disabled = false;
  };
})();
