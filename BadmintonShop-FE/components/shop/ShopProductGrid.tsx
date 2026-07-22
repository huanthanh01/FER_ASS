import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, InteractionManager, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { AppColors } from '../../constants/colors';
import { useTheme } from '../../constants/ThemeContext';
import { styles } from '../styles/shop/ShopProductGrid.styles';
import { Product } from '../../models/types';
import { getProducts } from '../../utils/database';
import { useAppContext } from '../../controllers/useAppController';

import { Skeleton } from '../ui/Skeleton';
import { CategorySidebar } from './CategorySidebar';
import { SortingInfo, SortOrder } from './SortingInfo';

const getPaginationItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

interface ShopProductGridProps {
  searchQuery?: string;
  initialCategory?: string;
}

export const ShopProductGrid = ({ searchQuery = '', initialCategory = 'All' }: ShopProductGridProps = {}) => {
  const { colors, isDark } = useTheme();
  const { transition } = useLocalSearchParams<{ transition?: string }>();
  const { addToCart, productRefreshKey } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    if (initialCategory && initialCategory !== activeCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const fetchProducts = async (pageNum: number) => {
    setLoading(true);

    const result = await getProducts(false, pageNum, 10, activeCategory, searchQuery, sortOrder);
    
    if (result.success && result.products) {
      setProducts(result.products);
      setTotalPages(result.totalPages || 1);
      setPage(result.currentPage || 1);
      setTotalProducts(result.totalProducts || 0);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const interaction = InteractionManager.runAfterInteractions(() => {
      fetchProducts(1);
    });
    return () => interaction.cancel();
  }, [activeCategory, searchQuery, sortOrder, productRefreshKey]);

  const handlePrevPage = () => {
    if (page > 1) fetchProducts(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) fetchProducts(page + 1);
  };



  const renderItem = ({ item: product }: { item: Product }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]} 
      activeOpacity={0.9}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product._id } })}
    >
      <View style={[styles.imageContainer, { backgroundColor: isDark ? 'rgba(42, 42, 42, 1)' : '#F3F2EB' }]}>
        <Image source={{ uri: product.images?.[0] }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity style={[styles.favoriteButton, { backgroundColor: isDark ? 'rgba(19, 19, 19, 0.5)' : 'rgba(0, 0, 0, 0.05)' }]}>
          <Ionicons name="heart-outline" size={16} color={colors.text} />
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
        <Text style={[styles.brand, { color: colors.primary }]}>{product.brand}</Text>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{product.name}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>{product.description}</Text>
        <Text style={{ fontSize: 12, color: (product.stock && product.stock > 0) ? colors.primary : '#ef4444', marginTop: 6, fontWeight: '600' }}>
          {product.stock && product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
        </Text>
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            {product.oldPrice && <Text style={styles.oldPrice}>${product.oldPrice.toFixed(2)}</Text>}
            <Text style={[styles.price, { color: colors.text }]}>${product.price.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={[styles.cartButton, { backgroundColor: colors.primary }]} onPress={() => addToCart(product._id, 1)}>
            <Ionicons name="cart" size={20} color={isDark ? '#572000' : '#ffffff'} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={[styles.card, { width: '48%', marginBottom: 16, marginRight: 0 }]}>
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
        <Text style={{ color: '#666' }}>No products found.</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <FlatList
        data={loading ? [] : products}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        contentContainerStyle={styles.container}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SortingInfo 
            totalProducts={totalProducts} 
            sortOrder={sortOrder} 
            onSortChange={setSortOrder} 
          />
        }
        ListEmptyComponent={renderEmpty}
        renderItem={renderItem}
        ListFooterComponent={
          products.length > 0 && totalPages > 1 ? (
            <View style={{ paddingVertical: 20, alignItems: 'center', marginTop: 10, marginBottom: 80 }}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' }}
              >
                {getPaginationItems(page, totalPages).map((p, index) => (
                  <TouchableOpacity
                    key={`${p}-${index}`}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: page === p ? colors.primary : (p === '...' ? 'transparent' : (isDark ? '#232325' : '#e5e7eb')),
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 4
                    }}
                    onPress={() => {
                      if (typeof p === 'number') fetchProducts(p);
                    }}
                    disabled={p === '...'}
                  >
                    <Text style={{
                      color: page === p ? '#fff' : colors.textSecondary,
                      fontWeight: 'bold',
                      fontSize: 16
                    }}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : <View style={{ height: 100 }} />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[fabStyles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setSidebarVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="filter" size={22} color="#fff" />
        {activeCategory !== 'All' && (
          <View style={fabStyles.badge}>
            <View style={fabStyles.badgeDot} />
          </View>
        )}
      </TouchableOpacity>

      {/* Category Sidebar */}
      <CategorySidebar
        visible={sidebarVisible}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onClose={() => setSidebarVisible(false)}
      />
    </View>
  );
};

const fabStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});
