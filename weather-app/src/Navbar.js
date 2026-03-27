import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>

      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '2rem',
        margin: 0,
        padding: 0,
        alignItems: 'center'
      }}>
        <li><Link to="/OdACycling" style={linkStyle}>OdACycling</Link></li>
        <li><Link to="/OdAHiking" style={linkStyle}>OdAHiking</Link></li>
        <li><Link to="/OdARunning" style={linkStyle}>OdARunning</Link></li>
        <li><Link to="/OdACamping" style={linkStyle}>OdACamping</Link></li>
        <li><Link to="/Metrics" style={linkStyle}>Metrics</Link></li>
        <li><Link to="/WeatherPage" style={linkStyle}>WeatherPage</Link></li>
        <li><Link to="/TodayWeather" style={linkStyle}>TodayWeather</Link></li>
        
      </ul>
      
    </nav>
  );
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '0.5rem',
  borderRadius: '4px',
  transition: 'background 0.3s'
};

export default Navbar;