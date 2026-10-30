import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('em_cart_inr')) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('em_wish_inr')) || []);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('em_user_inr')) || null);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('em_orders_inr')) || []);
  const [toast, setToast] = useState(null);

  useEffect(() => localStorage.setItem('em_cart_inr', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('em_wish_inr', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('em_user_inr', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('em_orders_inr', JSON.stringify(orders)), [orders]);

  // Fetch user's cloud orders from MongoDB when logged in
  useEffect(() => {
    if (user?.email) {
      fetch(`${API_BASE_URL}/api/orders/${user.email}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setOrders(data);
        })
        .catch(() => {});
    }
  }, [user]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
    showToast(`Added "${product.title}" to Cart!`);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from Cart.');
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        showToast('Removed from Wishlist');
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Saved "${product.title}" to Wishlist ♥`);
        return [...prev, product];
      }
    });
  };

  const placeNewOrder = ({ items, addressDetails, paymentMethod, subtotal, deliveryCharge, codFee, finalTotal }) => {
    const randomOrderId = `ORD-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-5)}`;
    const newOrder = {
      orderId: randomOrderId,
      userEmail: user?.email || 'guest@nexusgear.in',
      items,
      subtotal,
      deliveryCharge,
      codFee,
      totalAmount: finalTotal,
      addressDetails,
      paymentMethod,
      placedAt: new Date().toLocaleString('en-IN')
    };

    // Save locally immediately and sync to MongoDB in the background
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);

    fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch((err) => console.error('Order sync error:', err));

    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        user,
        setUser,
        orders,
        toast,
        showToast,
        addToCart,
        updateCartQty,
        removeFromCart,
        toggleWishlist,
        placeNewOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};