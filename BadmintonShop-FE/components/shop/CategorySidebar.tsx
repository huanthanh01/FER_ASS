import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { SlideInRight, SlideOutRight, FadeIn, FadeOut } from 'react-native-reanimated';
import { AppColors } from '../../constants/colors';
import { useTheme } from '../../constants/ThemeContext';

const categories = ['All', 'RACKET', 'SHOES', 'SHIRTS', 'SHORTS', 'SKIRTS', 'BAGS', 'BACKPACKS', 'ACCESSORIES'];

interface CategorySidebarProps {
  visible: boolean;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onClose: () => void;
}

export const CategorySidebar = ({ visible, activeCategory, onCategoryChange, onClose }: CategorySidebarProps) => {
  const { colors, isDark } = useTheme();
  
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View 
        entering={FadeIn.duration(200)} 
        exiting={FadeOut.duration(200)} 
        style={sidebarStyles.backdrop}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Sidebar panel */}
      <Animated.View
        entering={SlideInRight.duration(300).springify()}
        exiting={SlideOutRight.duration(250)}
        style={[sidebarStyles.panel, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={[sidebarStyles.header, { borderBottomColor: colors.border }]}>
          <Text style={[sidebarStyles.headerTitle, { color: colors.text }]}>Categories</Text>
          <TouchableOpacity onPress={onClose} style={sidebarStyles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Category list */}
        <View style={sidebarStyles.categoryList}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[sidebarStyles.categoryItem, isActive && { backgroundColor: colors.primary + '1F' }]}
                onPress={() => onCategoryChange(cat)}
                activeOpacity={0.7}
              >
                <View style={[sidebarStyles.dot, isActive && { backgroundColor: colors.primary }]} />
                <Text style={[sidebarStyles.categoryText, isActive && { color: colors.text, fontWeight: '700' }]}>
                  {cat}
                </Text>
                {isActive && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={{ marginLeft: 'auto' }} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
};

const sidebarStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 260,
    backgroundColor: 'rgba(24, 24, 24, 0.98)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(90, 65, 54, 0.4)',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(90, 65, 54, 0.3)',
  },
  headerTitle: {
    color: AppColors.white,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryList: {
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  categoryItemActive: {
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 14,
  },
  dotActive: {
    backgroundColor: AppColors.primaryOrange,
  },
  categoryText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.8,
  },
  categoryTextActive: {
    color: AppColors.white,
    fontWeight: '700',
  },
});
