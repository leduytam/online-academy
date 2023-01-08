const cards = document.querySelectorAll('.carousel-item');
for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', (e) => {
        if (e.target.classList.contains('wish-list-button') || e.target.classList.contains('fa-heart') || e.target.classList.contains('fa-regular')) {
            const wishListButton = e.target.closest('.wish-list-button');
            const courseId = cards[i].getAttribute('data-id')
            fetch('/api/v1/student/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    courseId: courseId
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == 200) {
                        if (data.isWishListed) {
                            wishListButton.innerHTML = '<span class="fa-regular fa-heart fa-3x" style="color: white;"></span>'
                        } else {
                            wishListButton.innerHTML = '<span class="fa fa-heart fa-3x" style="color: white;"></span>'
                        }
                    }
                })
            return;

        }
        const slug = cards[i].getAttribute('data-slug');
        window.location.href = `/courses/${slug}`;
    });
}