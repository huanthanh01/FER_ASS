import axios from "axios";
import { User, Product, Review } from "../models/types";
import { Platform } from "react-native";

import Constants from "expo-constants";

// Dynamically determine the API URL based on the environment
export const getApiUrl = () => {
  if (Platform.OS === "web") {
    return "http://localhost:5000/api";
  }

  // Try to get the IP from Expo Constants (works in Expo Go)
  // Tính năng này rất hay: Nó sẽ tự lấy IP Wi-Fi của máy tính đang chạy frontend!
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(":")[0];
    return `http://${ip}:5000/api`;
  }

  // Fallback to ngrok nếu bạn muốn hardcode
  // return 'https://backrest-refund-yeast.ngrok-free.dev/api';

  // Fallback to the current known IP
  return "http://192.168.1.25:5000/api";
};

const API_URL = getApiUrl();

// ==================== DATABASE INITIALIZATION ====================

export async function initDB(): Promise<void> {
  // No longer needed as we use MongoDB backend, but kept to prevent breaking existing calls
  return Promise.resolve();
}

// ==================== USER AUTHENTICATION ====================

export async function registerUser(
  fullname: string,
  email: string,
  username: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      fullname,
      email,
      username,
      password,
    });

    return {
      success: true,
      user: response.data.user,
    };
  } catch (error: any) {
    const msg =
      error.response?.data?.error || "Registration failed. Please try again.";
    return { success: false, error: msg };
  }
}

export async function loginUser(
  username: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });

    return {
      success: true,
      user: response.data.user,
    };
  } catch (error: any) {
    if (!error.response) {
      console.log("Network error in login:", error.message);
      return {
        success: false,
        error: "Network error. Is the backend running at " + API_URL + "?",
      };
    }
    const msg = error.response?.data?.error || "Invalid username or password";
    return { success: false, error: msg };
  }
}

export async function updateUserProfileDB(
  userId: string, // MongoDB uses string ObjectId usually, wait, it was number before. We'll typecast.
  fullname: string,
  email: string,
  phoneNumber?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await axios.put(`${API_URL}/auth/profile/${userId}`, {
      fullname,
      email,
      phoneNumber
    });
    return { success: true };
  } catch (error: any) {
    const msg =
      error.response?.data?.error ||
      "Failed to update profile. Please try again.";
    return { success: false, error: msg };
  }
}

export async function changeUserPasswordDB(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await axios.put(`${API_URL}/auth/password/${userId}`, {
      currentPassword,
      newPassword,
    });
    return { success: true };
  } catch (error: any) {
    if (!error.response) {
      return {
        success: false,
        error: "Network error. Is the backend running?",
      };
    }
    const msg =
      error.response?.data?.error ||
      "Failed to change password. Please try again.";
    return { success: false, error: msg };
  }
}

// ==================== PRODUCT ENDPOINTS ====================

export async function getProducts(
  isFeatured?: boolean,
  page: number = 1,
  limit: number = 10,
  category?: string,
  search?: string,
  sortOrder?: string
): Promise<{
  success: boolean;
  error?: string;
  products?: Product[];
  totalPages?: number;
  currentPage?: number;
  totalProducts?: number;
}> {
  try {
    let url = `${API_URL}/products?page=${page}&limit=${limit}`;
    if (isFeatured) {
      url += `&isFeatured=true`;
    }
    if (category && category !== 'All') {
      url += `&category=${encodeURIComponent(category)}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${encodeURIComponent(sortOrder)}`;
    }
    
    const response = await axios.get(url);
    return {
      success: true,
      products: response.data.products,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
      totalProducts: response.data.totalProducts,
    };
  } catch (error: any) {
    if (!error.response) {
      return {
        success: false,
        error: "Network error. Is the backend running?",
      };
    }
    const msg = error.response?.data?.error || "Failed to fetch products.";
    return { success: false, error: msg };
  }
}

export async function getProductById(
  id: string,
): Promise<{ success: boolean; error?: string; product?: Product }> {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return { success: true, product: response.data.product };
  } catch (error: any) {
    if (!error.response) {
      return {
        success: false,
        error: "Network error. Is the backend running?",
      };
    }
    const msg =
      error.response?.data?.error || "Failed to fetch product details.";
    return { success: false, error: msg };
  }
}

