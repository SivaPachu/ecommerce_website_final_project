import React, { useState, useMemo, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

export default function CheckoutPage() {
  const { cart, user, placeNewOrder } = useContext(StoreContext);
  const location = useLocation();
  const directBuyItem = location.state?.directBuyItem;

  const checkoutItems = directBuyItem ? [directBuyItem] : cart;
  const subtotal = checkoutItems.reduce((acc, i) => acc + i.salePrice * i.qty, 0);

  // Random delivery charge < ₹80 (between ₹25 and ₹79) generated once per checkout session if subtotal < ₹599
  const randomDeliveryUnder80 = useMemo(() => Math.floor(Math.random() * 55) + 25, []);
  const deliveryCharge = subtotal === 0 ? 0 : subtotal >= 599 ? 0 : randomDeliveryUnder80;

  const [address, setAddress] = useState(
    user ? `${user.address}, ${user.city} - ${user.pincode}` : ''
  );
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR Instant Pay');
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [cardError, setCardError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const codFee = paymentMethod === 'Cash on Delivery (COD)' ? 10 : 0;
  const finalTotal = subtotal + deliveryCharge + codFee;

  const validateCardFields = () => {
    const cleanNum = cardDetails.cardNumber.replace(/\s+/g, '');
    if (cardDetails.cardName.trim().length < 3) {
      return 'Please enter the cardholder name.';
    }
    if (!/^\d{16}$/.test(cleanNum)) {
      return 'Card number must be 16 digits.';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry.trim())) {
      return 'Expiry must be in MM/YY format.';
    }
    if (!/^\d{3}$/.test(cardDetails.cvv.trim())) {
      return 'CVV must be 3 digits.';
    }
    return '';
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!address.trim()) return alert('Please provide a delivery address.');

    if (paymentMethod === 'Credit / Debit Card') {
      const err = validateCardFields();
      if (err) {
        setCardError(err);
        return;
      }
    }
    setCardError('');

    const orderRecord = placeNewOrder({
      items: checkoutItems,
      addressDetails: address,
      paymentMethod,
      subtotal,
      deliveryCharge,
      codFee,
      finalTotal
    });
    setConfirmedOrder(orderRecord);
  };

  if (confirmedOrder) {
    return (
      <div className="page-view">
        <div className="form-card" style={{ textAlign: 'center', borderColor: 'var(--cobalt-light)' }}>
          <span className="badge-count" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
            ORDER CONFIRMED
          </span>
          <h2 style={{ fontSize: '2rem', margin: '16px 0 8px' }}>Thank You For Your Purchase!</h2>
          <p style={{ color: 'var(--cobalt-light)', fontWeight: 800, fontSize: '1.2rem' }}>
            Order ID: {confirmedOrder.orderId}
          </p>
          <div style={{ color: 'var(--text-muted)', margin: '14px 0 24px', fontSize: '0.95rem' }}>
            <p>Delivering to: {confirmedOrder.addressDetails}</p>
            <p>Payment Mode: {confirmedOrder.paymentMethod}</p>
            <p style={{ color: '#fff', fontWeight: 700, marginTop: '8px', fontSize: '1.15rem' }}>
              Total Paid: ₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}
            </p>
          </div>
          <Link to="/products" className="btn btn-blue">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-view">
      <div className="form-card">
        <h2 style={{ marginBottom: '20px' }}>Checkout & Delivery Confirmation</h2>
        <form onSubmit={handleConfirmOrder}>
          <div className="form-group">
            <label>Shipping Address for Delivery</label>
            <textarea
              rows="3"
              className="form-control"
              required
              placeholder="Enter full house number, street, city, and pincode..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Select Payment Method</label>
            <select
              className="form-control"
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setCardError('');
              }}
            >
              <option value="UPI / QR Instant Pay">UPI / QR Instant Pay (Google Pay)</option>
              <option value="Credit / Debit Card">Credit / Debit Card (Visa / MasterCard / RuPay)</option>
              <option value="NetBanking">NetBanking</option>
              <option value="Cash on Delivery (COD)">Cash on Delivery (COD - ₹10 Extra)</option>
            </select>
          </div>

          {/* 1. Google Pay QR Code Redirect Box */}
          {paymentMethod === 'UPI / QR Instant Pay' && (
            <div className="qr-payment-box">
              <h4 style={{ color: 'var(--cobalt-light)' }}>Scan QR with Mobile Camera or GPay</h4>
              <a
                href="https://pay.google.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Click or Scan to open Google Pay"
              >
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fpay.google.com"
                  alt="Google Pay QR Code"
                />
              </a>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Scanning this QR redirects straight to the{' '}
                <a
                  href="https://pay.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--cobalt-light)' }}
                >
                  Google Pay Home Page
                </a>
                .
              </p>
            </div>
          )}

          {/* 2. Mandatory Credit / Debit Card Details Box */}
          {paymentMethod === 'Credit / Debit Card' && (
            <div className="card-payment-box">
              <h4 style={{ marginBottom: '12px', color: 'var(--cobalt-light)' }}>
                Enter Credit / Debit Card Details (Required)
              </h4>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Gopi S"
                  required
                  value={cardDetails.cardName}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>16-Digit Card Number</label>
                <input
                  type="text"
                  maxLength="16"
                  className="form-control"
                  placeholder="4532019283746510"
                  required
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Expiry Date (MM/YY)</label>
                  <input
                    type="text"
                    maxLength="5"
                    className="form-control"
                    placeholder="08/29"
                    required
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>CVV (3 Digits)</label>
                  <input
                    type="password"
                    maxLength="3"
                    className="form-control"
                    placeholder="•••"
                    required
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  />
                </div>
              </div>
              {cardError && <div className="error-msg">{cardError}</div>}
            </div>
          )}

          {/* Price Breakdown with Dynamic Delivery & COD Rules */}
          <div style={{ borderTop: '1px solid var(--border-slate)', paddingTop: '14px', margin: '18px 0' }}>
            <h4>Order Breakdown ({checkoutItems.length} items):</h4>
            {checkoutItems.map((item) => (
              <div
                key={item.id}
                style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '8px', color: 'var(--text-muted)' }}
              >
                <span>{item.title} (x{item.qty})</span>
                <span>₹{(item.salePrice * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '12px', color: 'var(--text-muted)' }}>
              <span>Items Subtotal:</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '6px', color: 'var(--text-muted)' }}>
              <span>Delivery Charge {subtotal >= 599 ? '(Orders ≥ ₹599)' : '(Orders < ₹599)'}:</span>
              <span style={{ color: deliveryCharge === 0 ? '#10b981' : '#facc15', fontWeight: 700 }}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>

            {codFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '6px', color: '#fb7185' }}>
                <span>Cash on Delivery (COD) Fee:</span>
                <span>+ ₹{codFee}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: 800, marginTop: '14px', borderTop: '1px solid var(--border-slate)', paddingTop: '10px' }}>
              <span>Total Payable:</span>
              <span style={{ color: 'var(--crimson-main)' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button type="submit" className="btn btn-red" style={{ width: '100%' }}>
            Confirm & Place Order (₹{finalTotal.toLocaleString('en-IN')})
          </button>
        </form>
      </div>
    </div>
  );
}