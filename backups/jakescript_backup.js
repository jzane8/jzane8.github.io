$(document).ready(function() {
  // Set active sidebar tab based on current page
  setActivePage();
  
  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Create theme toggle button if it doesn't exist
  if (!$('.theme-toggle').length) {
    $('body').append('<button class="theme-toggle" aria-label="Toggle theme">For Sonia</button>');
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
        <p class="message-text">How does a movie sound? I'll buy tickets and provide optional commentary.</p>
        <p class="signature">-J</p>
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

// Theme Management
$(document).ready(function() {
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
            // Simple theme toggle
            toggleTheme();
            // Show message popup after theme change
            setTimeout(() => {
              $('.message-popup').fadeIn(300);
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
