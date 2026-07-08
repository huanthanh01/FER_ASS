import axios from 'axios';
import { API_URL } from './config';

// ==================== CART ENDPOINTS ====================

export async function fetchCart(userId) {
  try {
    const response = await axios.get(`${API_URL}/cart/${userId}`);
    return { success: true, cart: response.data.cart };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch cart' };
  }
}

export async function addToCartAPI(userId, productId, quantity) {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, {
      userId, productId, quantity,
    });
    return { success: true, cart: response.data.cart };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to add to cart' };
  }
}

export async function updateCartQuantityAPI(userId, productId, delta) {
  try {
    const response = await axios.post(`${API_URL}/cart/update`, {
      userId, productId, delta,
    });
    return { success: true, cart: response.data.cart };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to update cart' };
  }
}

export async function removeFromCartAPI(userId, productId) {
  try {
    const response = await axios.post(`${API_URL}/cart/remove`, {
      userId, productId,
    });
    return { success: true, cart: response.data.cart };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to remove from cart' };
  }
}

export async function checkoutCartAPI(userId) {
  try {
    const response = await axios.post(`${API_URL}/cart/checkout`, { userId });
    return { success: true, cart: response.data.cart };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to checkout' };
  }
}
