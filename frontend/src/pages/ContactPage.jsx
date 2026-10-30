import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ContactPage() {
  const { showToast } = useContext(StoreContext);
  return (
    <div className="page-view">
      <div className="form-card">
        <h2>Connect With NexusGear Support</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Need warranty assistance on keyboards, IEMs, or powerbanks? Drop us a message below.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast('Support ticket submitted! We will reply within 24 hours.');
            e.target.reset();
          }}
        >
          <div className="form-group">
            <label>Your Name</label>
            <input className="form-control" required placeholder="e.g. Gopi S" />
          </div>
          <div className="form-group">
            <label>Order ID (Optional)</label>
            <input className="form-control" placeholder="e.g., ORD-9X2A" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea rows="4" className="form-control" required placeholder="How can we help?" />
          </div>
          <button type="submit" className="btn btn-blue" style={{ width: '100%' }}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}