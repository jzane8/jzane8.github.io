$(document).ready(function() {
  // Set active sidebar tab based on current page
  setActivePage();
  
  // Add smooth scrolling for anchor links
  $('a[href^="#"]').on('click', function(event) {
      event.preventDefault();
      $('html, body').animate({
          scrollTop: $($.attr(this, 'href')).offset().top - 100
      }, 500);
  });
  
  // Add hover effects for work history sections
  $('.body h4').hover(
      function() {
          $(this).next('p, a').css('background-color', '#f8f9fa');
      },
      function() {
          $(this).next('p, a').css('background-color', '');
      }
  );
  
  // Animate elements when they come into view
  $(window).scroll(function() {
      $('.body h3, .body p').each(function() {
          if (isElementInViewport(this) && !$(this).hasClass('animated')) {
              $(this).addClass('animated').css({
                  'opacity': '0',
                  'transform': 'translateY(20px)'
              }).animate({
                  'opacity': '1',
                  'transform': 'translateY(0)'
              }, 500);
          }
      });
  });
  
  // Trigger scroll once to animate elements already in viewport
  $(window).trigger('scroll');
});

// Function to toggle intro section
function hideIntro() {
  $('.intro').toggleClass('minimized');
  
  // Save state in localStorage
  if ($('.intro').hasClass('minimized')) {
      localStorage.setItem('introMinimized', 'true');
  } else {
      localStorage.setItem('introMinimized', 'false');
  }
}

// Check if intro should be minimized based on localStorage
$(document).ready(function() {
  if (localStorage.getItem('introMinimized') === 'true') {
      $('.intro').addClass('minimized');
  }
});

// Function to set active page in navigation
function setActivePage() {
  var currentPage = window.location.pathname.split("/").pop();
  
  if (currentPage === "" || currentPage === "index.html") {
      $('#about').addClass('active');
  } else if (currentPage === "projects.html") {
      $('#projects').addClass('active');
  } else if (currentPage === "music.html") {
      $('#music').addClass('active');
  } else if (currentPage === "contact.html") {
      $('#contact').addClass('active');
  }
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Add a simple typed effect to the main heading
$(document).ready(function() {
  if ($('.intro h2 b').length) {
      var text = $('.intro h2 b').text();
      $('.intro h2 b').text('');
      
      var i = 0;
      var typingEffect = setInterval(function() {
          if (i < text.length) {
              $('.intro h2 b').text($('.intro h2 b').text() + text.charAt(i));
              i++;
          } else {
              clearInterval(typingEffect);
          }
      }, 100);
  }
});