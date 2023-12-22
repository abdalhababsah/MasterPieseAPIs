(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  };
  spinner();


  // Initiate the wowjs
  new WOW().init();


  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.sticky-top').css('top', '0px');
    } else {
      $('.sticky-top').css('top', '-100px');
    }
  });


  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });


  // Header carousel
  $(".header-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    items: 1,
    dots: true,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>'
    ]
  });


  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    center: true,
    margin: 24,
    dots: true,
    loop: true,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      992: {
        items: 3
      }
    }
  });

})(jQuery);



// js --------------------------------------------------
let signupButtonNav = document.getElementById('signupBtn');
let loginButtonNav = document.getElementById('loginbtn');
// let signupButtonNav1 = document.getElementById('signupBtn1');
// Check if the user is logged in
const roleId = sessionStorage.getItem('roleiId'); // Use 'roleiId' instead of 'roleId'
const isLoggedIn = sessionStorage.getItem('isLoggedin');

if (isLoggedIn === 'true' && roleId === '1') {
  signupButtonNav.textContent = 'Dashboard';
  signupButtonNav.addEventListener('click', (e) => {
    window.location.href = 'admindashboard';
  });
  // signupButtonNav1.textContent = 'Dashboard';
  // signupButtonNav1.addEventListener('click', (e) => {
  //   window.location.href = 'admindashboard';
  // });
  loginButtonNav.addEventListener('click', (e) => {
    // Log out logic
    console.log('Logout button clicked');
    window.location.href = '/MasterPieseAPIs/JobPortal/src/index.html';
    sessionStorage.clear();
  });

} else if (isLoggedIn === 'true' && roleId === '2') {
  // Change text and behavior for logged-in users
  loginButtonNav.textContent = 'Log out';
  signupButtonNav.textContent = 'Dashboard';
  // signupButtonNav1.textContent = 'Dashboard';

  signupButtonNav.addEventListener('click', (e) => {
    window.location.href = '/MasterPieseAPIs/JobPortal/src/userDashBoard/index.html';
  });
  
  // signupButtonNav1.addEventListener('click', (e) => {
  //   window.location.href = '/MasterPieseAPIs/JobPortal/src/userDashBoard/index.html';
  // });
  loginButtonNav.addEventListener('click', (e) => {
    window.location.href = '/MasterPieseAPIs/JobPortal/src/index.html';
    sessionStorage.clear();
  });
} else {
  // signupButtonNav1.addEventListener('click', (e) => {
  //   window.location.href = 'loginandsighnup.html';
  // });
  signupButtonNav.addEventListener('click', (e) => {
    window.location.href = 'loginandsighnup.html';
  });

  loginButtonNav.addEventListener('click', (e) => {
    window.location.href = 'loginandsighnup.html';
  });
}
// C:\xampp\htdocs\MasterPieseAPIsGithub\MasterPieseAPIs\JobPortal\src\userDashBoard\index.html