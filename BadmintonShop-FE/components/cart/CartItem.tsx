import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext';
import { styles } from '../styles/cart/CartItem.styles';
import { CartItemType } from '../../models/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) => {
  const { colors, isDark } = useTheme();
  const product = item.product;

  if (!product) return null;

  const handleMinusPress = () => {
    if (item.quantity > 0) {
      onUpdateQuantity(product._id, -1);
    }
  };

  return (
    <View style={[styles.cartItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.imageContainer, { backgroundColor: colors.border }]}>
        <Image source={{ uri: product.images?.[0] }} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.itemDetails}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.brandText, { color: colors.textSecondary }]}>{product.brand}</Text>
            <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>{product.name}</Text>
          </View>
          <TouchableOpacity 
            style={{ padding: 4, marginLeft: 8 }} 
            onPress={() => {
              Alert.alert(
                "Xác nhận",
                "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?",
                [
                  { text: "Không", style: "cancel" },
                  { text: "Có", style: "destructive", onPress: () => onRemoveItem(product._id) }
                ]
              );
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
        <View style={styles.priceRow}>
          <Text style={[styles.priceText, { color: colors.primary }]}>${product.price.toFixed(2)}</Text>
          <View style={[styles.quantitySelector, { backgroundColor: isDark ? '#333' : '#e5e7eb' }]}>
            <TouchableOpacity onPress={handleMinusPress} style={styles.qtyBtn}>
              <MaterialIcons name="remove" size={16} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => onUpdateQuantity(product._id, 1)} style={styles.qtyBtn}>
              <MaterialIcons name="add" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
