$(".card").on("click", function(){
    $(".detail").addClass("active");
});

$(".close-detail").on("click", function(){
    $(".detail").removeClass("active");
});

$(".menu-bar").on("click", function(){
    $(".sidebar").addClass("active");
});

$(".logo").on("click", function(){
    $(".sidebar").removeClass("active");
});

// document.getElementById('ProfileLoction').addEventListener('click', function() {

//     window.location.href = 'Profile.html';
// });

// document.addEventListener('DOMContentLoaded', function() {
//     var closeDetail = document.querySelectorAll('.close-detail');

//     closeDetail.forEach(function(button) {
//         button.addEventListener('click', function() {
//             var detailElements = document.querySelectorAll('.detail');
//             detailElements.forEach(function(detail) {
//                 detail.classList.remove('active');
//             });
//         });
//     });
// });
function closeDetail() {
    var detailElements = document.querySelectorAll('.detail');
    detailElements.forEach(function(detail) {
        detail.classList.remove('active');
    });
}

function fetchAndDisplayPosts(userID) {
    console.log(userID);
    const data = { userID };

    fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/postsCrud/ReadAllPosts.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(posts => {
        // Clearing existing posts before displaying new ones
        const container = document.getElementById('CardContainertwo');
        container.innerHTML = '';
        displayPosts(posts);
    })
    .catch(error => console.error('Error fetching data:', error));
}



// Function to display posts
function displayPosts(posts) {
    posts.forEach(post => {
        const card = createCard(post);
        document.getElementById('CardContainertwo').appendChild(card);
    });
}
const basePath = '/MasterPieseAPIs/server/User/loginAndRegister/img/';

// Function to create a card
function createCard(post) {
    const card = document.createElement('div');
    card.classList.add('card');
    // document.getElementById('ProfileImg').setAttribute('src', '/MasterPieseAPIs/server/User/loginAndRegister/img/' + data.ProfilePictureURL);

    card.innerHTML = `
        <div class="card-left blue-bg">
        <img src="/MasterPieseAPIs/server/User/loginAndRegister/img/${post.profile_picture}" alt="Profile Picture" class="profile-picture">
        </div>
        <div class="card-center">
            <h3 class="username"></h3>
            <p class="card-detail">Looking for: ${post.YourNeed}</p>
            <p class="card-detail">I know: ${post.YourProvide}</p>
           
        </div>
        <div class="card-right">
        <div class="card-salary">
            <p><b class="your-provide">${post.Username}</b><span></span></p>
        </div>
            <div class="card-tag">
                
                <button class="but-apply" onclick="displayPostDetails(${post.PostID})">View</button>
            </div>
        </div>
    `;
  


    return card;
}

