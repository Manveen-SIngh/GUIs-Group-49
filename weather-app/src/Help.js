import React, { useState, useEffect } from "react";
import { fetchWeatherByCity, getBackgroundImage } from "./services/weatherApi";
import { useSidebar } from "./Sidebar";
import menuIcon from "./assets/menu.svg";

import fallbackBg from "./assets/PartlyCloudy.png";
import "./OdAPage.css";
import "./Help.css";

/**
 * Help Page
 *
 * Provides:
 * - FAQ section with expandable answers
 * - Navigation guidance for users
 * - Dynamic background based on current weather
 */
const Help = () => {
  const { open } = useSidebar();

  /**
   * Background image state
   * Defaults to a fallback image until weather data loads
   */
  const [bg, setBg] = useState(fallbackBg);

  /**
   * Tracks which FAQ item is expanded
   * null = all collapsed
   */
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    /**
     * Loads a weather-based background using the last searched city.
     * Keeps the help page visually consistent with the rest of the app.
     */
    const loadBg = async () => {
      const city = localStorage.getItem("lastCity") || "London";

      try {
        const data = await fetchWeatherByCity(city);

        // Determine whether to use day or night background
        const isNight =
          data.current.nowHour < 6 || data.current.nowHour > 20;

        setBg(getBackgroundImage(data.current.condition, isNight));
      } catch (e) {
        console.error("Background load failed", e);
      }
    };

    loadBg();
  }, []);

  /**
   * FAQ content
   * Stored as data so UI rendering stays clean and scalable
   */
  const faqs = [
    {
      q: "How do I change my location?",
      a: "Use the search bar at the top of the Home page to find any city, or enable browser location services to update automatically based on your GPS.",
    },
    {
      q: "Where are the unit settings?",
      a: "Open the Sidebar menu and select Settings. Here you can toggle between Metric and Imperial for temperature, wind speed, and distance.",
    },
    {
      q: "What is an Activity Score?",
      a: "It's a 1-10 rating indicating how suitable current conditions are for your chosen activity, factoring in temperature, wind, and precipitation.",
    },
    {
      q: "Is the weather data real-time?",
      a: "Yes. Our data and radar layers refresh every 10 minutes to ensure you have the most accurate local information available.",
    },
  ];

  return (
    <div
      className="help-page-bg"
      style={{ backgroundImage: `url(${bg})` }} // Dynamic background from weather
    >
      <div className="oda-container">
        
        {/* --- Top Bar --- */}
        <div className="help-top-bar">
          
          {/* Sidebar menu button */}
          <div className="top-button-box" onClick={open}>
            <img
              src={menuIcon}
              alt="Menu"
              className="top-bar__menu-icon"
            />
          </div>

          {/* Page title */}
          <div className="title-center">
            <div className="oda-subtitle">Navigation & FAQ</div>
          </div>
        </div>

        {/* --- Main Content --- */}
        <div className="oda-grid help-grid-layout">
          <div className="oda-col">
            <div className="faq-hero-box">

              {/* Section header */}
              <div className="oda-box-header">
                <div className="swatch-blue help-swatch" />
                <span className="oda-box-title help-title">FAQ</span>
              </div>

              {/* Scrollable FAQ list */}
              <div className="faq-scroll-section">
                {faqs.map((faq, i) => {
                  const isActive = activeFaq === i;

                  return (
                    <div
                      key={i}
                      className={`faq-row ${isActive ? "active" : ""}`}
                      onClick={() =>
                        setActiveFaq(isActive ? null : i)
                      }
                    >
                      {/* Question row */}
                      <div className="faq-q">
                        {faq.q}
                        <span>{isActive ? "−" : "+"}</span>
                      </div>

                      {/* Conditionally render answer */}
                      {isActive && (
                        <div className="faq-a">{faq.a}</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer with contact info */}
              <div className="help-footer-area">
                <div className="email-text">
                  support@outdoorcast.com
                </div>

                <button className="oda-contact-btn">
                  Contact Support
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;