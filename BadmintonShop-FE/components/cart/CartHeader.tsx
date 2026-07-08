import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext';
import { styles } from '../styles/cart/CartHeader.styles';

import { router } from 'expo-router';

export const CartHeader = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.headerIcon}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/shop');
          }
        }}
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors.primary }]}>Your Court Bag</Text>
      <TouchableOpacity style={styles.headerIcon}>
        <MaterialIcons name="shopping-basket" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};
