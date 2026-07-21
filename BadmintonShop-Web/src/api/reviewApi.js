import axios from 'axios';

// Get base URL from environment or fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all reviews for a given product
 * @param {string} productId 
 * @returns {Promise<{success: boolean, reviews: Array, error?: string}>}
 */
export const fetchReviews = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Could not connect to server' 
    };
  }
};

/**
 * Submit a new review or update an existing review for a product
 * @param {string} productId 
 * @param {string} userId 
 * @param {number} rating 
 * @param {string} comment 
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const submitReview = async (productId, userId, rating, comment) => {
  try {
    const response = await axios.post(`${API_URL}/products/${productId}/reviews`, {
      userId,
      rating,
      comment
    });
    return response.data;
  } catch (error) {
    console.error('Failed to submit review:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to submit review' 
    };
  }
};
