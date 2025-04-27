import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrimaryStocks from './PrimaryStocks'; // For Primary tab content
import Holdings from './Holdings';           // For Holdings tab content
import './Watchlist.css';

const Watchlist = () => {
    const [watchlists, setWatchlists] = useState([]);
    const [newWatchlistName, setNewWatchlistName] = useState('');
    const [loadingWatchlists, setLoadingWatchlists] = useState(true);
    const [watchlistError, setWatchlistError] = useState('');

    // For search functionality
    const [searchTicker, setSearchTicker] = useState('');
    const [searchExchange, setSearchExchange] = useState('NSE');
    const [searchResult, setSearchResult] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // Tab state: "Holdings" or "Primary"
    const [activeTab, setActiveTab] = useState('Holdings');

    const token = localStorage.getItem('token');

    // Fetch user's watchlists from the backend on mount
    useEffect(() => {
        const fetchWatchlists = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/watchlists', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWatchlists(res.data.watchlists);
            } catch (error) {
                console.error("Error fetching watchlists", error);
                setWatchlistError('Error fetching watchlists');
            } finally {
                setLoadingWatchlists(false);
            }
        };
        fetchWatchlists();
    }, [token]);

    // Create a new watchlist via backend
    const handleCreateWatchlist = async () => {
        if (!newWatchlistName.trim()) return;
        try {
            const res = await axios.post(
                'http://localhost:5000/api/watchlists',
                { name: newWatchlistName.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setWatchlists((prev) => [...prev, res.data.watchlist]);
            setNewWatchlistName('');
        } catch (error) {
            console.error("Error creating watchlist", error);
            setWatchlistError('Error creating watchlist');
        }
    };

    // 🚀 **NEW FUNCTION: Delete a watchlist**
    const handleDeleteWatchlist = async (watchlistId) => {
        try {
            await axios.delete(`http://localhost:5000/api/watchlists/${watchlistId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchlists((prev) => prev.filter((wl) => wl._id !== watchlistId)); // Remove from state
        } catch (error) {
            console.error("Error deleting watchlist", error);
            alert("Failed to delete watchlist.");
        }
    };

    // Search for a stock using the backend API
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTicker.trim()) return;
        setSearchLoading(true);
        setSearchError('');
        setSearchResult(null);
        try {
            const res = await axios.get('http://localhost:5000/api/stock-data', {
                params: {
                    ticker: searchTicker.trim().toUpperCase(),
                    exchange: (searchExchange || 'NSE').toUpperCase()
                }
            });
            setSearchResult(res.data);
        } catch (error) {
            setSearchError('Error fetching stock data.');
        } finally {
            setSearchLoading(false);
        }
    };

    // Add searched stock to a specific watchlist via backend
    const handleAddStockToWatchlist = async (watchlistId) => {
        if (!searchResult) return;
        try {
            const res = await axios.put(
                'http://localhost:5000/api/watchlists/add-stock',
                {
                    watchlistId,
                    stock: {
                        ticker: searchResult.ticker,
                        exchange: searchResult.exchange,
                        price: searchResult.price
                    }
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Update the specific watchlist in state with the returned updated watchlist
            setWatchlists((prev) =>
                prev.map((wl) =>
                    wl._id === res.data.watchlist._id ? res.data.watchlist : wl
                )
            );
            setShowDropdown(false);
            setSearchResult(null);
            setSearchTicker('');
        } catch (error) {
            console.error("Error adding stock to watchlist", error);
        }
    };

    return (
        <div className="container">
            <h2>Watchlist</h2>

            {/* My Watchlists Section (fetched from database) */}
            <div className="my-watchlists-section">
                <h3>My Watchlists</h3>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="New Watchlist Name (e.g. WL-1)"
                        value={newWatchlistName}
                        onChange={(e) => setNewWatchlistName(e.target.value)}
                    />
                    <button className="primary" onClick={handleCreateWatchlist}>
                        +
                    </button>
                </div>
                {loadingWatchlists ? (
                    <p>Loading watchlists...</p>
                ) : watchlistError ? (
                    <p className="error">{watchlistError}</p>
                ) : watchlists.length === 0 ? (
                    <p>No watchlists created yet.</p>
                ) : (
                    watchlists.map((wl) => (
                        <div key={wl._id} className="watchlist-item">
                            <h4>{wl.name}</h4>
                            {/* 🗑️ Delete Watchlist Button */}
                            <button className="delete-btn" onClick={() => handleDeleteWatchlist(wl._id)}>
                                🗑️
                            </button>
                            {wl.stocks.length === 0 ? (
                                <p>No stocks added.</p>
                            ) : (
                                wl.stocks.map((stock, idx) => (
                                    <div key={idx} className="stock-item">
                                        <p>
                                            <strong>{stock.ticker}</strong> ({stock.exchange}) - Price: {stock.price}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Stock Search Section */}
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
                <button type="submit" className="primary" disabled={searchLoading}>
                    {searchLoading ? 'Searching...' : 'Search Stock'}
                </button>
            </form>
            {searchError && <p className="error">{searchError}</p>}

            {/* Display search result with plus icon for adding to a watchlist */}
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
                    <button onClick={() => setShowDropdown(!showDropdown)} className="primary">
                        +
                    </button>
                    {showDropdown && (
                        <div className="dropdown">
                            <p>Select Watchlist:</p>
                            {watchlists.length === 0 ? (
                                <p>No watchlists available. Create one first.</p>
                            ) : (
                                watchlists.map((wl) => (
                                    <button
                                        key={wl._id}
                                        onClick={() => handleAddStockToWatchlist(wl._id)}
                                        className="primary"
                                    >
                                        {wl.name}
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Tabs for Holdings and Primary */}
            <div className="watchlist-tabs">
                <button
                    onClick={() => setActiveTab('Holdings')}
                    className={activeTab === 'Holdings' ? 'active-tab' : ''}
                >
                    Holdings
                </button>
                <button
                    onClick={() => setActiveTab('Primary')}
                    className={activeTab === 'Primary' ? 'active-tab' : ''}
                >
                    Primary
                </button>
            </div>

            <div className="watchlist-content">
                {activeTab === 'Primary' ? (
                    <PrimaryStocks />
                ) : (
                    <Holdings />
                )}
            </div>
        </div>
    );
};

export default Watchlist;
