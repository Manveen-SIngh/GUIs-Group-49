import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapCard.css";

function MapCard({
  lat = 51.5072,
  lon = -0.1276,
  locationName = "London"
})
{
  return (
    <div className="map-card">
      <div className="map-card__title">{locationName}</div>

      <MapContainer
        center={[lat, lon]}
        zoom={10}
        scrollWheelZoom={false}
        className="map-card__map"
      >
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
    </div>
  );
}

export default MapCard;
