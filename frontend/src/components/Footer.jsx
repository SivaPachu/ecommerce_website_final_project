import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="brand-logo" style={{ marginBottom: '12px' }}>
            <span className="blue">NEXUS</span>
            <span className="red">GEAR</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            India's premier destination for audiophile IEMs, hot-swap mechanical keyboards, ultralight gaming mice, Hall-effect controllers, and GaN powerbanks.
          </p>
        </div>

        <div className="footer-col">
          <h4>Top Categories</h4>
          <ul>
            <li><Link to="/products">Mechanical Keyboards</Link></li>
            <li><Link to="/products">Gaming Mice</Link></li>
            <li><Link to="/products">Headphones & IEMs</Link></li>
            <li><Link to="/products">TWS & Powerbanks</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul>
            <li><Link to="/user">My Account & Orders</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/contact">Warranty & Returns</Link></li>
            <li><Link to="/contact">Help Center</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Connect With Us</h4>
          <ul>
            <li><a href="#instagram">Instagram</a></li>
            <li><a href="#twitter">X (Twitter)</a></li>
            <li><a href="#youtube">YouTube Tech Reviews</a></li>
            <li><a href="#discord">Discord Community</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}