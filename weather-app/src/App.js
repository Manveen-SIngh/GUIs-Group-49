import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Link } from 'react-router-dom';

import Metrics from './Metrics';
import OdA from './OdA';
import Navbar from "./Navbar";
import WeatherPage from "./WeatherPage";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/OdA" element={<OdA />} />
        <Route path="/Metrics" element={<Metrics />} />
        <Route path="/WeatherPage" element={<WeatherPage />} />

      </Routes>
    </Router>
  );
}

export default App;
