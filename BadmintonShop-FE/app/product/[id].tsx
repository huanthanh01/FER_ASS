import React, { useEffect, useState } from 'react';
import { Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../../constants/colors';
import { useTheme } from '../../constants/ThemeContext';
import { Product, Review } from '../../models/types';
import { getProductById, getProductReviews, createProductReview } from '../../utils/database';
import { useAppContext } from '../../controllers/useAppController';
import { styles } from '../../components/styles/details/ProductDetails.styles';

// Import components
import { ProductDetailsHeader } from '../../components/details/ProductDetailsHeader';
import { ProductImage } from '../../components/details/ProductImage';
import { ProductInfo } from '../../components/details/ProductInfo';
import { ProductReviews } from '../../components/details/ProductReviews';
import { ProductBottomBar } from '../../components/details/ProductBottomBar';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const { addToCart, currentUser, isLoggedIn } = useAppContext();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (id) {
        const result = await getProductById(id);
        if (result.success && result.product) {
          setProduct(result.product);
        }
        
        const reviewsRes = await getProductReviews(id);
        if (reviewsRes.success && reviewsRes.reviews) {
          setReviews(reviewsRes.reviews);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product._id, quantity);
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!currentUser || !isLoggedIn) {
      alert("Please login to submit a review");
      return false;
    }
    
    setIsSubmittingReview(true);
    const res = await createProductReview(id as string, currentUser.id, rating, comment);
    
    if (res.success) {
      alert("Review submitted successfully");
      
      // Refresh product data
      const prodRes = await getProductById(id as string);
      if (prodRes.success && prodRes.product) setProduct(prodRes.product);
      
      // Refresh reviews
      const revRes = await getProductReviews(id as string);
      if (revRes.success && revRes.reviews) setReviews(revRes.reviews);
      setIsSubmittingReview(false);
      return true;
    } else {
      alert(res.error || "Failed to submit review");
      setIsSubmittingReview(false);
      return false;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={AppColors.primaryOrange} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Product not found.</Text>
        <TouchableOpacity style={styles.backButtonCenter} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ProductDetailsHeader colors={colors} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ProductImage product={product} />
        <ProductInfo product={product} colors={colors} />
        <ProductReviews 
          productId={id}
          reviews={reviews}
          colors={colors}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onSubmitReview={handleReviewSubmit}
          isSubmitting={isSubmittingReview}
        />
      </ScrollView>

      <ProductBottomBar 
        quantity={quantity}
        setQuantity={setQuantity}
        handleAddToCart={handleAddToCart}
        colors={colors}
      />
    </SafeAreaView>
  );
}
