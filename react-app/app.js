// Main Application Entry Point
// This file manages the secret code system and renders either PixelArtDisplay or PoliticalSimulator

// Import React hooks for state management
// useState: manages component state (secret code entered status)
// https://react.dev/reference/react/useState
const { useState } = React;

// Define counter titles array for PoliticalSimulator
const initParties = [
      {
        id: 1,
        name: "x",
        count: 0,
        position: "left",
        visible:SC true,
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
    
    // State for the text input field
    const [inputValue, setInputValue] = useState('');
    
    // State for feedback message
    const [message, setMessage] = useState('');
    
    // Handle input change
    // Updates inputValue state as user types
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setMessage(''); // Clear message when user types
    };
    
    // Handle form submission
    // Checks if entered code matches SECRET_CODE
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload on form submit
        
        // Check if input matches secret code (case-sensitive)
        if (inputValue.trim() === SECRET_CODE) {
            setSecretCodeEntered(true);
            setMessage('Access granted!');
            setInputValue(''); // Clear input field
        } else {
            setMessage('Invalid code. Try again.');
            // Optional: clear input after failed attempt
            // setInputValue('');
        }
    };
    
    // Toggle back to ASCII display
    const handleBackToAscii = () => {
        setSecretCodeEntered(false);
        setInputValue('');
        setMessage('');
    };
    
    return (
        <div>
            {/* Secret Code Input Section - Always visible at top */}
            <div className="secret-code-section">
                <form onSubmit={handleSubmit} className="secret-code-form">
                    <label htmlFor="secret-code-input">
                        <strong>Enter Command:</strong>
                    </label>
                    <div className="secret-code-input-group">
                        <input
                            id="secret-code-input"
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Type command here..."
                            className="secret-code-input"
                        />
                        <button type="submit" className="react-button">
                            Execute
                        </button>
                    </div>
                    {/* Feedback message */}
                    {message && (
                        <p className={`secret-code-message ${secretCodeEntered ? 'success' : 'error'}`}>
                            {message}
                        </p>
                    )}
                </form>
                
                {/* Toggle button - only show when PoliticalSimulator is active */}
                {secretCodeEntered && (
                    <button 
                        className="react-button" 
                        onClick={handleBackToAscii}
                        style={{ marginTop: '10px' }}
                    >
                        ← Back to ASCII Display
                    </button>
                )}
            </div>
            
            {/* Conditional Rendering based on secret code */}
            {/* If secret code entered, show PoliticalSimulator, else show PixelArtDisplay */}
            {secretCodeEntered ? (
                <PoliticalSimulator initialParties={initParties} />
            ) : (
                <PixelArtDisplay />
            )}
        </div>
    );
}

// Render the React application to the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

console.log('React application initialized successfully!');
console.log('Secret code system active. Default view: ASCII Art Display');
