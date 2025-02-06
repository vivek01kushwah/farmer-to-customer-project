document.addEventListener('DOMContentLoaded', function () {
    var rating_data = 0;
    var product_id = document.getElementById('productID').value ; // Replace with the actual product ID

    // Select elements
    var addReviewButton = document.getElementById('add_review');
    var reviewModal = document.getElementById('review_modal');
    var submitStars = document.querySelectorAll('.submit_star');
    var saveReviewButton = document.getElementById('save_review');
    var userNameInput = document.getElementById('user_name');
    var userReviewInput = document.getElementById('user_review');
    var averageRating = document.getElementById('average_rating');
    var totalReview = document.getElementById('total_review');
    var mainStars = document.querySelectorAll('.main_star');
    var totalFiveStarReview = document.getElementById('total_five_star_review');
    var totalFourStarReview = document.getElementById('total_four_star_review');
    var totalThreeStarReview = document.getElementById('total_three_star_review');
    var totalTwoStarReview = document.getElementById('total_two_star_review');
    var totalOneStarReview = document.getElementById('total_one_star_review');
    var fiveStarProgress = document.getElementById('five_star_progress');
    var fourStarProgress = document.getElementById('four_star_progress');
    var threeStarProgress = document.getElementById('three_star_progress');
    var twoStarProgress = document.getElementById('two_star_progress');
    var oneStarProgress = document.getElementById('one_star_progress');
    var reviewContent = document.getElementById('review_content');
    var closeReviewModal = document.getElementById('close_review_modal');

    // Event listeners
    closeReviewModal.addEventListener('click', () => {
        reviewModal.style.display = 'none';
    });

    addReviewButton.addEventListener('click', function () {
        reviewModal.style.display = 'block';
    });

    submitStars.forEach(function (star) {
        star.addEventListener('mouseenter', function () {
            var rating = star.dataset.rating;
            resetBackground();
            for (var count = 1; count <= rating; count++) {
                document.getElementById('submit_star_' + count).classList.add('text-warning');
            }
        });
    });

    function resetBackground() {
        for (var count = 1; count <= 5; count++) {
            document.getElementById('submit_star_' + count).classList.add('star-light');
            document.getElementById('submit_star_' + count).classList.remove('text-warning');
        }
    }

    submitStars.forEach(function (star) {
        star.addEventListener('mouseleave', function () {
            resetBackground();
            for (var count = 1; count <= rating_data; count++) {
                document.getElementById('submit_star_' + count).classList.add('text-warning');
            }
        });
    });

    submitStars.forEach(function (star) {
        star.addEventListener('click', function () {
            rating_data = star.dataset.rating;
        });
    });

    saveReviewButton.addEventListener('click', function () {
        var user_name = userNameInput.value;
        var user_review = userReviewInput.value;

        if (user_name === '' || user_review === '') {
            alert('Please fill both fields');
        } else {
            const ratingData = rating_data;
            const userName = user_name;
            const userReview = user_review;

            fetch('/submit_rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating_data: ratingData, user_name: userName, user_review: userReview, product_id: product_id }),
            })
                .then(response => {
                    if (response.status === 201) {
                        userNameInput.value = '';
                        userReviewInput.value = '';
                        console.log("setting display none");
                        reviewModal.style.display = 'none';
                        resetBackground();
                        // Reload the page after successful submission
                        location.reload();
                    } else {
                        return response.text();
                    }
                })
                .then(responseText => {
                    console.error('Error occurred while submitting the data:', responseText);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        }
    });

    function resetBackground() {
        for (var count = 1; count <= 5; count++) {
            document.getElementById('submit_star_' + count).classList.add('star-light');
            document.getElementById('submit_star_' + count).classList.remove('text-warning');
        }
    }

    loadRatingData();

    function loadRatingData() {
        fetch('/fetch_ratings/' + product_id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Error occurred while fetching data.');
                }
            })
            .then(data => {
                averageRating.textContent = data.average_rating;

                // Update the DOM elements with the fetched data
                mainStars.forEach(function (star) {
                    star.classList.remove('text-warning');
                    star.classList.remove('star-light');
                });

                let starsToShow;

                if (data.average_rating >= 0.5 && data.average_rating < 1.5) {
                    starsToShow = 1;
                } else if (data.average_rating >= 1.5 && data.average_rating < 2.5) {
                    starsToShow = 2;
                } else if (data.average_rating >= 2.5 && data.average_rating < 3.5) {
                    starsToShow = 3;
                } else if (data.average_rating >= 3.5 && data.average_rating < 4.5) {
                    starsToShow = 4;
                } else if (data.average_rating >= 4.5 && data.average_rating <= 5.0) {
                    starsToShow = 5;
                } else {
                    // Handle invalid or out-of-range values, if necessary
                    starsToShow = 0;
                }

                for (let count = 1; count <= starsToShow; count++) {
                    mainStars[count - 1].classList.add('text-warning');
                    mainStars[count - 1].classList.add('star-light');
                }

                totalReview.textContent = data.total_review;
                totalFiveStarReview.textContent = data.five_star_review;
                totalFourStarReview.textContent = data.four_star_review;
                totalThreeStarReview.textContent = data.three_star_review;
                totalTwoStarReview.textContent = data.two_star_review;
                totalOneStarReview.textContent = data.one_star_review;

                fiveStarProgress.style.width = (data.five_star_review / data.total_review * 100) + '%';
                fourStarProgress.style.width = (data.four_star_review / data.total_review * 100) + '%';
                threeStarProgress.style.width = (data.three_star_review / data.total_review * 100) + '%';
                twoStarProgress.style.width = (data.two_star_review / data.total_review * 100) + '%';
                oneStarProgress.style.width = (data.one_star_review / data.total_review * 100) + '%';

                if (data.review_data.length > 0) {
                    var html = '';
                    for (let count = 0; count < data.review_data.length; count++) {
                        html += '<div class="row mb-3">';
                        html += '<div class="col-sm-1"><div class="rounded-circle bg-danger text-white pt-2 pb-2"><h3 class="text-center">' + data.review_data[count].user_name.charAt(0) + '</h3></div></div>';
                        html += '<div class="col-sm-11">';
                        html += '<div class="card">';
                        html += '<div class="card-header d-flex justify-content-between"><div><b>' + data.review_data[count].user_name + '</b></div>' + '<div><b>On ' + data.review_data[count].datetime + '</b></div></div>';
                        html += '<div class="card-body">';
                        for (let star = 1; star <= 5; star++) {
                            let class_name = star <= data.review_data[count].rating ? 'text-warning' : 'star-light';
                            html += '<i class="fas fa-star ' + class_name + ' mr-1"></i>';
                        }
                        html += '<br />';
                        html += data.review_data[count].user_review;
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                    }
                    reviewContent.innerHTML = html;
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }

    loadRatingData();
});
