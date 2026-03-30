import { createContext, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// ── Context ────────────────────────────────────────────────────────────────
export const SidebarContext = createContext(null);
export function useSidebar() { return useContext(SidebarContext); }

// ── Provider (wrap around Router in App.js) ────────────────────────────────
export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </SidebarContext.Provider>
  );
}

// ── Nav items ──────────────────────────────────────────────────────────────
const navItems = [
  { section: 'Weather' },
  { to: '/TodayWeather', label: "Today's Weather", icon: '🌤️' },
  { to: '/WeatherPage',  label: 'Weekly Forecast',  icon: '📅' },
  { to: '/Metrics',      label: 'Metrics',           icon: '📊' },
  { to: '/FullMap',      label: 'Map',               icon: '🗺️' },
  { section: 'Activities' },
  { to: '/OdACycling',  label: 'Cycling',  icon: '🚴' },
  { to: '/OdAHiking',   label: 'Hiking',   icon: '🥾' },
  { to: '/OdARunning',  label: 'Running',  icon: '🏃' },
  { to: '/OdACamping',  label: 'Camping',  icon: '⛺' },
  { section: 'App' },
  { to: '/Settings',    label: 'Settings', icon: '⚙️' },
];

// ── Sidebar panel (no hamburger button — pages supply their own) ───────────
function Sidebar() {
  const { isOpen, close } = useSidebar();
  const location = useLocation();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={close} />}

      <nav className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <h2>OutdoorCast</h2>
          <button className="sidebar-close" onClick={close} aria-label="Close menu">✕</button>
        </div>

        <div className="sidebar-nav">
          {navItems.map((item, i) =>
            item.section ? (
              <div key={i} className="sidebar-section-label">{item.section}</div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`sidebar-link${location.pathname === item.to ? ' active' : ''}`}
                onClick={close}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </nav>
    </>
  );
}

export default Sidebar;