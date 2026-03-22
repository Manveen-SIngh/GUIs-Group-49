import React from 'react';
import { Cloud, Droplet, Wind, Eye, Thermometer, Sun } from 'lucide-react';

const CurrentWeather: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
      {/* Large Temperature */}
      <div className="text-center">
        <h1 className="text-9xl font-rubik font-normal text-primary-dark-gray leading-none">
          13°C
        </h1>
        <p className="text-2xl font-rubik font-normal text-primary-dark-gray opacity-70 mt-2">
          Feels like 10°C
        </p>
      </div>

      {/* Condition and Activity */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4 bg-ui-surface rounded-[43px] px-8 py-4 shadow-custom">
          <Cloud className="h-8 w-8 text-primary-dark-gray" />
          <span className="text-2xl font-rubik font-normal text-primary-dark-gray">
            Cloudy
          </span>
        </div>
        
        <div className="flex items-center justify-center space-x-4 bg-ui-surface rounded-[43px] px-8 py-4 shadow-custom">
          <div className="w-6 h-6 bg-primary-white rounded-full flex items-center justify-center">
            <span className="text-xs font-rubik font-semibold text-primary-dark-gray">C</span>
          </div>
          <span className="text-xl font-rubik font-normal text-primary-dark-gray">
            Cycling
          </span>
          <span className="text-xl font-rubik font-semibold text-primary-dark-gray">
            6/10
          </span>
        </div>
      </div>

      {/* Location Text */}
      <p className="text-4xl font-rubik font-semibold text-primary-dark-gray">
        In Greater London now...
      </p>
    </div>
  );
};

export default CurrentWeather;