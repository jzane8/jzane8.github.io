$(document).ready(function() {
  // Set active sidebar tab based on current page
  setActivePage();
  
  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Create theme toggle button if it doesn't exist
  if (!$('.theme-toggle').length) {
    $('body').append('<button class="theme-toggle" aria-label="Toggle theme"><span>For S</span></button>');
  }
  
  // Create mobile theme toggle button if it doesn't exist
  if (!$('.theme-toggle-mobile').length && isMobile()) {
    $('body').append('<button class="theme-toggle-mobile" aria-label="Toggle theme"><span>For S</span></button>');
  }
  
  // Create puzzle modal if it doesn't exist
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
  
  // Create message popup if it doesn't exist
  if (!$('.message-popup').length) {
    $('body').append(`
      <div class="message-popup">
        <span class="close-popup">&times;</span>
       
      </div>
    `);
  }
  
  // Check if intro should be minimized based on localStorage
  if (localStorage.getItem('introMinimized') === 'true') {
    $('.intro').addClass('minimized');
  }
  
  // Smooth scrolling for anchor links
  $('a[href^="#"]').on('click', function(event) {
    event.preventDefault();
    const target = $($.attr(this, 'href'));
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top - 100
      }, 500);
    }
  });
  
  // Enhanced scroll reveal animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
  
  // Smooth hover effects for work items
  $('.work-item').on('mouseenter', function() {
    $(this).css('transform', 'translateX(10px) translateY(-5px)');
  });
  
  $('.work-item').on('mouseleave', function() {
    $(this).css('transform', 'translateX(0) translateY(0)');
  });
});

// Device detection
function isMobile() {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

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

// Function to set active page in navigation
function setActivePage() {
  const currentPage = window.location.pathname.split("/").pop();
  
  // Remove all active classes first
  $('.sidebar-tab').removeClass('active');
  
  // Add active class to current page
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

// Theme Management and Puzzle Logic
$(document).ready(function() {
  // Puzzle logic
  let puzzleSequence = [];
  const correctSequence = ['JR', 'JZ', 'LB'];
  
  // Theme toggle click handler for both desktop and mobile buttons
  $('.theme-toggle, .theme-toggle-mobile').on('click', function(e) {
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
            // Create heart animation
            createHeartAnimation();
            // Toggle to Sonia theme
            toggleToSoniaTheme();
            // Show message popup after theme change
            setTimeout(() => {
              showCustomPopup();
            }, 400);
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
  
  // Close message popup on background click
  $('.message-popup').on('click', function(e) {
    if (e.target === this) {
      $(this).fadeOut(300);
    }
  });
});

// Simple theme toggle function
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Toggle to Sonia theme
function toggleToSoniaTheme() {
  document.documentElement.setAttribute('data-theme', 'sonia');
  localStorage.setItem('theme', 'sonia');
}

// Create heart animation
function createHeartAnimation() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      createHeart();
    }, i * 200);
  }
}

function createHeart() {
  const heart = document.createElement('div');
  heart.innerHTML = '❤️';
  heart.style.position = 'fixed';
  heart.style.left = Math.random() * window.innerWidth + 'px';
  heart.style.top = window.innerHeight + 'px';
  heart.style.fontSize = '16px';
  heart.style.zIndex = '9999';
  heart.style.pointerEvents = 'none';
  heart.style.transition = 'all 2s ease-out';
  heart.style.opacity = '0.7';
  
  document.body.appendChild(heart);
  
  // Animate heart floating up subtly
  setTimeout(() => {
    heart.style.top = window.innerHeight - 200 + 'px';
    heart.style.opacity = '0';
    heart.style.transform = 'translateX(' + (Math.random() * 100 - 50) + 'px)';
  }, 100);
  
  // Remove heart after animation
  setTimeout(() => {
    if (heart.parentNode) {
      heart.parentNode.removeChild(heart);
    }
  }, 2500);
}

// Show custom popup with improved animation
function showCustomPopup() {
  $('.message-popup').fadeIn(300);
}

// TransparenC page specific functions
function openMacModal() {
  document.getElementById('macModal').style.display = 'block';
}

function closeMacModal() {
  document.getElementById('macModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('macModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Handle window resize
$(window).on('resize', function() {
  // Add or remove mobile button based on screen size
  if (isMobile()) {
    if (!$('.theme-toggle-mobile').length) {
      $('body').append('<button class="theme-toggle-mobile" aria-label="Toggle theme"><span>For S</span></button>');
      // Re-attach event handlers
      $('.theme-toggle-mobile').on('click', function(e) {
        e.preventDefault();
        puzzleSequence = [];
        $('.puzzle-modal').fadeIn(300);
      });
    }
  } else {
    $('.theme-toggle-mobile').remove();
  }
});
