import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const TradeLab = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    // Format numbers to 2 decimal places with currency symbol
    const formatCurrency = (value) => {
        return `₹${parseFloat(value).toFixed(2)}`;
    };

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('http://localhost:5000/api/trade-lab', {
                    headers: { Authorization: `Bearer ${token}` }
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
                <div className="loading-placeholder">
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <h2>Trade Lab</h2>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="page-title">Trade Lab</h2>
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-header">
                        <h3>Total Portfolio</h3>
                        <span className="metric-icon">💰</span>
                    </div>
                    <div className="metric-value">
                        {formatCurrency(metrics.totalPortfolio)}
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <h3>Unrealized P&L</h3>
                        <span className="metric-icon">📈</span>
                    </div>
                    <div className={`metric-value ${metrics.unrealizedPnL >= 0 ? 'positive' : 'negative'}`}>
                        {formatCurrency(metrics.unrealizedPnL)}
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <h3>Available Margin</h3>
                        <span className="metric-icon">🟢</span>
                    </div>
                    <div className="metric-value">
                        {formatCurrency(metrics.availableMargin)}
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <h3>Invested Margin</h3>
                        <span className="metric-icon">🔴</span>
                    </div>
                    <div className="metric-value">
                        {formatCurrency(metrics.investedMargin)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradeLab;