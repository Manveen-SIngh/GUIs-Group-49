import React from 'react';
import Header from './components/Header';
import CurrentWeather from './components/CurrentWeather';


function App() {
  return (
    <div className="min-h-screen w-full bg-bg-light-gray">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between space-x-8">
          {/* Left: Current Weather */}
          <CurrentWeather />
          
        </div>
      </main>
    </div>
  );
}

export default App;
