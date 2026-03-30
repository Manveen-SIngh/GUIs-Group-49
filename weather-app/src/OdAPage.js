import { useSidebar } from "./Sidebar";

import "./OdAPage.css";

import bg from "./assets/PartlyCloudy.png";
import menuIcon from "./assets/menu.svg";

import ActivityScoresBox, { ACTIVITIES } from "./components/ActivityScoresBox";
import Clock from "./components/Clock";
import hiArrow        from "./assets/redArrowUp.svg";
import loArrow        from "./assets/blueArrowDown.svg";
import partlySunnyIcon from "./assets/weather-icons/sun-clouds.svg";
import rainyIcon       from "./assets/weather-icons/rainy.svg";
import windDirection   from "./assets/Compass.png";

// ─── Per-activity page details ───────────────────────────────────────────────

const PAGE_DATA = {
  cycling: {
    mainActivityScore:   "6",
    mainActivityColor:   "#FFAB1C",
    mainActivityMessage: "Good conditions for a ride",
    tempScoreColour:        "#3BC50F",
    precipScoreColour:      "#3BC50F",
    HumidityScoreColour:    "#3BC50F",
    visibilityScoreColour:  "#3BC50F",
    UVScoreColour:          "#FFAB1C",
    windspeedScoreColour:   "#FF4A3A",
  },
  hiking: {
    mainActivityScore:   "9",
    mainActivityColor:   "#3BC50F",
    mainActivityMessage: "Great day for a hike!",
    tempScoreColour:        "#3BC50F",
    precipScoreColour:      "#3BC50F",
    HumidityScoreColour:    "#3BC50F",
    visibilityScoreColour:  "#3BC50F",
    UVScoreColour:          "#3BC50F",
    windspeedScoreColour:   "#3BC50F",
  },
  camping: {
    mainActivityScore:   "5",
    mainActivityColor:   "#FFAB1C",
    mainActivityMessage: "Maybe wait for another day",
    tempScoreColour:        "#FFAB1C",
    precipScoreColour:      "#FF4A3A",
    HumidityScoreColour:    "#3BC50F",
    visibilityScoreColour:  "#3BC50F",
    UVScoreColour:          "#3BC50F",
    windspeedScoreColour:   "#FF4A3A",
  },
  running: {
    mainActivityScore:   "8",
    mainActivityColor:   "#3BC50F",
    mainActivityMessage: "Good conditions for a run",
    tempScoreColour:        "#3BC50F",
    precipScoreColour:      "#3BC50F",
    HumidityScoreColour:    "#FFAB1C",
    visibilityScoreColour:  "#3BC50F",
    UVScoreColour:          "#3BC50F",
    windspeedScoreColour:   "#FFAB1C",
  },
};

// ─── Shared weather values ────────────────────────────────────────────────────

const WEATHER = {
  unitTemp:          "F",
  distanceUnitSpeed: "m",
  distanceUnit:      "mi",

  tempHi:  "16",
  tempLo:  "10",
  tempNow: "13",

  precipToday:              "<10",
  prevPrecipStatus:         "Heavy",
  precipMessage:            "Wet Ground",
  currentPrecipScoreColour: "#3BC50F",
  prevPrecipScoreColour:    "#FF4A3A",
  precipIconToday:          partlySunnyIcon,
  precipIconPrev:           rainyIcon,

  HumidityTodayHi: "87",
  HumidityTodayLo: "73",
  HumidityPrevHi:  "84",
  HumidityPrevLo:  "65",

  visibilityTodayHi: "12",
  visibilityTodayLo: "5",
  visibilityNow:     "6",

  windSpeed: "15",
  windAngle: 130,

  UVLevelDaily: "Low",
};

// ─── Component ───────────────────────────────────────────────────────────────

