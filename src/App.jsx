import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Projects from './pages/Projects';
import Music from './pages/Music';
import Esports from './pages/Esports';
import Contact from './pages/Contact';
import Wheel from './pages/Wheel';
import ReactDemo from './pages/ReactDemo';
import Secrets from './pages/Secrets';

/**
 * Root application component.
 * Uses HashRouter (set up in main.jsx) for GitHub Pages compatibility.
 * All pages except Wheel and Secrets share the Layout wrapper with
 * the header, sidebar navigation, and theme toggle.
 */
export default function App() {
  return (
    <Routes>
      {/* Pages with shared layout (header + sidebar + theme toggle) */}
      <Route element={<Layout />}>
        <Route index element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="music" element={<Music />} />
        <Route path="esports" element={<Esports />} />
        <Route path="contact" element={<Contact />} />
        <Route path="react-demo" element={<ReactDemo />} />
      </Route>

      {/* Standalone pages (no shared layout) */}
      <Route path="wheel" element={<Wheel />} />
      <Route path="secrets" element={<Secrets />} />
    </Routes>
  );
}
