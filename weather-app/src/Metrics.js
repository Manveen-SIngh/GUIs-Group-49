import { useState, useEffect } from "react";
import bg from "./assets/PartlyCloudy.png";

import TopBarMetricPage from "./components/TopBarMetricPage";
import WeatherBox from "./components/WeatherBox";
import WindBox from "./components/WindBox";
import SunriseSunsetBox from "./components/SunriseSunsetBox";
import UVBox from "./components/UVBox";
import VisibilityBox from "./components/VisibilityBox";
import HumidityBox from "./components/HumidityBox";

import { fetchWeatherByCity, fetchWeatherByCoords } from "./services/weatherApi";
import SearchBar from "./components/SearchBar";

function Metrics() {
  const [weather, setWeather] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");

  const loadWeather = async (city) => {
    try {
      setError("");
      const data = await fetchWeatherByCity(city);
      setWeather(data);
      localStorage.setItem("lastCity", city);
    } catch (err) {
      setError(err.message);
    }
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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 0",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 1200,
          padding: "0 30px 30px",
          boxSizing: "border-box",
        }}
      >
        <TopBarMetricPage />

        {/* Search bar */}
        <div style={{ marginBottom: 10 }}>
          <SearchBar
            query={searchInput}
            onQueryChange={setSearchInput}
            onSearch={handleSearch}
          />
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: 8, fontFamily: "Rubik" }}>
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
          />
          <VisibilityBox
            visibility={cur ? cur.visibility : 0}
            nowTime={cur ? `${String(Math.floor(cur.nowHour)).padStart(2, "0")}:00` : ""}
          />
          <HumidityBox
            humidity={cur ? cur.humidity : 0}
            humidityAvg={tod ? Math.round((tod.humidityHigh + tod.humidityLow) / 2) : 0}
            nowTime={cur ? `${String(Math.floor(cur.nowHour)).padStart(2, "0")}:00` : ""}
          />
        </div>
      </div>
    </div>
  );
}

export default Metrics;
