import menuIcon from "../assets/menu.svg";
import { useSidebar } from "../Sidebar";
import Clock from "./Clock";
import "./TopBarMetricPage.css";

/**
 * TopBarMetricPage
 *
 * Header section for the metrics page.
 * Contains:
 * - Sidebar toggle button
 * - Temperature unit switch (C / F)
 * - Clock display
 */
export default function TopBarMetricPage({ unit = "C", onUnitChange }) {
  const { open } = useSidebar();

  return (
    <div className="topbar">
      {/* Sidebar menu button */}
      <div className="topbar-menu">
        <img
          src={menuIcon}
          alt="menu"
          className="topbar-menu-icon"
          onClick={open}
        />
      </div>

      {/* Unit toggle switch */}
      <div className="topbar-toggle">
        {/* Sliding background indicator */}
        <div
          className={`topbar-toggle-slider ${
            unit === "C" ? "left" : "right"
          }`}
        />

        {/* Celsius button */}
        <button
          className="topbar-toggle-btn"
          onClick={() => onUnitChange && onUnitChange("C")}
        >
          °C
        </button>

        {/* Fahrenheit button */}
        <button
          className="topbar-toggle-btn"
          onClick={() => onUnitChange && onUnitChange("F")}
        >
          °F
        </button>
      </div>

      {/* Clock display */}
      <div className="topbar-clock">
        <Clock />
      </div>
    </div>
  );
}