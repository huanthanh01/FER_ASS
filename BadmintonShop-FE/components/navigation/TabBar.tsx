import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/navigation/TabBar.styles';
import { AppColors } from '../../constants/colors';
import { useAppContext } from '../../controllers/useAppController';
import { useTheme } from '../../constants/ThemeContext';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { cartItems, notifications } = useAppContext();
  const { colors, isDark } = useTheme();
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifCount = notifications ? notifications.filter(n => !n.read).length : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        let labelText = label as string;
        if (labelText === 'Notification') {
          labelText = 'Notifs';
        }

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: keyof typeof Ionicons.glyphMap = 'home';
        if (route.name === 'index') iconName = 'home';
        else if (route.name === 'shop') iconName = 'bag-handle';
        else if (route.name === 'notification') iconName = 'notifications';
        else if (route.name === 'report') iconName = 'chatbubble';
        else if (route.name === 'profile') iconName = 'person';

        // Outline icons for inactive tabs
        if (!isFocused && iconName !== 'bag-handle') {
            // @ts-ignore - dynamic string concat
            iconName = `${iconName}-outline`;
        } else if (!isFocused && iconName === 'bag-handle') {
            iconName = 'bag-handle-outline';
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={[styles.tabItem, isFocused && { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <View>
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? AppColors.white : colors.textSecondary}
              />
              {route.name === 'notification' && unreadNotifCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  minWidth: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                  borderWidth: 1.5,
                  borderColor: colors.card
                }}>
                  <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>
                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                  </Text>
                </View>
              )}
            </View>
            <Text 
              numberOfLines={1}
              style={[styles.tabText, { color: isFocused ? AppColors.white : colors.textSecondary }]}
            >
              {labelText}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
