import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import { CartHeader } from '../components/cart/CartHeader';
import { CartItem } from '../components/cart/CartItem';
import { CartPromoCode } from '../components/cart/CartPromoCode';
import { CartSummary } from '../components/cart/CartSummary';
import { useAppContext } from '../controllers/useAppController';

export default function CartScreen() {
  const { colors, isDark } = useTheme();
  const { cartItems, updateCartQuantity, removeFromCart, isLoggedIn } = useAppContext();

  // The price is in item.product.price
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const handleUpdateQuantity = (productId: string, delta: number) => {
    updateCartQuantity(productId, delta);
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
        <Text style={{ color: colors.text, fontSize: 16 }}>Please login to view your cart.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <CartHeader />

      {cartItems.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary, fontSize: 16 }}>Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.itemsContainer}>
              {cartItems.map(item => (
                <CartItem 
                  key={item._id || item.product._id} 
                  item={item} 
                  onUpdateQuantity={handleUpdateQuantity} 
                  onRemoveItem={removeFromCart}
                />
              ))}
            </View>

            <CartPromoCode />
            
            <CartSummary subtotal={subtotal} />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // space for tab bar
  },
  itemsContainer: {
    gap: 16,
  },
});
