// client/src/components/StockData.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockData = () => {
    const [stockData, setStockData] = useState({ ticker: '', exchange: '', price: '' });
    const [loading, setLoading] = useState(true);

    const fetchStockData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/stock-data', {
                params: { ticker: 'INFY', exchange: 'NSE' }
            });
            setStockData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStockData();

        // Optionally, fetch the data every 15 seconds for real-time updates
        const intervalId = setInterval(fetchStockData, 15000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h2>Real-Time Stock Data</h2>
            {loading ? (
                <p>Loading stock data...</p>
            ) : (
                <div>
                    <p>
                        <strong>Ticker:</strong> {stockData.ticker}
                    </p>
                    <p>
                        <strong>Exchange:</strong> {stockData.exchange}
                    </p>
                    <p>
                        <strong>Price:</strong> {stockData.price}
                    </p>
                </div>
            )}
        </div>
    );
};

export default StockData;
