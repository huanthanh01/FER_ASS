import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { styles } from '../components/styles/profile/Orders.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../constants/ThemeContext';
import { useAppContext } from '../controllers/useAppController';
import { getUserOrdersDB } from '../utils/database';
import { AppColors } from '../constants/colors';

export default function OrderHistoryScreen() {
  const { colors, isDark } = useTheme();
  const { currentUser } = useAppContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isSilent = false) => {
    if (!currentUser) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    if (!isSilent) setLoading(true);
    const result = await getUserOrdersDB(currentUser.id);
    if (result.success && result.orders) {
      // Sort orders by newest first
      const sorted = result.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setProducts(sorted);
    }
    setLoading(false);
    setRefreshing(false);
  };

  // Helper setProducts since variable was named sorted
  const setProducts = (sortedOrders: any[]) => {
    setOrders(sortedOrders);
  }

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#eab308';
      case 'Completed': return '#22c55e';
      case 'Cancelled': return '#ef4444';
      default: return colors.textSecondary;
    }
  };

  const mutedColor = isDark ? AppColors.textMutedDark : AppColors.textMutedLight;
  const cardBg = isDark ? AppColors.cardDark : AppColors.white;
  const cardBorder = isDark ? AppColors.borderDark : AppColors.borderLight;

  const renderOrderItem = ({ item: order }: { item: any }) => (
    <View style={[styles.orderCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      <View style={styles.orderHeader}>
        <Text style={[styles.orderId, { color: colors.text }]}>Order #{order._id.slice(-6).toUpperCase()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
          <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>{order.status}</Text>
        </View>
      </View>
      <Text style={[styles.orderDate, { color: mutedColor }]}>
        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      
      <View style={styles.itemsList}>
        {order.items.map((item: any, idx: number) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={[styles.itemText, { color: colors.textSecondary, flex: 1 }]} numberOfLines={1}>
              {item.product?.name || 'Unknown Product'}
            </Text>
            <Text style={[styles.itemQty, { color: mutedColor }]}>
              Qty: {item.quantity}
            </Text>
            <Text style={[styles.itemPrice, { color: colors.text }]}>
              ${(item.priceAtPurchase || item.product?.price || 0).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.orderFooter, { borderTopColor: cardBorder }]}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
        <Text style={[styles.totalAmount, { color: colors.primary }]}>
          ${(order.totalAmount || 0).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={80} color={colors.textSecondary} style={{ marginBottom: 16 }} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Orders Found</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          You haven't placed any orders yet. Go back to shop and find something you like!
        </Text>
        <TouchableOpacity 
          style={[styles.exploreButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/shop')}
        >
          <Text style={styles.exploreButtonText}>Shop Now</Text>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order History</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={loading ? [] : orders}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          renderItem={renderOrderItem}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </SafeAreaView>
  );
}
