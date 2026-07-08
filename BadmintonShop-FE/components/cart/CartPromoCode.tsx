import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext';
import { styles } from '../styles/cart/CartPromoCode.styles';

export const CartPromoCode = () => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={[styles.promoCode, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
      <View style={styles.promoLeft}>
        <MaterialIcons name="local-offer" size={20} color={colors.primary} />
        <Text style={[styles.promoText, { color: colors.text }]}>Apply Promo Code</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};
