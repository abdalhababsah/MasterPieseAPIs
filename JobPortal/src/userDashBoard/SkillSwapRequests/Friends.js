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

// Function to fetch pending swap requests
function fetchPendingRequests() {
  let userId = sessionStorage.getItem("userid");

  fetch(
      "http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/skillSwapRequests/selectUserAcceptedRequests.php",
      {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ UserID: userId }),
      }
  )
  .then((response) => response.json())
  .then((data) => {
      if (data.message) {
          console.log(data.message);
      } else {
          displayPendingRequests(data, userId);
      }
  })
  .catch((error) => console.error("Error:", error));
}

function displayPendingRequests(requests, userId) {
  let container = document.getElementById("pendingRequestsContainer");

  container.innerHTML = ""; // Clear previous content

  requests.forEach((request) => {
    let displayID, displayUsername, displayProfileURL, displayProfession;

    // Determine which user's information to display
    if (request.SenderID == userId) {
      // Current user is the sender; display receiver's information
      displayID = request.ReceiverID;
      displayUsername = request.ReceiverUsername;
      displayProfileURL = request.ReceiverProfilePictureURL;
      displayProfession = request.ReceiverMainProfession;
    } else if (request.ReceiverID == userId) {
      // Current user is the receiver; display sender's information
      displayID = request.SenderID;
      displayUsername = request.SenderUsername;
      displayProfileURL = request.SenderProfilePictureURL;
      displayProfession = request.SenderMainProfession;
    } 

    let card = document.createElement("div");
    card.classList.add("col-md-6", "col-xl-4"); // Add Bootstrap classes

    // Set the inner HTML of the card with user information and action buttons
    card.innerHTML = `
        <div class="card">
        <div class="card-body d-flex flex-column">
        <div class="media align-items-center">
        <span style="background-image: url(${displayProfileURL})" class="avatar avatar-xl mr-3"></span>  
        <div class="media-body overflow-hidden">
        <h5 class="card-text mb-0">${displayUsername}</h5>
        <p class="card-text text-uppercase text-muted">Profession: ${displayProfession}</p>
        <!-- You can add other data here -->
        
        <div class="button-list d-flex justify-content-around mt-4 mb-3 order-md-last">
        <button type="button" class="btn btn-primary" onclick="sendMessage()">
        <i class="feather icon-message-square mr-2"></i>Message
        </button>
        <button type="button" class="btn btn-danger" onclick="deleteFriend(${request.RequestID})">
        <i class="feather icon-message-square mr-2"></i>Delete
        </button>
        </div>
        </div>
        </div>
        </div>
        </div>
        `;

    // Append the card to the container
    container.appendChild(card);
  });
}


function deleteFriend(RequestID) {
  console.log(RequestID);
  fetch(
    "http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/skillSwapRequests/deleteFriend.php",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ RequestID: RequestID }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message); 
    })
    .catch((error) => console.error("Error:", error));
}


document.addEventListener("DOMContentLoaded", function () {
  fetchPendingRequests();
});


function sendMessage() {
  window.location.href="../chatApp.html"
}