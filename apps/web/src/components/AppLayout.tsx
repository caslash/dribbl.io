import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router';

/**
 * Reads the persisted dark mode preference from localStorage and applies it
 * to the <html> element on first render.
 */
function getInitialDarkMode(): boolean {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
  } catch {
    // localStorage not available
  }
  return false;
}

/**
 * Root layout shell: navigation bar with logo, route links, and dark/light
 * mode toggle. Child routes are rendered via <Outlet />.
 *
 * @example
 * <Route element={<AppLayout />}>
 *   <Route path="/" element={<HomePage />} />
 * </Route>
 */
export function AppLayout() {
  const [isDark, setIsDark] = useState(getInitialDarkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      // localStorage not available
    }
  }, [isDark]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-red-600 ${
      isActive ? 'text-red-600' : 'text-text-secondary'
    }`;

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="font-serif text-xl font-bold tracking-tight text-primary-text">
            dribbl.io
          </Link>

          <nav className="flex items-center gap-6">
            <NavLink to="/daily" end className={navLinkClass}>
              Daily
            </NavLink>
            <NavLink to="/career" className={navLinkClass}>
              Career Path
            </NavLink>
            <NavLink to="/draft" className={navLinkClass}>
              Draft
            </NavLink>

            <button
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-text-secondary/10"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