export async function createProduct(
  productData: Partial<Product>,
): Promise<{ success: boolean; error?: string; product?: Product }> {
  try {
    const response = await axios.post(`${API_URL}/products`, productData);
    return { success: true, product: response.data.product };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to create product.",
    };
  }
}

export async function updateProduct(
  id: string,
  productData: Partial<Product>,
): Promise<{ success: boolean; error?: string; product?: Product }> {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, productData);
    return { success: true, product: response.data.product };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to update product.",
    };
  }
}

export async function deleteProduct(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await axios.delete(`${API_URL}/products/${id}`);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to delete product.",
    };
  }
}

export async function getProductReviews(
  productId: string,
): Promise<{ success: boolean; error?: string; reviews?: Review[] }> {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}/reviews`);
    return { success: true, reviews: response.data.reviews };
  } catch (error: any) {
    if (!error.response) {
      return { success: false, error: "Network error. Is the backend running?" };
    }
    return { success: false, error: error.response?.data?.error || "Failed to fetch reviews." };
  }
}

export async function createProductReview(
  productId: string,
  userId: string,
  rating: number,
  comment: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const response = await axios.post(`${API_URL}/products/${productId}/reviews`, {
      userId,
      rating,
      comment
    });
    return { success: true, message: response.data.message };
  } catch (error: any) {
    if (!error.response) {
      return { success: false, error: "Network error. Is the backend running?" };
    }
    return { success: false, error: error.response?.data?.error || "Failed to submit review." };
  }
}

// ==================== CART ENDPOINTS ====================

export async function fetchCartDB(
  userId: string,
): Promise<{ success: boolean; error?: string; cart?: any }> {
  try {
    const response = await axios.get(`${API_URL}/cart/${userId}`);
    return { success: true, cart: response.data.cart };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch cart",
    };
  }
}

export async function addToCartDB(
  userId: string,
  productId: string,
  quantity: number,
): Promise<{ success: boolean; error?: string; cart?: any }> {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, {
      userId,
      productId,
      quantity,
    });
    return { success: true, cart: response.data.cart };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to add to cart",
    };
  }
}

export async function updateCartQuantityDB(
  userId: string,
  productId: string,
  delta: number,
): Promise<{ success: boolean; error?: string; cart?: any }> {
  try {
    const response = await axios.post(`${API_URL}/cart/update`, {
      userId,
      productId,
      delta,
    });
    return { success: true, cart: response.data.cart };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to update cart",
    };
  }
}

export async function removeFromCartDB(
  userId: string,
  productId: string,
): Promise<{ success: boolean; error?: string; cart?: any }> {
  try {
    const response = await axios.post(`${API_URL}/cart/remove`, {
      userId,
      productId,
    });
    return { success: true, cart: response.data.cart };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to remove from cart",
    };
  }
}

export async function checkoutCartDB(
  userId: string,
): Promise<{ success: boolean; error?: string; cart?: any }> {
  try {
    const response = await axios.post(`${API_URL}/cart/checkout`, { userId });
    return { success: true, cart: response.data.cart };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to checkout",
    };
  }
}

// ==================== FORGOT PASSWORD (MOCK FOR NOW) ====================

export async function verifyUserAccount(
  username: string,
  email: string,
): Promise<{ success: boolean; error?: string; userId?: string }> {
  // Not implemented on backend yet, returning generic response or we could implement it
  return { success: false, error: "Feature in development" };
}

export async function resetUserPassword(
  userId: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: "Feature in development" };
}

export async function clearAllDataDB(): Promise<void> {
  // Should ideally call an endpoint to drop db, ignoring for now.
  return Promise.resolve();
}

// ==================== REVENUE ENDPOINTS ====================

export async function getRevenue(
  day?: string,
  month?: string,
  year?: string,
): Promise<{
  success: boolean;
  error?: string;
  totalRevenue?: number;
  orders?: any[];
}> {
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
  } catch (error: any) {
    if (!error.response) {
      return {
        success: false,
        error: "Network error. Is the backend running?",
      };
    }
    const msg = error.response?.data?.error || "Failed to fetch revenue.";
    return { success: false, error: msg };
  }
}
