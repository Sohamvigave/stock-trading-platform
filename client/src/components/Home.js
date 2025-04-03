import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Home = () => {
    const [searchTicker, setSearchTicker] = useState('');
    const [searchExchange, setSearchExchange] = useState('NSE');
    const [searchResult, setSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to search for a stock via your backend API
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTicker.trim()) return;
        setLoading(true);
        setError('');
        setSearchResult(null);
        try {
            const response = await axios.get('http://localhost:5000/api/stock-data', {
                params: {
                    ticker: searchTicker.trim().toUpperCase(),
                    exchange: (searchExchange || 'NSE').toUpperCase()
                }
            });
            setSearchResult(response.data);
        } catch (err) {
            setError('Error fetching stock data.');
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async () => {
        const quantity = prompt("Enter quantity to buy:");
        if (!quantity || isNaN(quantity) || Number(quantity) <= 0) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/trade/buy', {
                ticker: searchResult.ticker,
                exchange: searchResult.exchange,
                quantity: Number(quantity)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                alert("Stock purchased successfully!");
            } else {
                alert("No user data returned from the server.");
            }
            setSearchResult(null);
            setSearchTicker('');
        } catch (err) {
            alert("Error buying stock.", err);
        }
    };

    // Handler for selling a stock
    const handleSell = async () => {
        const quantity = prompt("Enter quantity to sell:");
        if (!quantity || isNaN(quantity) || Number(quantity) <= 0) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/trade/sell', {
                ticker: searchResult.ticker,
                exchange: searchResult.exchange,
                quantity: Number(quantity)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                alert("Stock sold successfully!");
            } else {
                alert("No user data returned from the server.");
            }
            setSearchResult(null);
            setSearchTicker('');
        } catch (err) {
            alert("Error selling stock.");
        }
    };

    return (
        <div className="container">
            <h2>Welcome to Your Trading Dashboard</h2>
            <p>Use the search below to get live stock prices and trade.</p>
            <form onSubmit={handleSearch} className="search-form">
                <div className="form-group">
                    <label>Ticker Symbol:</label>
                    <input
                        type="text"
                        placeholder="e.g. INFY, AAPL"
                        value={searchTicker}
                        onChange={(e) => setSearchTicker(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Exchange (default NSE):</label>
                    <input
                        type="text"
                        placeholder="e.g. NSE, NASDAQ"
                        value={searchExchange}
                        onChange={(e) => setSearchExchange(e.target.value)}
                    />
                </div>
                <button type="submit" className="primary" disabled={loading}>
                    {loading ? 'Searching...' : 'Search Stock'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}

            {/* If a stock is found, show its details along with Buy/Sell buttons */}
            {searchResult && (
                <div className="stock-result">
                    <p>
                        <strong>Ticker:</strong> {searchResult.ticker}
                    </p>
                    <p>
                        <strong>Exchange:</strong> {searchResult.exchange}
                    </p>
                    <p>
                        <strong>Price:</strong> {searchResult.price}
                    </p>
                    <div style={{ marginTop: '1rem' }}>
                        <button onClick={handleBuy} className="primary" style={{ marginRight: '1rem' }}>
                            Buy
                        </button>
                        <button onClick={handleSell} className="primary">
                            Sell
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
