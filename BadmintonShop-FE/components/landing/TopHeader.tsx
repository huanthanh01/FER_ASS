import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from "react-native";
import { styles } from "../styles/landing/TopHeader.styles";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../../constants/colors";
import { useTheme } from "../../constants/ThemeContext";
import { useAppContext } from "../../controllers/useAppController";
import { router } from "expo-router";

import { TextInput } from "react-native";

export interface TopHeaderProps {
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  showCart?: boolean;
}

export const TopHeader = ({
  showSearch,
  searchQuery,
  onSearchChange,
  showCart,
}: TopHeaderProps = {}) => {
  const { colors, isDark } = useTheme();
  const { handleLogout, currentUser, cartItems } = useAppContext();
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
      {!showSearch && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          <Text
            style={[
              styles.logoText,
              {
                color: colors.primary,
                fontSize: 18,
                letterSpacing: 1,
                marginLeft: 20,
              },
            ]}
          >
            BMW STORE
          </Text>
        </View>
      )}
      <View style={[styles.leftSection, showSearch && { flex: 1 }]}>
        {!showSearch ? (
          <TouchableOpacity
            onPress={() => {
              if (!currentUser) {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/" as any);
                }
              } else {
                router.replace("/" as any);
              }
            }}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/images/ShopLogo.png")}
              style={{
                width: 120,
                height: 35,
                resizeMode: "contain",
                marginLeft: -12,
              }}
            />
          </TouchableOpacity>
        ) : (
          <View style={[
            styles.searchContainer,
            {
              flex: 1,
              marginRight: 10,
              backgroundColor: colors.inputBg,
              borderWidth: 1,
              borderColor: colors.border
            }
          ]}>
            <Ionicons
              name="search"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              style={{ color: colors.text, flex: 1, height: 40, paddingHorizontal: 8 }}
              placeholder="Search products..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={onSearchChange}
            />
          </View>
        )}
      </View>
      <View style={styles.rightSection}>
        {currentUser && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleLogout()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        )}

        {showCart && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              if (!currentUser) {
                Alert.alert("Notification", "Please login to view cart!");
              } else {
                router.push("/cart" as any);
              }
            }}
          >
            <Ionicons name="cart-outline" size={24} color={colors.text} />
            {cartItemCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  width: 20,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            currentUser ? styles.profileButton : styles.signupButton,
            { backgroundColor: colors.primary }
          ]}
          onPress={() => {
            if (!currentUser) {
              router.push("/auth" as any);
            } else {
              router.push("/(tabs)/profile" as any);
            }
          }}
          activeOpacity={0.7}
        >
          {currentUser ? (
            <Ionicons name="person" size={16} color={AppColors.white} />
          ) : (
            <Text style={styles.signupText}>Sign-Up?</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
