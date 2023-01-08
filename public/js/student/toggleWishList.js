const wishListButton = document.querySelectorAll('.wish-list-button')
    for (let i = 0; i < wishListButton.length; i++) {
        console.log("🚀 ~ file: toggleWishList.js:5 ~ wishListButton[i].addEventListener ~ courseId", wishListButton[i])
        wishListButton[i].addEventListener('click', () => {
            const courseId = wishListButton[i].getAttribute('data-id')
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
                            wishListButton[i].innerHTML = '<span class="fa-regular fa-heart fa-3x" style="color: white;"></span>'
                        } else {
                            wishListButton[i].innerHTML = '<span class="fa fa-heart fa-3x" style="color: white;"></span>'
                        }
                    }
                })

        })
    }