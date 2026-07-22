import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { AppColors } from "../../constants/colors";
import { User } from "../../models/types";
import { loginUser } from "../../utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../constants/ThemeContext";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AnimatedButton } from "../ui/AnimatedButton";
import { useAppContext } from "../../controllers/useAppController";

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
  onSocialLogin: (platform: string) => void;
}

import { styles } from "../styles/auth/LoginForm.styles";

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onSocialLogin,
}) => {
  const { colors, isDark } = useTheme();
  const { setIsSignUp } = useAppContext();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("saved_username");
        const savedPassword = await AsyncStorage.getItem("saved_password");
        if (savedUsername && savedPassword) {
          setIdentifier(savedUsername);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (e) {
        console.log("Failed to load saved credentials", e);
      }
    };
    loadSavedCredentials();
  }, []);

  const handleSubmit = async () => {
    if (!identifier || !password) {
      setError("Please fill in both fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log(
        `[FRONTEND LOGIN ATTEMPT] identifier: '${identifier}', password: '${password}'`,
      );
      // Assuming database utils can handle this
      const result = await loginUser(identifier.trim(), password);

      if (result.success && result.user) {
        if (rememberMe) {
          await AsyncStorage.setItem("saved_username", identifier.trim());
          await AsyncStorage.setItem("saved_password", password);
          await AsyncStorage.setItem("saved_timestamp", Date.now().toString());
        } else {
          await AsyncStorage.removeItem("saved_username");
          await AsyncStorage.removeItem("saved_password");
          await AsyncStorage.removeItem("saved_timestamp");
        }
        onLoginSuccess(result.user);
      } else {
        setError(result.error || "Login failed");
      }
    } catch (e) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const textColor = colors.text;
  const mutedColor = colors.textSecondary;
  const inputBorder = colors.border;
  const inputBg = colors.inputBg;
  const primaryBtn = colors.primary;
  const primaryBtnText = AppColors.white;
  const socialBg = colors.card;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View
        style={styles.header}
        entering={FadeInDown.delay(100).duration(500)}
      >
        <Text style={[styles.title, { color: textColor }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Sign in to access your premium badminton gear and rewards.
        </Text>
        <Text style={[styles.subtitle, { color: mutedColor, marginTop: 8 }]}>
          If you don't have an account,{' '}
          <Text 
            style={[styles.forgotPasswordText, { color: textColor }]} 
            onPress={() => setIsSignUp(true)}
          >
            please register
          </Text>
        </Text>
      </Animated.View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: AppColors.error }]}>
            {error}
          </Text>
        </View>
      ) : null}

      {/* Input: Identifier (Email or Username) */}
      <Animated.View
        style={styles.inputGroup}
        entering={FadeInDown.delay(200).duration(500)}
      >
        <Text style={[styles.inputLabel, { color: mutedColor }]}>
          EMAIL OR USERNAME
        </Text>
        <View
          style={[
            styles.inputContainer,
            { borderColor: inputBorder, backgroundColor: inputBg },
          ]}
        >
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="username or email"
            placeholderTextColor={mutedColor}
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
          />
        </View>
      </Animated.View>

      {/* Input: Password */}
      <Animated.View
        style={styles.inputGroup}
        entering={FadeInDown.delay(300).duration(500)}
      >
        <Text style={[styles.inputLabel, { color: mutedColor }]}>PASSWORD</Text>
        <View
          style={[
            styles.inputContainer,
            { borderColor: inputBorder, backgroundColor: inputBg },
          ]}
        >
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="••••••••"
            placeholderTextColor={mutedColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={mutedColor}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Options Row */}
      <Animated.View
        style={styles.optionsRow}
        entering={FadeInDown.delay(400).duration(500)}
      >
        <TouchableOpacity
          style={styles.rememberMeContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: rememberMe ? primaryBtn : inputBorder,
                backgroundColor: rememberMe ? primaryBtn : "transparent",
              },
            ]}
          >
            {rememberMe && (
              <Ionicons name="checkmark" size={14} color={primaryBtnText} />
            )}
          </View>
          <Text style={[styles.rememberMeText, { color: textColor }]}>
            Keep me signed in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={[styles.forgotPasswordText, { color: textColor }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Submit Button */}
      <Animated.View entering={FadeInDown.delay(500).duration(500)}>
        <AnimatedButton
          style={[styles.submitButton, { backgroundColor: primaryBtn }]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={primaryBtnText} />
          ) : (
            <>
              <Text
                style={[styles.submitButtonText, { color: primaryBtnText }]}
              >
                LOGIN TO BWF
              </Text>
              <Ionicons name="flash" size={18} color={primaryBtnText} />
            </>
          )}
        </AnimatedButton>
      </Animated.View>

      {/* Divider */}
      <Animated.View
        style={styles.dividerContainer}
        entering={FadeInDown.delay(600).duration(500)}
      >
        <View style={[styles.dividerLine, { backgroundColor: inputBorder }]} />
        <Text style={[styles.dividerText, { color: mutedColor }]}>
          SOCIAL CONNECT
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: inputBorder }]} />
      </Animated.View>

      {/* Social Buttons */}
      <Animated.View
        style={styles.socialRow}
        entering={FadeInDown.delay(700).duration(500)}
      >
        <AnimatedButton
          style={[
            styles.socialButton,
            { borderColor: inputBorder, backgroundColor: socialBg },
          ]}
          onPress={() => onSocialLogin("Google")}
        >
          <Ionicons
            name="logo-google"
            size={18}
            color={textColor}
            style={styles.socialIcon}
          />
          <Text style={[styles.socialText, { color: textColor }]}>Google</Text>
        </AnimatedButton>

        <AnimatedButton
          style={[
            styles.socialButton,
            { borderColor: inputBorder, backgroundColor: socialBg },
          ]}
          onPress={() => onSocialLogin("Apple")}
        >
          <Ionicons
            name="logo-apple"
            size={18}
            color={textColor}
            style={styles.socialIcon}
          />
          <Text style={[styles.socialText, { color: textColor }]}>Apple</Text>
        </AnimatedButton>
      </Animated.View>
    </View>
  );
};
