import React from 'react';
import '../App.css';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};

    // Safely access nested properties with optional chaining
    return (
        <div className="container">
            <h2>Profile</h2>
            <p><strong>Name:</strong> {user?.name?.trim() || 'N/A'}</p>
            <p><strong>Email:</strong> {user?.email || 'No email associated with this account'}</p>
            <p><strong>Account ID:</strong> {user?.id || 'N/A'}</p>
            <p><strong>Balance:</strong> ${user?.balance?.toLocaleString() || '0'}</p>
        </div>
    );
};

export default Profile;