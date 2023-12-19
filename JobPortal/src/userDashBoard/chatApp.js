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






function loadMessages(senderID, receiverID) {
    var messageList = $('#message-list');
    messageList.empty();
    $.ajax({
        url: 'http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/masseging/ReadMessage.php',
        method: 'POST',
        data: JSON.stringify({ SenderID: senderID, ReceiverID: receiverID }), // Sending the sender and receiver IDs
        contentType: 'application/json',
        success: function(response) {
            console.log("Response received:", response); // Debugging
            response.forEach(function(message) {
                var loggedInUserID = sessionStorage.getItem("userid");
                var isCurrentUser = loggedInUserID == message.SenderID ;

                var messageHtml = isCurrentUser ?
                    `<li class="clearfix">
                        <div class="message-data">
                            <span class="message-data-time">${message.Timestamp}</span>
                        </div>
                        <div class="message my-message">${message.MessageText}</div>
                    </li>`
                    :
                    `<li class="clearfix">
                        <div class="message-data text-right">
                            <span class="message-data-time">${message.Timestamp}</span>
                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                        </div>
                        <div class="message other-message float-right">${message.MessageText}</div>
                    </li>`;
                
                $('#message-list').prepend(messageHtml);
            });

            var messageList = document.getElementById('message-list');
            messageList.scrollTop = messageList.scrollHeight;
        },
        error: function(xhr, status, error) {
            console.error("Error in AJAX request:", error);
        }
    });
}


    function sendMessage(messageText ) {
       // Set the receiver's ID here
       let senderID = sessionStorage.getItem("senderID");
    //    console.log(senderID)
    let receiverID = sessionStorage.getItem("receiverID");
        // AJAX request to send the message to the server
        $.ajax({
            url: 'http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/masseging/SendMessage.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            SenderID: senderID,
            ReceiverID: receiverID,
            MessageText: messageText
        }),
        success: function(response) {
            // Assuming the message was sent successfully
            // Display the sent message in 'my-message' format
            $('#message-list').append(`
                <li class="clearfix">
                    <div class="message-data">
                        <span class="message-data-time">Current Time</span>
                        </div>
                        <div class="message my-message">${messageText}</div>
                        </li>
                        `);
                        
                        // Scroll to the bottom to show the latest messages
                        var messageList = document.getElementById('message-list');
                        messageList.scrollTop = messageList.scrollHeight;
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

// Event listener for the send button
$('#send-button').on('click', function() {
    var messageText = $('#message-input').val().trim();
    if (messageText !== '') {
        // Call the sendMessage function with the message text
        sendMessage(messageText);
        // Clear the input field after sending the message
        $('#message-input').val('');
    }
});

// Event listener to detect when Enter key is pressed in the input field
$('#message-input').keypress(function(event) {
    if (event.which === 13) { // Detect Enter key
        var messageText = $('#message-input').val().trim();
        if (messageText !== '') {
            // Call the sendMessage function with the message text
            sendMessage(messageText);
            // Clear the input field after sending the message
            $('#message-input').val('');
        }
    }
});


function loadUsers() {
    let userID = sessionStorage.getItem("userid");
    $.ajax({
        url: 'http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/skillSwapRequests/selectUserAcceptedRequests.php',
        method: 'POST',
        data: JSON.stringify({ UserID: userID }),
        contentType: 'application/json',
        success: function(response) {
            console.log("Response received:", response); // Debugging
            response.forEach(function(user) {
                let senderID = user.SenderID;
                let receiverID = user.ReceiverID;
                console.log("Before swapping - senderID:", senderID, "receiverID:", receiverID, "userID:", userID);

                // Check if senderID is not equal to userID, then switch senderID and receiverID
                if (senderID != userID) {
                    let temp = senderID;
                    senderID = receiverID;
                    receiverID = temp;
                }
                console.log("After swapping - senderID:", senderID, "receiverID:", receiverID, "userID:", userID);

                $('#user-list').append(`
                    <li class="clearfix user-item" data-senderid="${senderID}" data-receiverid="${receiverID}">
                        <img src="${user.ProfilePictureURL}" alt="avatar">
                        <div class="about">
                            <div class="name">${user.SenderUsername}</div>
                            <!-- Add any other user details as needed -->
                        </div>
                    </li>
                `);
            });
            $('.user-item').on('click', function() {
                let senderID = $(this).data('senderid');
                let receiverID = $(this).data('receiverid');
                let SenderUsername = $(this).find('.name').text();
                displaySelectedUser(senderID, receiverID, SenderUsername);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error fetching users:", error);
        }
    });
}
// Function to display the selected user in the chat section
function displaySelectedUser(senderID, receiverID ,SenderUsername) {

    $('.chat-about h6').text(SenderUsername); // Update with user's name
    sessionStorage.setItem("senderID", senderID)
    sessionStorage.setItem("receiverID", receiverID)
    loadMessages(senderID, receiverID);
}


loadUsers();
