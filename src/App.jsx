import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import RouteFallback from './components/RouteFallback';

/**
 * Root application component.
 * Uses HashRouter (set up in main.jsx) for GitHub Pages compatibility.
 * All pages except Wheel and Secrets share the Layout wrapper with
 * the header, sidebar navigation, and theme toggle.
 *
 * Code-splitting strategy: the About landing dashboard is imported eagerly so
 * it paints with no Suspense flash. Every other page is lazy-loaded into its
 * own chunk — in particular the secondary "toys" (ReactDemo/Political
 * Simulator, Wheel, Secrets) never ship in the dashboard's critical bundle and
 * load only when navigated to.
 */
const Projects = lazy(() => import('./pages/Projects'));
const Music = lazy(() => import('./pages/Music'));
const Esports = lazy(() => import('./pages/Esports'));
const Contact = lazy(() => import('./pages/Contact'));
const ReactDemo = lazy(() => import('./pages/ReactDemo'));
const Wheel = lazy(() => import('./pages/Wheel'));
const Secrets = lazy(() => import('./pages/Secrets'));

export default function App() {
  // Warm the priority route chunks once the dashboard is idle, so navigating to
  // Projects / Music / Contact feels instant. The secondary toys (ReactDemo,
  // Wheel, Secrets) are intentionally left to load purely on demand.
  useEffect(() => {
    const warm = () => {
      import('./pages/Projects');
      import('./pages/Music');
      import('./pages/Contact');
    };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warm);
      return () => window.cancelIdleCallback?.(id);
    }
    const t = setTimeout(warm, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Routes>
      {/* Pages with shared layout (header + sidebar + theme toggle).
          Layout renders a <Suspense> around its <Outlet />, so the header and
          nav stay visible while a lazy page chunk loads. */}
      <Route element={<Layout />}>
        <Route index element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="music" element={<Music />} />
        <Route path="esports" element={<Esports />} />
        <Route path="contact" element={<Contact />} />
        <Route path="react-demo" element={<ReactDemo />} />
      </Route>

      {/* Standalone pages (no shared layout) — each gets its own Suspense. */}
      <Route
        path="wheel"
        element={
          <Suspense fallback={<RouteFallback />}>
            <Wheel />
          </Suspense>
        }
      />
      <Route
        path="secrets"
        element={
          <Suspense fallback={<RouteFallback />}>
            <Secrets />
          </Suspense>
        }
      />

      {/* Catch-all: redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
