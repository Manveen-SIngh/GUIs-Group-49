import React, { useState } from 'react';
import { Search, MapPin, ThermometerSun, ThermometerSnowflake } from 'lucide-react';

const Header: React.FC = () => {
  const [isCelsius, setIsCelsius] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="relative">
      {/* Background Shell */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 pointer-events-none"></div>
      
      {/* Header Content */}
      <div className="relative container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Left Side: Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary-dark-gray/60" />
              </div>
              <div className="absolute inset-y-0 left-8 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-primary-dark-gray/60" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-4 py-3 bg-bg-semi-white border border-white/50 rounded-[28px] focus:outline-none focus:ring-2 focus:ring-primary-dark-gray/30 focus:border-transparent text-primary-dark-gray placeholder-primary-dark-gray/60 font-rubik"
                placeholder="Search Location..."
              />
            </div>
          </div>

          {/* Right Side: Temperature Toggle */}
          <div className="flex items-center space-x-2 bg-bg-semi-white border border-white/50 rounded-[43px] p-1">
            <button
              onClick={() => setIsCelsius(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-[43px] transition-all duration-200 ${
                isCelsius 
                  ? 'bg-primary-white text-primary-dark-gray shadow-custom' 
                  : 'text-primary-dark-gray/60 hover:text-primary-dark-gray'
              }`}
            >
              <ThermometerSun className="h-4 w-4" />
              <span className="text-sm font-medium">°C</span>
            </button>
            <button
              onClick={() => setIsCelsius(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-[43px] transition-all duration-200 ${
                !isCelsius 
                  ? 'bg-primary-white text-primary-dark-gray shadow-custom' 
                  : 'text-primary-dark-gray/60 hover:text-primary-dark-gray'
              }`}
            >
              <ThermometerSnowflake className="h-4 w-4" />
              <span className="text-sm font-medium">°F</span>
            </button>
          </div>
        </div>

        {/* Location Text */}
        <div className="mt-4">
          <p className="text-primary-dark-gray font-rubik text-heading-large font-semibold">
            In Greater London now...
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;