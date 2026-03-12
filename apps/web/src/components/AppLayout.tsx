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
    `text-sm font-medium transition-colors hover:text-burgundy-600 dark:hover:text-burgundy-500 ${
      isActive
        ? 'text-burgundy-600 dark:text-burgundy-500'
        : 'text-navy-700 dark:text-cream-300'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-cream-50 dark:bg-navy-950">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/95 backdrop-blur dark:border-slate-700 dark:bg-navy-950/95">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            to="/"
            className="font-serif text-xl font-bold tracking-tight text-navy-900 dark:text-cream-100"
          >
            dribbl.io
          </Link>

          <nav className="flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
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
              className="rounded-md p-1.5 text-navy-700 transition-colors hover:bg-navy-800/10 dark:text-cream-300 dark:hover:bg-cream-200/10"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
