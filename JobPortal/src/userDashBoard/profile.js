$(".card").on("click", function () {
    $(".detail").addClass("active");
});

$(".close-detail").on("click", function () {
    $(".detail").removeClass("active");
});

$(".menu-bar").on("click", function () {
    $(".sidebar").addClass("active");
});

$(".logo").on("click", function () {
    $(".sidebar").removeClass("active");
});


function fetchUserDataAndPopulateForm(userID) {
    fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/Admin/usersCrud/ReadSpacificUser.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserID: userID }),
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

            document.getElementById('editProfileButton').addEventListener('click', function () {
                window.location.href = `editProfile.html?userid=${userID} `;
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener("DOMContentLoaded", function () {

    let userID = sessionStorage.getItem("userid");

    fetchUserDataAndPopulateForm(userID);
});







document.getElementById('ProfileLoction').addEventListener('click', function () {

    window.location.href = 'Profile.html';
});

