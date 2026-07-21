import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../../constants/colors';
import { useTheme } from '../../constants/ThemeContext';
import { styles } from '../styles/shop/SortingInfo.styles';

export type SortOrder = 'newest' | 'asc' | 'desc';

interface SortingInfoProps {
  totalProducts: number;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export const SortingInfo = ({ totalProducts, sortOrder, onSortChange }: SortingInfoProps) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(200);
  const [dropdownRight, setDropdownRight] = useState(16);
  const buttonRef = useRef<View>(null);

  const getSortText = (order: SortOrder) => {
    if (order === 'asc') return 'Price: Low to High';
    if (order === 'desc') return 'Price: High to Low';
    return 'Newest First';
  };

  const handleSortSelect = (order: SortOrder) => {
    onSortChange(order);
    setModalVisible(false);
  };

  const openDropdown = () => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      const windowWidth = Dimensions.get('window').width;
      setDropdownTop(pageY + height + 5);
      setDropdownRight(windowWidth - (pageX + width));
      setModalVisible(true);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.productsFound}>{totalProducts} Products Found</Text>
      
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity 
          style={styles.sortContainer} 
          activeOpacity={0.8} 
          onPress={openDropdown}
        >
          <Text style={styles.sortText}>{getSortText(sortOrder)}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, { top: dropdownTop, right: dropdownRight }]}>
                <TouchableOpacity style={styles.sortOption} onPress={() => handleSortSelect('newest')}>
                  <Text style={[styles.sortOptionText, sortOrder === 'newest' && [styles.sortOptionTextActive, { color: colors.primary }]]}>
                    {getSortText('newest')}
                  </Text>
                  {sortOrder === 'newest' && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </TouchableOpacity>

                <TouchableOpacity style={styles.sortOption} onPress={() => handleSortSelect('asc')}>
                  <Text style={[styles.sortOptionText, sortOrder === 'asc' && [styles.sortOptionTextActive, { color: colors.primary }]]}>
                    {getSortText('asc')}
                  </Text>
                  {sortOrder === 'asc' && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </TouchableOpacity>

                <TouchableOpacity style={styles.sortOption} onPress={() => handleSortSelect('desc')}>
                  <Text style={[styles.sortOptionText, sortOrder === 'desc' && [styles.sortOptionTextActive, { color: colors.primary }]]}>
                    {getSortText('desc')}
                  </Text>
                  {sortOrder === 'desc' && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
