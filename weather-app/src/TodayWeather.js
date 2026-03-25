import React, { useState } from "react";
import bg from "./assets/PartlyCloudy.png";
import "./TodayWeather.css";
import backBtn from './assets/BackBtn.png';
import searchIcon from './assets/search.svg';
import cloudyIcon from './assets/weather-icons/clouds.svg';
import HourlyForecast from "./components/HourlyForecast";
import HourlyV2 from "./components/HourlyV2";

function TodayWeather() {
    const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        color: "white"
        
        
      }}
      className="weather-container"

      
    >

                
      <div style={{ width: "100%", padding: "0 10px", marginTop: "250px", boxSizing: "border-box" }}>
        <HourlyV2 />
      </div>

      {/*Header with back button, search and c/f and mi/km */}
      <header 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          width: "100%", 
          maxWidth: "500px", 
          marginBottom: "40px" 
        }}
      >
        <button style={{ background: "transparent", border: "none", cursor: "pointer" }}>
          <img src={backBtn} alt="Go Back" style={{ width: "24px", height: "24px" }} />
        </button>

        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.50)', borderRadius: '43px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', padding: "4px" }}>
          {/* Active state - mi/km */}
          <div style={{ padding: "8px 16px", background: 'rgba(203, 210, 208, 0.70)', borderRadius: '43px', color: 'black', fontSize: '18px', fontFamily: 'Rubik', fontWeight: '700', cursor: "pointer" }}>
            mi
          </div>
          {/* Inactive state */}
          <div style={{ padding: "8px 16px", color: 'black', fontSize: '18px', fontFamily: 'Rubik', fontWeight: '700', cursor: "pointer" }}>
            km
          </div>
        </div>

        <div style={{ display: 'flex', marginRight: "20px", background: 'rgba(255, 255, 255, 0.50)', borderRadius: '43px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', padding: "4px" }}>
          {/* Active state - Celcius/Far */}
          <div style={{ padding: "8px 16px", background: 'rgba(203, 210, 208, 0.70)', borderRadius: '43px', color: 'black', fontSize: '18px', fontFamily: 'Rubik', fontWeight: '700', cursor: "pointer" }}>
            °C
          </div>
          {/* Inactive state */}
          <div style={{ padding: "8px 16px", color: 'black', fontSize: '18px', fontFamily: 'Rubik', fontWeight: '700', cursor: "pointer" }}>
            °F
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", background: "rgba(0,0,0,0.2)", padding: "8px 16px", borderRadius: "20px" }}>
          <input 
            type="text" 
            placeholder="Search location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: "none", border: "none", color: "white", outline: "none", marginRight: "10px" }}
          />
          <img src={searchIcon} alt="Search" style={{ width: "20px", height: "20px", cursor: "pointer" }} />
        </div>
      </header>

      {/*Main section*/}
      <main 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          flexGrow: 1 
        }}
      >
        <div style={{width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '240px 244px 244px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
        <img src={cloudyIcon} alt="Cloudy" style={{ width: "120px", height: "120px", marginBottom: "10px" }} />
        <h1 style={{ fontSize: "5rem", margin: "0", fontWeight: "300" }}>temp_current</h1>
        <h2 style={{ fontSize: "1.5rem", margin: "0 0 10px 0", fontWeight: "400" }}>weather_current</h2>
      </main>


    </div>
  );
}

export default TodayWeather;
