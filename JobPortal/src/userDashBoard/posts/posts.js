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





document.getElementById('ProfileLoction').addEventListener('click', function() {

    window.location.href = '../profile.html';
});




  // Function to fetch and display posts
  async function fetchPosts(userID) {
    try {
      const response = await fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/postsCrud/ReadSpacificUserPosts.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ UserID: userID })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const posts = await response.json();
      const postContainer = document.getElementById('postContainer');

      posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'col-lg-4';
        
        // Convert the received date format to "12 DEC"
        const receivedDate = post.Date; // Assuming post.Date is your date field
        const dateObj = new Date(receivedDate);
        const monthNames = [
          'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
          'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
        ];
        const month = monthNames[dateObj.getMonth()];
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        const formattedDate = `${day} ${month}`;
  
        card.innerHTML =   `
          <div class="card card-margin">
            <div class="card-header no-border">
              <h5 class="card-title">${post.YourNeed}</h5>
            </div>
            <div class="card-body pt-0">
              <div class="widget-49">
                <!-- Populate card body with post data -->
                <div class="widget-49-title-wrapper">
                <div class="widget-49-date-primary">
                  <span class="widget-49-date-day">${day}</span>
                  <span class="widget-49-date-month">${month.toLowerCase()}</span>
                </div>
                <div class="widget-49-meeting-info">
                  <span class="widget-49-pro-title"
                    >I Knew</span
                  >
                  <span class="widget-49-meeting-time"
                    >${post.YourProvide}</span
                  >
                </div>
              </div>
              <div class="mt-4 widget-49-meeting-info">
                Description
              </div>
              <ul class="widget-49-meeting-points">
                
                <li class="widget-49-meeting-item">
                  <span>${post.Description}</span>
                </li>
                
              </ul>
                <!-- ... -->
                <div class="widget-49-meeting-action">
                  <button class="btn btn-sm btn-flash-border-primary" onclick="deletePost(${post.PostID})">Delete Post</button>
                </div>
              </div>
            </div>
          </div>

        </div>
        `;
        postContainer.appendChild(card);
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Function to delete a post
  async function deletePost(postID) {
    try {
      const response = await fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/postsCrud/DeletePost.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ PostID: postID })
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      const result = await response.json();
      console.log(result.message); // Log success message
      // Optionally, remove the deleted post from the UI
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch and display posts when the page loads
  fetchPosts();

  // Call the function with the stored userID
document.addEventListener("DOMContentLoaded", function() {

    let userID = sessionStorage.getItem("userid");
    if(!userID)(
        userID=1
    )
    fetchPosts(userID);
});


