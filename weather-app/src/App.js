import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Link } from 'react-router-dom';

import Metrics from './Metrics';
import OdACycling from './OdACycling';
import OdAHiking from './OdAHiking';
import OdARunning from './OdARunning';
import OdACamping from './OdACamping';
import Navbar from "./Navbar";
import WeatherPage from "./WeatherPage";
import TodayWeather from "./TodayWeather";
import Settings from "./Settings"




function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/OdACycling" element={<OdACycling />} />
        <Route path="/OdAHiking" element={<OdAHiking/>} />
        <Route path="/OdARunning" element={<OdARunning />} />
        <Route path="/OdACamping" element={<OdACamping />} />
        <Route path="/Metrics" element={<Metrics />} />
        <Route path="/WeatherPage" element={<WeatherPage />} />
        <Route path="/TodayWeather" element={<TodayWeather />} />
        <Route path="/Settings" element={<Settings />} />



      </Routes>
    </Router>
  );
}

export default App;
