// CustomWidget.js
// A user-configurable widget slot on the weather dashboard.
// When empty it shows a "+" button; clicking it opens a picker so the user
// can choose which weather metric to display (wind, humidity, rain %, UV, or
// visibility). Once a metric is selected, the widget shows the icon, label,
// and live value. An ellipsis button lets the user remove the selection
// and return to the empty state.
//
// State is local — each widget instance independently tracks what it shows.
// The actual values come from WeatherPage via the `values` prop.

import React, { useState, useEffect, useRef } from "react";
import "./CustomWidget.css";

// Icons for the available metrics and the UI controls
import windIcon    from "../assets/weather-icons/windy.svg";
import rainIcon    from "../assets/precipitation.svg";
import uvIcon      from "../assets/UV.png";
import compassIcon from "../assets/Compass.png";
import addIcon     from "../assets/add.svg";
import ellipsesIcon from "../assets/ellipses.svg";

// CONDITIONS defines all the metric options a user can pick from.
// key must match a property name in the `values` prop from WeatherPage.
// icon is null for humidity because there's no dedicated icon asset for it.
const CONDITIONS = [
  { key: "wind",       label: "Wind",       icon: windIcon    },
  { key: "humidity",   label: "Humidity",   icon: null        },
  { key: "rain",       label: "Rain %",     icon: rainIcon    },
  { key: "uv",         label: "UV Index",   icon: uvIcon      },
  { key: "visibility", label: "Visibility", icon: compassIcon },
];

// Props:
//   values — object mapping condition keys to pre-formatted display strings,
//            e.g. { wind: "12 km/h", humidity: "65%", rain: "20%", uv: "Low", visibility: "10.0 km" }
function CustomWidget({ values = {} }) {
  const [selected,    setSelected]    = useState(null);  // key of the chosen metric, or null if empty
  const [showPicker,  setShowPicker]  = useState(false); // whether the metric picker dropdown is open
  const [showMenu,    setShowMenu]    = useState(false);  // whether the "Remove" context menu is open
  const ref = useRef(null); // ref to the widget container for outside-click detection

  // Close any open overlay when clicking outside the widget.
  // This avoids the picker/menu staying open when the user clicks elsewhere on the page.
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

  // handleRemove clears the selected metric and closes the options menu
  const handleRemove = () => {
    setSelected(null);
    setShowMenu(false);
  };

  // Look up the full condition object and current value for the selected key
  const condition = CONDITIONS.find((c) => c.key === selected);
  const value     = selected ? (values[selected] ?? "—") : null; // "—" if the value hasn't loaded yet

  return (
    <div className="custom-widget" ref={ref}>

      {/* Empty state */}
      {/* Shown when no metric has been chosen yet */}
      {!selected && (
        <>
          {/* "+" icon toggles the picker dropdown */}
          <img
            className="custom-widget__plus"
            src={addIcon}
            alt="Add"
            onClick={() => setShowPicker((v) => !v)}
          />

          {/* Dropdown list of available metrics */}
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

      {/* Filled state */}
      {/* Shown once the user has picked a metric */}
      {selected && (
        <>
          {/* Ellipsis button opens the "Remove" context menu */}
          <img
            className="custom-widget__ellipsis"
            src={ellipsesIcon}
            alt="Options"
            onClick={() => setShowMenu((v) => !v)}
          />

          {/* Context menu with a single "Remove" option to reset the widget */}
          {showMenu && (
            <div className="custom-widget__menu">
              <div className="custom-widget__menu-item" onClick={handleRemove}>
                Remove
              </div>
            </div>
          )}

          {/* Icon for the selected metric — only rendered if an icon asset exists */}
          {condition.icon && (
            <img
              className="custom-widget__icon"
              src={condition.icon}
              alt={condition.label}
            />
          )}

          {/* readable label (e.g. "Wind", "UV Index") */}
          <div className="custom-widget__condition-label">{condition.label}</div>

          {/* The actual current value (pre-formatted string from WeatherPage) */}
          <div className="custom-widget__value">{value}</div>
        </>
      )}

    </div>
  );
}

export default CustomWidget;
