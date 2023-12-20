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
      var value = $("#data").val().trim();
      if (value !== '') {
          var msg = '<div class="chat-msg user"><p>'+ value +'</p></div>';
          $(".chat-logs").append(msg);
          $("#data").val('');

          // AJAX request to get the bot's response
          $.ajax({
              url: 'http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/chatbot.php',
              type: 'POST',
              data: { text: value },
              success: function(result){
                  var reply = '<div class="chat-msg bot"><p>'+ result +'</p></div>';
                  $(".chat-logs").append(reply);
                  $(".chat-logs").scrollTop($(".chat-logs")[0].scrollHeight);
              }
          });
      } else {
          $(".chat-logs").append('<div class="chat-msg bot" style="color: red;">Please fill out the input.</div>');
          $(".chat-logs").scrollTop($(".chat-logs")[0].scrollHeight);
      }
  });
});
