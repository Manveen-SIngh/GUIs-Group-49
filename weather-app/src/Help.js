import React, { useState, useEffect } from "react";
import { fetchWeatherByCity, getBackgroundImage } from "./services/weatherApi";
import { useSidebar } from "./Sidebar";
import menuIcon from "./assets/menu.svg";
import MenuButton from "./components/MenuButton";

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
      } catch (e) { console.error("Bg load failed", e); }
    };
    loadBg();
  }, []);

  const faqs = [
    { 
      q: "How do I change my location?", 
      a: "Use the search bar at the top of the Home page to find any city, or enable browser location services to update automatically based on your GPS." 
    },
    { 
      q: "Where are the unit settings?", 
      a: "Open the Sidebar menu and select Settings. Here you can toggle between Metric and Imperial for temperature, wind speed, and distance." 
    },
    { 
      q: "What is an Activity Score?", 
      a: "It's a 1-10 rating indicating how suitable current conditions are for your chosen activity, factoring in temperature, wind, and precipitation." 
    },
    { 
      q: "Is the weather data real-time?", 
      a: "Yes. Our data and radar layers refresh every 10 minutes to ensure you have the most accurate local information available."
    }
  ];

  return (
    <div className="help-page-bg" style={{ backgroundImage: `url(${bg})` }}>
      <div className="oda-container">
        
        <div className="help-top-bar">
          <div className="top-button-box" onClick={open}>
         <img src={menuIcon} alt="Menu" className="top-bar__menu-icon" />
          </div>

          <div className="title-center">
            <div className="oda-subtitle">Navigation & FAQ</div>
          </div>
        </div>

        <div className="oda-grid help-grid-layout">
          <div className="oda-col">
            <div className="faq-hero-box">
              <div className="oda-box-header">
                <div className="swatch-blue" style={{ width: 33, height: 33, borderRadius: 10 }} />
                <span className="oda-box-title" style={{ fontSize: 35, marginLeft: 10 }}>FAQ</span>
              </div>

              <div className="faq-scroll-section">
                {faqs.map((faq, i) => (
                  <div 
                    key={i} 
                    className={`faq-row ${activeFaq === i ? "active" : ""}`} 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  >
                    <div className="faq-q">
                      {faq.q} <span>{activeFaq === i ? "−" : "+"}</span>
                    </div>
                    {activeFaq === i && <div className="faq-a">{faq.a}</div>}
                  </div>
                ))}
              </div>

              <div className="help-footer-area">
                <div className="email-text">support@outdoorcast.com</div>
                <button className="oda-contact-btn">Contact Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;