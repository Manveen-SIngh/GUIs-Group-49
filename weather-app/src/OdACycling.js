<<<<<<< HEAD
import { useState, useEffect } from "react";
import bg from "./assets/PartlyCloudy.png";
import menuIcon from "./assets/menu.svg";

import hikingIcon  from "./assets/Activity-icons/hiking.svg";
import runningIcon from "./assets/Activity-icons/running.svg";
import cyclingIcon from "./assets/Activity-icons/cycling.svg";
import campingIcon from "./assets/Activity-icons/camping.svg";
import hiArrow     from "./assets/redArrowUp.svg";
import loArrow     from "./assets/blueArrowDown.svg";
import partlySunnyIcon from "./assets/weather-icons/sun-clouds.svg";
import rainyIcon   from "./assets/weather-icons/rainy.svg";
import sunnyIcon   from "./assets/weather-icons/Sunny.svg";
import stormyIcon  from "./assets/weather-icons/stormy.svg";
import cloudsIcon  from "./assets/weather-icons/clouds.svg";
import windDirection from "./assets/Compass.png";

import { fetchWeatherByCity, scoreColor, activityMessage } from "./services/weatherApi";

const getConditionIcon = (condition) => {
  if (condition === "Clear")       return sunnyIcon;
  if (condition === "Rain" || condition === "Drizzle") return rainyIcon;
  if (condition === "Thunderstorm") return stormyIcon;
  if (condition === "Clouds")      return cloudsIcon;
  return partlySunnyIcon;
};

