function fetchUserDataAndPopulateForm(targetUserID) {
    fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/Admin/usersCrud/ReadSpacificUser.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserID: targetUserID }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Profile Picture URL:', data.ProfilePictureURL);

        // Populate form fields with user data
        document.getElementById('userName').innerText = data.Username;
        document.getElementById('ProfileImgTwo').setAttribute('src', '/MasterPieseAPIs/server/User/loginAndRegister/img/' + data.ProfilePictureURL);
        document.getElementById('userEmail').innerText = data.Email;
        document.getElementById('userLocation').innerText = data.Location;
        document.getElementById('userBio').innerText = data.Bio;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const targetUserID = window.location.hash.substring(1);
    const loggedInUserID = sessionStorage.getItem('userid');

    function fetchAndDisplayReviews(page = 1) {
        fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/review/readUserReviews.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserID: targetUserID, Page: page }) // Pass the page parameter in the body
        })
        .then(response => response.json())
        .then(reviews => displayReviews(reviews, page)) // Pass both reviews and page to displayReviews
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
                <p class="text-muted small mb-0">Shared - ${new Date(review.ReviewDate).toLocaleDateString()}</p>
                <p class="mt-3 mb-4 pb-2">${review.ReviewText}</p>
                ${generateRatingStars(review.Rating)}
                <hr>
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

    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const targetUserID = window.location.hash.substring(1);
        const loggedInUserID = sessionStorage.getItem('userid');
        const reviewText = document.getElementById('reviewText').value;
        const rating = document.getElementById('ratingSelect').value;

        fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/review/createcomment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ReviewerID: loggedInUserID,
                TargetUserID: targetUserID,
                Rating: rating,
                ReviewText: reviewText
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Review Posted:', data);
            fetchAndDisplayReviews();
            document.getElementById('reviewText').value = '';
            document.getElementById('ratingSelect').value = '0';
        })
        .catch(error => console.error('Error:', error));
    });

    fetchAndDisplayReviews();

    fetchUserDataAndPopulateForm(targetUserID);
});
