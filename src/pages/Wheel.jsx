import { useState, useMemo, useRef, useEffect, useCallback } from 'react';

/**
 * Wheel of Fortune standalone page.
 * SVG-based wheel with configurable CSV data, spin animation,
 * coin flip, and admin panel for customization.
 */

const DEFAULT_CSV = `Dance for 30 seconds,2,#FF6B6B,medium
Tell a joke,5,#4ECDC4,low
Sing your favorite song,5,#45B7D1,high
Do 10 pushups,2,#96CEB4,medium
Share an embarrassing story,2,#FFEAA7,high`;

const SEVERITY_DEFAULTS = {
  low: { fontSize: 12, fontWeight: 'normal', textTransform: 'none' },
  medium: { fontSize: 14, fontWeight: 'bold', textTransform: 'none' },
  high: { fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' },
};

function parseCSV(text) {
  return text
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(',').map((s) => s.trim());
      if (parts.length !== 4) return null;
      const [promptText, weight, color, severity] = parts;
      const w = parseInt(weight, 10);
      if (!promptText || isNaN(w) || w < 1) return null;
      return { text: promptText, weight: w, color, severity };
    })
    .filter(Boolean);
}

export default function Wheel() {
  const svgRef = useRef(null);
  const [csvText, setCsvText] = useState(DEFAULT_CSV);
  const [maxSlices, setMaxSlices] = useState(8);
  const [wheelData, setWheelData] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultMsg, setResultMsg] = useState('Click "SPIN THE WHEEL!" to get started!');
  const [showAdmin, setShowAdmin] = useState(false);
  const [coinFace, setCoinFace] = useState(null);
  const [severity, setSeverity] = useState(SEVERITY_DEFAULTS);

  // Build wheel data from CSV
  const buildWheel = useCallback(() => {
    const items = parseCSV(csvText).slice(0, maxSlices);
    if (items.length === 0) return;
    const totalWeight = items.reduce((s, i) => s + i.weight, 0);
    setWheelData(
      items.map((i) => ({ ...i, percentage: (i.weight / totalWeight) * 100 }))
    );
    setResultMsg('Wheel updated! Click "SPIN THE WHEEL!" to play.');
  }, [csvText, maxSlices]);

  useEffect(() => {
    buildWheel();
  }, [buildWheel]);

  const spin = () => {
    if (isSpinning || wheelData.length === 0) return;
    setIsSpinning(true);
    setResultMsg('Spinning...');

    const spins = 4 + Math.random() * 4;
    const angle = Math.random() * 360;
    const total = spins * 360 + angle;
    setRotation(total);

    setTimeout(() => {
      setIsSpinning(false);
      // Calculate which slice the pointer landed on
      // The pointer is at the top (0 degrees / 360 degrees)
      // The wheel rotates clockwise, so we need to find which section is at the top
      const finalAngle = (360 - (total % 360)) % 360;
      let cumulative = 0;
      let winner = wheelData[0];
      for (const section of wheelData) {
        cumulative += (section.percentage / 100) * 360;
        if (finalAngle < cumulative) {
          winner = section;
          break;
        }
      }
      setResultMsg(`Result: ${winner.text}`);
    }, 4000);
  };

  const flipCoin = () => {
    setCoinFace(null);
    setTimeout(() => setCoinFace(Math.random() < 0.5 ? 'heads' : 'tails'), 1000);
  };

  // Build SVG paths (memoized to avoid recalculation during spin animation)
  const renderSections = useMemo(() => () => {
    const cx = 200, cy = 200, r = 180;
    let currentAngle = -90;
    return wheelData.map((section, idx) => {
      const sAngle = (section.percentage / 100) * 360;
      const startRad = (currentAngle * Math.PI) / 180;
      const endRad = ((currentAngle + sAngle) * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const largeArc = sAngle > 180 ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const midAngle = currentAngle + sAngle / 2;
      const tr = r * 0.65;
      const tRad = (midAngle * Math.PI) / 180;
      const tx = cx + tr * Math.cos(tRad);
      const ty = cy + tr * Math.sin(tRad);

      let textRot = midAngle + 90;
      if (textRot > 90 && textRot < 270) textRot += 180;

      const sev = severity[section.severity] || severity.medium;
      currentAngle += sAngle;

      return (
        <g key={idx}>
          <path d={d} fill={section.color} stroke="#fff" strokeWidth={2} />
          <text
            x={tx}
            y={ty}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Arial, sans-serif"
            fontWeight={sev.fontWeight}
            fill="white"
            fontSize={sev.fontSize}
            paintOrder="stroke fill"
            stroke="rgba(0,0,0,0.8)"
            strokeWidth="1px"
            transform={`rotate(${textRot}, ${tx}, ${ty})`}
            style={{ textTransform: sev.textTransform }}
          >
            {section.text}
          </text>
        </g>
      );
    });
  }, [wheelData, severity]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Wheel of F******</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>
            Spin the wheel and see what fate has in store!
          </p>
        </div>

        <div style={styles.gameArea}>
          {/* Wheel */}
          <div style={styles.wheelCol}>
            <div style={styles.wheelWrapper}>
              <div style={styles.pointer} />
              <svg
                ref={svgRef}
                viewBox="0 0 400 400"
                style={{
                  ...styles.wheelSvg,
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning
                    ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                    : 'none',
                }}
              >
                {renderSections()}
              </svg>
            </div>
          </div>

          {/* Controls */}
          <div style={styles.controls}>
            <button
              style={{ ...styles.spinBtn, ...(isSpinning ? styles.spinBtnDisabled : {}) }}
              onClick={spin}
              disabled={isSpinning}
            >
              SPIN THE WHEEL!
            </button>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h3>Undecided?</h3>
              <button style={styles.coinBtn} onClick={flipCoin}>
                Flip Coin
              </button>
              <div style={styles.coin}>
                {coinFace === null ? '\uD83D\uDC64' : coinFace === 'heads' ? '\uD83D\uDC68\uD83C\uDFFB' : '\uD83D\uDC69\uD83C\uDFFF'}
              </div>
            </div>

            <div style={styles.resultDisplay}>
              <p>{resultMsg}</p>
            </div>
          </div>
        </div>

        {/* Admin Panel */}
        <div style={styles.adminPanel}>
          <button style={styles.adminToggle} onClick={() => setShowAdmin((p) => !p)}>
            Toggle Admin Panel
          </button>
          {showAdmin && (
            <div>
              <h2>Admin Panel</h2>
              <h3>CSV Data (prompt_text, percentage_size, color, severity)</h3>
              <textarea
                style={styles.csvInput}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
              <h3>Max Slices on Wheel</h3>
              <input
                type="number"
                value={maxSlices}
                min={1}
                max={50}
                onChange={(e) => setMaxSlices(parseInt(e.target.value, 10) || 8)}
                style={{ width: '100%', marginBottom: 20, padding: 10, border: '1px solid #ccc', borderRadius: 5 }}
              />
              <button style={styles.adminToggle} onClick={buildWheel}>
                Update Wheel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Arial', sans-serif",
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: { maxWidth: 1200, width: '100%' },
  header: { textAlign: 'center', color: 'white', marginBottom: 30 },
  title: { fontSize: '3em', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', marginBottom: 10 },
  gameArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 30,
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  wheelCol: { flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  wheelWrapper: { position: 'relative', width: 400, height: 400, maxWidth: '100%' },
  pointer: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderTop: '25px solid #FFD700',
    zIndex: 10,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },
  wheelSvg: {
    width: '100%',
    height: '100%',
    transformOrigin: 'center center',
    filter: 'drop-shadow(0 8px 25px rgba(0,0,0,0.3))',
  },
  controls: {
    flex: 1,
    background: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    minWidth: 280,
  },
  spinBtn: {
    width: '100%',
    padding: 15,
    fontSize: '1.5em',
    background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  spinBtnDisabled: { background: '#ccc', cursor: 'not-allowed' },
  coinBtn: {
    padding: '10px 20px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    marginBottom: 10,
  },
  coin: {
    width: 80,
    height: 80,
    background: '#FFD700',
    borderRadius: '50%',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    border: '3px solid #FFA500',
  },
  resultDisplay: {
    background: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    textAlign: 'center',
    minHeight: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminPanel: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  adminToggle: {
    background: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 5,
    cursor: 'pointer',
    marginBottom: 20,
  },
  csvInput: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 5,
    fontFamily: 'monospace',
  },
};