function OdACycling() {
  const [weather, setWeather]     = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError]         = useState("");
  const [time, setTime]           = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const last = localStorage.getItem("lastCity");
    if (last) loadWeather(last);
  }, []);

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

  const handleSearch = () => { if (searchInput.trim()) loadWeather(searchInput.trim()); };

  // ── Derived display values ──────────────────────────────────────────────────
  const w = weather;

  var unitTemp = "C";
  var distanceUnitSpeed = "m";
  var distanceUnit = "mi";

  var mainActivityScore = w ? String(w.scores.cycling) : "6";
  var mainActivityColor = w ? scoreColor(w.scores.cycling) : '#FFAB1C';
  var score1  = w ? String(w.scores.cycling) : "6";
  var score2  = w ? String(w.scores.hiking)  : "9";
  var score3  = w ? String(w.scores.camping) : "5";
  var score4  = w ? String(w.scores.running) : "8";
  var colour1 = w ? scoreColor(w.scores.cycling) : '#FFAB1C';
  var colour2 = w ? scoreColor(w.scores.hiking)  : '#3BC50F';
  var colour3 = w ? scoreColor(w.scores.camping) : '#FFAB1C';
  var colour4 = w ? scoreColor(w.scores.running) : '#3BC50F';

  var activity1 = "Cycling";
  var activity2 = "Hiking";
  var activity3 = "Camping";
  var activity4 = "Running";

  var tempScoreColour      = w ? (w.today.tempHigh >= 10 && w.today.tempHigh <= 25 ? '#3BC50F' : '#FFAB1C') : '#FFAB1C';
  var precipScoreColour    = w ? (w.today.pop < 30 ? '#3BC50F' : w.today.pop < 60 ? '#FFAB1C' : '#FF4A3A') : '#FFAB1C';
  var HumidityScoreColour  = w ? (w.today.humidityHigh < 70 ? '#3BC50F' : w.today.humidityHigh < 85 ? '#FFAB1C' : '#FF4A3A') : '#3BC50F';
  var visibilityScoreColour= w ? (w.today.visibilityCurrent > 10 ? '#3BC50F' : w.today.visibilityCurrent > 5 ? '#FFAB1C' : '#FF4A3A') : '#FFAB1C';
  var UVScoreColour        = w ? (w.today.uvi < 6 ? '#3BC50F' : w.today.uvi < 8 ? '#FFAB1C' : '#FF4A3A') : '#3BC50F';
  var windspeedScoreColour = w ? (w.today.windSpeed < 15 ? '#3BC50F' : w.today.windSpeed < 25 ? '#FFAB1C' : '#FF4A3A') : '#FFAB1C';

  var pageActivity         = "Cycling";
  var mainActivityMessage  = w ? activityMessage("cycling", w.scores.cycling) : "It's an alright day to cycle";
  var currentTime          = time;

  var tempHi  = w ? String(w.today.tempHigh) : "16";
  var tempLo  = w ? String(w.today.tempLow)  : "10";
  var tempNow = w ? String(w.current.temp)   : "13";

  var precipToday         = w ? String(w.today.pop) : "<10";
  var prevPrecipStatus    = w ? `${w.tomorrow.pop}%` : "Heavy";
  var precipMessage       = w ? (w.today.pop < 20 ? "Dry roads ahead!" : w.today.pop < 50 ? "Light rain possible" : "Bad road grip") : "Bad road grip";
  var currentPrecipScoreColour = w ? (w.today.pop < 30 ? '#3BC50F' : '#FF4A3A') : '#3BC50F';
  var prevPrecipScoreColour    = w ? (w.tomorrow.pop < 30 ? '#3BC50F' : '#FF4A3A') : '#FF4A3A';
  var precipIconToday     = w ? getConditionIcon(w.today.condition)    : partlySunnyIcon;
  var precipIconPrev      = w ? getConditionIcon(w.tomorrow.condition) : rainyIcon;

  var HumidityTodayHi = w ? String(w.today.humidityHigh) : "87";
  var HumidityTodayLo = w ? String(w.today.humidityLow)  : "73";
  var HumidityPrevHi  = w ? String(w.today.humidityHigh) : "84";
  var HumidityPrevLo  = w ? String(w.today.humidityLow)  : "65";

  var visibilityTodayHi = w ? String(w.today.visibilityHigh)    : "12";
  var visibilityTodayLo = w ? String(w.today.visibilityLow)     : "5";
  var visibilityNow     = w ? String(w.today.visibilityCurrent) : "6";

  var windSpeed = w ? String(w.today.windSpeed) : "15";
  var windAngle = w ? w.today.windDeg           : 130;

  var UVLevelDaily = w ? w.today.uvLabel : "Low";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
    {error && (
      <div style={{position:'absolute',top:10,left:'50%',transform:'translateX(-50%)',background:'rgba(255,80,80,0.85)',color:'white',padding:'6px 18px',borderRadius:20,zIndex:9999,fontSize:14}}>
        {error}
      </div>
    )}

    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 165, height: 91, left: 1460, top: 42, position: 'absolute', background: 'rgba(255, 255, 255, 0.50)', borderRadius: 28}} />
        <div style={{ position: "absolute",left: 1460,top: 42,width: 165,height: 91,borderRadius: 24,display: "flex",alignItems: "center",justifyContent: "center",font: "Rubik",fontSize: 50,fontWeight: 500,color: "black",}}>{currentTime}</div>
    </div>

    {/* Search bar */}
    <div style={{width: '100%', height: '100%', position: 'absolute', zIndex: 100}}>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        placeholder="Search city..."
        style={{position:'absolute',left:760,top:55,width:250,height:53,borderRadius:43,border:'none',background:'rgba(255,255,255,0.55)',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',padding:'0 16px',fontSize:18,fontFamily:'Rubik',outline:'none'}}
      />
      <button
        onClick={handleSearch}
        style={{position:'absolute',left:1020,top:55,height:53,width:80,borderRadius:43,border:'none',background:'rgba(255,255,255,0.55)',boxShadow:'0px 4px 4px rgba(0,0,0,0.25)',fontSize:16,fontFamily:'Rubik',cursor:'pointer',fontWeight:600}}
      >Go</button>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute'}}>
      <div style={{width: 139, height: 53, left: 591, top: 55, position: 'absolute', background: 'rgba(255, 255, 255, 0.50)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 79.11, height: 53, left: 591, top: 55, position: 'absolute', background: 'rgba(203, 210, 208, 0.40)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 64.41, left: 607, top: 64, position: 'absolute', color: 'black', fontSize: 32, fontFamily: 'Rubik', fontWeight: '700', wordWrap: 'break-word'}}>mi</div>
      <div style={{width: 48.59, left: 675, top: 64, position: 'absolute', color: 'black', fontSize: 32, fontFamily: 'Rubik', fontWeight: '700', wordWrap: 'break-word'}}>km</div>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute'}}>
      <div style={{width: 123, height: 53, left: 418, top: 55, position: 'absolute', background: 'rgba(255, 255, 255, 0.50)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 70, height: 53, left: 418, top: 55, position: 'absolute', background: 'rgba(203, 210, 208, 0.40)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 43, left: 426, top: 64, position: 'absolute', color: 'black', fontSize: 32, fontFamily: 'Rubik', fontWeight: '700', wordWrap: 'break-word'}}>°C</div>
      <div style={{width: 43, left: 498, top: 64, position: 'absolute', color: 'black', fontSize: 32, fontFamily: 'Rubik', fontWeight: '700', wordWrap: 'break-word'}}>°F</div>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute'}}>
      <div style={{width: 91, height: 91, left: 277, top: 36, position: 'absolute', background: 'rgba(255, 255, 255, 0.50)', borderRadius: 28}} />
      <div style={{width: 60, height: 60, left: 277, top: 36, position: 'absolute'}}>
          <div style={{width: '100%', height: '100%', position: 'absolute',left: 15 , top: 15.5}}><img src={menuIcon} alt="menu"/>
        </div>
      </div>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute'}}>
      <div style={{ position: "absolute",left: 280,top: 110,alignItems: "left",font: "Rubik",fontSize: 52,fontWeight: 400,color: "black"}}>Outdoor Activity Summary</div>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute'}}>
      <div style={{ position: "absolute",left: 280,top: 153,alignItems: "left",font: "Rubik",fontSize: 92,fontWeight: 500,color: "black"}}>{pageActivity}:</div>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute'}}>
      <div style={{width: 92, height: 86, left: 1160, top: 142, position: 'absolute', background: mainActivityColor, borderRadius: 10}} />
      <div style={{position: 'absolute',top: 142, left: 1260, justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 92, fontFamily: 'Rubik', fontWeight: '500', letterSpacing: 0.50 }}>{mainActivityScore}/10</div>
      <div style={{position: 'absolute',top: 230, left: 1060, justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 38, fontFamily: 'Rubik', fontWeight: '450', letterSpacing: 0.50}}>{mainActivityMessage}</div>
    </div>

    {/* Scores Box */}
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 299, top: 280, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />

      <div style={{left: 360, top: 300, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{activity1}</div>
      <div style={{width: 32.08, height: 30.11, left: 320, top: 300, position: 'absolute', background: colour1, borderRadius: 10}} />
      <img style={{position: "absolute",top:295, left: 505}} src={cyclingIcon} alt="cycling"/>
      <div style={{left: 570, top: 300, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{score1}/10</div>
      <div style={{width: 349, height: 1, left: 299, top: 340, position: 'absolute', background: 'rgba(0, 0, 0, 0.05)'}} />

      <div style={{left: 360, top: 350, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{activity2}</div>
      <div style={{width: 32.08, height: 30.11, left: 320, top: 350, position: 'absolute', background: colour2, borderRadius: 10}} />
      <img style={{position: "absolute",top:345, left: 505}} src={hikingIcon} alt="hiking"/>
      <div style={{left: 570, top: 350, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{score2}/10</div>
      <div style={{width: 349, height: 1, left: 299, top: 390, position: 'absolute', background: 'rgba(0, 0, 0, 0.05)'}} />

      <div style={{left: 360, top: 400, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{activity3}</div>
      <div style={{width: 32.08, height: 30.11, left: 320, top: 400, position: 'absolute', background: colour3, borderRadius: 10}} />
      <img style={{position: "absolute",top:395, left: 505}} src={campingIcon} alt="camping"/>
      <div style={{left: 570, top: 400, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{score3}/10</div>
      <div style={{width: 349, height: 1, left: 299, top: 440, position: 'absolute', background: 'rgba(0, 0, 0, 0.05)'}} />

      <div style={{left: 360, top: 450, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{activity4}</div>
      <div style={{width: 32.08, height: 30.11, left: 320, top: 450, position: 'absolute', background: colour4, borderRadius: 10}} />
      <img style={{position: "absolute",top:445, left: 505}} src={runningIcon} alt="running"/>
      <div style={{left: 570, top: 450, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{score4}/10</div>
      <div style={{width: 349, height: 1, left: 299, top: 490, position: 'absolute', background: 'rgba(0, 0, 0, 0.05)'}} />
    </div>

    {/* Map */}
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 299, top: 600, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{position: 'absolute',top: 730, left: 440,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Map</div>
    </div>

    {/* Temperature box */}
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 670, top: 600, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 33, height: 33, left: 712, top: 620, position: 'absolute', background: tempScoreColour, borderRadius: 10}} />
      <div style={{position: 'absolute',top: 615, left: 747,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Temperature</div>
      <div style={{position: 'absolute',top: 680, left: 790,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Today:</div>
      <div style={{color:'rgba(0, 0, 0, 0.70)',position: 'absolute',top: 724, left: 755,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{tempHi}°{unitTemp} </div>
      <img style={{position: "absolute", top: 719, left: 737}} src={hiArrow} alt="hi"/>
      <div style={{color:'rgba(0, 0, 0, 0.70)',position: 'absolute',top: 724, left: 865,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{tempLo}°{unitTemp} </div>
      <img style={{position: "absolute", top: 719, left: 847}} src={loArrow} alt="lo"/>
      <div style={{color:"black",position: 'absolute',top: 800, left: 750,textAlign: "center", justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Right Now:</div>
      <div style={{color:"black",position: 'absolute',top: 837, left: 800,textAlign: "center", justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{tempNow}°{unitTemp}</div>
    </div>

    {/* Precipitation */}
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 670, top: 280, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 33, height: 33, left: 710, top: 300, position: 'absolute', background: precipScoreColour, borderRadius: 10}} />
      <div style={{position: 'absolute',top: 295, left: 745,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Precipitation</div>
      <img style={{position: "absolute",height:86, width: 98, top: 345, left: 700}} src={precipIconToday} alt="today precip"/>
      <div style={{position: 'absolute',top: 430, left: 700,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 34, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Today</div>
      <div style={{width: 33, height: 33, left: 800, top: 435, position: 'absolute', background: currentPrecipScoreColour, borderRadius: 10}} />
      <div style={{position: 'absolute',top: 470, left: 720,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{precipToday}%</div>
      <img style={{position: "absolute",height:86, width: 98, top: 350, left: 870}} src={precipIconPrev} alt="prev precip"/>
      <div style={{position: 'absolute',top: 430, left: 880,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 34, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Tmrw.</div>
      <div style={{width: 33, height: 33, left: 965, top: 435, position: 'absolute', background: prevPrecipScoreColour, borderRadius: 10}} />
      <div style={{position: 'absolute',top: 470, left: 890,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{prevPrecipStatus}<br/> rain</div>
      <div style={{position: 'absolute',top: 550, left: 745,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 28, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{precipMessage}</div>
    </div>

    {/* Humidity */}
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 1041, top: 280, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 33, height: 33, left: 1125, top: 300, position: 'absolute', background: HumidityScoreColour, borderRadius: 10}} />
      <div style={{position: 'absolute',top: 295, left: 1160,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Humidity</div>
      <div style={{position: 'absolute',top: 345, left: 1170,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Today:</div>
      <div style={{color:'#FF6B6B',position: 'absolute',top: 390, left: 1097,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Hi</div>
      <div style={{color:'rgba(0, 0, 0, 0.70)',position: 'absolute',top: 390, left: 1140,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{HumidityTodayHi}%</div>
      <div style={{color:'#0048FF',position: 'absolute',top: 390, left: 1242,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Lo</div>
      <div style={{color:'rgba(0, 0, 0, 0.70)',position: 'absolute',top: 390, left: 1290,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{HumidityTodayLo}%</div>
      <div style={{position: 'absolute',top: 465, left: 1135,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Avg Today:</div>
      <div style={{color:'#FF6B6B',position: 'absolute',top: 505, left: 1097,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Hi</div>
      <div style={{color:'rgba(0, 0, 0, 0.70)',position: 'absolute',top: 505, left: 1140,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{HumidityPrevHi}%</div>
      <div style={{color:'#0048FF',position: 'absolute',top: 505, left: 1242,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Lo</div>
      <div style={{color:'rgba(0, 0, 0, 0.70)',position: 'absolute',top: 505, left: 1290,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{HumidityPrevLo}%</div>
    </div>

    {/* Visibility box */}
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 1041, top: 600, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 33, height: 33, left: 1115, top: 620, position: 'absolute', background: visibilityScoreColour, borderRadius: 10}} />
      <div style={{position: 'absolute',top: 615, left: 1150,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Visibility</div>
      <div style={{position: 'absolute',top: 680, left: 1170,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Today:</div>
      <div style={{color:'#FF6B6B',position: 'absolute',top: 717, left: 1097,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Hi</div>
      <div style={{color:'rgba(0, 0, 0, 0.70)',position: 'absolute',top: 717, left: 1137,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{visibilityTodayHi}{distanceUnit}</div>
      <div style={{color:'#0048FF',position: 'absolute',top: 717, left: 1242,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Lo</div>
      <div style={{color:'rgba(0, 0, 0, 0.70)',position: 'absolute',top: 717, left: 1287,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{visibilityTodayLo}{distanceUnit}</div>
      <div style={{color:"black",position: 'absolute',top: 800, left: 1134,textAlign: "center", justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Right Now:</div>
      <div style={{color:"black",position: 'absolute',top: 837, left: 1189,textAlign: "center", justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{visibilityNow}{distanceUnit}</div>
    </div>

    {/* Wind speed box */}
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 175, height: 311, left: 1416, top: 280, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{position: 'absolute',top: 295, left: 1453,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>. Wind<br/>Speed</div>
      <div style={{width: 33, height: 33, left: 1440, top: 300, position: 'absolute', background: windspeedScoreColour, borderRadius: 10}} />
      <img style={{position: "absolute", width:168, height: 168, top: 372, left: 1425, transform: `rotate(${windAngle}deg)`}} src={windDirection} alt="compass"/>
      <div style={{color:"black",position: 'absolute',top: 445, left: 1465,textAlign: "center", justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 25, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{windSpeed}{distanceUnitSpeed}ph</div>
      <div style={{color:"black",position: 'absolute',top: 535, left: 1465,textAlign: "center", justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 22, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Daily<br/> Average</div>
    </div>

    {/* UV box */}
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 175, height: 311, left: 1416, top: 600, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 33, height: 33, left: 1453, top: 620, position: 'absolute', background: UVScoreColour, borderRadius: 10}} />
      <div style={{position: 'absolute',top: 615, left: 1490,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>UV</div>
      <div style={{position: 'absolute',top: 695, left: 1455,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 25, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Daily <br/> Highest <br/> Level:</div>
      <div style={{position: 'absolute',top: 835, left: 1470,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 38, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{UVLevelDaily}</div>
    </div>

  </div>
  );
}

export default OdACycling;
=======
import OdAPage from "./OdAPage";
export default function OdACycling() { return <OdAPage activityKey="cycling" />; }
>>>>>>> 089ffd45d4d6ce6b7bfa5421aa723453ca5b5b3b
