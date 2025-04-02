import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Footer = () => {
    return (
        <footer className="footer">
            <nav>
                <ul>
                    <li>
                        <Link to="/watchlist">Watchlist</Link>
                    </li>
                    <li>
                        <Link to="/trade-lab">Trade Lab</Link>
                    </li>
                </ul>
            </nav>
        </footer>
    );
};

export default Footer;
