

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

document.addEventListener("DOMContentLoaded", function () {

   
    const targetUserID = window.location.hash.substring(1);

    fetchUserDataAndPopulateForm(targetUserID);
});

// Function to fetch and display reviews for a specific user
function fetchReviews(userID) {
    const apiURL = 'http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/review/readUserReviews.php'; // Replace with your API endpoint for fetching reviews

    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserID: userID })
    })
    .then(response => response.json())
    .then(reviews => displayReviews(reviews))
    .catch(error => console.error('Error:', error));
}

// Function to display reviews
function displayReviews(reviews) {
    const container = document.getElementById('reviewsContainer'); // Replace with your actual container ID
    container.innerHTML = '';

    reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review';
        reviewDiv.innerHTML = `<p>${review.ReviewText}</p>`; // Modify as needed to display review details
        container.appendChild(reviewDiv);
    });
}

// Function to handle the submission of a new review
function submitReview(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    const loggedInUserID = sessionStorage.getItem('userid'); // Retrieve the logged-in user ID from session storage
    const targetUserID = window.location.hash.substring(1); // Assuming this is the ID of the user being reviewed
    const reviewText = document.getElementById('reviewText').value; // Replace 'reviewText' with your actual textarea ID
    const rating = document.getElementById('rating_simple').value; // Replace with your actual rating field ID

    const apiURL = 'http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/review/createcomment.php'; // Replace with your API endpoint for posting reviews

    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ReviewerID: loggedInUserID,
            TargetUserID: targetUserID,
            Rating: rating,
            ReviewText: reviewText
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        fetchReviews(targetUserID); // Refetch reviews to display the new one
    })
    .catch(error => console.error('Error:', error));
}

// Event listener for the review form submission
document.getElementById('reviewForm').addEventListener('submit', submitReview); // Replace 'reviewForm' with your form ID

// Extract User ID from URL and fetch reviews for that user
const userID = window.location.hash.substring(1);
fetchReviews(userID);

