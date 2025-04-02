import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Import global CSS

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div>
                <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Stock Trading Platform
                </Link>
            </div>
            <ul>
                {token ? (
                    <>
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/signup">Signup</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
