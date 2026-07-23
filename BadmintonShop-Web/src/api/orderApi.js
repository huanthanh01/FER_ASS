import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getOrders = async (searchQuery = '') => {
  try {
    const url = `${API_URL}/orders${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch orders' 
    };
  }
};

export const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch your orders'
    };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to update order status' 
    };
  }
};
