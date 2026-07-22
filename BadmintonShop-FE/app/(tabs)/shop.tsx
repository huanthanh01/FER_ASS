import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/ThemeContext';
import { AppColors } from '../../constants/colors';

import { useLocalSearchParams } from 'expo-router';

import { TopHeader } from '../../components/landing/TopHeader';
import { ShopProductGrid } from '../../components/shop/ShopProductGrid';
import { styles } from '../../components/styles/index.styles';

export default function ShopScreen() {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const { category } = useLocalSearchParams<{ category?: string }>();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <TopHeader 
        showSearch={true} 
        showCart={true} 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      <ShopProductGrid 
        searchQuery={searchQuery} 
        initialCategory={category || 'All'} 
      />
    </SafeAreaView>
  );
}
