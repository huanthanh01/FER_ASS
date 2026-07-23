import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineClipboardList, HiOutlineShoppingBag } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getUserOrders } from '../api/orderApi';
import { useAppContext } from '../context/AppContext';
import '../styles/OrdersPage.css';

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const getProductImage = (product) => {
  if (product?.images?.length > 0) return product.images[0];
  return product?.imageUrl || 'https://via.placeholder.com/96x96?text=No+Image';
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useMemo(() => currentUser?.id || currentUser?._id || '', [currentUser]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadOrders = async () => {
      setIsLoading(true);
      const result = await getUserOrders(userId);
      if (result.success) {
        setOrders(result.orders || []);
      } else {
        toast.error(result.error, { toastId: 'orders-fetch-error' });
      }
      setIsLoading(false);
    };

    loadOrders();
  }, [isLoggedIn, navigate, userId]);

  return (
    <div className="orders-page page-container">
      <div className="orders-page-header">
        <div>
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">Review your checkout history and purchased items.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/shop')}>
          <HiOutlineShoppingBag /> Continue Shopping
        </button>
      </div>

      {isLoading ? (
        <div className="orders-state glass">
          <div className="loading-spinner"></div>
          <span>Loading your orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-state glass">
          <HiOutlineClipboardList size={48} />
          <h2>No orders yet</h2>
          <p>Your completed checkouts will appear here.</p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card glass" key={order._id}>
              <div className="order-card-header">
                <div>
                  <span className="order-label">Order</span>
                  <h2>#{String(order._id).slice(0, 8).toUpperCase()}</h2>
                </div>
                <div className="order-meta">
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                  <strong>{formatCurrency(order.totalAmount)}</strong>
                </div>
              </div>

              <div className="order-items">
                {order.items?.map((item) => (
                  <div className="order-item" key={`${order._id}-${item.product?._id || item.product}-${item.quantity}`}>
                    <img src={getProductImage(item.product)} alt={item.product?.name || 'Product'} />
                    <div className="order-item-info">
                      <h3>{item.product?.name || 'Product unavailable'}</h3>
                      <span>Qty {item.quantity} x {formatCurrency(item.priceAtPurchase)}</span>
                    </div>
                    <strong>{formatCurrency((item.priceAtPurchase || 0) * (item.quantity || 0))}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
