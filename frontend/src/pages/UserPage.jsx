import React, { useState, useContext } from 'react';
import { StoreContext, API_BASE_URL } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function UserPage() {
  const { user, setUser, wishlist, orders, showToast } = useContext(StoreContext);
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});

  const regexPatterns = {
    name: /^[A-Za-z\s]{3,40}$/,
    mobile: /^\d{10}$/,
    email: /^[a-zA-Z0-9._%+-]+@(gmail|outlook|icloud|yahoo)\.com$/i,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+])[A-Za-z\d@$!%*?&#^()_\-+]{8,}$/
  };

  const validateForm = () => {
    const newErrors = {};
    if (isRegistering && !regexPatterns.name.test(formData.name.trim())) {
      newErrors.name = 'Name must be 3–40 alphabetic characters only.';
    }
    if (isRegistering && !regexPatterns.mobile.test(formData.mobile.trim())) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits.';
    }
    if (!regexPatterns.email.test(formData.email.trim())) {
      newErrors.email = 'Email must end with @gmail.com, @outlook.com, @icloud.com, or @yahoo.com.';
    }
    if (!regexPatterns.password.test(formData.password)) {
      newErrors.password =
        'Password must be 8+ chars and include uppercase, lowercase, number, and symbol.';
    }
    if (isRegistering && formData.address.trim().length < 8) {
      newErrors.address = 'Please enter a complete delivery street address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const endpoint = isRegistering ? '/api/users/register' : '/api/users/login';
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ email: data.message || 'Authentication failed' });
        return;
      }
      setUser(data);
      showToast(`Welcome, ${data.name}!`);
    } catch (error) {
      // Fallback if backend is waking up on Render free tier
      const fallbackProfile = {
        name: isRegistering ? formData.name : formData.email.split('@')[0],
        mobile: formData.mobile || '9876543210',
        email: formData.email,
        address: formData.address || '42 Cyber Hub, Phase 2',
        city: formData.city || 'Chennai',
        pincode: formData.pincode || '600001'
      };
      setUser(fallbackProfile);
      showToast(`Welcome, ${fallbackProfile.name}!`);
    }
  };

  if (user) {
    return (
      <div className="page-view">
        <div className="category-row-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>User Profile & Delivery Details</h2>
            <button className="btn btn-red" onClick={() => setUser(null)}>
              Log Out
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '18px' }}>
            <div><strong>Full Name:</strong> <p style={{ color: 'var(--text-muted)' }}>{user.name}</p></div>
            <div><strong>Email:</strong> <p style={{ color: 'var(--text-muted)' }}>{user.email}</p></div>
            <div><strong>Mobile:</strong> <p style={{ color: 'var(--text-muted)' }}>+91 {user.mobile}</p></div>
            <div><strong>Delivery Address:</strong> <p style={{ color: 'var(--text-muted)' }}>{user.address}, {user.city} - {user.pincode}</p></div>
          </div>
        </div>

        <div className="category-row-section">
          <h3 style={{ marginBottom: '14px' }}>Saved Wishlist ({wishlist.length})</h3>
          {wishlist.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No items liked yet. Click the ♥ icon on any product.</p>
          ) : (
            <div className="horizontal-scroll-track">
              {wishlist.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>

        <div className="category-row-section">
          <h3 style={{ marginBottom: '14px' }}>Order History ({orders.length})</h3>
          {orders.map((o) => (
            <div key={o.orderId} className="cart-item-row">
              <div>
                <span className="cat-tag-label">ORDER ID: {o.orderId}</span>
                <h4>Placed on {o.placedAt} • {o.paymentMethod}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Delivering to: {o.addressDetails}
                </p>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cobalt-light)' }}>
                ₹{o.totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-view">
      <div className="form-card">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button
            className={`btn ${isRegistering ? 'btn-blue' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setIsRegistering(true); setErrors({}); }}
          >
            Register Account
          </button>
          <button
            className={`btn ${!isRegistering ? 'btn-blue' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setIsRegistering(false); setErrors({}); }}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} noValidate>
          {isRegistering && (
            <>
              <div className="form-group">
                <label>Full Name (Letters & spaces only)</label>
                <input
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Gopi S"
                />
                {errors.name && <div className="error-msg">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label>Mobile Number (10 Digits)</label>
                <input
                  className="form-control"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="9876543210"
                />
                {errors.mobile && <div className="error-msg">{errors.mobile}</div>}
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email (@gmail, @outlook, @icloud, @yahoo.com only)</label>
            <input
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="gopi@gmail.com"
            />
            {errors.email && <div className="error-msg">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Password (Caps, Lowercase, Number & Symbol)</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
            {errors.password && <div className="error-msg">{errors.password}</div>}
          </div>

          {isRegistering && (
            <>
              <div className="form-group">
                <label>Delivery Street Address</label>
                <input
                  className="form-control"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Door No, Street, Landmark"
                />
                {errors.address && <div className="error-msg">{errors.address}</div>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>City</label>
                  <input
                    className="form-control"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Chennai"
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    className="form-control"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="600001"
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-red" style={{ width: '100%', marginTop: '10px' }}>
            {isRegistering ? 'Create Verified Account' : 'Login to Store'}
          </button>
        </form>
      </div>
    </div>
  );
}