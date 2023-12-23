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


// Fetch pending requests
function fetchPendingRequests(userID) {
    fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/skillSwapRequests/selectUserPendingReq.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserID: userID }),
    })
    .then(response => response.json())
    .then(data => {
        displayPendingRequests(data);
    })
    .catch(error => {
        console.error('Error fetching pending requests:', error);
    });
}

// Display pending requests in the UI
function displayPendingRequests(requests) {
    const cardContainer = document.getElementById('CardContainer');

    requests.forEach(request => {
        const { RequestID, SenderUsername, SkillID,ProfilePictureURL  } = request;

        const card = document.createElement('div');
        card.className = 'col-md-6 col-xl-4';
        card.innerHTML = `
            <div class="card">
                <div class="card-body d-flex flex-column">
                    <div class="media align-items-center">
                    <img class="avatar avatar-xl mr-3" src="/MasterPieseAPIs/server/User/loginAndRegister/img/${ProfilePictureURL}" alt="">
                    <div class="media-body overflow-hidden">

                            <h5 class="card-text mb-0">${SenderUsername}</h5>
                            <p class="card-text text-uppercase text-muted">${SkillID}</p>
                        </div>
                    </div>
                    <div class="button-list d-flex justify-content-around mt-4 mb-3 order-md-last">
                        <button type="button" class="btn btn-primary" onclick="acceptRequest(${RequestID})"><i class="feather icon-message-square mr-2"></i>Accept</button>
                        <button type="button" class="btn btn-danger" onclick="rejectRequest(${RequestID})"><i class="feather icon-message-square mr-2"></i>Reject</button>
                    </div>
                </div>
            </div>
        `;

        cardContainer.appendChild(card);
    });
}

// Function to open the reject confirmation modal with the specific request ID
// function openRejectConfirmationModal(requestID) {
//     document.getElementById('confirmRejectBtn').setAttribute('data-request-id', requestID);
//     $('#rejectConfirmationModal').modal('show');
// }

// document.addEventListener("DOMContentLoaded", function() {
//     const rejectButton = document.getElementById('confirmRejectBtn');

//     // Add click event listener to the reject button
//     rejectButton.addEventListener('click', function() {
//         const requestID = rejectButton.getAttribute('data-request-id');
//         if (requestID) {
//             openRejectConfirmationModal(requestID);
//         } else {
//             console.error('Request ID not found.');
//         }
//     });
// });

// Function to handle rejecting a request
function rejectRequest(requestID) {
    fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/skillSwapRequests/RejectingSkillSwapRequests.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestID: requestID }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(`Request ${requestID} rejected!`);
        $('#rejectConfirmationModal').modal('hide');
    })
    .catch(error => {
        console.error('Error rejecting request:', error);
    });
}


function acceptRequest(requestID) {
    console.log(requestID)
    fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/skillSwapRequests/AcceptingSkillSwapRequests.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestID: requestID }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response (e.g., show a success message)
        console.log('Request accepted:', data.message);
    })
    .catch(error => {
        console.error('Error accepting request:', error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    let userID = sessionStorage.getItem("userid");

    fetchPendingRequests(userID);

  });
   // Replace 'user123' with the actual user ID
