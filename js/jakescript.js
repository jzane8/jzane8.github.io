$(document).ready(function() {
  // Set active sidebar tab based on current page
  setActivePage();
  
  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Create theme toggle button if it doesn't exist
  if (!$('.theme-toggle').length) {
    $('body').append('<button class="theme-toggle" aria-label="Toggle theme"><span>S</span></button>');
  }
  
  // Create mobile theme toggle button if it doesn't exist
  if (!$('.theme-toggle-mobile').length && isMobile()) {
    $('body').append('<button class="theme-toggle-mobile" aria-label="Toggle theme"><span>S</span></button>');
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
        <a href = "/wheel.html"> Spin The Wheel!</a>
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

// Session Tracking and Advanced Puzzle System
class PuzzleSessionManager {
  constructor() {
    this.storageKey = 'wheelPuzzleSession';
    this.initSession();
  }
  
  initSession() {
    const saved = localStorage.getItem(this.storageKey);
    this.session = saved ? JSON.parse(saved) : {
      failureCount: 0,
      lastFailureTime: null,
      totalAttempts: 0,
      lastSuccessTime: null,
      currentCooldown: 0,
      puzzleHistory: []
    };
  }
  
  saveSession() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.session));
  }
  
  recordAttempt(puzzleType, success) {
    this.session.totalAttempts++;
    this.session.puzzleHistory.push({
      type: puzzleType,
      success: success,
      timestamp: Date.now()
    });
    
    if (success) {
      this.session.lastSuccessTime = Date.now();
      this.session.failureCount = Math.max(0, this.session.failureCount - 1); // Partial forgiveness
    } else {
      this.session.failureCount++;
      this.session.lastFailureTime = Date.now();
      this.session.currentCooldown = this.calculateCooldown();
    }
    
    this.saveSession();
  }
  
  calculateCooldown() {
    const baseCooldown = 30000; // 30 seconds
    return Math.min(baseCooldown * Math.pow(2, this.session.failureCount - 1), 300000); // Max 5 minutes
  }
  
  isInCooldown() {
    if (!this.session.lastFailureTime || this.session.currentCooldown === 0) return false;
    const timeSince = Date.now() - this.session.lastFailureTime;
    return timeSince < this.session.currentCooldown;
  }
  
  getRemainingCooldown() {
    if (!this.isInCooldown()) return 0;
    const timeSince = Date.now() - this.session.lastFailureTime;
    return Math.max(0, this.session.currentCooldown - timeSince);
  }
  
  shouldResetSession() {
    if (!this.session.lastFailureTime) return false;
    const timeSince = Date.now() - this.session.lastFailureTime;
    return timeSince > 86400000; // 24 hours
  }
  
  resetSession() {
    this.session = {
      failureCount: 0,
      lastFailureTime: null,
      totalAttempts: 0,
      lastSuccessTime: null,
      currentCooldown: 0,
      puzzleHistory: []
    };
    this.saveSession();
  }
  
  getAvailablePuzzles() {
    const allPuzzles = ['sequence', 'math', 'memory', 'cipher', 'logic'];
    
    if (this.session.failureCount === 0) {
      return allPuzzles; // All puzzles available
    } else if (this.session.failureCount <= 2) {
      return allPuzzles.filter(p => p !== 'sequence'); // Remove easiest
    } else if (this.session.failureCount <= 4) {
      return ['memory', 'cipher', 'logic']; // Only hardest 3
    } else {
      return ['cipher', 'logic']; // Only hardest 2
    }
  }
  
  getDifficultyLevel() {
    if (this.session.failureCount === 0) return 'normal';
    if (this.session.failureCount <= 2) return 'increased';
    if (this.session.failureCount <= 4) return 'hard';
    return 'extreme';
  }
}

// Initialize session manager
const sessionManager = new PuzzleSessionManager();

