import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../../constants/colors';
import { styles } from '../styles/details/ProductDetails.styles';

interface ProductBottomBarProps {
  quantity: number;
  setQuantity: (qty: number) => void;
  handleAddToCart: () => void;
  colors: any;
}

export const ProductBottomBar = ({ quantity, setQuantity, handleAddToCart, colors }: ProductBottomBarProps) => {
  return (
    <View style={[styles.bottomBar, { backgroundColor: colors.headerBg, borderTopColor: colors.border }]}>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={[styles.qtyButton, { backgroundColor: colors.card }]}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Ionicons name="remove" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.qtyText, { color: colors.text }]}>{quantity}</Text>
        <TouchableOpacity 
          style={[styles.qtyButton, { backgroundColor: colors.card }]}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Ionicons name="add" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
        <Ionicons name="cart" size={20} color={AppColors.white} />
      </TouchableOpacity>
    </View>
  );
};
