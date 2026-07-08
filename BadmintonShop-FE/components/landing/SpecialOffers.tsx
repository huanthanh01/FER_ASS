import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/landing/SpecialOffers.styles';

export const SpecialOffers = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>SEASON FINALS SALE</Text>
          <Text style={styles.description}>
            Up to 40% OFF on professional stringing and footwear. Limited time only.
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Claim Offer</Text>
            </TouchableOpacity>
            <View style={styles.statsContainer}>
              <Text style={styles.statsNumber}>12,400+</Text>
              <Text style={styles.statsLabel}>PLAYERS GEARED UP</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