// Function to display post details
function displayPostDetails(postId) {
    fetch(`http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/postsCrud/ReadPost.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ PostID: postId })
    })
    .then(response => response.json())
    .then(post => {
        const detail = document.querySelector('.detail');
        detail.innerHTML = `
            <ion-icon class="close-detail" name="close-outline" onclick ="closeDetail()"></ion-icon>
            <div class="detail-header">
            <img src="/MasterPieseAPIs/server/User/loginAndRegister/img/${post.profile_picture}" alt="">
            <h2>${post.Username}</h2>
                <p>${post.YourNeed}</p>
            </div>
            <hr class="divider">
            <div class="detail-desc">
                <div class="about">
                    <h4>The Serves I provide</h4>
                    <p>${post.YourProvide}</p>
                    <a href="#">Read more</a>
                </div>
                <hr class="divider">
                <div class="qualification">
                    <h4>Job Description </h4>
                    <ul>
                        ${post.Description}
                    </ul>
                </div>
            </div>
            <hr class="divider">
            <div class="detail-btn">
                <button id="addFriend" onclick="sendRequest(${post.UserID})" class="but-save">Add Friend</button>
                                </div>
        `;
        // let receiverID = post.UserID;
        // const senderID = sessionStorage.getItem('userid');
        // checkSkillSwapRequest(senderID ,receiverID);

        detail.classList.add('active');
        
        // Check and update the skill swap request status
        checkSkillSwapRequest(sessionStorage.getItem('userid'), post.UserID, function(statusMessage) {
            const addFriendButton = document.getElementById('addFriend');
            addFriendButton.textContent = statusMessage || 'Check Status'; // Set default message if empty
        });

    })
    .catch(error => console.error('Error fetching post:', error));
}




function checkSkillSwapRequest(senderID, receiverID, callback) {
    fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/skillSwapRequests/InnerHTMLpenddingOrAddFriend.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ senderID: senderID, receiverID: receiverID })
    })
    .then(response => response.json())
    .then(data => {
        callback(data.message); // Call the callback function with the message
    })
    .catch(error => {
        console.error('Error:', error);
        callback('Error'); // Call the callback with an error message
    });
}

// Your existing code for sendRequest, filterPosts, etc.

// Event listener for DOMContentLoaded to fetch and display all posts initially
document.addEventListener("DOMContentLoaded", function() {
    let userID = sessionStorage.getItem("userid");
    fetchAndDisplayPosts(userID);
});



























// Function to filter and display posts based on search input




function filterPosts(searchInput , I_knew) {
    const url = 'http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/SkillSwapSearch/SkillSwapSearch.php';
    const data = {
        "I_need": searchInput,
        "I_knew": I_knew
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(filteredPosts => {
        // Clear existing posts
        document.getElementById('CardContainertwo').innerHTML = '';
console.log(filteredPosts)
        // Display filtered posts
        displayPosts(filteredPosts);
    })
    .catch(error => console.error('Error filtering posts:', error));
}

// Event listener for search button
// document.getElementById('searchButton').addEventListener('click', function() {
//     const searchInput = document.getElementById('searchInput').value.trim(); // Get search input value
//     if(searchInput ==' '|| searchInput =='' ){
//        let I_knew = '';
//     }else{
//         I_knew =sessionStorage.getItem('mainProffision');
//     }
//     filterPosts(searchInput,I_knew);
//      // Filter posts based on search input
// });
document.getElementById('searchButton').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput').value.trim(); // Get search input value
    let I_knew = ''; // Declare the variable with an initial empty string value

    if (searchInput === '' || searchInput === ' ') {
        // Set I_knew to an empty string if searchInput is empty or contains only spaces
        I_knew = '';
    } else {
        // If searchInput is not empty, retrieve the value from sessionStorage
        I_knew = sessionStorage.getItem('mainProffision');
    }

    filterPosts(searchInput, I_knew); // Filter posts based on search input
});
// Fetch and display all posts initially


document.addEventListener("DOMContentLoaded", function() {

    let userID = sessionStorage.getItem("userid");
console.log(userID)
    fetchAndDisplayPosts(userID);
});



//////////////////
const toggleFriends = document.querySelectorAll('.toggle-friends');

// Loop through each element and add a click event listener
// toggleFriends.forEach((toggle) => {
//   toggle.addEventListener('click', function() {
//     // Find the next element with the 'friends-submenu' class
//     const submenu = this.nextElementSibling;

//     // Toggle the 'show' class to collapse or expand the submenu
//     submenu.classList.toggle('show');
//   });
// });

// document.addEventListener('DOMContentLoaded', function(){
//     const drop = document.getElementById('drop');
//     const droplist = document.getElementById('drop-list');

//     drop.addEventListener('click', function (){
//         droplist.classList.toggle('show');
//     });
// });



// send friend request :::
function sendRequest(receiverID) {
    const senderID = sessionStorage.getItem('userid'); // Get senderID from session
 // Get senderID from session
    const skillID = 1; // Assuming skillID is always 1 based on your description

    const requestData = {
        senderID: senderID,
        receiverID: receiverID,
        skillID: skillID
    };

    fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/skillSwapRequests/SendingSkillSwapRequests.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Request failed');
        }
    })
    .then(data => {
        // Process the response as needed
        // For instance, if you want to display a message:
        if (data.message=="Skill swap request sent!"){
            document.getElementById('addFriend').textContent='Pendding';

        }
        else if (data.message=="Skill swap request deleted"){
            document.getElementById('addFriend').textContent='Add friend';

        }
        alert(data.message);
    })
    .catch(error => {
        console.log('Error sending request:', error);
        // Handle errors here
    });
}


