import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext';
import { styles } from '../styles/cart/CartSummary.styles';

import { useAppContext } from '../../controllers/useAppController';

interface CartSummaryProps {
  subtotal: number;
}

export const CartSummary = ({ subtotal }: CartSummaryProps) => {
  const { colors } = useTheme();
  const { checkoutCart, cartItems } = useAppContext();

  return (
    <View style={[styles.summaryContainer, { backgroundColor: colors.headerBg, borderColor: colors.border }]}>
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
        <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>${subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Delivery</Text>
        <Text style={[styles.freeDelivery, { color: '#22c55e' }]}>FREE</Text>
      </View>
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
        <Text style={[styles.totalValue, { color: colors.primary }]}>${subtotal.toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.checkoutBtn, { backgroundColor: cartItems.length === 0 ? '#999' : colors.primary }]}
        disabled={cartItems.length === 0}
        onPress={() => checkoutCart()}
      >
        <Text style={styles.checkoutBtnText}>PROCEED TO CHECKOUT</Text>
        <MaterialIcons name="payment" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
