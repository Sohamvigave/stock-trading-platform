import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

// Memoize the static tickers array to prevent re-render issues
const allTickers = ['INFY', 'TCS', 'WIPRO', 'HDFCBANK', 'RELIANCE', 'ICICIBANK', 'LT', 'SBIN'];

const PrimaryStocks = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getRandomTickers = () => {
            // Use the memoized array reference
            const shuffled = [...allTickers].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, 5);
        };

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

        const fetchData = async () => {
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
        };

        fetchData();
    }, []); // Empty array is safe now because allTickers is static

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

