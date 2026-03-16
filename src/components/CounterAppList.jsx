import { useState, useEffect } from 'react';

/**
 * Individual counter with increment / decrement / reset.
 * Syncs with parent state via onCountChange callback.
 */
function CounterApp({
  title = 'Interactive Political Simulator',
  initialCount = 0,
  partyId = null,
  onCountChange = null,
}) {
  const [count, setCount] = useState(initialCount);
  const [message, setMessage] = useState(title);

  // Sync when parent changes initialCount (e.g. localStorage reload)
  useEffect(() => setCount(initialCount), [initialCount]);

  function update(val) {
    setCount(val);
    if (onCountChange && partyId !== null) onCountChange(partyId, val);
  }

  return (
    <div className="react-demo">
      <h3>{title}</h3>
      <p style={{ textAlign: 'center', color: '#666' }}>{message}</p>
      <div className="counter-display">{count}</div>
      <div className="button-group">
        <button className="react-button" onClick={() => { update(count - 1); setMessage('Counter decremented!'); }}>
          Decrement (-)
        </button>
        <button className="react-button reset" onClick={() => { update(0); setMessage('Counter reset to zero!'); }}>
          Reset
        </button>
        <button className="react-button" onClick={() => { update(count + 1); setMessage('Counter incremented!'); }}>
          Increment (+)
        </button>
      </div>
    </div>
  );
}

/**
 * Renders a CounterApp for each party in the array.
 */
export default function CounterAppList({ parties = [], onCountChange = null }) {
  if (parties.length === 0) {
    return <CounterApp title="Interactive Counter Component" />;
  }

  return (
    <>
      {parties.map((party) => (
        <CounterApp
          key={party.id}
          title={party.name}
          initialCount={party.count}
          partyId={party.id}
          onCountChange={onCountChange}
        />
      ))}
    </>
  );
}
