import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart, wishlist, toggleWishlist } = useContext(StoreContext);
  const navigate = useNavigate();
  const isLiked = wishlist.some((item) => item.id === product.id);

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/products', { state: { selectedProduct: product } });
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate('/checkout', { state: { directBuyItem: { ...product, qty: 1 } } });
  };

  return (
    <div className="product-card">
      <span className="sale-ribbon">-{product.discountPercent}% OFF</span>
      <button
        className={`wishlist-heart ${isLiked ? 'liked' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        title="Add to Wishlist"
      >
        ♥
      </button>

      <div className="card-img-wrap" onClick={handleCardClick}>
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      <div>
        <div className="cat-tag-label">{product.category}</div>
        <h4 className="card-title" onClick={handleCardClick}>
          {product.title}
        </h4>
        <div style={{ fontSize: '0.8rem', color: '#facc15', marginBottom: '6px' }}>
          ★ {product.rating} <span style={{ color: '#94a3b8' }}>({product.reviews})</span>
        </div>
        <div className="price-row">
          <span className="sale-price">₹{product.salePrice.toLocaleString('en-IN')}</span>
          <span className="original-price">₹{product.price.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="btn btn-blue"
          style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
        >
          + Cart
        </button>
        <button
          className="btn btn-red"
          style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}