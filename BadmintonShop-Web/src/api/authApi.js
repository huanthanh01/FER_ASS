import axios from 'axios';
import { API_URL } from './config';

// ==================== USER AUTHENTICATION ====================

export async function registerUser(fullname, email, username, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      fullname, email, username, password,
    });
    return { success: true, user: response.data.user };
  } catch (error) {
    const msg = error.response?.data?.error || 'Registration failed. Please try again.';
    return { success: false, error: msg };
  }
}

export async function loginUser(username, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username, password,
    });
    return { success: true, user: response.data.user };
  } catch (error) {
    if (!error.response) {
      return { success: false, error: 'Network error. Is the backend running at ' + API_URL + '?' };
    }
    const msg = error.response?.data?.error || 'Invalid username or password';
    return { success: false, error: msg };
  }
}

export async function adminLogin(username, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/admin-login`, {
      username, password,
    });
    return { success: true, user: response.data.user };
  } catch (error) {
    if (!error.response) {
      return { success: false, error: 'Network error. Is the backend running at ' + API_URL + '?' };
    }
    const msg = error.response?.data?.error || 'Invalid admin credentials';
    return { success: false, error: msg };
  }
}

export async function updateUserProfile(userId, fullname, email, phoneNumber) {
  try {
    await axios.put(`${API_URL}/auth/profile/${userId}`, {
      fullname, email, phoneNumber,
    });
    return { success: true };
  } catch (error) {
    const msg = error.response?.data?.error || 'Failed to update profile.';
    return { success: false, error: msg };
  }
}

export async function changeUserPassword(userId, currentPassword, newPassword) {
  try {
    await axios.put(`${API_URL}/auth/password/${userId}`, {
      currentPassword, newPassword,
    });
    return { success: true };
  } catch (error) {
    if (!error.response) {
      return { success: false, error: 'Network error. Is the backend running?' };
    }
    const msg = error.response?.data?.error || 'Failed to change password.';
    return { success: false, error: msg };
  }
}

export async function verifyResetPassword(username, phoneNumber) {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-reset-password`, {
      username, phoneNumber,
    });
    return { success: response.data.success };
  } catch (error) {
    const msg = error.response?.data?.error || 'Verification failed.';
    return { success: false, error: msg };
  }
}

export async function resetPassword(username, newPassword) {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      username, newPassword,
    });
    return { success: response.data.success };
  } catch (error) {
    const msg = error.response?.data?.error || 'Reset failed.';
    return { success: false, error: msg };
  }
}
