import { useState, useEffect } from 'react';
import PixelArtDisplay from '../components/PixelArtDisplay';
import PolSim from '../components/PolSim';

/**
 * React Demo page — entry point for the secret-code system.
 * Typing "cynic.exe" exactly in the PixelArtDisplay textarea unlocks the
 * Political Simulator. A back button returns to the ASCII display.
 */

const INITIAL_PARTIES = [
  { id: 1, name: 'x', count: 0, position: 'left', visible: true, color: '#35bbdcff' },
  { id: 2, name: 'y', count: 0, position: 'right', visible: true, color: '#dc3545' },
];

const SECRET_CODE = 'cynic.exe';

export default function ReactDemo() {
  const [unlocked, setUnlocked] = useState(false);
  const [currentArt, setCurrentArt] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentArt === SECRET_CODE) {
      setUnlocked(true);
      setMessage('Access granted! Secret code detected in ASCII art.');
    }
  }, [currentArt]);

  if (unlocked) {
    return (
      <div className="react-container">
        <div className="secret-code-section">
          <p className="secret-code-message success">{message}</p>
          <button
            className="react-button"
            onClick={() => {
              setUnlocked(false);
              setMessage('');
            }}
            style={{ marginTop: 10 }}
          >
            &larr; Back to ASCII Display
          </button>
        </div>
        <PolSim initialParties={INITIAL_PARTIES} />
      </div>
    );
  }

  return (
    <div className="react-container">
      <PixelArtDisplay onAsciiChange={setCurrentArt} />
    </div>
  );
}
