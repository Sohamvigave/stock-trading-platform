import React from 'react';
import '../App.css'; // Import global CSS

const Home = () => {
    return (
        <div className="container">
            <h2>Welcome to Your Trading Dashboard</h2>
            <p>
                Here you can view real-time stock data, manage your portfolio, and
                execute trades. Use the navigation above to explore different features.
            </p>
        </div>
    );
};

export default Home;
