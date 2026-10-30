import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNavSearch, setShowNavSearch] = useState(false);
  const [navQuery, setNavQuery] = useState('');
  const { cart, wishlist, user } = useContext(StoreContext);
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/' && window.scrollY > 230) {
        setShowNavSearch(true);
      } else {
        setShowNavSearch(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    if (!navQuery.trim()) return;
    navigate('/products', { state: { initialSearch: navQuery } });
  };

  return (
    <>
      <nav className="navbar">
        {/* Left: Brand Logo */}
        <Link to="/" className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/favicon.svg" alt="NexusGear Logo" style={{ width: '38px', height: '38px' }} />
          <div>
            <span className="blue">NEXUS</span>
            <span className="red">GEAR</span>
          </div>
        </Link>

        {/* Center/Bottom: Scroll-Activated Navbar Search */}
        {showNavSearch && (
          <form className="nav-search-form" onSubmit={handleNavSearchSubmit}>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search keyboards, mice, IEMs..."
              value={navQuery}
              onChange={(e) => setNavQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-red nav-search-btn">
              Search
            </button>
          </form>
        )}

        {/* Right (Desktop): Navigation Links */}
        <ul className="nav-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/products">Products</NavLink></li>
          <li>
            <NavLink to="/cart">
              Cart <span className="badge-count">{cartCount}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/user">
              {user ? `Hi, ${user.name.split(' ')[0]}` : 'User Account'}
              {wishlist.length > 0 && <span className="badge-count">{wishlist.length} ♥</span>}
            </NavLink>
          </li>
          <li><NavLink to="/contact">Contact Us</NavLink></li>
        </ul>

        {/* Right Corner (Mobile/Tablet): Hamburger Menu Icon */}
        <button
          className="hamburger-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open Menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Side Navigation Drawer */}
      <div
        className={`sidenav-backdrop ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside className={`sidenav-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="sidenav-header">
          <div className="brand-logo">
            <span className="blue">NEXUS</span>
            <span className="red">GEAR</span>
          </div>
          <button className="close-drawer-btn" onClick={() => setDrawerOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="sidenav-menu">
          <NavLink to="/" onClick={() => setDrawerOpen(false)} className="sidenav-link">
            <span>Home Page</span>
            <span className="sidenav-arrow">&rarr;</span>
          </NavLink>

          <NavLink to="/products" onClick={() => setDrawerOpen(false)} className="sidenav-link">
            <span>Products</span>
            <span className="sidenav-arrow">&rarr;</span>
          </NavLink>

          <NavLink to="/cart" onClick={() => setDrawerOpen(false)} className="sidenav-link">
            <span>Shopping Cart</span>
            <span className="badge-count">{cartCount}</span>
          </NavLink>

          <NavLink to="/user" onClick={() => setDrawerOpen(false)} className="sidenav-link">
            <span>User Account & Wishlist</span>
            <span className="badge-count">{wishlist.length} ♥</span>
          </NavLink>

          <NavLink to="/contact" onClick={() => setDrawerOpen(false)} className="sidenav-link">
            <span>Contact & Support</span>
            <span className="sidenav-arrow">&rarr;</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}