import React from 'react';
import { ScrollView, StatusBar, Platform, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/ThemeContext';
import { AppColors } from '../../constants/colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { TopHeader } from '../../components/landing/TopHeader';
import { styles } from '../../components/styles/index.styles';
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
        
        {/* Racket Finder Banner */}
        <TouchableOpacity 
          style={[
            localStyles.bannerContainer, 
            { 
              backgroundColor: isDark ? 'rgba(249, 115, 22, 0.08)' : 'rgba(132, 204, 22, 0.08)',
              borderColor: colors.primary 
            }
          ]}
          activeOpacity={0.8}
          onPress={() => router.push('/racket-finder')}
        >
          <View style={localStyles.bannerContent}>
            <View style={{ flex: 1 }}>
              <Text style={[localStyles.bannerTitle, { color: colors.text }]}>
                🔍 Tìm Vợt Phù Hợp
              </Text>
              <Text style={[localStyles.bannerDesc, { color: colors.textSecondary }]}>
                Làm trắc nghiệm 1 phút để tìm ra cây vợt trợ lực hoặc tấn công tối ưu nhất cho bạn!
              </Text>
            </View>
            <View style={[localStyles.bannerBtn, { backgroundColor: colors.primary }]}>
              <Ionicons name="chevron-forward" size={16} color="#ffffff" />
            </View>
          </View>
        </TouchableOpacity>

        <BannerSlider />
        <CategoryGrid />
        <FeaturedProducts />
        <SpecialOffers />
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerDesc: {
    fontSize: 12,
    lineHeight: 16,
    paddingRight: 8,
  },
  bannerBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


