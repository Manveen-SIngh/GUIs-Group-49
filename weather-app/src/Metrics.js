import { useState, useEffect } from "react";

import TopBarMetricPage from "./components/TopBarMetricPage";
import WeatherBox from "./components/WeatherBox";
import WindBox from "./components/WindBox";
import SunriseSunsetBox from "./components/SunriseSunsetBox";
import UVBox from "./components/UVBox";
import VisibilityBox from "./components/VisibilityBox";
import HumidityBox from "./components/HumidityBox";

// 1. Import dynamic background helper and a fallback image
import { fetchWeatherByCity, fetchWeatherByCoords, getBackgroundImage, getUnitSettings } from "./services/weatherApi";
import fallbackBg from "./assets/backgrounds/weather-partly-cloudy.svg";
import SearchBar from "./components/SearchBar";

function Metrics() {
  const [weather, setWeather] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");

  // Local temp unit — initialized from global settings, changes stay on this page only
  const [tempUnit, setTempUnit] = useState(() => {
    const s = getUnitSettings();
    return s.Temperature === "Fahrenheit (F)" ? "F" : "C";
  });

  const loadWeather = async (city, settingsOverride = null) => {
    try {
      setError("");
      const data = await fetchWeatherByCity(city, settingsOverride);
      setWeather(data);
      localStorage.setItem("lastCity", city);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTempChange = (unit) => {
    setTempUnit(unit);
    const saved = localStorage.getItem("unitSettings");
    const parsed = saved ? JSON.parse(saved) : {};
    const override = { ...parsed, Temperature: unit === "F" ? "Fahrenheit (F)" : "Celsius (C)" };
    const city = localStorage.getItem("lastCity");
    if (city) fetchWeatherByCity(city, override).then(setWeather).catch(console.error);
  };

  useEffect(() => {
    const saved = localStorage.getItem("lastCity");
    if (saved) {
      loadWeather(saved);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const data = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
            setWeather(data);
            localStorage.setItem("lastCity", data.locationName);
          } catch (err) {
            setError(err.message);
          }
        },
        () => {}
      );
    }
  }, []);

  const handleSearch = () => {
    if (searchInput.trim()) loadWeather(searchInput.trim());
  };

  const w = weather;
  const cur = w ? w.current : null;
  const tod = w ? w.today : null;
  
  // Extract unitLabels from our new API payload, providing defaults if data hasn't loaded
  const unitLabels = w ? w.unitLabels : { temp: "°C", wind: "km/h", dist: "km", precip: "mm" };

  // 2. Determine dynamic background based on weather and time
  let currentBg = fallbackBg;
  if (cur) {
    const isNight = cur.nowHour < cur.sunriseHour || cur.nowHour >= cur.sunsetHour;
    currentBg = getBackgroundImage(cur.condition, isNight);
  }
  const getHourlyIntervals = (dataKey) => {
      if (!w || !w.rawHourly) return [];
      return [0, 6, 12, 18, 24].map(hourOffset => 
          w.rawHourly[hourOffset] ? w.rawHourly[hourOffset][dataKey] : 0
      );
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${currentBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "32px 0",
        boxSizing: "border-box",
        transition: "background-image 0.5s ease-in-out"
      }}
    >
      <div
        style={{
          width: "1400px",
          maxWidth: "100%",
          padding: "0 24px 24px",
          boxSizing: "border-box",
        }}
      >
        <TopBarMetricPage unit={tempUnit} onUnitChange={handleTempChange} />

        {/* Search bar */}
        <div style={{ marginBottom: 10 }}>
          <SearchBar
            query={searchInput}
            onQueryChange={setSearchInput}
            onSearch={handleSearch}
          />
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: 8, fontFamily: "Rubik", fontWeight: "bold" }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <WeatherBox
            hourly={w ? w.hourly : []}
            description={cur ? cur.description : ""}
            nowTime={cur ? cur.nowHour !== undefined
              ? `${String(Math.floor(cur.nowHour)).padStart(2, "0")}:00`
              : ""
              : ""}
          />
        </div>

        {/* Middle row */}
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 20,
          }}
        >
          <WindBox
            windSpeed={cur ? cur.windSpeed : 0}
            windGust={cur ? cur.windGust : 0}
            windDeg={cur ? cur.windDeg : 0}
            windDir={cur ? cur.windDir : "N"}
            nowTime={cur ? cur.sunrise : ""}
            unitWind={unitLabels.wind} // Pass dynamic wind unit
          />
          <SunriseSunsetBox
            sunrise={cur ? cur.sunrise : "06:00"}
            sunset={cur ? cur.sunset : "18:00"}
            sunriseHour={cur ? cur.sunriseHour : 6}
            sunsetHour={cur ? cur.sunsetHour : 18}
            nowHour={cur ? cur.nowHour : 12}
          />
        </div>

        {/* Bottom row */}
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          <UVBox
    uvLabel={cur ? cur.uvLabel : "Low"}
    uvi={cur ? cur.uvi : 0}
    nowTime={cur ? `${String(Math.floor(cur.nowHour)).padStart(2, "0")}:00` : ""}
    hourlyData={getHourlyIntervals('uvi')}
/>

<VisibilityBox
    visibility={cur ? cur.visibility : 0}
    nowTime={cur ? `${String(Math.floor(cur.nowHour)).padStart(2, "0")}:00` : ""}
    unitDist={unitLabels.dist}
    hourlyData={getHourlyIntervals('visibility')}
/>

<HumidityBox
    humidity={cur ? cur.humidity : 0}
    humidityAvg={tod ? Math.round((tod.humidityHigh + tod.humidityLow) / 2) : 0}
    nowTime={cur ? `${String(Math.floor(cur.nowHour)).padStart(2, "0")}:00` : ""}
    hourlyData={getHourlyIntervals('humidity')}
/>
        </div>
      </div>
    </div>
  );
}

export default Metrics;