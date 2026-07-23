import React, { useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../components/styles/index.styles";
import { AppColors } from "../constants/colors";
import { useTheme } from "../constants/ThemeContext";
import { router } from "expo-router";

// Import modular components
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useAppContext } from "../controllers/useAppController";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const {
    isSignUp,
    setIsSignUp,
    handleLoginSuccess,
    handleRegisterSuccess,
    handleSocialLogin,
  } = useAppContext();

  const scrollViewRef = useRef<ScrollView>(null);

  // Sync ScrollView whenever isSignUp changes (e.g. after successful register)
  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: isSignUp ? width : 0,
      animated: true,
    });
  }, [isSignUp]);

  // When tab is pressed, scroll to the correct page
  const handleTabPress = (isRegister: boolean) => {
    setIsSignUp(isRegister);
  };

  // Sync state when user swipes
  const handleMomentumScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const isRegister = offsetX > width / 2;
    setIsSignUp(isRegister);
  };

  // Colors based on theme
  const bgColor = colors.background;
  const textColor = colors.text;
  const logoBg = colors.primary;
  const logoTextIconColor = AppColors.white;
  const segmentBg = colors.border;
  const activeTabBg = colors.card;
  const activeTabShadow = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  return (
    <View style={[styles.authContainer, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.authScroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity 
              style={styles.logoContainer}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/' as any);
                }
              }}
              activeOpacity={0.7}
            >
              <Image 
                source={require('../assets/images/ShopLogo.png')} 
                style={{ width: 170, height: 50, resizeMode: 'contain', marginLeft: -12 }} 
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity 
                style={[styles.helpButton, { borderColor: isDark ? AppColors.borderDark : AppColors.borderLight }]}
                onPress={toggleTheme}
              >
                <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={20} color={textColor} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.helpButton, { borderColor: isDark ? AppColors.borderDark : AppColors.borderLight }]}>
                <Ionicons name="help-outline" size={20} color={textColor} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Segmented Control */}
          <View style={[styles.segmentContainer, { backgroundColor: segmentBg }]}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                !isSignUp && {
                  backgroundColor: activeTabBg,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.2 : 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }
              ]}
              onPress={() => handleTabPress(false)}
            >
              <Text style={[styles.segmentText, { color: !isSignUp ? colors.primary : AppColors.textMutedDark }]}>
                Login
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.segmentButton,
                isSignUp && {
                  backgroundColor: activeTabBg,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.2 : 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }
              ]}
              onPress={() => handleTabPress(true)}
            >
              <Text style={[styles.segmentText, { color: isSignUp ? colors.primary : AppColors.textMutedDark }]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Swipeable Forms Container */}
          <View style={styles.swipeContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              scrollEventThrottle={16}
              bounces={false}
            >
              {/* Login Form Wrapper */}
              <View style={{ width: width - 48 }}>
                <LoginForm
                  onLoginSuccess={handleLoginSuccess}
                  onSocialLogin={handleSocialLogin}
                />
              </View>

              {/* Register Form Wrapper */}
              <View style={{ width: width - 48 }}>
                <RegisterForm
                  onRegisterSuccess={handleRegisterSuccess}
                  onSocialLogin={handleSocialLogin}
                />
              </View>
            </ScrollView>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
