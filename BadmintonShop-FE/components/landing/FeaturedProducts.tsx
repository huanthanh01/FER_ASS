import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  InteractionManager,
} from "react-native";
import { router } from "expo-router";
import { styles } from "../styles/landing/FeaturedProducts.styles";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../../constants/colors";
import { useTheme } from "../../constants/ThemeContext";
import { Product } from "../../models/types";
import { getProducts } from "../../utils/database";
import { useAppContext } from "../../controllers/useAppController";
import { Skeleton } from "../ui/Skeleton";
import { AnimatedButton } from "../ui/AnimatedButton";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

export const FeaturedProducts = () => {
  const { addToCart, productRefreshKey } = useAppContext();
  const { colors, isDark } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(4, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const result = await getProducts(true); // true = isFeatured
      if (result.success && result.products) {
        setProducts(result.products);
      }
      setLoading(false);
    };

    setLoading(true);
    const interaction = InteractionManager.runAfterInteractions(() => {
      fetchFeaturedProducts();
    });
    return () => interaction.cancel();
  }, [productRefreshKey]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>RECOMMEND PRODUCTS</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Some impressive products for you.</Text>
        </View>
        <AnimatedButton 
          style={styles.viewAllContainer}
          onPress={() => router.push({ pathname: '/shop', params: { category: 'All', transition: Date.now().toString() } })}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>VIEW ALL</Text>
          <Animated.View style={animatedArrowStyle}>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={colors.primary}
            />
          </Animated.View>
        </AnimatedButton>
      </View>

      {loading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {[1, 2, 3].map((item) => (
            <View key={item} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Skeleton height={250} borderRadius={0} />
              <View style={styles.cardContent}>
                <Skeleton width={80} height={12} style={{ marginBottom: 4 }} />
                <Skeleton width={180} height={20} style={{ marginBottom: 8 }} />
                <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
                <Skeleton width="80%" height={14} style={{ marginBottom: 16 }} />
                <View style={styles.footer}>
                  <Skeleton width={60} height={24} />
                  <Skeleton width={40} height={40} borderRadius={12} />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {products.map((product) => (
            <TouchableOpacity
              key={product._id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: { id: product._id },
                })
              }
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: product.images?.[0] }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity style={[styles.favoriteButton, { backgroundColor: isDark ? 'rgba(20,20,20,0.8)' : 'rgba(240,240,240,0.8)' }]}>
                  <Ionicons
                    name="heart-outline"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                {product.badge ? (
                  <View style={[styles.badge, { backgroundColor: product.badgeColor || colors.primary }]}>
                    <Text style={[styles.badgeText, { color: product.badgeTextColor || AppColors.white }]}>
                      {product.badge}
                    </Text>
                  </View>
                ) : product.isFeatured ? (
                  <View style={[styles.badge, { backgroundColor: '#ef4444' }]}>
                    <Text style={[styles.badgeText, { color: AppColors.white }]}>
                      Hot
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.brand, { color: colors.textSecondary }]}>{product.brand}</Text>
                <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                  {product.description}
                </Text>
                <Text style={{ fontSize: 12, color: (product.stock && product.stock > 0) ? colors.primary : '#ef4444', marginTop: 6, fontWeight: '600' }}>
                  {product.stock && product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                </Text>
                <View style={styles.footer}>
                  <Text style={[styles.price, { color: colors.primary }]}>${product.price.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={[styles.cartButton, { backgroundColor: colors.primary }]}
                    onPress={() => addToCart(product._id, 1)}
                  >
                    <Ionicons
                      name="cart-outline"
                      size={20}
                      color={AppColors.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
