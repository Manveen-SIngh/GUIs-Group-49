import { createContext, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// ── Context ────────────────────────────────────────────────────────────────
export const SidebarContext = createContext(null);
export function useSidebar() { return useContext(SidebarContext); }

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </SidebarContext.Provider>
  );
}

// ── Nav items (No emojis, just text) ───────────────────────────────────────
const navItems = [
  { section: 'Weather' },
  { to: '/TodayWeather', label: "Today's Weather" },
  { to: '/WeatherPage',  label: 'Weekly Forecast' },
  { to: '/Metrics',      label: 'Metrics' },
  { to: '/FullMap',      label: 'Map' },
  { section: 'Activities' },
  { to: '/OdACycling',  label: 'Cycling' },
  { to: '/OdAHiking',   label: 'Hiking' },
  { to: '/OdARunning',  label: 'Running' },
  { to: '/OdACamping',  label: 'Camping' },
  { section: 'App' },
  { to: '/Settings',    label: 'Settings' },
  { to: '/Help',        label: 'Help' }, 
];

// ── Sidebar panel ──────────────────────────────────────────────────────────
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
              <div key={i} className="sidebar-section-label">
                {item.section}
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`sidebar-link${location.pathname === item.to ? ' active' : ''}`}
                onClick={close}
              >
                {/* Just the label, no icon span, so it uses your 1.4rem font size */}
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