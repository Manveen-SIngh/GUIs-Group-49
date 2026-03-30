import React, { useState, useEffect, useRef } from "react";
import "./CustomWidget.css";

import windIcon    from "../assets/weather-icons/windy.svg";
import rainIcon    from "../assets/precipitation.svg";
import uvIcon      from "../assets/UV.png";
import compassIcon from "../assets/Compass.png";
import addIcon     from "../assets/add.svg";
import ellipsesIcon from "../assets/ellipses.svg";

const CONDITIONS = [
  { key: "wind",       label: "Wind",       icon: windIcon    },
  { key: "humidity",   label: "Humidity",   icon: null        },
  { key: "rain",       label: "Rain %",     icon: rainIcon    },
  { key: "uv",         label: "UV Index",   icon: uvIcon      },
  { key: "visibility", label: "Visibility", icon: compassIcon },
];

function CustomWidget({ values = {} }) {
  const [selected,    setSelected]    = useState(null);
  const [showPicker,  setShowPicker]  = useState(false);
  const [showMenu,    setShowMenu]    = useState(false);
  const ref = useRef(null);

  // Close any open overlay when clicking outside the widget
  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowPicker(false);
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleRemove = () => {
    setSelected(null);
    setShowMenu(false);
  };

  const condition = CONDITIONS.find((c) => c.key === selected);
  const value     = selected ? (values[selected] ?? "—") : null;

  return (
    <div className="custom-widget" ref={ref}>

      {/* ── Empty state ─────────────────────────────────── */}
      {!selected && (
        <>
          <img
            className="custom-widget__plus"
            src={addIcon}
            alt="Add"
            onClick={() => setShowPicker((v) => !v)}
          />

          {showPicker && (
            <div className="custom-widget__picker">
              {CONDITIONS.map((c) => (
                <div
                  key={c.key}
                  className="custom-widget__picker-item"
                  onClick={() => { setSelected(c.key); setShowPicker(false); }}
                >
                  {c.label}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Filled state ────────────────────────────────── */}
      {selected && (
        <>
          <img
            className="custom-widget__ellipsis"
            src={ellipsesIcon}
            alt="Options"
            onClick={() => setShowMenu((v) => !v)}
          />

          {showMenu && (
            <div className="custom-widget__menu">
              <div className="custom-widget__menu-item" onClick={handleRemove}>
                Remove
              </div>
            </div>
          )}

          {condition.icon && (
            <img
              className="custom-widget__icon"
              src={condition.icon}
              alt={condition.label}
            />
          )}
          <div className="custom-widget__condition-label">{condition.label}</div>
          <div className="custom-widget__value">{value}</div>
        </>
      )}

    </div>
  );
}

export default CustomWidget;
