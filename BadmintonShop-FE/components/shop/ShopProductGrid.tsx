import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, InteractionManager, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { AppColors } from '../../constants/colors';
import { styles } from '../styles/shop/ShopProductGrid.styles';
import { Product } from '../../models/types';
import { getProducts } from '../../utils/database';
import { useAppContext } from '../../controllers/useAppController';

import { Skeleton } from '../ui/Skeleton';
import { CategorySidebar } from './CategorySidebar';
import { SortingInfo, SortOrder } from './SortingInfo';

interface ShopProductGridProps {
  searchQuery?: string;
  initialCategory?: string;
}

export const ShopProductGrid = ({ searchQuery = '', initialCategory = 'All' }: ShopProductGridProps = {}) => {
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
      style={styles.card} 
      activeOpacity={0.9}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product._id } })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.images?.[0] }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={16} color={AppColors.white} />
        </TouchableOpacity>
        {product.badge && (
          <View style={[styles.badge, { backgroundColor: product.badgeColor || AppColors.primaryOrange }]}>
            <Text style={[styles.badgeText, { color: product.badgeTextColor || AppColors.white }]}>
              {product.badge}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={1}>{product.description}</Text>
        <Text style={{ fontSize: 12, color: '#f59e0b', marginTop: 6, fontWeight: '600' }}>
          {product.stock && product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
        </Text>
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            {product.oldPrice && <Text style={styles.oldPrice}>${product.oldPrice.toFixed(2)}</Text>}
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.cartButton} onPress={() => addToCart(product._id, 1)}>
            <Ionicons name="cart" size={20} color={'#572000'} />
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
          products.length > 0 ? (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 20,
              paddingHorizontal: 8,
              marginTop: 10
            }}>
              <TouchableOpacity 
                style={[
                  { flexDirection: 'row', alignItems: 'center', backgroundColor: AppColors.primaryOrange, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
                  page === 1 && { backgroundColor: '#ddd' }
                ]} 
                onPress={handlePrevPage}
                disabled={page === 1}
              >
                <Ionicons name="chevron-back" size={20} color={page === 1 ? '#999' : '#fff'} />
                <Text style={[{ color: '#fff', fontWeight: '600', fontSize: 14, marginHorizontal: 4 }, page === 1 && { color: '#999' }]}>Prev</Text>
              </TouchableOpacity>
              
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666' }}>Page {page} of {totalPages}</Text>
              
              <TouchableOpacity 
                style={[
                  { flexDirection: 'row', alignItems: 'center', backgroundColor: AppColors.primaryOrange, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
                  page >= totalPages && { backgroundColor: '#ddd' }
                ]} 
                onPress={handleNextPage}
                disabled={page >= totalPages}
              >
                <Text style={[{ color: '#fff', fontWeight: '600', fontSize: 14, marginHorizontal: 4 }, page >= totalPages && { color: '#999' }]}>Next</Text>
                <Ionicons name="chevron-forward" size={20} color={page >= totalPages ? '#999' : '#fff'} />
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={fabStyles.fab}
        onPress={() => setSidebarVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="filter" size={22} color={AppColors.white} />
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
    borderColor: AppColors.primaryOrange,
  },
});
