import React from 'react';
import '../App.css';

const Profile = () => {
    // Get the user data string from localStorage
    const userString = localStorage.getItem('user');
    let user = {};
    try {
        // Only parse if userString exists and is not "undefined"
        if (userString && userString !== "undefined") {
            user = JSON.parse(userString);
        }
    } catch (err) {
        console.error("Error parsing user data from localStorage:", err);
    }

    return (
        <div className="container">
            <h2>Profile</h2>
            <p><strong>Name:</strong> {user.name || "N/A"}</p>
            <p><strong>Email:</strong> {user.email || "N/A"}</p>
            <p><strong>Balance:</strong> {user.balance || "N/A"}</p>
        </div>
    );
};

export default Profile;
