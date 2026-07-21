import axios from 'axios';
import { API_URL } from './config';

export async function getUserReport(token) {
  try {
    const res = await axios.get(`${API_URL}/reports/my-report`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { success: false, error: error.response.data.error };
    }
    return { success: false, error: 'Failed to fetch report' };
  }
}

export async function getAllReports(token) {
  try {
    const res = await axios.get(`${API_URL}/reports`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { success: false, error: error.response.data.error };
    }
    return { success: false, error: 'Failed to fetch reports' };
  }
}

export async function getAdminReport(userId, token) {
  try {
    const res = await axios.get(`${API_URL}/reports/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { success: false, error: error.response.data.error };
    }
    return { success: false, error: 'Failed to fetch user report' };
  }
}
