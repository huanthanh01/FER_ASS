import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch settings' 
    };
  }
};

export const updateSettings = async (settingsData) => {
  try {
    const response = await axios.put(`${API_URL}/settings`, settingsData);
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to update settings' 
    };
  }
};
