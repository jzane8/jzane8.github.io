import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { usePuzzle } from '../hooks/usePuzzle';
import PuzzleModal from './PuzzleModal';

/**
 * The red "S" button fixed at bottom-right.
 * Clicking it opens the puzzle system. On success it activates the
 * Sonia theme and shows a link to the Wheel of Fortune.
 */
export default function ThemeToggle() {
  const { activateSoniaTheme } = useTheme();
  const navigate = useNavigate();
  const puzzle = usePuzzle();

  const [showPuzzle, setShowPuzzle] = useState(false);
  const [showCooldown, setShowCooldown] = useState(false);
  const [showCheat, setShowCheat] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Listen for cheat code activation
  useEffect(() => {
    function onCheat() {
      setShowCheat(true);
      setShowCooldown(false);
      setTimeout(() => setShowCheat(false), 3000);
    }
    window.addEventListener('cheat-activated', onCheat);
    return () => window.removeEventListener('cheat-activated', onCheat);
  }, []);

  const handleClick = useCallback(() => {
    if (puzzle.isInCooldown()) {
      setShowCooldown(true);
      return;
    }
    setShowPuzzle(true);
  }, [puzzle]);

  const handlePuzzleSuccess = useCallback(() => {
    setShowPuzzle(false);
    // Heart animation
    createHeartAnimation();
    activateSoniaTheme();
    setTimeout(() => setShowSuccess(true), 400);
  }, [activateSoniaTheme]);

  const handlePuzzleFailure = useCallback(() => {
    setTimeout(() => setShowPuzzle(false), 2000);
  }, []);

  return (
    <>
      <button className="theme-toggle" onClick={handleClick} aria-label="Open puzzle">
        <span>S</span>
      </button>

      {/* Puzzle Modal */}
      {showPuzzle && (
        <PuzzleModal
          puzzle={puzzle}
          onSuccess={handlePuzzleSuccess}
          onFailure={handlePuzzleFailure}
          onClose={() => setShowPuzzle(false)}
        />
      )}

      {/* Cooldown Modal */}
      {showCooldown && (
        <CooldownModal puzzle={puzzle} onClose={() => setShowCooldown(false)} />
      )}

      {/* Cheat Activated Modal */}
      {showCheat && (
        <div
          className="puzzle-overlay"
          onClick={() => setShowCheat(false)}
          style={{ zIndex: 10001 }}
        >
          <div
            style={{
              background: 'linear-gradient(45deg, #4CAF50, #45a049)',
              color: 'white',
              padding: 30,
              borderRadius: 15,
              textAlign: 'center',
              maxWidth: 400,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              animation: 'pulse 0.6s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 15 }}>Cheat Activated!</h3>
            <p style={{ marginBottom: 20 }}>Cooldown timer removed and failures reset.</p>
            <p style={{ color: '#e8f5e8', fontSize: 14, marginBottom: 20 }}>
              Sequence detected
            </p>
            <button
              onClick={() => setShowCheat(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '10px 20px',
                borderRadius: 5,
                cursor: 'pointer',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Success Popup — link to Wheel */}
      {showSuccess && (
        <div className="message-popup">
          <button
            className="close-popup"
            onClick={() => setShowSuccess(false)}
          >
            &times;
          </button>
          <button
            className="react-button"
            style={{ background: '#28a745', fontSize: '1.1rem', padding: '12px 28px' }}
            onClick={() => {
              setShowSuccess(false);
              navigate('/wheel');
            }}
          >
            Spin The Wheel!
          </button>
        </div>
      )}
    </>
  );
}

/** Cooldown timer overlay */
function CooldownModal({ puzzle, onClose }) {
  const [remaining, setRemaining] = useState(puzzle.getRemainingCooldown());

  useEffect(() => {
    const id = setInterval(() => {
      const r = puzzle.getRemainingCooldown();
      if (r <= 0) {
        clearInterval(id);
        onClose();
      } else {
        setRemaining(r);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [puzzle, onClose]);

  const seconds = Math.ceil(remaining / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${seconds}s`;

  return (
    <div className="puzzle-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        style={{
          background: 'white',
          padding: 30,
          borderRadius: 15,
          textAlign: 'center',
          maxWidth: 400,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: '#ff4444', marginBottom: 15 }}>Access Denied</h3>
        <p style={{ marginBottom: 20 }}>Too many failed attempts. Please wait:</p>
        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4444', marginBottom: 20 }}>
          {timeStr}
        </div>
        <p style={{ color: '#666', fontSize: 14 }}>
          Attempts: {puzzle.session.failureCount} | Difficulty:{' '}
          {puzzle.getDifficultyLevel().toUpperCase()}
        </p>
        <button
          onClick={onClose}
          style={{
            background: '#ccc',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 5,
            cursor: 'pointer',
            marginTop: 15,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/** Float hearts up from the bottom of the screen */
function createHeartAnimation() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.textContent = '\u2764\uFE0F';
      Object.assign(heart.style, {
        position: 'fixed',
        left: `${Math.random() * window.innerWidth}px`,
        top: `${window.innerHeight}px`,
        fontSize: '16px',
        zIndex: '9999',
        pointerEvents: 'none',
        transition: 'all 2s ease-out',
        opacity: '0.7',
      });
      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.top = `${window.innerHeight - 200}px`;
        heart.style.opacity = '0';
        heart.style.transform = `translateX(${Math.random() * 100 - 50}px)`;
      });

      setTimeout(() => heart.remove(), 2500);
    }, i * 200);
  }
}
