import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Renders one of five puzzle types based on current difficulty.
 * Props:
 *   puzzle   — the usePuzzle() hook return value
 *   onSuccess / onFailure — callbacks
 *   onClose  — close without answering
 */
export default function PuzzleModal({ puzzle, onSuccess, onFailure, onClose }) {
  const available = puzzle.getAvailablePuzzles();
  const [type] = useState(
    () => available[Math.floor(Math.random() * available.length)]
  );
  const [result, setResult] = useState(null); // 'success' | 'failure' | null

  const handleSuccess = useCallback(() => {
    puzzle.recordAttempt(type, true);
    setResult('success');
    setTimeout(onSuccess, 1500);
  }, [puzzle, type, onSuccess]);

  const handleFailure = useCallback(() => {
    puzzle.recordAttempt(type, false);
    setResult('failure');
    setTimeout(onFailure, 2000);
  }, [puzzle, type, onFailure]);

  return (
    <div className="puzzle-overlay" onClick={onClose}>
      <div className="puzzle-container" onClick={(e) => e.stopPropagation()}>
        <div className="difficulty-indicator">
          Difficulty: {puzzle.getDifficultyLevel().toUpperCase()} |
          Attempts: {puzzle.session.totalAttempts} |
          Failures: {puzzle.session.failureCount}
        </div>

        {result === 'success' ? (
          <div style={{ textAlign: 'center', color: '#4CAF50' }}>
            <h3>Puzzle Solved!</h3>
            <p>Granting access...</p>
          </div>
        ) : result === 'failure' ? (
          <div style={{ textAlign: 'center', color: '#ff4444', marginTop: 15 }}>
            <p><strong>Incorrect!</strong></p>
            <p>Failures: {puzzle.session.failureCount}</p>
          </div>
        ) : (
          <PuzzleContent type={type} onSuccess={handleSuccess} onFailure={handleFailure} />
        )}
      </div>
    </div>
  );
}

function PuzzleContent({ type, onSuccess, onFailure }) {
  switch (type) {
    case 'sequence':
      return <SequencePuzzle onSuccess={onSuccess} onFailure={onFailure} />;
    case 'math':
      return <MathPuzzle onSuccess={onSuccess} onFailure={onFailure} />;
    case 'memory':
      return <MemoryPuzzle onSuccess={onSuccess} onFailure={onFailure} />;
    case 'cipher':
      return <CipherPuzzle onSuccess={onSuccess} onFailure={onFailure} />;
    case 'logic':
      return <LogicPuzzle onSuccess={onSuccess} onFailure={onFailure} />;
    default:
      return null;
  }
}

/* ---------- Sequence: press JR → JZ → LB ---------- */
function SequencePuzzle({ onSuccess, onFailure }) {
  const correct = ['JR', 'JZ', 'LB'];
  const seq = useRef([]);

  function press(val) {
    seq.current.push(val);
    const ok = seq.current.every((v, i) => v === correct[i]);
    if (!ok) return onFailure();
    if (seq.current.length === correct.length) onSuccess();
  }

  return (
    <>
      <div className="puzzle-hint">1.F 2.M 3.K</div>
      <div className="puzzle-buttons">
        {['JR', 'LB', 'JZ'].map((v) => (
          <button key={v} className="puzzle-button" onClick={() => press(v)}>
            {v}
          </button>
        ))}
      </div>
    </>
  );
}

/* ---------- Math: 2, 6, 12, 20, 30, ? → 42 ---------- */
function MathPuzzle({ onSuccess, onFailure }) {
  const [value, setValue] = useState('');

  function submit() {
    parseInt(value, 10) === 42 ? onSuccess() : onFailure();
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 18, marginBottom: 15 }}>2, 6, 12, 20, 30, ?</p>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="?"
        autoFocus
        style={{
          padding: 10, border: '2px solid #ddd', borderRadius: 5,
          fontSize: 16, width: 100, textAlign: 'center', marginBottom: 15,
        }}
      />
      <br />
      <button
        onClick={submit}
        style={{
          background: '#4CAF50', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: 5, cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </div>
  );
}

/* ---------- Memory: remember & repeat a color sequence ---------- */
function MemoryPuzzle({ onSuccess, onFailure }) {
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  const COLOR_NAMES = { '#FF6B6B': 'Red', '#4ECDC4': 'Teal', '#45B7D1': 'Blue', '#96CEB4': 'Green', '#FFEAA7': 'Yellow', '#DDA0DD': 'Purple' };
  const [sequence] = useState(() =>
    Array.from({ length: 6 }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
  );
  const [phase, setPhase] = useState('show'); // show | memorize | input
  const userSeq = useRef([]);

  function startMemorize() {
    setPhase('memorize');
    setTimeout(() => setPhase('input'), 3000);
  }

  function pick(color) {
    if (phase !== 'input') return;
    userSeq.current.push(color);
    if (userSeq.current.length === sequence.length) {
      JSON.stringify(userSeq.current) === JSON.stringify(sequence)
        ? onSuccess()
        : onFailure();
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {(phase === 'show' || phase === 'memorize') && (
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 15 }}>
          {sequence.map((c, i) => (
            <div
              key={i}
              style={{
                width: 30, height: 30, background: c,
                border: '2px solid #333', borderRadius: 3,
              }}
            />
          ))}
        </div>
      )}

      {phase === 'show' && (
        <button
          onClick={startMemorize}
          style={{
            background: '#2196F3', color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: 5, cursor: 'pointer',
          }}
        >
          Begin
        </button>
      )}

      {phase === 'memorize' && <p>Memorize the sequence...</p>}

      {phase === 'input' && (
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => pick(c)}
              aria-label={COLOR_NAMES[c] || c}
              style={{
                width: 30, height: 30, background: c,
                border: '2px solid #333', borderRadius: 3, cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Cipher: decode LOXVMF → ILUSJC ---------- */
function CipherPuzzle({ onSuccess, onFailure }) {
  const [value, setValue] = useState('');

  function submit() {
    value.toUpperCase().trim() === 'ILUSJC' ? onSuccess() : onFailure();
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <p
        style={{
          fontSize: 18, fontFamily: 'monospace', marginBottom: 15,
          background: '#f5f5f5', padding: 10, borderRadius: 5,
        }}
      >
        LOXVMF
      </p>
      <p style={{ color: '#666', fontSize: 12, marginBottom: 15 }}>Decode this message</p>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="decoded message"
        autoFocus
        style={{
          padding: 10, border: '2px solid #ddd', borderRadius: 5,
          fontSize: 16, width: 200, textAlign: 'center', marginBottom: 15,
        }}
      />
      <br />
      <button
        onClick={submit}
        style={{
          background: '#FF9800', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: 5, cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </div>
  );
}

/* ---------- Logic: star-circle pattern ---------- */
function LogicPuzzle({ onSuccess, onFailure }) {
  function pick(val) {
    val === '\u25CB' ? onSuccess() : onFailure();
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 24, marginBottom: 15 }}>{'\u2605\u25CB\u2605\u25CB\u2605?'}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {['\u25CB', '\u2605', '\u25C6', '\u2666'].map((sym) => (
          <button
            key={sym}
            onClick={() => pick(sym)}
            style={{
              background: 'white', border: '2px solid #333',
              padding: '10px 15px', borderRadius: 5, cursor: 'pointer', fontSize: 18,
            }}
          >
            {sym}
          </button>
        ))}
      </div>
    </div>
  );
}
