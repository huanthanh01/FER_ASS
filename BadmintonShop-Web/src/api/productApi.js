import axios from 'axios';
import { API_URL } from './config';

// ==================== PRODUCT ENDPOINTS ====================

export async function getProducts(isFeatured, page = 1, limit = 10, category, search, sortOrder) {
  try {
    let url = `${API_URL}/products?page=${page}&limit=${limit}`;
    if (isFeatured) url += '&isFeatured=true';
    if (category && category !== 'All') url += `&category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (sortOrder) url += `&sortOrder=${encodeURIComponent(sortOrder)}`;

    const response = await axios.get(url);
    return {
      success: true,
      products: response.data.products,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
      totalProducts: response.data.totalProducts,
    };
  } catch (error) {
    if (!error.response) {
      return { success: false, error: 'Network error. Is the backend running?' };
    }
    return { success: false, error: error.response?.data?.error || 'Failed to fetch products.' };
  }
}

export async function getCategories() {
  try {
    const response = await axios.get(`${API_URL}/products/categories`);
    return { success: true, categories: response.data.categories || [] };
  } catch (error) {
    if (!error.response) {
      return { success: false, error: 'Network error. Is the backend running?' };
    }
    return { success: false, error: error.response?.data?.error || 'Failed to fetch categories.' };
  }
}

export async function getProductById(id) {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return { success: true, product: response.data.product };
  } catch (error) {
    if (!error.response) {
      return { success: false, error: 'Network error. Is the backend running?' };
    }
    return { success: false, error: error.response?.data?.error || 'Failed to fetch product.' };
  }
}

export async function createProduct(productData) {
  try {
    const response = await axios.post(`${API_URL}/products`, productData);
    return { success: true, product: response.data.product };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to create product.' };
  }
}

export async function updateProduct(id, productData) {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, productData);
    return { success: true, product: response.data.product };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to update product.' };
  }
}

export async function deleteProduct(id) {
  try {
    await axios.delete(`${API_URL}/products/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to delete product.' };
  }
}
