// React Components - CounterApp and CounterAppList
// These components demonstrate React's state management, event handling, and list rendering

const { useState } = React;

// Individual Counter Component
// Props: title (string) - The title to display for this counter
function CounterApp({ title = "Interactive Political Simulator" }) {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState(title);

    const increment = () => {
        setCount(count + 1);
        setMessage('Counter incremented!');
    };

    const decrement = () => {
        setCount(count - 1);
        setMessage('Counter decremented!');
    };

    const reset = () => {
        setCount(0);
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
// Props: counterTitles (array) - Array of strings to create multiple counters
function CounterAppList({ inputCounterTitles = [] }) {
    // If no titles provided, show a single default counter
    const [counterTitles, setTitles] = useState(inputCounterTitles) 
    if (counterTitles.length === 0) {
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

    // Map over the counterTitles array and create a CounterApp for each title
    return (
        <>
            {counterTitles.map((title, index) => (
                <CounterApp key={index} title={title} />
            ))}
            
        </>
    );
}

// Export components for use in other files
// Note: In a browser environment with script tags, this makes the components globally available
window.CounterApp = CounterApp;
window.CounterAppList = CounterAppList;
