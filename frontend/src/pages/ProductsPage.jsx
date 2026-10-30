import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { ALL_PRODUCTS, CATEGORIES } from '../data/productsData';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useContext(StoreContext);

  const [search, setSearch] = useState(location.state?.initialSearch || '');
  const [selectedGroupId, setSelectedGroupId] = useState(location.state?.filterGroupId || 'ALL');
  const [selectedProduct, setSelectedProduct] = useState(location.state?.selectedProduct || null);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const filteredProducts = ALL_PRODUCTS.filter((p) => {
    const matchesGroup = selectedGroupId === 'ALL' || p.categoryGroupId === selectedGroupId;
    const q = search.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q);
    const matchesWish = !showWishlistOnly || wishlist.some((w) => w.id === p.id);
    return matchesGroup && matchesQuery && matchesWish;
  });

  const similarProducts = selectedProduct
    ? ALL_PRODUCTS.filter(
        (p) =>
          p.categoryGroupId === selectedProduct.categoryGroupId &&
          p.id !== selectedProduct.id
      )
    : [];

  return (
    <div className="page-view">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Electronics Catalog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Filter by category or click any product to inspect specifications and similar models.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '520px' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by brand, model, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className={`btn ${showWishlistOnly ? 'btn-red' : 'btn-outline'}`}
            onClick={() => setShowWishlistOnly(!showWishlistOnly)}
          >
            ♥ Wishlist ({wishlist.length})
          </button>
        </div>
      </div>

      {/* Clean Category Filter Bar (No IDs or Counts Displayed) */}
      <div className="filter-bar">
        <button
          className={`chip-btn ${selectedGroupId === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedGroupId('ALL')}
        >
          All Categories
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.categoryGroupId}
            className={`chip-btn ${selectedGroupId === c.categoryGroupId ? 'active' : ''}`}
            onClick={() => {
              setSelectedGroupId(c.categoryGroupId);
              setSelectedProduct(null);
            }}
          >
            {c.category.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Toggled Product Detail View */}
      {selectedProduct && (
        <div className="detail-modal-panel">
          <div className="detail-img-box">
            <img src={selectedProduct.image} alt={selectedProduct.title} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="cat-tag-label">{selectedProduct.categoryLabel}</span>
                <button className="btn btn-outline" onClick={() => setSelectedProduct(null)}>
                  ✕ Close Detail View
                </button>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '10px 0' }}>
                {selectedProduct.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '18px' }}>
                {selectedProduct.description}
              </p>

              <div className="price-row">
                <span className="sale-price" style={{ fontSize: '2rem', color: 'var(--cobalt-light)' }}>
                  ₹{selectedProduct.salePrice.toLocaleString('en-IN')}
                </span>
                <span className="original-price" style={{ fontSize: '1.1rem' }}>
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="badge-count">Save {selectedProduct.discountPercent}%</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
              <button
                className="btn btn-blue"
                style={{ flex: 1 }}
                onClick={() => addToCart(selectedProduct, 1)}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-red"
                style={{ flex: 1 }}
                onClick={() =>
                  navigate('/checkout', { state: { directBuyItem: { ...selectedProduct, qty: 1 } } })
                }
              >
                Buy Now (Instant Checkout)
              </button>
              <button
                className="btn btn-outline"
                onClick={() => toggleWishlist(selectedProduct)}
              >
                {wishlist.some((w) => w.id === selectedProduct.id) ? '♥ Wishlisted' : '♡ Add Wishlist'}
              </button>
            </div>

            {/* Similar Products in Same Category */}
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-slate)', paddingTop: '14px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--cobalt-light)', marginBottom: '10px' }}>
                Similar {selectedProduct.categoryLabel}:
              </h4>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                {similarProducts.slice(0, 6).map((sim) => (
                  <button
                    key={sim.id}
                    className="chip-btn"
                    onClick={() => setSelectedProduct(sim)}
                  >
                    {sim.title.split(' ').slice(0, 3).join(' ')} (₹{sim.salePrice.toLocaleString('en-IN')})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Product Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
          />
        ))}
      </div>
    </div>
  );
}