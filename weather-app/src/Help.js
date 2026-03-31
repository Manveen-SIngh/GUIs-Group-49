import React, { useState, useEffect } from "react";
import { fetchWeatherByCity, getBackgroundImage } from "./services/weatherApi";
import { useSidebar } from "./Sidebar";
import menuIcon from "./assets/menu.svg";
import fallbackBg from "./assets/PartlyCloudy.png";

import "./OdAPage.css"; 
import "./Help.css"; 

const Help = () => {
  const { open } = useSidebar();
  const [bg, setBg] = useState(fallbackBg);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const loadBg = async () => {
      const city = localStorage.getItem("lastCity") || "London";
      try {
        const data = await fetchWeatherByCity(city);
        const isNight = data.current.nowHour < 6 || data.current.nowHour > 20;
        setBg(getBackgroundImage(data.current.condition, isNight));
      } catch (e) { console.error(e); }
    };
    loadBg();
  }, []);

  const faqs = [
    { 
      q: "How are Activity Scores calculated?", 
      a: "Scores (1-10) use a weighted multi-factor algorithm. Cycling prioritizes Wind Speed and Precipitation, while Hiking weights Temperature and Visibility more heavily. Data refreshes every 10 minutes." 
    },
    { 
      q: "Why is the data different from other apps?", 
      a: "OutdoorCast utilizes Hyper-local Radar Interpolation. Instead of using a distant airport station, we triangulate the three closest weather radars to your exact GPS coordinates." 
    },
    { 
      q: "Understanding Wind & Gusts", 
      a: "Wind is the 2-minute average baseline. Gusts are maximum 3-second speeds. For high-performance activities, the 'Gust' value is often the more critical safety metric." 
    },
    { 
      q: "Troubleshooting Location Issues", 
      a: "Ensure 'High Accuracy' is enabled. If using a VPN, the app may show the server location; use the manual search bar to override this and set your specific city."
    }
  ];

  return (
    <div className="oda-page-wrapper help-page-bg" style={{ backgroundImage: `url(${bg})` }}>
      <div className="oda-container">
        
        {/* --- TOP BAR (Centered Title Only) --- */}
        <div className="help-top-bar">
          <div className="menu-box">
            <img src={menuIcon} alt="menuIcon" className="weather-page-menu-button" onClick={open} />
          </div>
          <div className="title-center">
            <div className="oda-subtitle">Support Center</div>
          </div>
          {/* Right side removed */}
        </div>

        {/* --- SINGLE CENTERED COLUMN --- */}
        <div className="oda-grid help-grid-layout">
          <div className="oda-col">
            <div className="oda-box faq-hero-box">
              <div className="oda-box-header">
                <div className="oda-swatch swatch-blue" />
                <span className="oda-box-title">FAQ</span>
              </div>

              <div className="faq-scroll-section">
                {faqs.map((faq, i) => (
                  <div key={i} className={`faq-row ${activeFaq === i ? "active" : ""}`} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                    <div className="faq-q">
                      {faq.q} <span>{activeFaq === i ? "−" : "+"}</span>
                    </div>
                    {activeFaq === i && <div className="faq-a">{faq.a}</div>}
                  </div>
                ))}
              </div>

              <div className="help-footer-area">
                <div className="oda-center-value email-text">support@outdoorcast.com</div>
                <button className="oda-contact-btn">Contact Technical Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;