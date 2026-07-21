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
  const { colors } = useTheme();
  const { handleLogout, currentUser, cartItems } = useAppContext();
  const [adminMenuVisible, setAdminMenuVisible] = useState(false);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
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
          <View style={[styles.searchContainer, { flex: 1, marginRight: 10 }]}>
            <Ionicons
              name="search"
              size={20}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={{
                flex: 1,
                color: colors.text,
                padding: 8,
                height: 40,
              }}
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
              color={colors.textSecondary}
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
            <Ionicons name="cart-outline" size={24} color={AppColors.white} />
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
          style={currentUser ? styles.profileButton : styles.signupButton}
          onPress={() => {
            if (!currentUser) {
              router.push("/auth" as any);
            } else if (currentUser.role === "admin") {
              setAdminMenuVisible(true);
            }
          }}
          activeOpacity={currentUser?.role === "admin" ? 0.7 : 1}
        >
          {currentUser ? (
            <Ionicons name="person" size={16} color={AppColors.white} />
          ) : (
            <Text style={[styles.signupText, { color: colors.primary }]}>Sign-Up?</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={adminMenuVisible}
        onRequestClose={() => setAdminMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setAdminMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setAdminMenuVisible(false);
                    router.push("/admin/products" as any);
                  }}
                >
                  <Ionicons
                    name="cube-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.dropdownItemText}>Manage Products</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dropdownItem, { marginTop: 10 }]}
                  onPress={() => {
                    setAdminMenuVisible(false);
                    router.push("/admin/revenue" as any);
                  }}
                >
                  <Ionicons
                    name="stats-chart-outline"
                    size={20}
                    color={AppColors.primaryLime}
                  />
                  <Text style={styles.dropdownItemText}>Revenue Stats</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
