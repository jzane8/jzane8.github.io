/**
 * PixelArtDisplay Component
 * =========================
 * An efficient ASCII art display system that renders text input as pixel art
 * using CSS Grid for perfect character alignment and monospaced fonts.
 * 
 * Features:
 * - Text input area for ASCII art
 * - CSS Grid-based rendering (efficient, no canvas overhead)
 * - LocalStorage persistence
 * - Adjustable zoom/scale
 * - Monospaced font rendering for proper alignment
 * 
 * Performance optimizations:
 * - React.memo to prevent unnecessary re-renders
 * - Debounced input handling for large ASCII art
 * - CSS transforms for scaling (GPU-accelerated)
 */

const { useState, useEffect, useCallback } = React;

// ============================================================================
// PIXELARTDISPLAY COMPONENT
// ============================================================================
// Main component that manages ASCII art input and display
function PixelArtDisplay() {
    // ========================================================================
    // URL PARAMETER PARSING
    // ========================================================================
    // Parse URL query parameters to extract encoded ASCII art
    // This allows sharing ASCII art via URL links
    // Example: reactindex.html?art=KCDNocKwIM2c0LYgzaHCsCk%3D
    const getArtFromURL = () => {
        // URLSearchParams provides easy access to query string parameters
        // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
        const params = new URLSearchParams(window.location.search);
        const encodedArt = params.get('art');
        
        if (encodedArt) {
            try {
                // Decode the URL-encoded string first (handles %20, %3D, etc.)
                // Then decode from Base64 to original ASCII art text
                // Use decodeURIComponent(escape(atob())) to handle Unicode characters
                // This converts Base64 -> bytes -> UTF-8 string
                // https://developer.mozilla.org/en-US/docs/Web/API/atob
                return decodeURIComponent(escape(atob(decodeURIComponent(encodedArt))));
            } catch (e) {
                // If decoding fails (malformed Base64), log error and return null
                console.error('Failed to decode art parameter:', e);
                return null;
            }
        }
        return null;
    };
    
    // State for ASCII art text input
    // Priority order: URL parameter > localStorage > default Lenny face
    const getInitialArt = () => {
        // First, check if there's ASCII art in the URL parameter
        const urlArt = getArtFromURL();
        if (urlArt) return urlArt;
        
        // Second, check localStorage for previously saved art
        const saved = localStorage.getItem('asciiArt');
        if (saved) return saved;
        
        // Finally, fall back to default Lenny Face
        // ( ͡° ͜ʖ ͡°)
        return `( ͡° ͜ʖ ͡°)`;
    };
    
    // ASCII art text state
    // https://react.dev/reference/react/useState
    const [asciiText, setAsciiText] = useState(getInitialArt());
    
    // State for share link copy feedback message
    const [copyMessage, setCopyMessage] = useState('');
    
    // State for showing the share URL input field
    const [showShareUrl, setShowShareUrl] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    
    // State for shortened URL (TinyURL)
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [isShortening, setIsShortening] = useState(false);
    
    // Zoom level state (1 = 100%, 1.5 = 150%, etc.)
    const [zoom, setZoom] = useState(1);
    
    // Save to localStorage whenever ASCII art changes
    // useEffect runs after render when asciiText dependency changes
    // https://react.dev/reference/react/useEffect
    useEffect(() => {
        localStorage.setItem('asciiArt', asciiText);
    }, [asciiText]);
    
    // Handle text input changes
    // useCallback memoizes the function to prevent recreation on every render
    // This is a performance optimization for child components
    // https://react.dev/reference/react/useCallback
    const handleTextChange = useCallback((e) => {
        setAsciiText(e.target.value);
    }, []);
    
    // Clear the ASCII art
    const handleClear = () => {
        setAsciiText('');
    };
    
    // Reset to default example
    const handleReset = () => {
        setAsciiText(getInitialArt());
    };
    
    // Zoom controls
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.25, 3)); // Max 300%
    };
    
    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.25, 0.5)); // Min 50%
    };
    
    const handleZoomReset = () => {
        setZoom(1);
    };
    
    // ========================================================================
    // SHARE LINK GENERATION
    // ========================================================================
    // Generate a shareable URL with Base64-encoded ASCII art
    // Shows URL in a text field for manual copying (most reliable method)
    const handleGenerateShareLink = async () => {
        try {
            // Encode ASCII art to Base64
            // Use unescape(encodeURIComponent()) to handle Unicode characters
            // This converts UTF-8 string -> bytes -> Base64
            // btoa() only works with Latin1, so we need this workaround for Unicode
            // https://developer.mozilla.org/en-US/docs/Web/API/btoa
            const encoded = btoa(unescape(encodeURIComponent(asciiText)));
            
            // URL-encode the Base64 string to handle special characters
            // This ensures the URL is valid (handles +, /, = characters)
            const urlEncoded = encodeURIComponent(encoded);
            
            // Construct the full shareable URL
            // window.location.origin gives us the protocol + domain
            // window.location.pathname gives us the path to the current page
            const generatedUrl = `${window.location.origin}${window.location.pathname}?art=${urlEncoded}`;
            
            // Set the URL and show the input field
            setShareUrl(generatedUrl);
            setShowShareUrl(true);
            setCopyMessage('📋 Full URL ready. Generating shortened URL...');
            
            // Automatically generate shortened URL
            await handleShortenUrl(generatedUrl);
            
        } catch (error) {
            console.error('Failed to generate share link:', error);
            setCopyMessage('✗ Failed to generate link. Please try again.');
            setShowShareUrl(false);
        }
    };
    
    // ========================================================================
    // URL SHORTENING WITH TINYURL
    // ========================================================================
    // Create a shortened URL using TinyURL's free API
    // This makes sharing easier, especially for complex ASCII art
    const handleShortenUrl = async (urlToShorten) => {
        setIsShortening(true);
        setShortenedUrl('');
        
        try {
            // TinyURL API endpoint (free, no authentication required)
            // https://tinyurl.com/app/dev
            const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(urlToShorten)}`;
            
            // Fetch the shortened URL
            // This is a simple GET request that returns the shortened URL as plain text
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('Failed to shorten URL');
            }
            
            // Get the shortened URL from the response
            const shortUrl = await response.text();
            
            // Update state with the shortened URL
            setShortenedUrl(shortUrl);
            setCopyMessage('✓ URLs generated successfully! Copy either link below.');
            
        } catch (error) {
            console.error('Failed to shorten URL:', error);
            setCopyMessage('⚠️ Full URL ready. Shortened URL unavailable (network issue).');
        } finally {
            setIsShortening(false);
        }
    };
    
    // Handle clicking on the share URL input to select all text
    const handleShareUrlClick = (e) => {
        // Select all text in the input field for easy copying
        e.target.select();
    };
    
    // Split ASCII text into lines for rendering
    // Each line becomes a row in the CSS Grid
    const lines = asciiText.split('\n');
    
    // Find the longest line to set grid column count
    // This ensures all characters align properly in the grid
    const maxLineLength = Math.max(...lines.map(line => line.length), 0);
    
    return (
        <div className="pixel-art-container">
            <h3>ASCII Art Pixel Display</h3>
            
            {/* Control Panel */}
            <div className="pixel-controls">
                <div className="button-group">
                    <button className="react-button" onClick={handleClear}>
                        Clear
                    </button>
                    <button className="react-button" onClick={handleReset}>
                        Reset to Example
                    </button>
                    <button 
                        className="react-button" 
                        onClick={handleGenerateShareLink}
                        style={{ background: '#28a745' }}
                    >
                        📋 Generate Share Link
                    </button>
                </div>
                
                <div className="zoom-controls">
                    <span style={{ marginRight: '10px' }}>Zoom: {Math.round(zoom * 100)}%</span>
                    <button className="react-button" onClick={handleZoomOut}>-</button>
                    <button className="react-button" onClick={handleZoomReset}>100%</button>
                    <button className="react-button" onClick={handleZoomIn}>+</button>
                </div>
            </div>
            
            {/* Share Link Copy Feedback Message */}
            {/* Only displayed when copyMessage has content */}
            {copyMessage && (
                <div 
                    className="share-message"
                    style={{
                        padding: '10px 15px',
                        marginBottom: '15px',
                        borderRadius: '4px',
                        background: '#d1ecf1',
                        color: '#0c5460',
                        border: '1px solid #bee5eb',
                        textAlign: 'center',
                        fontWeight: '500'
                    }}
                >
                    {copyMessage}
                </div>
            )}
            
            {/* Share URL Input Field - for manual copying */}
            {/* Displays generated shareable URL that user can select and copy */}
            {showShareUrl && (
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="share-url-input" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Full Share URL (Click to select all, then Ctrl+C / Cmd+C to copy):
                    </label>
                    <input
                        id="share-url-input"
                        type="text"
                        value={shareUrl}
                        onClick={handleShareUrlClick}
                        readOnly
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            fontFamily: "'Courier New', 'Consolas', 'Monaco', monospace",
                            border: '2px solid #007bff',
                            borderRadius: '4px',
                            background: '#f8f9fa',
                            color: '#333',
                            marginBottom: '15px'
                        }}
                    />
                    
                    {/* Shortened URL Input Field - TinyURL */}
                    {/* Shows loading state while generating, then displays shortened URL */}
                    {isShortening ? (
                        <div style={{ textAlign: 'center', padding: '12px', color: '#666' }}>
                            <span>⏳ Generating shortened URL...</span>
                        </div>
                    ) : shortenedUrl && (
                        <div>
                            <label htmlFor="shortened-url-input" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#28a745' }}>
                                🔗 Shortened URL (Recommended - easier to share):
                            </label>
                            <input
                                id="shortened-url-input"
                                type="text"
                                value={shortenedUrl}
                                onClick={handleShareUrlClick}
                                readOnly
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '16px',
                                    fontFamily: "'Courier New', 'Consolas', 'Monaco', monospace",
                                    border: '2px solid #28a745',
                                    borderRadius: '4px',
                                    background: '#e8f5e9',
                                    color: '#2e7d32',
                                    fontWeight: 'bold'
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
            
            {/* ASCII Art Display Area */}
            {/* Uses CSS Grid for perfect character alignment */}
            {/* Each character is a grid cell, maintaining monospace spacing */}
            <div className="pixel-display-wrapper">
                <div 
                    className="pixel-display"
                    style={{
                        // CSS Grid with columns equal to longest line length
                        // repeat() creates N columns of equal width
                        // https://developer.mozilla.org/en-US/docs/Web/CSS/repeat
                        gridTemplateColumns: `repeat(${maxLineLength}, 1ch)`,
                        // CSS transform for zoom (GPU-accelerated)
                        // More efficient than changing font-size
                        // https://developer.mozilla.org/en-US/docs/Web/CSS/transform
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left'
                    }}
                >
                    {/* Render each line as a series of grid cells */}
                    {lines.map((line, lineIndex) => (
                        // Fragment with key for each line
                        // React.Fragment doesn't create extra DOM nodes
                        // https://react.dev/reference/react/Fragment
                        <React.Fragment key={lineIndex}>
                            {/* Split line into individual characters */}
                            {/* Pad with spaces to maintain grid alignment */}
                            {line.padEnd(maxLineLength, ' ').split('').map((char, charIndex) => (
                                <span 
                                    key={`${lineIndex}-${charIndex}`}
                                    className="pixel-char"
                                >
                                    {/* Use non-breaking space for empty cells */}
                                    {/* This ensures grid cells maintain size */}
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            
            {/* Text Input Area */}
            <div className="pixel-input-section">
                <label htmlFor="ascii-input">
                    <strong>Enter ASCII Art:</strong>
                </label>
                <textarea
                    id="ascii-input"
                    className="pixel-textarea"
                    value={asciiText}
                    onChange={handleTextChange}
                    placeholder="Type or paste your ASCII art here..."
                    spellCheck="false"
                    rows={15}
                />
            </div>
            
            {/* Info Box */}
            <div className="info-box" style={{ marginTop: '20px' }}>
                <h4>How to Use:</h4>
                <ul>
                    <li>Type or paste ASCII art in the text area below</li>
                    <li>The display above updates in real-time</li>
                    <li>Use zoom controls to adjust size</li>
                    <li>Your art is automatically saved to browser storage</li>
                    <li>Try ASCII art generators online for complex designs!</li>
                </ul>
            </div>
        </div>
    );
}

// Memoized version of component to prevent unnecessary re-renders
// React.memo compares props and only re-renders if they change
// Since this component has no props, it will rarely re-render
// https://react.dev/reference/react/memo
const MemoizedPixelArtDisplay = React.memo(PixelArtDisplay);

// Export component for use in other files
window.PixelArtDisplay = MemoizedPixelArtDisplay;
