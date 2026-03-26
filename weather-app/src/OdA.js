import bg from "./assets/PartlyCloudy.png";
import menuIcon from "./assets/menu.svg";

import hikingIcon from "./assets/Activity-icons/hiking.svg";
import runningIcon from "./assets/Activity-icons/running.svg";
import cyclingIcon from "./assets/Activity-icons/cycling.svg";
import campingIcon from "./assets/Activity-icons/camping.svg";



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
        
        
      }}
    >
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 165, height: 91, left: 1460, top: 42, position: 'absolute', background: 'rgba(255, 255, 255, 0.50)', borderRadius: 28}} />
        <div style={{ position: "absolute",left: 1460,top: 42,width: 165,height: 91,borderRadius: 24,display: "flex",alignItems: "center",justifyContent: "center",font: "Rubik",fontSize: 50,fontWeight: 500,color: "black",}}>12:11</div>
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
      <div style={{ position: "absolute",left: 280,top: 153,alignItems: "left",font: "Rubik",fontSize: 92,fontWeight: 500,color: "black"}}>Cycling:</div>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute'}}>
      <div style={{width: 92, height: 86, left: 1160, top: 142, position: 'absolute', background: '#FFAB1C', borderRadius: 10}} />
      <div style={{position: 'absolute',top: 142, left: 1260, justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 92, fontFamily: 'Rubik', fontWeight: '500', letterSpacing: 0.50 }}>6/10</div>
      <div style={{position: 'absolute',top: 230, left: 1060, justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 38, fontFamily: 'Rubik', fontWeight: '450', letterSpacing: 0.50}}>Some message to do with the score</div>

    </div>
    
    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 299, top: 280, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{position: 'absolute',top: 730, left: 440,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Map</div>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 299, top: 600, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{position: 'absolute',top: 730, left: 440,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Map</div>
    </div>
    

    

    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 670, top: 600, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 33, height: 33, left: 712, top: 620, position: 'absolute', background: '#FFAB1C', borderRadius: 10}} />
      <div style={{position: 'absolute',top: 615, left: 747,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Temperature</div>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 670, top: 280, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 33, height: 33, left: 710, top: 300, position: 'absolute', background: '#FFAB1C', borderRadius: 10}} />
      <div style={{position: 'absolute',top: 295, left: 745,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Precipitation</div>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 1041, top: 280, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 33, height: 33, left: 1125, top: 300, position: 'absolute', background: '#FFAB1C', borderRadius: 10}} />
      <div style={{position: 'absolute',top: 295, left: 1160,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Visibility</div>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 349, height: 311, left: 1041, top: 600, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 33, height: 33, left: 1115, top: 620, position: 'absolute', background: '#3BC50F', borderRadius: 10}} />
      <div style={{position: 'absolute',top: 615, left: 1150,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>Humidity</div>
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 175, height: 311, left: 1416, top: 280, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{position: 'absolute',top: 295, left: 1463,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>.  Wind<br/>Speed</div>
      <div style={{width: 33, height: 33, left: 1450, top: 300, position: 'absolute', background: '#FFAB1C', borderRadius: 10}} />
    </div>

    <div style={{width: '100%', height: '100%', position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
      <div style={{width: 175, height: 311, left: 1416, top: 600, position: 'absolute', background: 'rgba(255, 255, 255, 0.70)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 43}} />
      <div style={{width: 33, height: 33, left: 1460, top: 620, position: 'absolute', background: '#3BC50F', borderRadius: 10}} />
      <div style={{position: 'absolute',top: 615, left: 1493,textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'black', fontSize: 35, fontFamily: 'Rubik', fontWeight: '400', letterSpacing: 0.50 }}>UV</div>

    </div>
    
  </div>
    
  );
}

export default OdA;