import { useState, useEffect, Suspense } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import RouteFallback from './RouteFallback';

/**
 * Shared layout for all portfolio pages.
 * Renders the purple header with name, collapsible sidebar navigation,
 * the page content (via <Outlet />), and the theme-toggle / puzzle button.
 */
export default function Layout() {
  const location = useLocation();
  const [minimized, setMinimized] = useState(
    () => localStorage.getItem('introMinimized') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('introMinimized', String(minimized));
  }, [minimized]);

  const navItems = [
    { to: '/', label: 'About', id: 'about' },
    { to: '/projects', label: 'Projects', id: 'projects' },
    { to: '/music', label: 'Music', id: 'music' },
    { to: '/esports', label: 'Esports', id: 'esports' },
    { to: '/contact', label: 'Contact', id: 'contact' },
    { to: '/react-demo', label: 'React Demo', id: 'react' },
  ];

  return (
    <div className="wrap">
      {/* Header / Intro */}
      <div className={`intro${minimized ? ' minimized' : ''}`} id="intro">
        <h2>
          <NavLink to="/">
            <b>Jacob &ldquo;Jake&rdquo; Zane</b>
          </NavLink>
        </h2>

        <button
          id="hidearrow"
          onClick={() => setMinimized((prev) => !prev)}
          aria-label={minimized ? 'Expand header' : 'Collapse header'}
        >
          &#8613;
        </button>

        {/* Sidebar Navigation */}
        <nav className="sidebar">
          {navItems.map(({ to, label, id }) => (
            <NavLink
              key={id}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `sidebar-tab${isActive ? ' active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Page Content — Suspense keeps the header/nav mounted while a lazy
          page chunk loads. */}
      <main className="body">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Theme toggle / puzzle button */}
      <ThemeToggle />
    </div>
  );
}
