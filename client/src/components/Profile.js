import React from 'react';
import './Profile.css';

const Profile = () => {
    const userString = localStorage.getItem('user');
    let user = {};

    try {
        if (userString && userString !== "undefined") {
            user = JSON.parse(userString);
        }
    } catch (err) {
        console.error("Error parsing user data:", err);
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h1>{user.name || "User Profile"}</h1>
            </div>

            <div className="profile-details">
                <div className="detail-item">
                    <span className="detail-icon">👤</span>
                    <div className="detail-content">
                        <label>Full Name</label>
                        <p>{user.name || "Not specified"}</p>
                    </div>
                </div>

                <div className="detail-item">
                    <span className="detail-icon">✉️</span>
                    <div className="detail-content">
                        <label>Email Address</label>
                        <p>{user.email || "Not specified"}</p>
                    </div>
                </div>

                <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <div className="detail-content">
                        <label>Account Balance</label>
                        <p className="balance">
                            ₹{(user.balance || 0).toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;