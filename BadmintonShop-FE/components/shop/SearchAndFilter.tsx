import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../../constants/colors';
import { styles } from '../styles/shop/SearchAndFilter.styles';
import { useTheme } from '../../constants/ThemeContext';

interface SearchAndFilterProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchAndFilter = ({ value, onChangeText }: SearchAndFilterProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.border,
              color: colors.text
            }
          ]}
          placeholder="Search premium gear..."
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};
