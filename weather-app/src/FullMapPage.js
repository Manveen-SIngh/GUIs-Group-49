import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./FullMapPage.css";

import { getBackgroundImage } from "./services/weatherApi";
import fallbackBg from "./assets/PartlyCloudy.png";
import menuIcon   from "./assets/menu.svg";
import { useSidebar } from "./Sidebar";
import SearchBar from "./components/SearchBar";
import Clock from "./components/Clock";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon   from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
});

function MapSetView({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

function FullMapPage() {
  const { open } = useSidebar();
  const [params] = useSearchParams();

  const [lat,  setLat]  = useState(parseFloat(params.get("lat"))  || 51.5072);
  const [lon,  setLon]  = useState(parseFloat(params.get("lon"))  || -0.1276);
  const [name, setName] = useState(params.get("name") || "London");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setError("");
      const res = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query.trim())}&limit=1&appid=${apiKey}`
      );
      if (!res.data.length) { setError("City not found."); return; }
      const { lat: newLat, lon: newLon, name: newName } = res.data[0];
      setLat(newLat);
      setLon(newLon);
      setName(newName);
      setQuery("");
    } catch {
      setError("Search failed.");
    }
  };

  let bg = fallbackBg;
  try {
    const cached = localStorage.getItem("cachedWeather");
    if (cached) {
      const w = JSON.parse(cached);
      if (w?.current) {
        const isNight = w.current.nowHour < w.current.sunriseHour || w.current.nowHour >= w.current.sunsetHour;
        bg = getBackgroundImage(w.current.condition, isNight);
      }
    }
  } catch (_) {}

  return (
    <div
      className="fmp-background"
      style={{ backgroundImage: `url(${bg})`, transition: "background-image 0.5s ease-in-out" }}
    >
      <div className="fmp-container">

        {/* ── Top bar (mirrors WeatherPage) ─────────────────────── */}
        <div className="weather-top-bar">
          <div className="top-left">
            <div className="top-button-box">
              <img src={menuIcon} alt="Menu" className="weather-page-menu-button" onClick={open} style={{ cursor: "pointer" }} />
            </div>
          </div>
          <div className="top-center">
            <SearchBar query={query} onQueryChange={setQuery} onSearch={handleSearch} />
          </div>
          <div className="top-right">
            <div className="top-time-box"><Clock /></div>
          </div>
        </div>

        {error && <p className="fmp-error">{error}</p>}

        {/* ── Location name ─────────────────────────────────────── */}
        <div className="fmp-location-name">{name}</div>

        {/* ── Map card ──────────────────────────────────────────── */}
        <div className="fmp-map-card">
          <MapContainer
            center={[lat, lon]}
            zoom={10}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%" }}
          >
            <MapSetView lat={lat} lon={lon} />
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TileLayer
              attribution="&copy; OpenWeather"
              url={`https://maps.openweathermap.org/maps/2.0/weather/PA0/{z}/{x}/{y}?opacity=1&fill_bound=true&appid=${apiKey}`}
            />
            <Marker position={[lat, lon]}>
              <Popup>{name}</Popup>
            </Marker>
          </MapContainer>
        </div>

      </div>
    </div>
  );
}

export default FullMapPage;
