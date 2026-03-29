import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import backIcon from "./assets/BackBtn.png";

// ── Icons ──────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IconUnits = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3v18M5 9h8a4 4 0 0 1 0 8H5" />
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconThermometer = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
);
const IconWind = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
    <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
    <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
  </svg>
);
const IconCloud = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);
const IconMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#f0c040" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ── Toggle Switch ──────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <button
    className={`toggle ${checked ? "toggle--on" : ""}`}
    onClick={() => onChange(!checked)}
    role="switch"
    aria-checked={checked}
  >
    <span className="toggle__thumb" />
  </button>
);

// ── Chevron Down Icon ─────────────────────────────────────────────────────
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Custom Dropdown ───────────────────────────────────────────────────────
const UnitDropdown = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  // Close on outside click
  const ref = React.useRef(null);
  React.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="unit-dropdown" ref={ref}>
      <button
        className={`unit-dropdown__trigger ${open ? "unit-dropdown__trigger--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value}</span>
        <span className={`unit-dropdown__chevron ${open ? "unit-dropdown__chevron--up" : ""}`}>
          <IconChevron />
        </span>
      </button>
      {open && (
        <ul className="unit-dropdown__menu">
          {options.map((opt) => (
            <li
              key={opt}
              className={`unit-dropdown__item ${opt === value ? "unit-dropdown__item--selected" : ""}`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
              {opt === value && <span className="unit-dropdown__check">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ── Sidebar nav items ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "profile",       label: "Account Profile", icon: <IconUser /> },
  { id: "units",         label: "Units & Formats",  icon: <IconUnits /> },
  { id: "notifications", label: "Notifications",    icon: <IconBell /> },
  { id: "location",      label: "Location",         icon: <IconPin /> },
];

// ── Panels ─────────────────────────────────────────────────────────────────
const ProfilePanel = () => (
  <div className="panel">
    <div className="profile-avatar-wrap">
      <div className="profile-avatar">
        <IconUser />
      </div>
      <div className="profile-lines">
        <div className="profile-line profile-line--long" />
        <div className="profile-line profile-line--med" />
        <div className="profile-line profile-line--short" />
      </div>
    </div>
  </div>
);

const UNIT_OPTIONS = {
  Temperature:   ["Celsius (C)", "Fahrenheit (F)", "Kelvin (K)"],
  "Wind Speed":  ["Kilometers per hour (km/h)", "Miles per hour (mph)", "Meters per second (m/s)", "Knots (kn)"],
  Precipitation: ["Millimeters (mm)", "Inches (in)", "Centimeters (cm)"],
  Distance:      ["Kilometers (km)", "Miles (mi)", "Meters (m)"],
};

const UnitsPanel = () => {
  const [values, setValues] = useState({
    Temperature:   "Celsius (C)",
    "Wind Speed":  "Kilometers per hour (km/h)",
    Precipitation: "Millimeters (mm)",
    Distance:      "Kilometers (km)",
  });

  const rows = [
    { icon: <IconThermometer />, label: "Temperature" },
    { icon: <IconWind />,        label: "Wind Speed" },
    { icon: <IconCloud />,       label: "Precipitation" },
    { icon: <IconMap />,         label: "Distance" },
  ];

  return (
    <div className="panel">
      <h2 className="panel__title">Units &amp; Formats</h2>
      <div className="unit-list">
        {rows.map((r) => (
          <div className="unit-row" key={r.label}>
            <span className="unit-row__icon">{r.icon}</span>
            <span className="unit-row__label">{r.label}</span>
            <UnitDropdown
              options={UNIT_OPTIONS[r.label]}
              value={values[r.label]}
              onChange={(v) => setValues((prev) => ({ ...prev, [r.label]: v }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationsPanel = () => {
  const [severe, setSevere]   = useState(true);
  const [morning, setMorning] = useState(false);
  return (
    <div className="panel">
      <h2 className="panel__title">Notifications</h2>
      <div className="notif-list">
        <div className="notif-row">
          <span className="notif-row__icon"><IconAlert /></span>
          <span className="notif-row__label">Severe Weather Alerts</span>
          <Toggle checked={severe} onChange={setSevere} />
        </div>
        <div className="notif-row">
          <span className="notif-row__icon notif-row__icon--sun"><IconSun /></span>
          <span className="notif-row__label">Daily Morning Summary</span>
          <Toggle checked={morning} onChange={setMorning} />
        </div>
      </div>
    </div>
  );
};

const LocationPanel = () => {
  const [useCurrent, setUseCurrent] = useState(true);
  const [saved, setSaved] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (inputVal.trim()) {
      setSaved([...saved, inputVal.trim()]);
      setInputVal("");
      setAdding(false);
    }
  };

  return (
    <div className="panel">
      <h2 className="panel__title">Location</h2>
      <div className="loc-row">
        <span className="loc-row__dot" />
        <span className="loc-row__label">Use Current Location</span>
        <Toggle checked={useCurrent} onChange={setUseCurrent} />
      </div>
      <div className="saved-locations">
        <p className="saved-locations__heading">Saved Locations</p>
        {saved.map((s, i) => (
          <div className="saved-location-item" key={i}>
            <IconPin />
            <span>{s}</span>
          </div>
        ))}
        {adding ? (
          <div className="add-location-input-row">
            <input
              className="add-location-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter location…"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
            />
            <button className="add-location-confirm" onClick={handleAdd}>Add</button>
            <button className="add-location-cancel" onClick={() => setAdding(false)}>✕</button>
          </div>
        ) : (
          <button className="add-location-btn" onClick={() => setAdding(true)}>
            <IconPlus />
            Add New Location
          </button>
        )}
      </div>
    </div>
  );
};

// ── Main Settings Page ─────────────────────────────────────────────────────
const Settings = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("profile");

  const panels = {
    profile:       <ProfilePanel />,
    units:         <UnitsPanel />,
    notifications: <NotificationsPanel />,
    location:      <LocationPanel />,
  };

  return (
    <div className="settings-root">
      {/* Header back button */}
      <img
        src={backIcon}
        alt="Back"
        onClick={() => navigate('/WeatherPage')}
        style={{ width: 64, height: 64, cursor: "pointer" }}
      />

      <div className="settings-layout">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          <h1 className="settings-title">Settings</h1>
          <nav className="settings-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${active === item.id ? "nav-item--active" : ""}`}
                onClick={() => setActive(item.id)}
              >
                <span className="nav-item__icon">{item.icon}</span>
                <span className="nav-item__label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="settings-content">
          {panels[active]}
        </main>
      </div>
    </div>
  );
};

export default Settings;