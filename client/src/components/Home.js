import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Home = () => {
    const [ticker, setTicker] = useState('');
    const [exchange, setExchange] = useState('');
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setStockData(null);

        try {
            // Build the query parameters. If no exchange is provided, you can set a default (e.g., 'NSE').
            const params = { ticker: ticker.toUpperCase(), exchange: exchange ? exchange.toUpperCase() : 'NSE' };
            const response = await axios.get('http://localhost:5000/api/stock-data', { params });
            setStockData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching stock data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Welcome to Your Trading Dashboard</h2>
            <p>Use the search below to get live stock prices.</p>

            <form onSubmit={handleSearch} className="search-form">
                <div className="form-group">
                    <label htmlFor="ticker">Ticker Symbol:</label>
                    <input
                        type="text"
                        id="ticker"
                        placeholder="e.g. INFY, AAPL"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="exchange">Exchange (Optional):</label>
                    <input
                        type="text"
                        id="exchange"
                        placeholder="e.g. NSE, NASDAQ"
                        value={exchange}
                        onChange={(e) => setExchange(e.target.value)}
                    />
                </div>
                <button type="submit" className="primary" disabled={loading}>
                    {loading ? 'Searching...' : 'Search Stock'}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            {stockData && (
                <div className="stock-result">
                    <h3>Stock Data</h3>
                    <p>
                        <strong>Ticker:</strong> {stockData.ticker}
                    </p>
                    <p>
                        <strong>Exchange:</strong> {stockData.exchange}
                    </p>
                    <p>
                        <strong>Live Price:</strong> {stockData.price}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
