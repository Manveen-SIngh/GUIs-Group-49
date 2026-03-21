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
        <li><Link to="/OdA" style={linkStyle}>OdA</Link></li>
        <li><Link to="/Metrics" style={linkStyle}>Metrics</Link></li>
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