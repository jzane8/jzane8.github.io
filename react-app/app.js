// Main Application Entry Point
// This file manages the secret code system and renders either PixelArtDisplay or PoliticalSimulator

// Import React hooks for state management
// useState: manages component state (secret code entered status)
// useEffect: monitors changes to ASCII art to check for secret code
// https://react.dev/reference/react/useState
// https://react.dev/reference/react/useEffect
const { useState, useEffect } = React;

// Define counter titles array for PoliticalSimulator
const initParties = [
      {
        id: 1,
        name: "x",
        count: 0,
        position: "left",
        visible: true,
        color: "#35bbdcff"
        },
        {
        id: 2,
        name: "y",
        count: 0,
        position: "right",
        visible: true,
        color: "#dc3545"
        }
];

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
// Manages secret code system and conditional rendering
function App() {
    // Secret code constant - change this to update the secret code
    const SECRET_CODE = "cynic.exe";
    
    // State to track if secret code has been entered
    // Initially false, so PixelArtDisplay shows by default
    const [secretCodeEntered, setSecretCodeEntered] = useState(false);
    
    // State for feedback message
    const [message, setMessage] = useState('');
    
    // State to hold the current ASCII art text from PixelArtDisplay
    // This will be monitored for the secret code
    const [currentAsciiArt, setCurrentAsciiArt] = useState('');
    
    // Effect to monitor ASCII art changes and check for secret code
    // This runs whenever currentAsciiArt changes
    useEffect(() => {
        // Check if the ASCII art contains the exact secret code
        // Must match exactly (case-sensitive, no partial matches)
        if (currentAsciiArt === SECRET_CODE) {
            setSecretCodeEntered(true);
            setMessage('Access granted! Secret code detected in ASCII art.');
        }
    }, [currentAsciiArt]);
    
    // Toggle back to ASCII display
    const handleBackToAscii = () => {
        setSecretCodeEntered(false);
        setMessage('');
    };
    
    return (
        <div>
            {/* Conditional Rendering based on secret code */}
            {/* If secret code entered, show PoliticalSimulator, else show PixelArtDisplay */}
            {/* Pass setCurrentAsciiArt callback to PixelArtDisplay so it can notify parent of changes */}
            {secretCodeEntered ? (
                <div>
                    <div className="secret-code-section">
                        <p className="secret-code-message success">
                            {message}
                        </p>
                        <button 
                            className="react-button" 
                            onClick={handleBackToAscii}
                            style={{ marginTop: '10px' }}
                        >
                            ← Back to ASCII Display
                        </button>
                    </div>
                    <PoliticalSimulator initialParties={initParties} />
                </div>
            ) : (
                <PixelArtDisplay onAsciiChange={setCurrentAsciiArt} />
            )}
        </div>
    );
}

// Render the React application to the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

console.log('React application initialized successfully!');
console.log('Secret code system active. Default view: ASCII Art Display');
