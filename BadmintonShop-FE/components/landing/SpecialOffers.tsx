import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/landing/SpecialOffers.styles';
import { useTheme } from '../../constants/ThemeContext';

export const SpecialOffers = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: isDark ? 'rgba(255, 107, 0, 0.2)' : colors.border }]}>
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: colors.primary }]}>SEASON FINALS SALE</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Up to 40% OFF on professional stringing and footwear. Limited time only.
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
              <Text style={styles.buttonText}>Claim Offer</Text>
            </TouchableOpacity>
            <View style={styles.statsContainer}>
              <Text style={styles.statsNumber}>12,400+</Text>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>PLAYERS GEARED UP</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
