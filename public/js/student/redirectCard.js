const cards = document.getElementsByClassName('course-card');
for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', () => {
        const courseId = cards[i].getAttribute('data-id');
        window.location.href = `/courses/${courseId}`;
    });
}