import { useSidebar } from "./Sidebar";

import "./OdAPage.css";

import bg from "./assets/PartlyCloudy.png";
import menuIcon from "./assets/menu.svg";

import ActivityScoresBox, { ACTIVITIES } from "./components/ActivityScoresBox";
import hiArrow        from "./assets/redArrowUp.svg";
import loArrow        from "./assets/blueArrowDown.svg";
import partlySunnyIcon from "./assets/weather-icons/sun-clouds.svg";
import rainyIcon       from "./assets/weather-icons/rainy.svg";
import windDirection   from "./assets/Compass.png";

// ─── Shared data ────────────────────────────────────────────────────────────


// Per-activity page details — extend this object for each activity key
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

// ─── Shared weather values (same across all pages) ───────────────────────────

const WEATHER = {
  unitTemp:          "F",
  distanceUnitSpeed: "m",
  distanceUnit:      "mi",

  tempHi:  "16",
  tempLo:  "10",
  tempNow: "13",

  precipToday:             "<10",
  prevPrecipStatus:        "Heavy",
  precipMessage:           "Wet Ground",
  currentPrecipScoreColour: "#3BC50F",
  prevPrecipScoreColour:    "#FF4A3A",
  precipIconToday:         partlySunnyIcon,
  precipIconPrev:          rainyIcon,

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
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch yesterday's precipitation once we have coordinates
  useEffect(() => {
    if (!weather?.lat || !weather?.lon) return;
    const cached = localStorage.getItem("cachedPrevPrecip");
    if (cached) {
      try { setPrevPrecip(JSON.parse(cached)); } catch (_) {}
    }
    fetchYesterdayPrecip(weather.lat, weather.lon)
      .then((data) => {
        setPrevPrecip(data);
        localStorage.setItem("cachedPrevPrecip", JSON.stringify(data));
      })
      .catch(console.error);
  }, [weather?.lat, weather?.lon]);

  const pageLabel = ACTIVITIES.find((a) => a.key === activityKey)?.label ?? activityKey;
  const D = "—"; // loading placeholder

  const score   = weather ? weather.scores[activityKey] : null;
  const today   = weather ? weather.today   : null;
  const current = weather ? weather.current : null;
  const labels  = weather ? weather.unitLabels : { temp: "°C", wind: "km/h", dist: "km" };

  const mainColor = score != null ? scoreColor(score) : "#FFAB1C";
  const mainMsg   = score != null ? activityMessage(activityKey, score) : "Loading…";

  return (
    <div className="page-wrapper" style={{ backgroundImage: `url(${bg})` }}>

      {/* ── Clock ───────────────────────────────────────────────── */}
      <div className="layer layer--shadow">
        <div className="clock-bg" />
        <div className="clock-display">{time}</div>
      </div>

      {/* ── Unit toggle – Distance ──────────────────────────────── */}
      <div className="layer">
        <div className="unit-distance-bg" />
        <div className="unit-distance-active" />
        <div className="unit-distance-mi">mi</div>
        <div className="unit-distance-km">km</div>
      </div>

      {/* ── Unit toggle – Temperature ───────────────────────────── */}
      <div className="layer">
        <div className="unit-temp-bg" />
        <div className="unit-temp-active" />
        <div className="unit-temp-c">°C</div>
        <div className="unit-temp-f">°F</div>
      </div>

      {/* ── Menu button ─────────────────────────────────────────── */}
      <div className="layer" style={{ zIndex: 100 }}>
        <div className="menu-btn-bg" />
        <div className="menu-btn-icon-wrap" onClick={open} style={{ cursor: 'pointer' }}>
          <div className="menu-btn-icon-inner">
            <img src={menuIcon} alt="Menu" />
          </div>
          <Clock />
        </div>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="layer">
        <div className="header-subtitle">Outdoor Activity Summary</div>
        <div className="header-activity-title">{pageLabel}:</div>
      </div>

      {/* ── Main activity score ─────────────────────────────────── */}
      <div className="layer layer--shadow">
        <div className="main-score-swatch" style={{ background: pd.mainActivityColor }} />
        <div className="main-score-value">{pd.mainActivityScore}/10</div>
        <div className="main-score-message">{pd.mainActivityMessage}</div>
      </div>

      {/* ── Scores box ──────────────────────────────────────────── */}
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

      {/* ── Temperature box ─────────────────────────────────────── */}
      <div className="layer layer--shadow">
        <div className="temp-box" />
        <div className="temp-score-swatch" style={{ background: pd.tempScoreColour }} />
        <div className="temp-title">Temperature</div>
        <div className="temp-today-label">Today:</div>
        <div className="temp-hi-value">{w.tempHi}°{w.unitTemp}</div>
        <img className="temp-hi-arrow" src={hiArrow} alt="High" />
        <div className="temp-lo-value">{w.tempLo}°{w.unitTemp}</div>
        <img className="temp-lo-arrow" src={loArrow} alt="Low" />
        <div className="temp-now-label">Right Now:</div>
        <div className="temp-now-value">{w.tempNow}°{w.unitTemp}</div>
      </div>

      {/* ── Precipitation box ───────────────────────────────────── */}
      <div className="layer layer--shadow">
        <div className="precip-box" />
        <div className="precip-score-swatch" style={{ background: pd.precipScoreColour }} />
        <div className="precip-title">Precipitation</div>

        <img className="precip-icon-today" src={w.precipIconToday} alt="Today weather" />
        <div className="precip-today-label">Today</div>
        <div className="precip-today-score-swatch" style={{ background: w.currentPrecipScoreColour }} />
        <div className="precip-today-value">{w.precipToday}%</div>

        <img className="precip-icon-prev" src={w.precipIconPrev} alt="Previous weather" />
        <div className="precip-prev-label">Prev.</div>
        <div className="precip-prev-score-swatch" style={{ background: w.prevPrecipScoreColour }} />
        <div className="precip-prev-value">{w.prevPrecipStatus}<br />rain</div>

        <div className="precip-message">{w.precipMessage}</div>
      </div>

      {/* ── Humidity box ────────────────────────────────────────── */}
      <div className="layer layer--shadow">
        <div className="humidity-box" />
        <div className="humidity-score-swatch" style={{ background: pd.HumidityScoreColour }} />
        <div className="humidity-title">Humidity</div>
        <div className="humidity-today-label">Today:</div>

        <div className="humidity-today-hi-label humidity-hi-label">Hi</div>
        <div className="humidity-today-hi-value humidity-value">{w.HumidityTodayHi}%</div>
        <div className="humidity-today-lo-label humidity-lo-label">Lo</div>
        <div className="humidity-today-lo-value humidity-value">{w.HumidityTodayLo}%</div>

        <div className="humidity-prev-label">Previously:</div>
        <div className="humidity-prev-hi-label humidity-hi-label">Hi</div>
        <div className="humidity-prev-hi-value humidity-value">{w.HumidityPrevHi}%</div>
        <div className="humidity-prev-lo-label humidity-lo-label">Lo</div>
        <div className="humidity-prev-lo-value humidity-value">{w.HumidityPrevLo}%</div>
      </div>

      {/* ── Visibility box ──────────────────────────────────────── */}
      <div className="layer layer--shadow">
        <div className="visibility-box" />
        <div className="visibility-score-swatch" style={{ background: pd.visibilityScoreColour }} />
        <div className="visibility-title">Visibility</div>
        <div className="visibility-today-label">Today:</div>
        <div className="visibility-hi-label">Hi</div>
        <div className="visibility-hi-value">{w.visibilityTodayHi}{w.distanceUnit}</div>
        <div className="visibility-lo-label">Lo</div>
        <div className="visibility-lo-value">{w.visibilityTodayLo}{w.distanceUnit}</div>
        <div className="visibility-now-label">Right Now:</div>
        <div className="visibility-now-value">{w.visibilityNow}{w.distanceUnit}</div>
      </div>

      {/* ── Wind speed box ──────────────────────────────────────── */}
      <div className="layer layer--shadow">
        <div className="wind-box" />
        <div className="wind-score-swatch" style={{ background: pd.windspeedScoreColour }} />
        <div className="wind-title">. Wind<br />Speed</div>
        <img
          className="wind-compass"
          src={windDirection}
          alt="Wind direction"
          style={{ transform: `rotate(${w.windAngle}deg)` }}
        />
        <div className="wind-speed-value">{w.windSpeed}{w.distanceUnitSpeed}ph</div>
        <div className="wind-avg-label">Daily<br /> Average</div>
      </div>

      {/* ── UV box ──────────────────────────────────────────────── */}
      <div className="layer layer--shadow">
        <div className="uv-box" />
        <div className="uv-score-swatch" style={{ background: pd.UVScoreColour }} />
        <div className="uv-title">UV</div>
        <div className="uv-daily-label">Daily <br /> Highest <br /> Level:</div>
        <div className="uv-daily-value">{w.UVLevelDaily}</div>
      </div>
    </div>
  );
}

export default OdAPage;
