import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../App.css';

// Memoize the static tickers array to prevent re-render issues
const allTickers = ['INFY', 'TCS', 'WIPRO', 'HDFCBANK', 'RELIANCE', 'ICICIBANK', 'LT', 'SBIN'];

const PrimaryStocks = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to get 5 random tickers
    const getRandomTickers = () => {
        const shuffled = [...allTickers].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    };

    // Function to fetch data for a given ticker
    const fetchStockData = async (ticker) => {
        try {
            const response = await axios.get('http://localhost:5000/api/stock-data', {
                params: { ticker, exchange: 'NSE' }
            });
            return response.data;
        } catch (err) {
            console.error(`Error fetching data for ${ticker}:`, err);
            return { ticker, exchange: 'NSE', price: 'N/A' };
        }
    };

    // Wrap fetchData in useCallback to avoid dependency issues in useEffect
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const randomTickers = getRandomTickers();
            const dataPromises = randomTickers.map(fetchStockData);
            const results = await Promise.all(dataPromises);
            setStocks(results);
        } catch (err) {
            setError('Error fetching primary stocks.');
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies since allTickers is static

    useEffect(() => {
        // Initial fetch on mount
        fetchData();

        // Polling interval for real-time updates
        const intervalId = setInterval(() => {
            fetchData();
        }, 15000); // Poll every 15 seconds

        // Cleanup the interval on unmount
        return () => clearInterval(intervalId);
    }, [fetchData]); // Include fetchData as dependency

    return (
        <div className="primary-stocks">
            <h3>Primary Stocks</h3>
            {loading ? (
                <p>Loading stocks...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div>
                    {stocks.map((stock, index) => (
                        <div key={index} className="stock-item">
                            <p><strong>{stock.ticker}</strong> ({stock.exchange})</p>
                            <p>Price: {stock.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PrimaryStocks;
