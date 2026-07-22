import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Animated, Easing, useWindowDimensions } from "react-native";
import { useTheme } from "../constants/ThemeContext";
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { User } from "../models/types";
import {
  initDB,
  loginUser,
  updateUserProfileDB,
  fetchCartDB,
  addToCartDB,
  updateCartQuantityDB,
  removeFromCartDB,
  fetchFavoritesDB,
  addFavoriteDB,
  removeFavoriteDB
} from "../utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { AlertButton } from "../components/ui/CustomAlertModal";

export const AppContext = createContext<ReturnType<typeof useAppController> | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

export function useAppController() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const { colors } = useTheme();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success';
    timestamp: Date;
    read: boolean;
  }[]>([]);

  // App State
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [productRefreshKey, setProductRefreshKey] = useState(0);

  // Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    buttons?: AlertButton[];
    type?: 'success' | 'error' | 'info' | 'warning';
  }>({
    title: '',
    message: '',
  });

  const showAlert = (
    title: string,
    message: string,
    buttons?: AlertButton[],
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    setAlertConfig({ title, message, buttons, type });
    setAlertVisible(true);
  };

  const hideAlert = () => setAlertVisible(false);

  const addNotification = (title: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setNotifications(prev => [{
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
    }, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => setNotifications([]);

  // Sliding Animation Value (Auth panels)
  const animationValue = useRef(new Animated.Value(0)).current;

  // Initialize SQLite database
  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();

        // Auto-login check
        const savedUsername = await AsyncStorage.getItem("saved_username");
        const savedPassword = await AsyncStorage.getItem("saved_password");
        const savedTimestamp = await AsyncStorage.getItem("saved_timestamp");

        if (savedUsername && savedPassword) {
          const currentTime = Date.now();
          const timestamp = savedTimestamp ? parseInt(savedTimestamp, 10) : 0;
          const tenMinutesInMs = 10 * 60 * 1000;

          if (currentTime - timestamp <= tenMinutesInMs) {
            const result = await loginUser(savedUsername, savedPassword);
            if (result.success && result.user) {
              setCurrentUser(result.user);
              setIsLoggedIn(true);
              
              // Load cart for auto-logged in user
              const cartResult = await fetchCartDB(result.user.id);
              if (cartResult.success && cartResult.cart) {
                setCartItems(cartResult.cart.items);
              }
              
              // Load favorites for auto-logged in user
              const favoritesResult = await fetchFavoritesDB(result.user.id);
              if (favoritesResult.success && favoritesResult.favorites) {
                setFavoriteIds(favoritesResult.favorites.map((p: any) => p._id));
              }

              router.replace('/(tabs)' as any);
            }
          } else {
            // Session expired, clear stored credentials
            await AsyncStorage.removeItem("saved_username");
            await AsyncStorage.removeItem("saved_password");
            await AsyncStorage.removeItem("saved_timestamp");
          }
        }
      } catch (err) {
        console.error("Failed to initialize database or auto-login:", err);
      }
    };
    setup();
  }, []);

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isSignUp ? 1 : 0,
      duration: 450,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [isSignUp, animationValue]);

  const updateProfile = async (fullname: string, email: string, phoneNumber?: string) => {
    if (!currentUser) return { success: false, error: "Not logged in" };
    setIsGlobalLoading(true);
    try {
      const { updateUserProfileDB } = await import('../utils/database');
      const result = await updateUserProfileDB(currentUser.id, fullname, email, phoneNumber);
      if (result.success) {
        setCurrentUser({ ...currentUser, fullname, email, phoneNumber });
      }
      return result;
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser) return { success: false, error: "Not logged in" };
    setIsGlobalLoading(true);
    try {
      const { changeUserPasswordDB } = await import('../utils/database');
      const result = await changeUserPasswordDB(currentUser.id, currentPassword, newPassword);
      return result;
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    
    // Fetch cart on login
    const cartResult = await fetchCartDB(user.id);
    if (cartResult.success && cartResult.cart) {
      setCartItems(cartResult.cart.items);
    }

    // Fetch favorites on login
    const favoritesResult = await fetchFavoritesDB(user.id);
    if (favoritesResult.success && favoritesResult.favorites) {
      setFavoriteIds(favoritesResult.favorites.map((p: any) => p._id));
    }
    
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as any);
    }

    // Check if user needs to add phone number
    if (!user.phoneNumber) {
      setTimeout(() => {
        addNotification(
          '📱 Phone Number Required',
          'Please add your phone number in the Profile section. You need a phone number to add items to your cart and place orders.',
          'warning'
        );
      }, 1000);
    }
  };

  // ==================== CART ACTIONS ====================

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!currentUser) {
      showAlert(
        "Login Required", 
        "Please login to add items to your cart.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push('/auth' as any) }
        ],
        "warning"
      );
      return;
    }

    if (!currentUser.phoneNumber) {
      showAlert(
        "Phone Number Required",
        "Please update your phone number in your profile before adding items to your cart.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Go to Profile", onPress: () => router.push('/(tabs)/profile' as any) }
        ],
        "warning"
      );
      return;
    }
    const result = await addToCartDB(currentUser.id, productId, quantity);
    if (result.success && result.cart) {
      setCartItems(result.cart.items);
      showAlert("Success", "Item added to cart!", undefined, "success");
    } else {
      showAlert("Error", result.error || "Failed to add to cart", undefined, "error");
    }
  };

  const updateCartQuantity = async (productId: string, delta: number) => {
    if (!currentUser) return;
    const result = await updateCartQuantityDB(currentUser.id, productId, delta);
    if (result.success && result.cart) {
      setCartItems(result.cart.items);
    } else {
      showAlert("Error", result.error || "Failed to update cart", undefined, "error");
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!currentUser) return;
    const result = await removeFromCartDB(currentUser.id, productId);
    if (result.success && result.cart) {
      setCartItems(result.cart.items);
      showAlert("Thành công", "Đã xóa sản phẩm khỏi giỏ hàng", undefined, "success");
    } else {
      showAlert("Lỗi", result.error || "Không thể xóa sản phẩm", undefined, "error");
    }
  };

  const checkoutCart = async () => {
    if (!currentUser) return;
    setIsGlobalLoading(true);
    const { checkoutCartDB } = await import('../utils/database');
    const result = await checkoutCartDB(currentUser.id);
    if (result.success && result.cart) {
      setCartItems(result.cart.items);
      setProductRefreshKey(prev => prev + 1);
      showAlert("Success", "Checkout successful! Thank you for your order.", undefined, "success");
    } else {
      showAlert("Error", result.error || "Failed to checkout", undefined, "error");
    }
    setIsGlobalLoading(false);
  };

  const toggleFavorite = async (productId: string) => {
    if (!currentUser) {
      showAlert(
        "Login Required", 
        "Please login to manage your wishlist.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push('/auth' as any) }
        ],
        "warning"
      );
      return;
    }

    const isFav = favoriteIds.includes(productId);
    if (isFav) {
      // Remove favorite
      const result = await removeFavoriteDB(currentUser.id, productId);
      if (result.success) {
        setFavoriteIds(prev => prev.filter(id => id !== productId));
      } else {
        showAlert("Error", result.error || "Failed to remove from wishlist", undefined, "error");
      }
    } else {
      // Add favorite
      const result = await addFavoriteDB(currentUser.id, productId);
      if (result.success) {
        setFavoriteIds(prev => [...prev, productId]);
      } else {
        showAlert("Error", result.error || "Failed to add to wishlist", undefined, "error");
      }
    }
  };

  // ======================================================

  const handleRegisterSuccess = (fullname: string) => {
    showAlert("Registration successful! 🎉", `Welcome, ${fullname}! Please login to continue. Note: Please add your phone number in the Profile section later!`, undefined, "success");
    setIsSignUp(false);
  };

  const signInWithGoogle = async () => {
    setIsGlobalLoading(true);
    try {
      const { googleLoginDB } = await import('../utils/database');

      const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "746750664886-i7gf88m81i3g8nfpm3kpviftsu128c5f.apps.googleusercontent.com";
      const appRedirectUrl = Linking.createURL('/oauthredirect');
      const webRedirectUri = process.env.EXPO_PUBLIC_WEB_REDIRECT_URI || "https://huan-badminton-shop-fpt.loca.lt/login";
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(webRedirectUri)}&state=${encodeURIComponent(appRedirectUrl)}&scope=openid%20profile%20email&prompt=select_account`;

      console.log('Opening Auth Session with URL:', authUrl);
      const result = await WebBrowser.openAuthSessionAsync(authUrl, appRedirectUrl);
      
      if (result.type === 'success' && result.url) {
        const parsedUrl = Linking.parse(result.url);
        const accessToken = parsedUrl.queryParams?.access_token as string;
        
        if (accessToken) {
          console.log('Obtained Google Access Token:', accessToken);
          const loginResult = await googleLoginDB(accessToken);
          if (loginResult.success && loginResult.user) {
            await handleLoginSuccess(loginResult.user);
          } else {
            showAlert("Login Failed", loginResult.error || "Google Authentication failed.", undefined, "error");
          }
        } else {
          showAlert("Login Failed", "Failed to retrieve access token from Google.", undefined, "error");
        }
      }
    } catch (e: any) {
      console.error('Google Sign In Error:', e);
      showAlert("Error", "An unexpected error occurred during Google Sign In.", undefined, "error");
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const handleSocialLogin = async (platform: string) => {
    if (platform === 'Google') {
      await signInWithGoogle();
    } else {
      showAlert(
        "Feature in Development",
        `Logging in with ${platform} is currently unavailable and under development. Please use a system account!`,
        undefined,
        "info"
      );
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      setIsLoggedIn(false);
      setCurrentUser(null);
      setCartItems([]);
      setFavoriteIds([]);
      setNotifications([]);
      await AsyncStorage.removeItem("saved_username");
      await AsyncStorage.removeItem("saved_password");
      await AsyncStorage.removeItem("saved_timestamp");
      router.replace('/(tabs)' as any);
      console.log('Logout successful');
    } catch (e) {
      console.error('Logout error:', e);
      showAlert('Error', 'Failed to logout properly', undefined, 'error');
    }
  };

  // Auth Animations
  const brandTranslateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 473],
  });

  const formTranslateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -387],
  });

  const loginOpacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const loginTranslateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const registerOpacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const registerTranslateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  return {
    isLargeScreen,
    colors,
    isLoggedIn,
    isSignUp,
    setIsSignUp,
    isGlobalLoading,
    updateProfile,
    changePassword,
    currentUser,
    handleLoginSuccess,
    handleRegisterSuccess,
    handleSocialLogin,
    handleLogout,
    brandTranslateX,
    formTranslateX,
    loginOpacity,
    loginTranslateY,
    registerOpacity,
    registerTranslateY,
    cartItems,
    favoriteIds,
    toggleFavorite,
    productRefreshKey,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    checkoutCart,
    alertVisible,
    alertConfig,
    showAlert,
    hideAlert,
    notifications,
    addNotification,
    markNotificationRead,
    clearNotifications,
  };
}
