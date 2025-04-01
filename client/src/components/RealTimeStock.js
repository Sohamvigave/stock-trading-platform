// client/src/components/RealTimeStock.js

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const RealTimeStock = () => {
    const [stockData, setStockData] = useState(null);

    useEffect(() => {
        // Connect to the Socket.IO server
        const socket = io('http://localhost:5000');

        // Log successful connection
        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        // Listen for stock data updates
        socket.on('stockDataUpdate', (data) => {
            console.log('Received stock update:', data);
            setStockData(data);
        });

        // Cleanup the connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h2>Real-Time Stock Data (via WebSockets)</h2>
            {stockData ? (
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
            ) : (
                <p>Loading real-time stock data...</p>
            )}
        </div>
    );
};

export default RealTimeStock;
