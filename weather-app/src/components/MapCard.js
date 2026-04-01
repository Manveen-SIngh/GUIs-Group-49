// MapCard.js
// Displays a small interactive Leaflet map centred on the searched location.
// Clicking anywhere on the map navigates to the full-map page.
//
// Two tile layers are stacked:
// 1. OpenStreetMap — the base map with roads and labels
// 2. OpenWeather precipitation overlay — semi-transparent weather data on top

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapCard.css";

// Leaflet's default marker images are bundled separately and need to be
// explicitly imported when using webpack, otherwise the marker icon breaks.
import markerIcon2x   from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon     from "leaflet/dist/images/marker-icon.png";
import markerShadow   from "leaflet/dist/images/marker-shadow.png";

// Fix the broken default icon that happens with webpack/CRA builds.
// We delete the internal _getIconUrl method and supply the paths manually.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
});

// MapUpdater is a child component that lives inside MapContainer.
// We need it because MapContainer only reads `center` once on mount 
// it doesn't re-centre when props change. This component calls
// map.setView() directly whenever lat or lon changes.
function MapUpdater({ lat, lon }) {
  const map = useMap(); // hook to access the Leaflet map instance
  useEffect(() => {
    map.setView([lat, lon], map.getZoom()); // recentre without changing zoom level
  }, [lat, lon, map]);
  return null; 
}

// Props:
//   lat — latitude of the location (default: London)
//   lon — longitude of the location
//   locationName — shown as the card title and in the map marker popup
function MapCard({
  lat = 51.5072,
  lon = -0.1276,
  locationName = "London"
})
{
  const navigate = useNavigate();

  // Navigate to the full-map page, passing coords and name as query params
  const handleClick = () => {
    navigate(`/FullMap?lat=${lat}&lon=${lon}&name=${encodeURIComponent(locationName)}`);
  };

  return (
    <div className="map-card">
      {/* Location name displayed above the map */}
      <div className="map-card__title">{locationName}</div>

      {/* scrollWheelZoom disabled to avoid accidentally zooming while scrolling the page */}
      <MapContainer
        center={[lat, lon]}
        zoom={10}
        scrollWheelZoom={false}
        className="map-card__map"
      >
        {/* Re-centres the map whenever the searched location changes */}
        <MapUpdater lat={lat} lon={lon} />

        {/* Base map layer from OpenStreetMap */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Precipitation overlay from OpenWeather — layered on top of the base map */}
        <TileLayer
          attribution="&copy; OpenWeather"
          url={`https://maps.openweathermap.org/maps/2.0/weather/PA0/{z}/{x}/{y}?opacity=1&fill_bound=true&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`}
        />

        {/* Marker pin at the searched location with a popup label */}
        <Marker position={[lat, lon]}>
          <Popup>{locationName}</Popup>
        </Marker>
      </MapContainer>

      {/* Transparent overlay to capture clicks over the Leaflet map.
          Leaflet takes pointer events itself, so a plain onClick on the
          MapContainer won't do anything. This invisible div sits on top and handles
          the click to navigate to the full-map page instead. */}
      <div className="map-card__overlay" onClick={handleClick} />
    </div>
  );
}

export default MapCard;
