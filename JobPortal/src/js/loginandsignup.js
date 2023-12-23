const wrapper = document.querySelector(".wrapper"),
  signupHeader = document.querySelector(".signup header"),
  loginHeader = document.querySelector(".login header");

loginHeader.addEventListener("click", () => {
  wrapper.classList.add("active");
});
signupHeader.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  // Validation
  var emailError = "";
  var passwordError = "";
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (email.trim() === "") {
    emailError = "Email is required";
  } else if (!emailPattern.test(email)) {
    emailError = "Please enter a valid email address";
  }
  if (password.trim() === "") {
    passwordError = "Password is required";
  } else if (password.length < 6 || password.length > 18) {
    passwordError = "Password should be between 6-18 characters";
  }
  document.getElementById('email-check').innerHTML = emailError;
  document.getElementById('pass-check').innerHTML = passwordError;

  if (emailError !== "" || passwordError !== "") {
    return;
  }

  //http://localhost/API/server/login_oop.php Send the username and password to the server for authentication
  var user = { email: email, password: password };

  fetch("http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/loginAndRegister/login.php", {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" }
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then((data) => {
      // Check if the validation is true or false
      if (data.STATUS === true && data.ROLE == 2) {
        sessionStorage.setItem("userid", data.USER_ID);
        sessionStorage.setItem("roleiId", data.ROLE)

        sessionStorage.setItem("mainProffision", data.mainProffision)
           
        sessionStorage.setItem("isLoggedin", "true");
        window.location.href = "/MasterPieseAPIs/JobPortal/src/index.html";
      } else if (data.STATUS === true && data.ROLE == 1) {
     
        sessionStorage.setItem("roleiId", data.ROLE)
        sessionStorage.setItem("userid", data.USER_ID);
        sessionStorage.setItem("isLoggedin", "true");
        window.location.href = "/MasterPieseAPIs/JobPortal/src/index.html";
      } else {
        alert("the email or password not valid")
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error('Fetch error:', error);
    });

});














document.getElementById('signupForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevents the default form submission

  var formData = new FormData(this); // 'this' refers to the form

  fetch('http://localhost/MasterPieseAPIsGithub/MasterPieseAPIs/server/User/loginAndRegister/nn.php', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);
      if (data.message) {
          alert("User registered successfully");
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});
