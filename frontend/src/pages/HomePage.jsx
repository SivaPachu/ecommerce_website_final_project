import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_PRODUCTS, CATEGORIES } from '../data/productsData';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate('/products', { state: { initialSearch: searchQuery } });
  };

  return (
    <div className="page-view">
      <section className="hero-banner">
        <span
          style={{
            background: 'var(--crimson-main)',
            padding: '4px 12px',
            borderRadius: '99px',
            fontSize: '0.78rem',
            fontWeight: 700
          }}
        >
          MEGA ELECTRONICS FEST • FREE DELIVERY ABOVE ₹599
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '14px' }}>
          Pro-Grade Gaming & Audio Peripherals
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', marginTop: '8px' }}>
          Explore curated mechanical keyboards, Hall-effect controllers, Hi-Res IEMs, TWS earbuds, and fast-charging GaN powerbanks at unbeatable Indian prices.
        </p>

        <form className="search-container" onSubmit={handleHeroSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search for keyboards, mice, headphones, IEMs, powerbanks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-red">
            Search Store
          </button>
        </form>
      </section>

      {CATEGORIES.map((cat) => {
        const categoryItems = ALL_PRODUCTS.filter((p) => p.category === cat.category);
        return (
          <section key={cat.categoryGroupId} className="category-row-section">
            <div className="row-header">
              <div>
                <span className="cat-tag-label">{cat.category}</span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>{cat.label} — Flash Sale</h2>
              </div>
              <button
                className="btn btn-outline"
                onClick={() =>
                  navigate('/products', { state: { filterGroupId: cat.categoryGroupId } })
                }
              >
                Explore Category &rarr;
              </button>
            </div>

            <div className="horizontal-scroll-track">
              {categoryItems.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}