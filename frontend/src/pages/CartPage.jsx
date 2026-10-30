import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { ALL_PRODUCTS } from '../data/productsData';
import ProductCard from '../components/ProductCard';

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.salePrice * item.qty, 0);
  const recommendations = ALL_PRODUCTS.slice(0, 8);

  return (
    <div className="page-view">
      <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '20px' }}>
        Shopping Cart ({cart.length} Items)
      </h1>

      {cart.length === 0 ? (
        <div className="category-row-section" style={{ textAlign: 'center', padding: '48px' }}>
          <h3>Your cart is currently empty.</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px' }}>
            Explore our flash deals on keyboards, IEMs, and gaming controllers.
          </p>
          <Link to="/products" className="btn btn-blue">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {cart.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div>
                    <span className="cat-tag-label">{item.category}</span>
                    <h4 style={{ fontSize: '1.05rem' }}>{item.title}</h4>
                    <div style={{ color: 'var(--cobalt-light)', fontWeight: 700 }}>
                      ₹{item.salePrice.toLocaleString('en-IN')} each
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button className="btn btn-outline" onClick={() => updateCartQty(item.id, -1)}>
                    -
                  </button>
                  <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                    {item.qty}
                  </span>
                  <button className="btn btn-outline" onClick={() => updateCartQty(item.id, 1)}>
                    +
                  </button>
                  <button className="btn btn-red" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="form-card" style={{ height: 'fit-content', margin: 0 }}>
            <h3 style={{ marginBottom: '16px' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--text-muted)' }}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
              <span>Delivery Eligibility:</span>
              <span style={{ color: subtotal >= 599 ? '#10b981' : 'var(--cobalt-light)' }}>
                {subtotal >= 599 ? 'FREE (Order ≥ ₹599)' : 'Calculated at Checkout (< ₹80)'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, borderTop: '1px solid var(--border-slate)', paddingTop: '14px', marginBottom: '20px' }}>
              <span>Subtotal:</span>
              <span style={{ color: 'var(--crimson-main)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <button
              className="btn btn-red"
              style={{ width: '100%' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout &rarr;
            </button>
          </div>
        </div>
      )}

      <section className="category-row-section" style={{ marginTop: '48px' }}>
        <div className="row-header">
          <h3 style={{ fontSize: '1.3rem' }}>Recommended For Your Setup</h3>
        </div>
        <div className="horizontal-scroll-track">
          {recommendations.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}