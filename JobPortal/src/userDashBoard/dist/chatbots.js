$(document).ready(function(){
    // Interaction scripts
    $("#chat-circle, .chat-box-toggle").click(function() {    
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    });

    $("#data").keypress(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#send-btn").click();
        }
    });

    $("#send-btn").on("click", function(){
        var value = $("#data").val().trim().toLowerCase();
        if (value !== '') {
            var msg = '<div class="chat-msg user"><p>'+ value +'</p></div>';
            $(".chat-logs").append(msg);
            $("#data").val('');

            // Check if the user is trying to login or sign up
            if((value.includes("log") || value.includes("sign")) && sessionStorage.getItem("isLoggedin") === "true") {
                // User is already logged in
                $(".chat-logs").append('<div class="chat-msg bot"><p>You are already logged in.</p></div>');
                $(".chat-logs").scrollTop($(".chat-logs")[0].scrollHeight);
            } else {
                // Proceed with sending the message
                $.ajax({
                    url: 'http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/chatbot.php',
                    type: 'POST',
                    data: { text: value },
                    success: function(result){
                        var data = JSON.parse(result);
                        if(data.redirect) {
                            window.location.href = data.redirect;
                        } else {
                            var reply = '<div class="chat-msg bot"><p>'+ data.reply +'</p></div>';
                            $(".chat-logs").append(reply);
                        }
                        $(".chat-logs").scrollTop($(".chat-logs")[0].scrollHeight);
                    }
                });
            }
        } else {
            $(".chat-logs").append('<div class="chat-msg bot" style="color: red;">Please fill out the input.</div>');
            $(".chat-logs").scrollTop($(".chat-logs")[0].scrollHeight);
        }
    });
});
