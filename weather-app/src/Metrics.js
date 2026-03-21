import bg from "./assets/PartlyCloudy.png";

import TopBarMetricPage from "./components/TopBarMetricPage";
import WeatherBox from "./components/WeatherBox";
import WindBox from "./components/WindBox";
import SunriseSunsetBox from "./components/SunriseSunsetBox";
import UVBox from "./components/UVBox";
import VisibilityBox from "./components/VisibilityBox";
import HumidityBox from "./components/HumidityBox";

function Metrics() {
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
        padding: "40px 0", // ✅ more space top/bottom
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 1200, // ✅ reduced from 1440 → cleaner margins
          padding: "0 30px 30px", // ✅ more side padding
          boxSizing: "border-box",
        }}
      >
        <TopBarMetricPage />

        <div style={{ marginTop: 20 }}>
          <WeatherBox />
        </div>

        {/* Middle row */}
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 20, // ✅ more spacing between boxes
          }}
        >
          <WindBox />
          <SunriseSunsetBox />
        </div>

        {/* Bottom row */}
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20, // ✅ more spacing
          }}
        >
          <UVBox />
          <VisibilityBox />
          <HumidityBox />
        </div>
      </div>
    </div>
  );
}

export default Metrics;