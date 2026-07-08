import React from 'react';
import { View, Text } from 'react-native';
import { AppColors } from '../../constants/colors';
import { styles } from '../styles/details/ProductDetails.styles';
import { Product } from '../../models/types';

interface ProductInfoProps {
  product: Product;
  colors: any;
}

export const ProductInfo = ({ product, colors }: ProductInfoProps) => {
  return (
    <View style={styles.detailsContainer}>
      <Text style={[styles.brand, { color: AppColors.primaryOrange }]}>{product.brand}</Text>
      <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
      
      <View style={styles.priceRow}>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.primary }]}>${product.price.toFixed(2)}</Text>
          {product.oldPrice && <Text style={styles.oldPrice}>${product.oldPrice.toFixed(2)}</Text>}
        </View>
        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>{(product.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>{product.description}</Text>
    </View>
  );
};
