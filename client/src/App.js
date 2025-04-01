import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StockData from './components/StockData';
// Import other components as needed

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Stock Trading Platform</h1>
        <Routes>
          <Route path="/stock-data" element={<StockData />} />
          {/* Add additional routes here */}
          <Route
            path="/"
            element={<p>Welcome to the Stock Trading Platform</p>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
