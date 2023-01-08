const cards = document.getElementsByClassName('course-card');
for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', (e) => {
        if (e.target.classList.contains('wish-list-button') || e.target.classList.contains('fa-heart') || e.target.classList.contains('fa-regular')) {
            return;
        }
        const slug = cards[i].getAttribute('data-slug');
        window.location.href = `/courses/${slug}`;
    });
}