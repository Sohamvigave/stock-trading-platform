import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const TradeLab = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Get the token from localStorage (assumes user is authenticated)
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            setError('');
            try {
                // Call the backend endpoint to fetch trade lab metrics
                const response = await axios.get('http://localhost:5000/api/trade-lab', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMetrics(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch trade lab metrics.');
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, [token]);

    if (loading) {
        return (
            <div className="container">
                <h2>Trade Lab</h2>
                <p>Loading trade lab data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <h2>Trade Lab</h2>
                <p className="error">{error}</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>Trade Lab</h2>
            <div className="trade-lab-stats">
                <div className="stat-item">
                    <h3>Total Portfolio</h3>
                    <p>{metrics.totalPortfolio}</p>
                </div>
                <div className="stat-item">
                    <h3>Unrealized P&L</h3>
                    <p>{metrics.unrealizedPnL}</p>
                </div>
                <div className="stat-item">
                    <h3>Available Margin</h3>
                    <p>{metrics.availableMargin}</p>
                </div>
                <div className="stat-item">
                    <h3>Invested Margin</h3>
                    <p>{metrics.investedMargin}</p>
                </div>
            </div>
        </div>
    );
};

export default TradeLab;
