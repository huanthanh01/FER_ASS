import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../constants/ThemeContext';
import { useAppContext } from '../../controllers/useAppController';
import { getUserOrdersDB } from '../../utils/database';
import { AppColors } from '../../constants/colors';

export const OrderHistory = () => {
  const { colors, isDark } = useTheme();
  const { currentUser } = useAppContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getUserOrdersDB(currentUser!.id);
    if (result.success && result.orders) {
      setOrders(result.orders);
    }
    setLoading(false);
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

  if (loading) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ color: mutedColor }}>No orders found.</Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      {orders.map(order => (
        <View key={order._id} style={[styles.orderCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.orderHeader}>
            <Text style={[styles.orderId, { color: colors.text }]}>Order #{order._id.slice(-6).toUpperCase()}</Text>
            <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>{order.status}</Text>
          </View>
          <Text style={[styles.orderDate, { color: mutedColor }]}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
          
          <View style={styles.itemsList}>
            {order.items.map((item: any, idx: number) => (
              <Text key={idx} style={[styles.itemText, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.quantity}x {item.product?.name || 'Unknown Product'}
              </Text>
            ))}
          </View>

          <View style={[styles.orderFooter, { borderTopColor: cardBorder }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
            <Text style={[styles.totalAmount, { color: colors.primary }]}></Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderStatus: {
    fontWeight: '600',
    fontSize: 14,
  },
  orderDate: {
    fontSize: 12,
    marginBottom: 12,
  },
  itemsList: {
    gap: 4,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
