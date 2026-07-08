import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  ActivityIndicator, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '../../constants/colors';
import { getRevenue } from '../../utils/database';
import { router } from 'expo-router';
import { useAppContext } from '../../controllers/useAppController';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function AdminRevenueScreen() {
  const { currentUser } = useAppContext();
  const [loading, setLoading] = useState(true);
  
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // If not admin, kick them out
    if (currentUser?.role !== 'admin') {
      router.back();
      return;
    }
    fetchRevenueData();
  }, [currentUser]);

  const fetchRevenueData = async () => {
    setLoading(true);
    const result = await getRevenue(day.trim(), month.trim(), year.trim());
    if (result.success) {
      setTotalRevenue(result.totalRevenue || 0);
      setOrders(result.orders || []);
    }
    setLoading(false);
  };

  const handleFilter = () => {
    fetchRevenueData();
  };

  const renderOrder = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.orderIdBadge}>
            <Text style={styles.orderIdText}>#{item._id.substring(0, 6).toUpperCase()}</Text>
          </View>
          <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.cardContent}>
          <View style={styles.rowInfo}>
            <Ionicons name="person-outline" size={16} color="#666" style={styles.iconMargin} />
            <Text style={styles.customerName}>
              {item.user ? item.user.fullname : 'Unknown User'}
            </Text>
          </View>
          <View style={styles.rowInfo}>
            <Ionicons name="cube-outline" size={16} color="#666" style={styles.iconMargin} />
            <Text style={styles.itemCount}>{item.items.length} Item(s)</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.totalLabel}>Order Total</Text>
          <Text style={styles.totalAmount}>${item.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Revenue Dashboard</Text>
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.flex1}
      >
        <FlatList
          data={orders}
          keyExtractor={item => item._id}
          ListHeaderComponent={
            <>
              {/* Summary Card */}
              <Animated.View entering={FadeInDown.duration(600)}>
                <LinearGradient
                  colors={[AppColors.primaryOrange, '#FF8A00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.summaryCard}
                >
                  <View style={styles.summaryTopRow}>
                    <Ionicons name="stats-chart" size={24} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.summaryTitle}>Total Revenue</Text>
                  </View>
                  <Text style={styles.summaryAmount}>
                    ${totalRevenue.toFixed(2)}
                  </Text>
                  <Text style={styles.summarySubtitle}>From {orders.length} completed orders</Text>
                  <View style={styles.glowCircle1} />
                  <View style={styles.glowCircle2} />
                </LinearGradient>
              </Animated.View>

              {/* Filter Section */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Filter Records</Text>
                <View style={styles.filterRow}>
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      style={styles.input} 
                      placeholder="DD" 
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={2}
                      value={day}
                      onChangeText={setDay}
                    />
                  </View>
                  <Text style={styles.slash}>/</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      style={styles.input} 
                      placeholder="MM" 
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={2}
                      value={month}
                      onChangeText={setMonth}
                    />
                  </View>
                  <Text style={styles.slash}>/</Text>
                  <View style={[styles.inputWrapper, { flex: 1.5 }]}>
                    <TextInput 
                      style={styles.input} 
                      placeholder="YYYY" 
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={4}
                      value={year}
                      onChangeText={setYear}
                    />
                  </View>
                  <TouchableOpacity style={styles.filterBtn} onPress={handleFilter}>
                    <Ionicons name="search" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* List Header */}
              <View style={styles.listHeaderRow}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                {loading && <ActivityIndicator size="small" color={AppColors.primaryOrange} />}
              </View>
            </>
          }
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={64} color="#ddd" />
                <Text style={styles.emptyText}>No orders found for this period.</Text>
                <Text style={styles.emptySubtext}>Try adjusting your date filters.</Text>
              </View>
            ) : null
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFAFA' 
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    backgroundColor: '#FAFAFA',
  },
  backBtn: { 
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    marginTop: 16,
    marginBottom: 24,
    padding: 24,
    borderRadius: 24,
    shadowColor: AppColors.primaryOrange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryAmount: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  summarySubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  glowCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    right: -20,
  },
  glowCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    bottom: -30,
    right: 80,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  },
  slash: {
    fontSize: 20,
    color: '#ccc',
    marginHorizontal: 8,
    fontWeight: '300',
  },
  filterBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff', 
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 12, 
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdBadge: {
    backgroundColor: '#FFF4EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderIdText: {
    color: AppColors.primaryOrange,
    fontSize: 12,
    fontWeight: '700',
  },
  orderDate: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  cardContent: {
    marginBottom: 16,
    gap: 8,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMargin: {
    marginRight: 8,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  }
});
