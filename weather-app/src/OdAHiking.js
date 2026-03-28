import bg from "./assets/PartlyCloudy.png";
import menuIcon from "./assets/menu.svg";

import hikingIcon from "./assets/Activity-icons/hiking.svg";
import runningIcon from "./assets/Activity-icons/running.svg";
import cyclingIcon from "./assets/Activity-icons/cycling.svg";
import campingIcon from "./assets/Activity-icons/camping.svg";
import hiArrow from "./assets/redArrowUp.svg";
import loArrow from "./assets/blueArrowDown.svg";
import partlySunnyIcon from "./assets/weather-icons/sun-clouds.svg";
import rainyIcon from "./assets/weather-icons/rainy.svg";
import windDirection from "./assets/Compass.png";

function OdAHiking() {
  //constants for changing values on page (including images) LONG LIST

  //Measurement values
  //unit customisations change these values
  var unitTemp = "C";
  var distanceUnitSpeed = "m";
  var distanceUnit = "mi";

  //Acitivty based scores
  //for adding and removing activities somehow declare and remove values and shift values
  var mainActivityScore = "9";
  var mainActivityColor = '#3BC50F';
  var score1 = "6";
  var score2 = "9";
  var score3 = "5";
  var score4 = "8";
  var colour1 = '#FFAB1C';//list of activitys in order
  var colour2 = '#3BC50F';
  var colour3 = '#FFAB1C';
  var colour4 = '#3BC50F';


  //activity list
  var activity1 = "Cycling"; //activity for score 1
  var activity2 = "Hiking"; //... score 2 etc
  var activity3 = "Camping";
  var activity4 = "Running";

  //metric based scores
  var tempScoreColour = '#3BC50F';
  var precipScoreColour = '#FFAB1C';
  var HumidityScoreColour = '#3BC50F';
  var visibilityScoreColour = '#FFAB1C';
  var UVScoreColour = '#3BC50F';
  var windspeedScoreColour = '#3BC50F';

  

  //page details
  var pageActivity = "Hiking";
  var mainActivityMessage = "It's a great day to go on a hike !";
  var currentTime = "11:23";

  

  //temperature
  var tempHi = "16";
  var tempLo = "10";
  var tempNow = "13";

  //precip
  var precipToday = "<10";
  var prevPrecipStatus = "Heavy";
  var precipMessage = "Soft Ground!";
  var currentPrecipScoreColour = '#3BC50F';
  var prevPrecipScoreColour = '#FF4A3A';
  var precipIconToday = partlySunnyIcon;
  var precipIconPrev = rainyIcon;

  //humidity
  var HumidityTodayHi = "87";
  var HumidityTodayLo = "73";
  var HumidityPrevHi = "84";
  var HumidityPrevLo = "65";

  //visibility
  var visibilityTodayHi = "12";
  var visibilityTodayLo = "5";
  var visibilityNow = "6";

  //windspeed
  var windSpeed = "15";
  var windAngle = 130;

  //UV
  var UVLevelDaily = "Low";

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
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 165, height: 91, left: 1460, top: 42, position: 'absolute', background: 'rgba(255, 255, 255, 0.50)', borderRadius: 28}} />
        <div style={{ position: "absolute",left: 1460,top: 42,width: 165,height: 91,borderRadius: 24,display: "flex",alignItems: "center",justifyContent: "center",font: "Rubik",fontSize: 50,fontWeight: 500,color: "black",}}>{currentTime}</div>
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
          <div style={{width: '100%', height: '100%', position: 'absolute',left: 15 , top: 15.5}}><img src={menuIcon}/>
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
      <img style={{position: "absolute",top:295, left: 505}} src ={cyclingIcon} />
      <div style={{left: 570, top: 300, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{score1}/10</div>
      <div style={{width: 349, height: 1, left: 299, top: 340, position: 'absolute', background: 'rgba(0, 0, 0, 0.05)'}} />

      <div style={{left: 360, top: 350, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{activity2}</div>
      <div style={{width: 32.08, height: 30.11, left: 320, top: 350, position: 'absolute', background: colour2, borderRadius: 10}} />
      <img style={{position: "absolute",top:345, left: 505}} src ={hikingIcon} />
      <div style={{left: 570, top: 350, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{score2}/10</div>
      <div style={{width: 349, height: 1, left: 299, top: 390, position: 'absolute', background: 'rgba(0, 0, 0, 0.05)'}} />

      <div style={{left: 360, top: 400, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{activity3}</div>
      <div style={{width: 32.08, height: 30.11, left: 320, top: 400, position: 'absolute', background: colour3, borderRadius: 10}} />
      <img style={{position: "absolute",top:395, left: 505}} src ={campingIcon} />
      <div style={{left: 570, top: 400, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{score3}/10</div>
      <div style={{width: 349, height: 1, left: 299, top: 440, position: 'absolute', background: 'rgba(0, 0, 0, 0.05)'}} />

      <div style={{left: 360, top: 450, position: 'absolute', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', wordWrap: 'break-word'}}>{activity4}</div>
      <div style={{width: 32.08, height: 30.11, left: 320, top: 450, position: 'absolute', background: colour4, borderRadius: 10}} />
      <img style={{position: "absolute",top:445, left: 505}} src ={runningIcon} />
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
      <img style={{position: "absolute", top: 719, left: 737}} src ={hiArrow}/>
      <div style={{color:'rgba(0, 0, 0, 0.70)',position: 'absolute',top: 724, left: 865,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{tempLo}°{unitTemp} </div>
      <img style={{position: "absolute", top: 719, left: 847}} src ={loArrow}/>

      <div style={{color:"black",position: 'absolute',top: 800, left: 750,textAlign: "center", justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Right Now:</div>
      <div style={{color:"black",position: 'absolute',top: 837, left: 800,textAlign: "center", justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{tempNow}°{unitTemp}</div>
    </div>


    {/* Precipitation */}
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 670, top: 280, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 33, height: 33, left: 710, top: 300, position: 'absolute', background: precipScoreColour, borderRadius: 10}} />
      <div style={{position: 'absolute',top: 295, left: 745,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Precipitation</div>

      <img style={{position: "absolute",height:86, width: 98, top: 345, left: 700}} src = {precipIconToday}/>
      <div style={{position: 'absolute',top: 430, left: 700,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 34, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Today</div>
      <div style={{width: 33, height: 33, left: 800, top: 435, position: 'absolute', background: currentPrecipScoreColour, borderRadius: 10}} />
      <div style={{position: 'absolute',top: 470, left: 720,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 26, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{precipToday}%</div>


      <img style={{position: "absolute",height:86, width: 98, top: 350, left: 870}} src = {precipIconPrev}/>
      <div style={{position: 'absolute',top: 430, left: 880,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 34, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Prev.</div>
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

      <div style={{position: 'absolute',top: 465, left: 1135,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Previously:</div>
      <div style={{color:'#FF6B6B',position: 'absolute',top: 505, left: 1097,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Hi</div>
      <div style={{color:'rgba(0, 0, 0, 0.70)',position: 'absolute',top: 505, left: 1140,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{HumidityPrevHi}%</div>
      <div style={{color:'#0048FF',position: 'absolute',top: 505, left: 1242,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Lo</div>
      <div style={{color:'rgba(0, 0, 0, 0.70)',position: 'absolute',top: 505, left: 1290,textAlign: 'left', justifyContent: 'center', display: 'flex', flexDirection: 'column', fontSize: 36, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>{HumidityPrevLo}%</div>
    </div>


    {/* Visibilty box */}
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
      <div style={{position: 'absolute',top: 295, left: 1453,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>.  Wind<br/>Speed</div>
      <div style={{width: 33, height: 33, left: 1440, top: 300, position: 'absolute', background: windspeedScoreColour, borderRadius: 10}} />
      
      <img style={{position: "absolute", width:168, height: 168, top: 372, left: 1425,transform: `rotate(${windAngle}deg)` }} src={windDirection}/>

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

export default OdAHiking;