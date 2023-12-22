function fetchAndDisplayReviews() {
    const userid = sessionStorage.getItem("userid");
    const apiUrl = 'http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/review/readUserReviews.php';

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserID: userid })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(reviews => displayReviews(reviews))
    .catch(error => console.error('Error:', error));
}

function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.innerHTML = '';

    reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review';
        reviewDiv.innerHTML = `
            <h6 class="fw-bold text-primary mb-1">${review.ReviewerUsername}</h6>
            <p class="text-muted small mb-0">Shared publicly - ${new Date(review.ReviewDate).toLocaleDateString()}</p>
            <p class="mt-3 mb-4 pb-2">${review.ReviewText}</p>
            ${generateRatingStars(review.Rating)}
        `;
        reviewsContainer.appendChild(reviewDiv);
    });
    
    function generateRatingStars(rating) {
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            starsHtml += i < rating ? '<i class="fas fa-star text-warning"></i>' : '<i class="far fa-star"></i>';
        }
        console.log('Stars HTML:', starsHtml);
        return starsHtml;
    }

    // Note: No need to log the result of generateRatingStars here
}

fetchAndDisplayReviews();
