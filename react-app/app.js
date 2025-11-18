// Main Application Entry Point
// This file uses the CounterAppList component from reactionary.js and renders it

// Define counter titles array
const counterTitles = [
    "Socialist Fervor",
    "Liberal Fervor",
    "Nationalist Fervor"
];

// Render the React application to the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// You can render either:
// 1. CounterAppList with multiple counters:
root.render(<CounterAppList counterTitles={counterTitles} />);

// 2. Or a single CounterApp:
// root.render(<CounterApp title="My Custom Counter" />);

// 3. Or CounterAppList with no titles (renders default single counter):
// root.render(<CounterAppList />);

console.log('React application initialized successfully!');
console.log('Rendering', counterTitles.length, 'counters');
