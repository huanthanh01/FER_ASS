import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export async function getUsers(search = '') {
  try {
    const response = await axios.get(`${API_URL}/users`, { params: { search } });
    return response.data;
  } catch (error) {
    if (!error.response) return { success: false, error: 'Network error.' };
    return { success: false, error: error.response?.data?.error || 'Failed to fetch users.' };
  }
}

export async function updateUserRole(id, role) {
  try {
    const response = await axios.put(`${API_URL}/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to update user role.' };
  }
}

export async function toggleUserStatus(id) {
  try {
    const response = await axios.put(`${API_URL}/users/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to toggle user status.' };
  }
}
