function fetchAndDisplayReviews(page = 1) {
    const userid = sessionStorage.getItem("userid");
    const apiUrl = 'http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/review/readUserReviews.php';

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserID: userid, Page: page })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(reviews => displayReviews(reviews, page))
    .catch(error => console.error('Error:', error));
}

function displayReviews(reviews, currentPage) {
    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.innerHTML = '';

    const itemsPerPage = 4;
    const totalPages = Math.ceil(reviews.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentReviews = reviews.slice(startIndex, endIndex);

    currentReviews.forEach(review => {
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

    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = i === currentPage ? 'btn btn-primary mx-1' : 'btn btn-outline-primary mx-1';
        pageButton.textContent = i;

        pageButton.addEventListener('click', () => fetchAndDisplayReviews(i));

        paginationContainer.appendChild(pageButton);
    }
}

function generateRatingStars(rating) {
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        starsHtml += i < rating ? '<i class="fas fa-star text-warning"></i>' : '<i class="far fa-star"></i>';
    }
    return starsHtml;
}

// Initial fetch for the first page
fetchAndDisplayReviews();