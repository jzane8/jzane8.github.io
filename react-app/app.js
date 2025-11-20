// Main Application Entry Point
// This file uses the CounterAppList component from reactionary.js and renders it

// Define counter titles array
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

// Render the React application to the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// You can render either:
// 1. CounterAppList with multiple counters:
root.render(<PoliticalSimulator initialParties = {initParties}/>);

// 2. Or a single CounterApp:
// root.render(<CounterApp title="My Custom Counter" />);

// 3. Or CounterAppList with no titles (renders default single counter):
// root.render(<CounterAppList />);

console.log('React application initialized successfully!');
console.log('Rendering', initParties.length, 'counters');
