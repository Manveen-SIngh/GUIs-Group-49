import bg from "./assets/PartlyCloudy.png";

import TopBarMetricPage from "./components/TopBarMetricPage";
import WeatherBox from "./components/WeatherBox";
import WindBox from "./components/WindBox";
import SunriseSunsetBox from "./components/SunriseSunsetBox";
import UVBox from "./components/UVBox";
import VisibilityBox from "./components/VisibilityBox";
import HumidityBox from "./components/HumidityBox";

function OdA() {
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
      
    </div>
  );
}

export default OdA;