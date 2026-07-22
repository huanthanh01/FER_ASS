import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../constants/ThemeContext";
import { AppColors } from "../constants/colors";
import { Product } from "../models/types";
import { fetchFavoritesDB } from "../utils/database";
import { useAppContext } from "../controllers/useAppController";
import { Skeleton } from "../components/ui/Skeleton";
import { styles } from "../components/styles/shop/Favorites.styles";

export default function FavoritesScreen() {
  const { colors, isDark } = useTheme();
  const { currentUser, favoriteIds, toggleFavorite, addToCart } = useAppContext();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async (isSilent = false) => {
    if (!currentUser) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    if (!isSilent) setLoading(true);
    const result = await fetchFavoritesDB(currentUser.id);
    if (result.success && result.favorites) {
      setProducts(result.favorites);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, [currentUser, favoriteIds]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFavorites(true);
  };

  const renderProductItem = ({ item: product }: { item: Product }) => {
    const isFav = favoriteIds.includes(product._id);
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: "/product/[id]", params: { id: product._id } })}
      >
        <View style={[styles.imageContainer, { backgroundColor: isDark ? "rgba(42, 42, 42, 1)" : "#F3F2EB" }]}>
          <Image source={{ uri: product.images?.[0] }} style={styles.image} resizeMode="cover" />
          
          <TouchableOpacity 
            style={[styles.favoriteButton, { backgroundColor: isDark ? "rgba(19, 19, 19, 0.5)" : "rgba(0, 0, 0, 0.05)" }]}
            onPress={() => toggleFavorite(product._id)}
          >
            <Ionicons 
              name={isFav ? "heart" : "heart-outline"} 
              size={16} 
              color={isFav ? colors.primary : colors.text} 
            />
          </TouchableOpacity>

          {product.badge ? (
            <View style={[styles.badge, { backgroundColor: product.badgeColor || colors.primary }]}>
              <Text style={[styles.badgeText, { color: product.badgeTextColor || AppColors.white }]}>
                {product.badge}
              </Text>
            </View>
          ) : product.isFeatured ? (
            <View style={[styles.badge, { backgroundColor: "#ef4444" }]}>
              <Text style={[styles.badgeText, { color: AppColors.white }]}>
                Hot
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.brand, { color: colors.primary }]}>{product.brand}</Text>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
            {product.description}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              {product.oldPrice && <Text style={styles.oldPrice}>${product.oldPrice.toFixed(2)}</Text>}
              <Text style={[styles.price, { color: colors.text }]}>${product.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.cartButton, { backgroundColor: colors.primary }]} 
              onPress={() => addToCart(product._id, 1)}
            >
              <Ionicons name="cart" size={18} color={isDark ? "#572000" : "#ffffff"} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={[styles.card, { width: "48%", marginBottom: 16 }]}>
              <Skeleton height={200} borderRadius={0} />
              <View style={styles.cardContent}>
                <Skeleton width={60} height={12} style={{ marginBottom: 4 }} />
                <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
                <Skeleton width="80%" height={14} style={{ marginBottom: 16 }} />
                <View style={styles.footer}>
                  <Skeleton width={50} height={20} />
                  <Skeleton width={32} height={32} borderRadius={10} />
                </View>
              </View>
            </View>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-dislike-outline" size={80} color={colors.textSecondary} style={{ marginBottom: 16 }} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Your Wishlist is Empty</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Tap the heart icon on any product to save it here for later.
        </Text>
        <TouchableOpacity 
          style={[styles.exploreButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/shop")}
        >
          <Text style={styles.exploreButtonText}>Explore Products</Text>
          <Ionicons name="arrow-forward" size={18} color={isDark ? "#572000" : "#ffffff"} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Wishlist</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={loading ? [] : products}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          renderItem={renderProductItem}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </SafeAreaView>
  );
}
