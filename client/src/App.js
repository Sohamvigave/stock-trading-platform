import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import RealTimeStock from './components/RealTimeStock';
import Watchlist from './components/WatchList';
import Profile from './components/Profile';
import TradeLab from './components/TradeLab';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import axios from 'axios';
import './App.css';

function App() {
  // Fallback mechanism: Fetch latest user data on load and periodically
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // no logged-in user

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data && response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.error('Failed to update user data from backend', err);
      }
    };

    // Fetch once on mount
    fetchUserData();

    // Set up interval to fetch every 5 minutes (300000 milliseconds)
    const intervalId = setInterval(() => {
      fetchUserData();
    }, 300000);

    // Cleanup the interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trade-lab"
            element={
              <ProtectedRoute>
                <TradeLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/real-time-stock"
            element={
              <ProtectedRoute>
                <RealTimeStock />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
