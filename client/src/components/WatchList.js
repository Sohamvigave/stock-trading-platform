import React, { useState } from 'react';
import PrimaryStocks from './PrimaryStocks';
import '../App.css';

const Watchlist = () => {
    const [activeTab, setActiveTab] = useState('Primary'); // Default to Primary

    return (
        <div className="container">
            <h2>Watchlist</h2>
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
                {activeTab === 'Primary' && <PrimaryStocks />}
                {activeTab === 'Holdings' && <p>Your holdings will be displayed here.</p>}
            </div>
        </div>
    );
};

export default Watchlist;
