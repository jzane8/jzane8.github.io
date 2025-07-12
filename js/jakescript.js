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

// Theme Management
$(document).ready(function() {
  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  // Create theme toggle button
  if (!$('.theme-toggle').length) {
      $('body').append('<button class="theme-toggle" aria-label="Toggle theme">For Sonia</button>');
  }
  
  // Create puzzle modal
  if (!$('.puzzle-modal').length) {
      $('body').append(`
          <div class="puzzle-modal">
              <div class="puzzle-container">
                  <div class="puzzle-hint">1.F 2.M 3.K</div>
                  <div class="puzzle-buttons">
                      <button class="puzzle-button" data-value="JR">JR</button>
                      <button class="puzzle-button" data-value="LB">LB</button>
                      <button class="puzzle-button" data-value="JZ">JZ</button>
                  </div>
              </div>
          </div>
      `);
  }
  
  // Create heart SVG for clip-path
  if (!$('#heart-svg').length) {
      $('body').append(`
          <svg id="heart-svg" width="0" height="0">
              <defs>
                  <clipPath id="heart-clip-path" clipPathUnits="objectBoundingBox">
                      <path d="M0.5,0.9 C0.5,0.9 0.1,0.6 0.1,0.4 C0.1,0.2 0.2,0.1 0.35,0.1 C0.45,0.1 0.5,0.15 0.5,0.25 C0.5,0.15 0.55,0.1 0.65,0.1 C0.8,0.1 0.9,0.2 0.9,0.4 C0.9,0.6 0.5,0.9 0.5,0.9 Z"/>
                  </clipPath>
              </defs>
          </svg>
      `);
  }
  
  // Create message popup
  if (!$('.message-popup').length) {
      $('body').append(`
          <div class="message-popup">
              <span class="close-popup">&times;</span>
              <p class="message-text">How does a movie sound? I'll buy tickets and provide optional commentary.</p>
              <p class="signature">-J</p>
          </div>
      `);
  }
  
  // Puzzle logic
  let puzzleSequence = [];
  const correctSequence = ['JR', 'JZ', 'LB'];
  
  // Theme toggle click handler
  $('.theme-toggle').on('click', function(e) {
      e.preventDefault();
      puzzleSequence = []; // Reset sequence
      $('.puzzle-modal').fadeIn(300);
  });
  
  // Puzzle button click handler
  $('.puzzle-button').on('click', function() {
      const value = $(this).data('value');
      puzzleSequence.push(value);
      
      // Check if the current sequence matches the start of the correct sequence
      const isCorrectSoFar = puzzleSequence.every((val, index) => val === correctSequence[index]);
      
      if (!isCorrectSoFar) {
          // Wrong sequence
          $(this).addClass('wrong');
          setTimeout(() => {
              $('.puzzle-button').removeClass('wrong correct');
              puzzleSequence = [];
          }, 500);
      } else {
          // Correct so far
          $(this).addClass('correct');
          
          // Check if complete
          if (puzzleSequence.length === correctSequence.length) {
              // Puzzle solved!
              setTimeout(() => {
                  $('.puzzle-modal').fadeOut(300, function() {
                      $('.puzzle-button').removeClass('correct');
                      startHeartTransition();
                      // Show message popup after puzzle is solved
                      setTimeout(() => {
                          $('.message-popup').fadeIn(300);
                      }, 900);
                  });
              }, 500);
          }
      }
  });
  
  // Close puzzle modal on background click
  $('.puzzle-modal').on('click', function(e) {
      if (e.target === this) {
          $(this).fadeOut(300);
          puzzleSequence = [];
          $('.puzzle-button').removeClass('wrong correct');
      }
  });
  
  // Close message popup
  $('.close-popup').on('click', function() {
      $('.message-popup').fadeOut(300);
  });
});

// Heart transition animation
function startHeartTransition() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Get button position for animation origin
  const button = $('.theme-toggle')[0];
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Create transition container
  const transitionContainer = $('<div class="theme-transition-container"></div>');
  
  // Create the heart animation element
  const heartElement = $(`
      <div style="
          position: absolute;
          top: ${centerY}px;
          left: ${centerX}px;
          width: 0;
          height: 0;
          background-color: ${newTheme === 'dark' ? '#1a1a2e' : '#AFEEEE'};
          clip-path: url(#heart-clip-path);
          transform: translate(-50%, -50%);
          transition: all 0.8s ease-out;
      "></div>
  `);
  
  transitionContainer.append(heartElement);
  $('body').append(transitionContainer);
  
  // Start the animation
  setTimeout(() => {
      heartElement.css({
          width: Math.max(window.innerWidth, window.innerHeight) * 2 + 'px',
          height: Math.max(window.innerWidth, window.innerHeight) * 2 + 'px'
      });
  }, 50);
  
  // Change theme midway through animation
  setTimeout(() => {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
  }, 400);
  
  // Clean up after animation
  setTimeout(() => {
      transitionContainer.remove();
  }, 850);
}

// Update theme icon
function updateThemeIcon(theme) {
  // No longer using icons, just keeping the "For Sonia" text
}
