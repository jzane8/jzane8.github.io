import { useState, useEffect, useCallback, memo } from 'react';

/**
 * ASCII art editor with CSS Grid rendering, zoom controls,
 * localStorage persistence, and URL-based sharing (with TinyURL shortening).
 *
 * Props:
 *   onAsciiChange — callback notified whenever the ASCII text changes
 */
function PixelArtDisplay({ onAsciiChange }) {
  // Parse ?art= URL parameter (Base64-encoded)
  // HashRouter puts params in the hash, so we parse from there
  const getArtFromURL = () => {
    const hash = window.location.hash;
    const queryIndex = hash.indexOf('?');
    if (queryIndex === -1) return null;
    const params = new URLSearchParams(hash.substring(queryIndex));
    const encoded = params.get('art');
    if (!encoded) return null;
    try {
      return decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
    } catch {
      return null;
    }
  };

  const getInitialArt = () => {
    const urlArt = getArtFromURL();
    if (urlArt) return urlArt;
    const saved = localStorage.getItem('asciiArt');
    if (saved) return saved;
    return '( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)'; // Lenny face
  };

  const [asciiText, setAsciiText] = useState(getInitialArt);
  const [copyMessage, setCopyMessage] = useState('');
  const [showShareUrl, setShowShareUrl] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isShortening, setIsShortening] = useState(false);
  const [zoom, setZoom] = useState(1);

  const hasUrlParam = (() => {
    const hash = window.location.hash;
    const qi = hash.indexOf('?');
    return qi !== -1 && new URLSearchParams(hash.substring(qi)).has('art');
  })();
  const [accordionOpen, setAccordionOpen] = useState(!hasUrlParam);

  // Persist & notify parent
  useEffect(() => {
    localStorage.setItem('asciiArt', asciiText);
    if (onAsciiChange) onAsciiChange(asciiText);
  }, [asciiText, onAsciiChange]);

  const handleTextChange = useCallback((e) => setAsciiText(e.target.value), []);

  // Share link generation
  const generateShareLink = async () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(asciiText)));
      const hashPath = window.location.hash.split('?')[0] || '#/react-demo';
      const url = `${window.location.origin}${window.location.pathname}${hashPath}?art=${encodeURIComponent(encoded)}`;
      setShareUrl(url);
      setShowShareUrl(true);
      setCopyMessage('Full URL ready. Generating shortened URL...');

      setIsShortening(true);
      setShortenedUrl('');
      try {
        const resp = await fetch(
          `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
        );
        if (resp.ok) {
          setShortenedUrl(await resp.text());
          setCopyMessage('URLs generated successfully! Copy either link below.');
        } else {
          throw new Error();
        }
      } catch {
        setCopyMessage('Full URL ready. Shortened URL unavailable.');
      } finally {
        setIsShortening(false);
      }
    } catch {
      setCopyMessage('Failed to generate link.');
      setShowShareUrl(false);
    }
  };

  const selectAll = (e) => e.target.select();

  const lines = asciiText.split('\n');
  const maxLen = Math.max(...lines.map((l) => l.length), 0);

  return (
    <div className="pixel-art-container">
      {/* Controls */}
      <div className="pixel-controls">
        <div className="button-group">
          <button className="react-button" onClick={() => setAsciiText('')}>Clear</button>
          <button className="react-button" onClick={() => setAsciiText(getInitialArt())}>Reset</button>
          <button className="react-button" style={{ background: '#28a745' }} onClick={generateShareLink}>
            Share
          </button>
        </div>
        <div className="zoom-controls">
          <span style={{ marginRight: 8, fontSize: '0.9em' }}>Zoom: {Math.round(zoom * 100)}%</span>
          <button className="react-button" onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}>-</button>
          <button className="react-button" onClick={() => setZoom(1)}>100%</button>
          <button className="react-button" onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}>+</button>
        </div>
      </div>

      {/* Share message */}
      {copyMessage && (
        <div style={{
          padding: '10px 15px', marginBottom: 15, borderRadius: 4,
          background: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb',
          textAlign: 'center', fontWeight: 500,
        }}>
          {copyMessage}
        </div>
      )}

      {/* Share URLs */}
      {showShareUrl && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Full Share URL (click to select, then copy):
          </label>
          <input
            type="text"
            value={shareUrl}
            onClick={selectAll}
            readOnly
            style={{
              width: '100%', padding: 12, fontSize: 14,
              fontFamily: "'Courier New', monospace",
              border: '2px solid #007bff', borderRadius: 4,
              background: '#f8f9fa', color: '#333', marginBottom: 15,
            }}
          />
          {isShortening ? (
            <div style={{ textAlign: 'center', padding: 12, color: '#666' }}>Generating shortened URL...</div>
          ) : shortenedUrl && (
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#28a745' }}>
                Shortened URL (recommended):
              </label>
              <input
                type="text"
                value={shortenedUrl}
                onClick={selectAll}
                readOnly
                style={{
                  width: '100%', padding: 12, fontSize: 16,
                  fontFamily: "'Courier New', monospace",
                  border: '2px solid #28a745', borderRadius: 4,
                  background: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* ASCII Art Display */}
      <div className="pixel-display-wrapper">
        <div
          className="pixel-display"
          style={{
            gridTemplateColumns: `repeat(${maxLen}, 1ch)`,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
          }}
        >
          {lines.map((line, li) => (
            <span key={li} style={{ display: 'contents' }}>
              {line.padEnd(maxLen, ' ').split('').map((ch, ci) => (
                <span key={`${li}-${ci}`} className="pixel-char">
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Text Editor */}
      <div className="pixel-input-section">
        {hasUrlParam && (
          <button
            onClick={() => setAccordionOpen((o) => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 15px', marginBottom: 10,
              background: '#007bff', color: 'white', border: 'none',
              borderRadius: 4, cursor: 'pointer', fontSize: '1em', fontWeight: 600,
            }}
          >
            <span style={{
              transform: accordionOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s', display: 'inline-block',
            }}>
              &#9660;
            </span>
            {accordionOpen ? 'Hide' : 'Show'} Text Editor
          </button>
        )}
        {(!hasUrlParam || accordionOpen) && (
          <textarea
            className="pixel-textarea"
            value={asciiText}
            onChange={handleTextChange}
            placeholder="Type or paste your ASCII art here..."
            spellCheck={false}
            rows={15}
          />
        )}
      </div>
    </div>
  );
}

export default memo(PixelArtDisplay);
