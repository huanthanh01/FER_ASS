import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../../constants/colors';
import { styles } from '../styles/shop/SearchAndFilter.styles';

interface SearchAndFilterProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchAndFilter = ({ value, onChangeText }: SearchAndFilterProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={AppColors.textMutedDark} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search premium gear..."
          placeholderTextColor={AppColors.textMutedDark}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};
