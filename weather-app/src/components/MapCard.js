import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapCard.css";

import markerIcon2x   from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon     from "leaflet/dist/images/marker-icon.png";
import markerShadow   from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
});

function MapUpdater({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

function MapCard({
  lat = 51.5072,
  lon = -0.1276,
  locationName = "London"
})
{
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/FullMap?lat=${lat}&lon=${lon}&name=${encodeURIComponent(locationName)}`);
  };

  return (
    <div className="map-card">
      <div className="map-card__title">{locationName}</div>

      <MapContainer
        center={[lat, lon]}
        zoom={10}
        scrollWheelZoom={false}
        className="map-card__map"
      >
        <MapUpdater lat={lat} lon={lon} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileLayer
          attribution="&copy; OpenWeather"
          url={`https://maps.openweathermap.org/maps/2.0/weather/PA0/{z}/{x}/{y}?opacity=1&fill_bound=true&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`}
        />
        <Marker position={[lat, lon]}>
          <Popup>{locationName}</Popup>
        </Marker>
      </MapContainer>

      {/* Transparent overlay to capture clicks over the Leaflet map */}
      <div className="map-card__overlay" onClick={handleClick} />
    </div>
  );
}

export default MapCard;