// Theme Management and Advanced Puzzle Logic
$(document).ready(function() {
  // Check if session should be reset (24+ hours since last failure)
  if (sessionManager.shouldResetSession()) {
    sessionManager.resetSession();
  }
  
  // Legacy puzzle logic (now part of rotating system)
  let puzzleSequence = [];
  const correctSequence = ['JR', 'JZ', 'LB'];
  
  // Theme toggle click handler for both desktop and mobile buttons
  $('.theme-toggle, .theme-toggle-mobile').on('click', function(e) {
    e.preventDefault();
    
    // Check if user is in cooldown
    if (sessionManager.isInCooldown()) {
      showCooldownMessage();
      return;
    }
    
    // Initialize and show puzzle
    initializePuzzleModal();
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

// Advanced Puzzle System Functions
let currentPuzzle = null;
let puzzleData = {};

// Konami-style cheat code system
let cheatSequence = [];
const correctCheatSequence = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

// Add keydown listener for cheat code
$(document).keydown(function(e) {
  cheatSequence.push(e.key);
  
  // Keep only the last 4 keys
  if (cheatSequence.length > 4) {
    cheatSequence.shift();
  }
  
  // Check if correct sequence was entered
  if (cheatSequence.length === 4 && 
      JSON.stringify(cheatSequence) === JSON.stringify(correctCheatSequence)) {
    
    // Clear the cooldown and reset failure count
    if (sessionManager.isInCooldown() || sessionManager.session.failureCount > 0) {
      sessionManager.session.currentCooldown = 0;
      sessionManager.session.lastFailureTime = null;
      sessionManager.session.failureCount = 0;
      sessionManager.saveSession();
      
      // Show cheat activation feedback
      showCheatActivated();
      
      // Close any open cooldown modal
      $('.cooldown-modal').remove();
    }
    
    // Reset sequence
    cheatSequence = [];
  }
});

function showCheatActivated() {
  // Create cheat activation modal
  const cheatModal = $(`
    <div class="cheat-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10001;
    ">
      <div style="
        background: linear-gradient(45deg, #4CAF50, #45a049);
        color: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: pulse 0.6s ease-in-out;
      ">
        <h3 style="margin-bottom: 15px;">🎮 Cheat Activated!</h3>
        <p style="margin-bottom: 20px;">Cooldown timer removed and failures reset.</p>
        <p style="color: #e8f5e8; font-size: 14px; margin-bottom: 20px;">↑↓←→ sequence detected</p>
        <button onclick="$('.cheat-modal').fadeOut(300)" style="
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        ">Continue</button>
      </div>
    </div>
  `);
  
  // Add pulse animation
  $('head').append(`
    <style>
      @keyframes pulse {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    </style>
  `);
  
  $('body').append(cheatModal);
  
  // Auto-close after 3 seconds
  setTimeout(() => {
    cheatModal.fadeOut(300);
  }, 3000);
}

function showCooldownMessage() {
  const remaining = sessionManager.getRemainingCooldown();
  const seconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  
  let timeString = minutes > 0 ? `${minutes}:${displaySeconds.toString().padStart(2, '0')}` : `${seconds}s`;
  
  // Create cooldown modal
  const cooldownModal = $(`
    <div class="cooldown-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    ">
      <div style="
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      ">
        <h3 style="color: #ff4444; margin-bottom: 15px;">🔒 Access Denied</h3>
        <p style="margin-bottom: 20px;">Too many failed attempts. Please wait:</p>
        <div id="cooldown-timer" style="font-size: 24px; font-weight: bold; color: #ff4444; margin-bottom: 20px;">${timeString}</div>
        <p style="color: #666; font-size: 14px;">Attempts: ${sessionManager.session.failureCount} | Difficulty: ${sessionManager.getDifficultyLevel().toUpperCase()}</p>
        <button onclick="$('.cooldown-modal').remove()" style="
          background: #ccc;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 15px;
        ">Close</button>
      </div>
    </div>
  `);
  
  $('body').append(cooldownModal);
  
  // Update timer every second
  const timer = setInterval(() => {
    const newRemaining = sessionManager.getRemainingCooldown();
    if (newRemaining <= 0) {
      clearInterval(timer);
      cooldownModal.remove();
    } else {
      const newSeconds = Math.ceil(newRemaining / 1000);
      const newMinutes = Math.floor(newSeconds / 60);
      const newDisplaySeconds = newSeconds % 60;
      const newTimeString = newMinutes > 0 ? `${newMinutes}:${newDisplaySeconds.toString().padStart(2, '0')}` : `${newSeconds}s`;
      $('#cooldown-timer').text(newTimeString);
    }
  }, 1000);
}

function initializePuzzleModal() {
  const availablePuzzles = sessionManager.getAvailablePuzzles();
  const selectedPuzzle = availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)];
  
  currentPuzzle = selectedPuzzle;
  setupPuzzle(selectedPuzzle);
  $('.puzzle-modal').fadeIn(300);
}

function setupPuzzle(puzzleType) {
  const difficultyLevel = sessionManager.getDifficultyLevel();
  const container = $('.puzzle-container');
  
  // Clear previous puzzle
  container.empty();
  
  // Add difficulty indicator
  container.append(`<div class="difficulty-indicator" style="text-align: center; margin-bottom: 15px; color: #666; font-size: 12px;">
    Difficulty: ${difficultyLevel.toUpperCase()} | Attempts: ${sessionManager.session.totalAttempts} | Failures: ${sessionManager.session.failureCount}
  </div>`);
  
  switch (puzzleType) {
    case 'sequence':
      setupSequencePuzzle(container, difficultyLevel);
      break;
    case 'math':
      setupMathPuzzle(container, difficultyLevel);
      break;
    case 'memory':
      setupMemoryPuzzle(container, difficultyLevel);
      break;
    case 'cipher':
      setupCipherPuzzle(container, difficultyLevel);
      break;
    case 'logic':
      setupLogicPuzzle(container, difficultyLevel);
      break;
  }
}

function setupSequencePuzzle(container, difficulty) {
  container.append(`
    <div class="puzzle-hint" style="text-align: center; margin-bottom: 20px; font-weight: bold;">
      1.F 2.M 3.K
    </div>
    <div class="puzzle-buttons" style="display: flex; gap: 10px; justify-content: center;">
      <button class="puzzle-button" data-value="JR">JR</button>
      <button class="puzzle-button" data-value="LB">LB</button>
      <button class="puzzle-button" data-value="JZ">JZ</button>
    </div>
  `);
  
  puzzleData = { correctSequence: ['JR', 'JZ', 'LB'], currentSequence: [] };
  attachSequenceHandlers();
}

function setupMathPuzzle(container, difficulty) {
  const answer = 42;
  container.append(`
    <div class="puzzle-hint" style="text-align: center; margin-bottom: 20px;">
      <p style="font-size: 18px; margin-bottom: 15px;">2, 6, 12, 20, 30, ?</p>
      <input type="number" id="math-input" style="
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
        width: 100px;
        text-align: center;
        margin-bottom: 15px;
      " placeholder="?">
      <br>
      <button id="math-submit" style="
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
      ">Submit</button>
    </div>
  `);
  
  puzzleData = { answer: answer };
  attachMathHandlers();
}

function setupMemoryPuzzle(container, difficulty) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  const sequence = [];
  for (let i = 0; i < 6; i++) {
    sequence.push(colors[Math.floor(Math.random() * colors.length)]);
  }
  
  container.append(`
    <div class="puzzle-hint" style="text-align: center; margin-bottom: 20px;">
      <div id="sequence-display" style="display: flex; gap: 5px; justify-content: center; margin-bottom: 15px;">
        ${sequence.map((color, i) => `<div style="width: 30px; height: 30px; background: ${color}; border: 2px solid #333; border-radius: 3px;"></div>`).join('')}
      </div>
      <div id="memory-buttons" style="display: none; flex-wrap: wrap; gap: 5px; justify-content: center;">
        ${colors.map((color, i) => `<button class="memory-btn" data-color="${color}" style="width: 30px; height: 30px; background: ${color}; border: 2px solid #333; border-radius: 3px; cursor: pointer;"></button>`).join('')}
      </div>
      <button id="start-memory" style="background: #2196F3; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Begin</button>
    </div>
  `);
  
  puzzleData = { sequence: sequence, userSequence: [], phase: 'show' };
  attachMemoryHandlers();
}

function setupCipherPuzzle(container, difficulty) {
  container.append(`
    <div class="puzzle-hint" style="text-align: center; margin-bottom: 20px;">
      <p style="font-size: 18px; font-family: monospace; margin-bottom: 15px; background: #f5f5f5; padding: 10px; border-radius: 5px;">LOXVMF</p>
      <p style="color: #666; font-size: 12px; margin-bottom: 15px;">Decode this message</p>
      <input type="text" id="cipher-input" style="
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
        width: 200px;
        text-align: center;
        margin-bottom: 15px;
      " placeholder="decoded message">
      <br>
      <button id="cipher-submit" style="
        background: #FF9800;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
      ">Submit</button>
    </div>
  `);
  
  puzzleData = { answer: 'ILUSJC' };
  attachCipherHandlers();
}

function setupLogicPuzzle(container, difficulty) {
  container.append(`
    <div class="puzzle-hint" style="text-align: center; margin-bottom: 20px;">
      <p style="font-size: 24px; margin-bottom: 15px;">★○★○★?</p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button class="logic-btn" data-value="○" style="background: white; border: 2px solid #333; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">○</button>
        <button class="logic-btn" data-value="★" style="background: white; border: 2px solid #333; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">★</button>
        <button class="logic-btn" data-value="◆" style="background: white; border: 2px solid #333; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">◆</button>
        <button class="logic-btn" data-value="♦" style="background: white; border: 2px solid #333; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 18px;">♦</button>
      </div>
    </div>
  `);
  
  puzzleData = { answer: '○' };
  attachLogicHandlers();
}

// Puzzle-specific handlers
function attachSequenceHandlers() {
  $('.puzzle-button').on('click', function() {
    const value = $(this).data('value');
    puzzleData.currentSequence.push(value);
    
    const isCorrectSoFar = puzzleData.currentSequence.every((val, index) => val === puzzleData.correctSequence[index]);
    
    if (!isCorrectSoFar) {
      handlePuzzleFailure();
    } else {
      $(this).addClass('correct');
      if (puzzleData.currentSequence.length === puzzleData.correctSequence.length) {
        handlePuzzleSuccess();
      }
    }
  });
}

function attachMathHandlers() {
  $('#math-submit').on('click', function() {
    const answer = parseInt($('#math-input').val());
    if (answer === puzzleData.answer) {
      handlePuzzleSuccess();
    } else {
      handlePuzzleFailure();
    }
  });
  
  $('#math-input').on('keypress', function(e) {
    if (e.which === 13) $('#math-submit').click();
  });
}

function attachMemoryHandlers() {
  $('#start-memory').on('click', function() {
    $(this).hide();
    setTimeout(() => {
      $('#sequence-display').hide();
      $('#memory-buttons').show();
      puzzleData.phase = 'input';
    }, 3000);
  });
  
  $('.memory-btn').on('click', function() {
    if (puzzleData.phase !== 'input') return;
    
    const color = $(this).data('color');
    puzzleData.userSequence.push(color);
    
    $(this).css('border-color', '#4CAF50');
    
    if (puzzleData.userSequence.length === puzzleData.sequence.length) {
      if (JSON.stringify(puzzleData.userSequence) === JSON.stringify(puzzleData.sequence)) {
        handlePuzzleSuccess();
      } else {
        handlePuzzleFailure();
      }
    }
  });
}

function attachCipherHandlers() {
  $('#cipher-submit').on('click', function() {
    const answer = $('#cipher-input').val().toUpperCase().trim();
    if (answer === puzzleData.answer) {
      handlePuzzleSuccess();
    } else {
      handlePuzzleFailure();
    }
  });
  
  $('#cipher-input').on('keypress', function(e) {
    if (e.which === 13) $('#cipher-submit').click();
  });
}

function attachLogicHandlers() {
  $('.logic-btn').on('click', function() {
    const value = $(this).data('value');
    if (value === puzzleData.answer) {
      handlePuzzleSuccess();
    } else {
      handlePuzzleFailure();
    }
  });
}

function handlePuzzleSuccess() {
  sessionManager.recordAttempt(currentPuzzle, true);
  
  // Visual success feedback
  $('.puzzle-container').html(`
    <div style="text-align: center; color: #4CAF50;">
      <h3>✅ Puzzle Solved!</h3>
      <p>Granting access...</p>
    </div>
  `);
  
  setTimeout(() => {
    $('.puzzle-modal').fadeOut(300, function() {
      createHeartAnimation();
      toggleToSoniaTheme();
      setTimeout(() => {
        showCustomPopup();
      }, 400);
    });
  }, 1500);
}

function handlePuzzleFailure() {
  sessionManager.recordAttempt(currentPuzzle, false);
  
  // Visual failure feedback
  $('.puzzle-container').append(`
    <div style="text-align: center; color: #ff4444; margin-top: 15px;">
      <p><strong>❌ Incorrect!</strong></p>
      <p>Failures: ${sessionManager.session.failureCount}</p>
    </div>
  `);
  
  setTimeout(() => {
    $('.puzzle-modal').fadeOut(300);
  }, 2000);
}

// Handle window resize
$(window).on('resize', function() {
  // Add or remove mobile button based on screen size
  if (isMobile()) {
    if (!$('.theme-toggle-mobile').length) {
      $('body').append('<button class="theme-toggle-mobile" aria-label="Toggle theme"><span>S</span></button>');
      // Re-attach event handlers
      $('.theme-toggle-mobile').on('click', function(e) {
        e.preventDefault();
        if (sessionManager.isInCooldown()) {
          showCooldownMessage();
          return;
        }
        initializePuzzleModal();
      });
    }
  } else {
    $('.theme-toggle-mobile').remove();
  }
});
