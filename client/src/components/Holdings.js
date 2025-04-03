// client/src/components/Holdings.js
import React, { useState, useEffect } from 'react';
import '../App.css';

const Holdings = () => {
    const [holdings, setHoldings] = useState([]);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString && userString !== 'undefined') {
            try {
                const user = JSON.parse(userString);
                setHoldings(user.portfolio || []);
            } catch (err) {
                console.error("Error parsing user data from localStorage:", err);
            }
        }
    }, []);

    return (
        <div>
            <h3>Your Holdings</h3>
            {holdings.length === 0 ? (
                <p>You do not own any stocks yet.</p>
            ) : (
                holdings.map((item, index) => (
                    <div key={index} className="stock-item">
                        <p>
                            <strong>{item.symbol}</strong> - Quantity: {item.quantity} - Avg Price: {item.avgPrice}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Holdings;
