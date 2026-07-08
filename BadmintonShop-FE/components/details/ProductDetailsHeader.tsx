import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styles } from '../styles/details/ProductDetails.styles';

interface ProductDetailsHeaderProps {
  colors: any;
}

export const ProductDetailsHeader = ({ colors }: ProductDetailsHeaderProps) => {
  return (
    <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
      <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Details</Text>
      <TouchableOpacity style={styles.headerButton}>
        <Ionicons name="heart-outline" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};
