import axios from 'axios';
import { getApiUrl } from './database';
const API_URL = getApiUrl();
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUserReport() {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const res = await axios.get(`${API_URL}/reports/my-report`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return { success: false, error: error.response.data.error };
    }
    return { success: false, error: 'Failed to fetch report' };
  }
}