function OdAPage({ activityKey }) {
  const { open } = useSidebar();

  const pd = PAGE_DATA[activityKey];
  const w  = WEATHER;

  const pageLabel = ACTIVITIES.find((a) => a.key === activityKey)?.label ?? activityKey;

  return (
    <div className="page-wrapper" style={{ backgroundImage: `url(${bg})` }}>
      <div className="page-content">

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="oda-top-bar">
          <div className="oda-top-left">
            <div className="oda-menu-btn" onClick={open}>
              <img src={menuIcon} alt="Menu" />
            </div>
            <div className="oda-toggle-pill">
              <span>°C</span>
              <span>°F</span>
            </div>
            <div className="oda-toggle-pill">
              <span>mi</span>
              <span>km</span>
            </div>
          </div>
          <Clock />
        </div>

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="oda-header">
          <div className="oda-title-group">
            <div className="oda-subtitle">Outdoor Activity Summary</div>
            <div className="oda-activity-name">{pageLabel}:</div>
          </div>
          <div className="oda-main-score">
            <div className="oda-score-row">
              <div className="oda-score-swatch" style={{ background: pd.mainActivityColor }} />
              <div className="oda-score-value">{pd.mainActivityScore}/10</div>
            </div>
            <div className="oda-score-message">{pd.mainActivityMessage}</div>
          </div>
        </div>

        {/* ── Card grid ───────────────────────────────────────────── */}
        <div className="oda-grid">

          {/* Scores */}
          <ActivityScoresBox activeKey={activityKey} />

          {/* Precipitation */}
          <div className="oda-card">
            <div className="oda-card-header">
              <div className="oda-card-swatch" style={{ background: pd.precipScoreColour }} />
              <span className="oda-card-title">Precipitation</span>
            </div>
            <div className="oda-precip-icons">
              <div className="oda-precip-col">
                <img src={w.precipIconToday} alt="Today" className="oda-weather-icon" />
                <div className="oda-precip-period-label">Today</div>
                <div className="oda-precip-score-dot" style={{ background: w.currentPrecipScoreColour }} />
                <div className="oda-precip-value">{w.precipToday}%</div>
              </div>
              <div className="oda-precip-col">
                <img src={w.precipIconPrev} alt="Prev" className="oda-weather-icon" />
                <div className="oda-precip-period-label">Prev.</div>
                <div className="oda-precip-score-dot" style={{ background: w.prevPrecipScoreColour }} />
                <div className="oda-precip-value">{w.prevPrecipStatus}<br />rain</div>
              </div>
            </div>
            <div className="oda-card-footer">{w.precipMessage}</div>
          </div>

          {/* Humidity */}
          <div className="oda-card">
            <div className="oda-card-header">
              <div className="oda-card-swatch" style={{ background: pd.HumidityScoreColour }} />
              <span className="oda-card-title">Humidity</span>
            </div>
            <div className="oda-humidity-content">
              <div className="oda-period-label">Today:</div>
              <div className="oda-hi-lo">
                <span className="hi">Hi {w.HumidityTodayHi}%</span>
                <span className="lo">Lo {w.HumidityTodayLo}%</span>
              </div>
              <div className="oda-period-label">Previously:</div>
              <div className="oda-hi-lo">
                <span className="hi">Hi {w.HumidityPrevHi}%</span>
                <span className="lo">Lo {w.HumidityPrevLo}%</span>
              </div>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="oda-card">
            <div className="oda-card-header">
              <div className="oda-card-swatch" style={{ background: pd.windspeedScoreColour }} />
              <span className="oda-card-title">Wind Speed</span>
            </div>
            <div className="oda-wind-content">
              <img
                className="oda-compass"
                src={windDirection}
                alt="Wind direction"
                style={{ transform: `rotate(${w.windAngle}deg)` }}
              />
              <div className="oda-wind-speed">{w.windSpeed}{w.distanceUnitSpeed}ph</div>
              <div className="oda-wind-avg-label">Daily Average</div>
            </div>
          </div>

          {/* Map */}
          <div className="oda-card oda-map-card">
            <span className="oda-map-label">Map</span>
          </div>

          {/* Temperature */}
          <div className="oda-card">
            <div className="oda-card-header">
              <div className="oda-card-swatch" style={{ background: pd.tempScoreColour }} />
              <span className="oda-card-title">Temperature</span>
            </div>
            <div className="oda-temp-content">
              <div className="oda-period-label">Today:</div>
              <div className="oda-temp-hi-lo">
                <img src={hiArrow} alt="Hi" className="oda-arrow" />
                <span>{w.tempHi}°{w.unitTemp}</span>
                <img src={loArrow} alt="Lo" className="oda-arrow" />
                <span>{w.tempLo}°{w.unitTemp}</span>
              </div>
              <div className="oda-period-label">Right Now:</div>
              <div className="oda-temp-now">{w.tempNow}°{w.unitTemp}</div>
            </div>
          </div>

          {/* Visibility */}
          <div className="oda-card">
            <div className="oda-card-header">
              <div className="oda-card-swatch" style={{ background: pd.visibilityScoreColour }} />
              <span className="oda-card-title">Visibility</span>
            </div>
            <div className="oda-vis-content">
              <div className="oda-period-label">Today:</div>
              <div className="oda-hi-lo">
                <span className="hi">Hi {w.visibilityTodayHi}{w.distanceUnit}</span>
                <span className="lo">Lo {w.visibilityTodayLo}{w.distanceUnit}</span>
              </div>
              <div className="oda-period-label">Right Now:</div>
              <div className="oda-vis-now">{w.visibilityNow}{w.distanceUnit}</div>
            </div>
          </div>

          {/* UV */}
          <div className="oda-card">
            <div className="oda-card-header">
              <div className="oda-card-swatch" style={{ background: pd.UVScoreColour }} />
              <span className="oda-card-title">UV</span>
            </div>
            <div className="oda-uv-content">
              <div className="oda-uv-label">Daily Highest Level:</div>
              <div className="oda-uv-value">{w.UVLevelDaily}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OdAPage;
