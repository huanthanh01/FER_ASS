import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Image, Modal, TextInput, ScrollView, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../../constants/colors';
import { Product } from '../../models/types';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../utils/database';
import { router } from 'expo-router';
import { useAppContext } from '../../controllers/useAppController';

export default function AdminProductsScreen() {
  const { currentUser, showAlert } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', brand: '', price: 0, images: [''], category: 'Rackets', description: '', stock: 0
  });

  // Pagination state
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // If not admin, kick them out
    if (currentUser?.role !== 'admin') {
      showAlert('Access Denied', 'You do not have permission to view this page.', undefined, 'error');
      router.back();
      return;
    }
    fetchProducts(1);
  }, [currentUser]);

  const fetchProducts = async (pageNum: number) => {
    setLoading(true);
    const result = await getProducts(false, pageNum, 10);
    if (result.success && result.products) {
      setProducts(result.products);
      setTotalPages(result.totalPages || 1);
      setPage(result.currentPage || 1);
    }
    setLoading(false);
  };

  const handlePrevPage = () => {
    if (page > 1) fetchProducts(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) fetchProducts(page + 1);
  };



  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', brand: '', price: 0, images: [''], category: 'Rackets', description: '', stock: 0 });
    setModalVisible(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingId(product._id);
    setFormData({ ...product, images: product.images && product.images.length > 0 ? product.images : [''] });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    showAlert('Confirm Delete', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          const result = await deleteProduct(id);
          if (result.success) {
            setProducts(prev => prev.filter(p => p._id !== id));
            showAlert('Success', 'Product deleted', undefined, 'success');
          } else {
            showAlert('Error', result.error || 'Failed to delete', undefined, 'error');
          }
        }
      }
    ], 'warning');
  };

  const handleSave = async () => {
    if (!formData.name || !formData.brand || !formData.price || !formData.images?.[0] || !formData.category) {
      showAlert('Error', 'Please fill all required fields', undefined, 'error');
      return;
    }

    if (editingId) {
      const result = await updateProduct(editingId, formData);
      if (result.success && result.product) {
        setProducts(prev => prev.map(p => p._id === editingId ? result.product! : p));
        setModalVisible(false);
        showAlert('Success', 'Product updated', undefined, 'success');
      } else {
        showAlert('Error', result.error || 'Failed to update', undefined, 'error');
      }
    } else {
      const result = await createProduct(formData);
      if (result.success && result.product) {
        setProducts(prev => [...prev, result.product!]);
        setModalVisible(false);
        showAlert('Success', 'Product created', undefined, 'success');
      } else {
        showAlert('Error', result.error || 'Failed to create', undefined, 'error');
      }
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)} | Stock: {item.stock}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: AppColors.primaryOrange }]} onPress={() => handleOpenEditModal(item)}>
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#d9534f' }]} onPress={() => handleDelete(item._id)}>
          <Ionicons name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Management</Text>
        <TouchableOpacity onPress={handleOpenAddModal} style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={AppColors.primaryOrange} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item._id}
          renderItem={renderProduct}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListFooterComponent={
            <View style={styles.paginationContainer}>
              <TouchableOpacity 
                style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]} 
                onPress={handlePrevPage}
                disabled={page === 1}
              >
                <Ionicons name="chevron-back" size={20} color={page === 1 ? '#999' : '#fff'} />
                <Text style={[styles.pageBtnText, page === 1 && { color: '#999' }]}>Prev</Text>
              </TouchableOpacity>
              
              <Text style={styles.pageInfo}>Page {page} of {totalPages}</Text>
              
              <TouchableOpacity 
                style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]} 
                onPress={handleNextPage}
                disabled={page >= totalPages}
              >
                <Text style={[styles.pageBtnText, page >= totalPages && { color: '#999' }]}>Next</Text>
                <Ionicons name="chevron-forward" size={20} color={page >= totalPages ? '#999' : '#fff'} />
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* CRUD Form Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Product' : 'Add Product'}</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.formContent}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />
            
            <Text style={styles.label}>Brand</Text>
            <TextInput style={styles.input} value={formData.brand} onChangeText={t => setFormData({...formData, brand: t})} />
            
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity 
              style={[styles.input, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} 
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <Text style={{ fontSize: 16, color: formData.category ? '#333' : '#999' }}>
                {formData.category || 'Select a category'}
              </Text>
              <Ionicons name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={20} color="#666" />
            </TouchableOpacity>

            {showCategoryDropdown && (
              <View style={styles.dropdownContainer}>
                {['Rackets', 'Shoes', 'Apparel', 'Accessories'].map((cat) => (
                  <TouchableOpacity 
                    key={cat} 
                    style={styles.dropdownOption}
                    onPress={() => {
                      setFormData({...formData, category: cat});
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <Text style={{ fontSize: 16, color: formData.category === cat ? AppColors.primaryOrange : '#333', fontWeight: formData.category === cat ? '600' : 'normal' }}>
                      {cat}
                    </Text>
                    {formData.category === cat && <Ionicons name="checkmark" size={20} color={AppColors.primaryOrange} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <Text style={styles.label}>Price ($)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={String(formData.price || '')} onChangeText={t => setFormData({...formData, price: parseFloat(t) || 0})} />
            
            <Text style={styles.label}>Stock</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={String(formData.stock || '')} onChangeText={t => setFormData({...formData, stock: parseInt(t) || 0})} />
            
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={formData.images?.[0] || ''}
              onChangeText={(text) => setFormData({ ...formData, images: [text] })}
              placeholder="https://..."
            />
            
            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.input, styles.textArea]} multiline value={formData.description} onChangeText={t => setFormData({...formData, description: t})} />
            
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  addBtn: { backgroundColor: AppColors.primaryOrange, padding: 4, borderRadius: 8 },
  card: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8,
    padding: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  cardContent: { flex: 1 },
  brand: { fontSize: 12, color: '#666', textTransform: 'uppercase' },
  name: { fontSize: 16, fontWeight: 'bold', marginVertical: 4 },
  price: { fontSize: 14, color: AppColors.primaryOrange, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  saveText: { fontSize: 16, color: AppColors.primaryOrange, fontWeight: 'bold' },
  formContent: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 16, backgroundColor: '#fafafa'
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  dropdownContainer: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primaryOrange,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pageBtnDisabled: {
    backgroundColor: '#ddd',
  },
  pageBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginHorizontal: 4,
  },
  pageInfo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  }
});
