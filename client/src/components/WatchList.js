import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrimaryStocks from './PrimaryStocks'; // We'll reuse your PrimaryStocks component for Primary tab
// import '../App.css';
import './Watchlist.css'

const Watchlist = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    // Retrieve persisted watchlists from localStorage on initial render
    const initialWatchlists = JSON.parse(localStorage.getItem(`watchlists_${user.id}`)) || [];
    const [watchlists, setWatchlists] = useState(initialWatchlists);
    const [newWatchlistName, setNewWatchlistName] = useState('');

    // For search functionality
    const [searchTicker, setSearchTicker] = useState('');
    const [searchExchange, setSearchExchange] = useState('NSE');
    const [searchResult, setSearchResult] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // Tab state: "Holdings" or "Primary"
    const [activeTab, setActiveTab] = useState('Holdings');
    const [selectedWatchlist, setSelectedWatchlist] = useState(null);

    // Persist watchlists for the current user
    useEffect(() => {
        if (user.id) {
            localStorage.setItem(`watchlists_${user.id}`, JSON.stringify(watchlists));
        }
    }, [watchlists, user.id]);

    // Create a new watchlist
    const handleCreateWatchlist = () => {
        if (!newWatchlistName.trim()) return;
        // Prevent duplicate watchlist names for the same user
        if (watchlists.some((wl) => wl.name === newWatchlistName.trim())) return;
        const newWL = { name: newWatchlistName.trim(), stocks: [] };
        setWatchlists([...watchlists, newWL]);
        setNewWatchlistName('');
    };

    // Add this new function to handle stock removal
    const handleRemoveStock = (watchlistName, ticker) => {
        setWatchlists(prev => prev.map(wl => {
            if (wl.name === watchlistName) {
                return {
                    ...wl,
                    stocks: wl.stocks.filter(stock => stock.ticker !== ticker)
                };
            }
            return wl;
        }));
    };

    // Search for a stock using the backend API
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTicker.trim()) return;
        setSearchLoading(true);
        setSearchError('');
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
            setSearchError('Error fetching stock data.');
        } finally {
            setSearchLoading(false);
        }
    };

    // Add searched stock to a specific watchlist
    const handleAddStockToWatchlist = (watchlistName) => {
        if (!searchResult) return;
        setWatchlists((prev) =>
            prev.map((wl) => {
                if (wl.name === watchlistName) {
                    // Prevent duplicate stocks
                    const exists = wl.stocks.some((stock) => stock.ticker === searchResult.ticker);
                    if (!exists) {
                        return { ...wl, stocks: [...wl.stocks, searchResult] };
                    }
                }
                return wl;
            })
        );
        // Hide dropdown and clear search result
        setShowDropdown(false);
        setSearchResult(null);
        setSearchTicker('');
    };

    return (
        <div className="watchlist-page">
            {/* Left Sidebar */}
            <div className="sidebar">
                <div className="section">
                    <h3>Create Watchlist</h3>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Watchlist name"
                            value={newWatchlistName}
                            onChange={(e) => setNewWatchlistName(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleCreateWatchlist}>
                        Create New
                    </button>
                </div>

                <div className="section">
                    <h3>Your Watchlists</h3>
                    {watchlists.map((wl, idx) => (
                        <div
                            key={idx}
                            className={`watchlist-card ${selectedWatchlist?.name === wl.name ? 'active' : ''}`}
                            onClick={() => setSelectedWatchlist(wl)}
                        >
                            <div>
                                <h4>{wl.name}</h4>
                                <small>{wl.stocks.length} stocks</small>
                            </div>
                            <button
                                className="btn-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setWatchlists(watchlists.filter((_, i) => i !== idx));
                                    if (selectedWatchlist?.name === wl.name) setSelectedWatchlist(null);
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Search Section */}
                <div className="section">
                    <form onSubmit={handleSearch}>
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Enter ticker (e.g., INFY)"
                                value={searchTicker}
                                onChange={(e) => setSearchTicker(e.target.value)}
                            />
                            <select
                                value={searchExchange}
                                onChange={(e) => setSearchExchange(e.target.value)}
                            >
                                <option value="NSE">NSE</option>
                                <option value="NASDAQ">NASDAQ</option>
                            </select>
                            <button className="btn btn-primary" type="submit">
                                {searchLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </form>

                    {searchError && <div className="error-message">{searchError}</div>}

                    {searchResult && (
                        <div className="stock-result-card">
                            <div className="stock-info">
                                <div>
                                    <h3>{searchResult.ticker}</h3>
                                    <p className="exchange">{searchResult.exchange}</p>
                                </div>
                                <p className="price">₹{searchResult.price}</p>
                            </div>
                            <div className="dropdown">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    Add to Watchlist
                                </button>
                                {showDropdown && (
                                    <div className="dropdown-list">
                                        {watchlists.map((wl, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAddStockToWatchlist(wl.name)}
                                                className="dropdown-item"
                                            >
                                                {wl.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="content-section">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'Holdings' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('Holdings');
                                setSelectedWatchlist(null);
                            }}
                        >
                            Holdings
                        </button>
                        <button
                            className={`tab ${activeTab === 'Primary' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('Primary');
                                setSelectedWatchlist(null);
                            }}
                        >
                            Primary Stocks
                        </button>
                    </div>

                    {selectedWatchlist ? (
                        <div className="selected-watchlist">
                            <div className="watchlist-header">
                                <h2>{selectedWatchlist.name}</h2>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedWatchlist(null)}
                                >
                                    Back to All
                                </button>
                            </div>
                            {selectedWatchlist.stocks.length === 0 ? (
                                <p className="empty-state">No stocks in this watchlist</p>
                            ) : (
                                selectedWatchlist.stocks.map((stock, sidx) => (
                                    <div key={sidx} className="stock-card">
                                        <div className="stock-info">
                                            <div>
                                                <h4>{stock.ticker}</h4>
                                                <p className="exchange">{stock.exchange}</p>
                                            </div>
                                            <p className="price">₹{stock.price}</p>
                                        </div>
                                        {/* Add delete button */}
                                        <button
                                            className="btn-danger"
                                            onClick={() => handleRemoveStock(selectedWatchlist.name, stock.ticker)}
                                            title="Remove stock"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : activeTab === 'Primary' ? (
                        <PrimaryStocks />
                    ) : (
                        <div className="holdings-section">
                            <h2>Virtual Holdings</h2>
                            <p className="placeholder-text">
                                Your purchased stocks will appear here when you start trading
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Watchlist;