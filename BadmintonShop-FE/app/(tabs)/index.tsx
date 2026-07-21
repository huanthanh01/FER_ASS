import React from 'react';
import { ScrollView, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/ThemeContext';
import { AppColors } from '../../constants/colors';

import { TopHeader } from '../../components/landing/TopHeader';
import { styles } from '../../components/styles/tabs/index.styles';
import { HeroSection } from '../../components/landing/HeroSection';
import { BannerSlider } from '../../components/landing/BannerSlider';
import { CategoryGrid } from '../../components/landing/CategoryGrid';
import { FeaturedProducts } from '../../components/landing/FeaturedProducts';
import { SpecialOffers } from '../../components/landing/SpecialOffers';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <TopHeader />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection />
        <BannerSlider />
        <CategoryGrid />
        <FeaturedProducts />
        <SpecialOffers />
      </ScrollView>
    </SafeAreaView>
  );
}


