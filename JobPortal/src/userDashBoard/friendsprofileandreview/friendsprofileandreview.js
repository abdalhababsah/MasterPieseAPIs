

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
            // document.getElementById('ProfileImg').setAttribute('src', '/MasterPieseAPIs/server/User/loginAndRegister/img/' + data.ProfilePictureURL);
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

    function fetchAndDisplayReviews() {
        fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/review/readUserReviews.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserID: targetUserID })
        })
        .then(response => response.json())
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
    }

    function generateRatingStars(rating) {
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            starsHtml += i < rating ? '<span class="fa fa-star checked"></span>' : '<span class="fa fa-star"></span>';
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
        console.log(reviewText)
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
        })
        .catch(error => console.error('Error:', error));
    });
    

    fetchAndDisplayReviews();
});
