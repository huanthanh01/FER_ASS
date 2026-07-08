import axios from 'axios';
import { API_URL } from './config';

// ==================== REVENUE ENDPOINTS ====================

export async function getRevenue(day, month, year) {
  try {
    let url = `${API_URL}/revenue?`;
    if (year) url += `year=${year}&`;
    if (month) url += `month=${month}&`;
    if (day) url += `day=${day}&`;

    const response = await axios.get(url);
    return {
      success: true,
      totalRevenue: response.data.totalRevenue,
      orders: response.data.orders,
    };
  } catch (error) {
    if (!error.response) {
      return { success: false, error: 'Network error. Is the backend running?' };
    }
    return { success: false, error: error.response?.data?.error || 'Failed to fetch revenue.' };
  }
}
