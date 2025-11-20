// React Components - CounterApp and CounterAppList
// These components demonstrate React's state management, event handling, and list rendering

// CHANGE: Added useEffect to sync with parent state changes
const { useState, useEffect } = React;

// Individual Counter Component
// CHANGE: Updated to accept initialCount, partyId, and onCountChange props
// Props: 
//   - title (string) - The title to display for this counter
//   - initialCount (number) - Starting count value from parent state
//   - partyId (number) - Unique ID to identify this counter to parent
//   - onCountChange (function) - Callback to notify parent of count changes
function CounterApp({ 
    title = "Interactive Political Simulator",
    initialCount = 0,
    partyId = null,
    onCountChange = null
}) {
    const [count, setCount] = useState(initialCount);
    const [message, setMessage] = useState(title);

    // CHANGE: Sync local count with parent state when initialCount prop changes
    // This handles cases where parent resets all counters or loads from localStorage
    // Without this, the counter would show stale data if parent state changes externally
    useEffect(() => {
        setCount(initialCount);
    }, [initialCount]);

    // CHANGE: Helper function to update both local state and notify parent
    // This ensures the UI updates immediately (local state) while also
    // propagating changes up to PoliticalSimulator (parent state)
    const updateCount = (newCount) => {
        setCount(newCount);
        // Only call parent callback if it exists and we have a valid partyId
        if (onCountChange && partyId !== null) {
            onCountChange(partyId, newCount);
        }
    };

    const increment = () => {
        updateCount(count + 1);  // CHANGE: Use updateCount instead of setCount
        setMessage('Counter incremented!');
    };

    const decrement = () => {
        updateCount(count - 1);  // CHANGE: Use updateCount instead of setCount
        setMessage('Counter decremented!');
    };

    const reset = () => {
        updateCount(0);  // CHANGE: Use updateCount instead of setCount
        setMessage('Counter reset to zero!');
    };

    return (
        <div className="react-demo">
            <h3>{title}</h3>
            <p style={{ textAlign: 'center', color: '#666' }}>{message}</p>
            <div className="counter-display">{count}</div>
            <div className="button-group">
                <button className="react-button" onClick={decrement}>
                    Decrement (-)
                </button>
                <button className="react-button reset" onClick={reset}>
                    Reset
                </button>
                <button className="react-button" onClick={increment}>
                    Increment (+)
                </button>
            </div>
        </div>
    );
}

// Counter List Component
// CHANGE: Updated to accept party objects and callback instead of just titles
// Props: 
//   - parties (array) - Array of party objects with id, name, count properties
//   - onCountChange (function) - Callback to update parent state when count changes
function CounterAppList({ parties = [], onCountChange = null }) {
    // If no parties provided, show a single default counter
    if (parties.length === 0) {
        return (
            <>
                <CounterApp title="Interactive Counter Component" />
                <div className="info-box" style={{ marginTop: '30px' }}>
                    <h4>React Features Demonstrated:</h4>
                    <ul>
                        <li><strong>State Management:</strong> Using the useState hook to manage component state</li>
                        <li><strong>Event Handling:</strong> onClick handlers for button interactions</li>
                        <li><strong>Dynamic Rendering:</strong> UI updates automatically when state changes</li>
                        <li><strong>Component Structure:</strong> Self-contained, reusable component architecture</li>
                        <li><strong>List Rendering:</strong> Using map() to render multiple components from an array</li>
                    </ul>
                </div>
            </>
        );
    }

    // CHANGE: Map over parties array instead of counterTitles
    // Pass party data and callback down to each CounterApp
    return (
        <>
            {parties.map((party) => (
                <CounterApp 
                    key={party.id}                        // CHANGE: Use party.id instead of index for stable keys
                    title={party.name}                    // Pass party name as title
                    initialCount={party.count}            // CHANGE: Pass the current count from party object
                    partyId={party.id}                    // CHANGE: Pass party ID so CounterApp can identify itself
                    onCountChange={onCountChange}         // CHANGE: Pass callback function down
                />
            ))}
            
        </>
    );
}

// Export components for use in other files
// Note: In a browser environment with script tags, this makes the components globally available
window.CounterApp = CounterApp;
window.CounterAppList = CounterAppList;
