// client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StockData from './components/StockData';
import RealTimeStock from './components/RealTimeStock';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Stock Trading Platform</h1>
        <Routes>
          <Route path="/stock-data" element={<StockData />} />
          <Route path="/real-time-stock" element={<RealTimeStock />} />
          <Route path="/" element={<p>Welcome to the Stock Trading Platform</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
