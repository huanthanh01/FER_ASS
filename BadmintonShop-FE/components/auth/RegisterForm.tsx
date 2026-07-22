import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput, ActivityIndicator } from "react-native";
import { AppColors } from "../../constants/colors";
import { registerUser } from "../../utils/database";
import { useTheme } from "../../constants/ThemeContext";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AnimatedButton } from "../ui/AnimatedButton";

interface RegisterFormProps {
  onRegisterSuccess: (fullname: string) => void;
  onSocialLogin: (platform: string) => void;
}

import { styles } from "../styles/auth/RegisterForm.styles";

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onSocialLogin,
}) => {
  const { colors, isDark } = useTheme();
  
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!fullname || !username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await registerUser(
        fullname.trim(),
        email.trim().toLowerCase(),
        username.trim(),
        password
      );
      
      if (result.success) {
        onRegisterSuccess(fullname.trim());
      } else {
        setError(result.error || "Registration failed");
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
  const btnBg = colors.primary;
  const btnText = AppColors.white;
  const primaryColor = colors.primary;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInDown.delay(100).duration(500)}>
        <Text style={[styles.title, { color: textColor }]}>
          Join The Elite
        </Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Get exclusive access to the latest collections and court news.
        </Text>
      </Animated.View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: AppColors.error }]}>{error}</Text>
        </View>
      ) : null}

      {/* Input: Full Name */}
      <Animated.View style={styles.inputGroup} entering={FadeInDown.delay(200).duration(500)}>
        <Text style={[styles.inputLabel, { color: mutedColor }]}>
          FULL NAME
        </Text>
        <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="Roger Federer"
            placeholderTextColor={mutedColor}
            value={fullname}
            onChangeText={setFullname}
          />
        </View>
      </Animated.View>

      {/* Input: Username */}
      <Animated.View style={styles.inputGroup} entering={FadeInDown.delay(250).duration(500)}>
        <Text style={[styles.inputLabel, { color: mutedColor }]}>
          USERNAME
        </Text>
        <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="roger_federer"
            placeholderTextColor={mutedColor}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
      </Animated.View>

      {/* Input: Email */}
      <Animated.View style={styles.inputGroup} entering={FadeInDown.delay(300).duration(500)}>
        <Text style={[styles.inputLabel, { color: mutedColor }]}>
          EMAIL ADDRESS
        </Text>
        <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="champ@smash.com"
            placeholderTextColor={mutedColor}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      </Animated.View>

      {/* Input: Password */}
      <Animated.View style={styles.inputGroup} entering={FadeInDown.delay(400).duration(500)}>
        <Text style={[styles.inputLabel, { color: mutedColor }]}>
          CREATE PASSWORD
        </Text>
        <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="••••••••"
            placeholderTextColor={mutedColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            contextMenuHidden={true}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={mutedColor} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Input: Confirm Password */}
      <Animated.View style={styles.inputGroupLast} entering={FadeInDown.delay(500).duration(500)}>
        <Text style={[styles.inputLabel, { color: mutedColor }]}>
          CONFIRM PASSWORD
        </Text>
        <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="••••••••"
            placeholderTextColor={mutedColor}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            contextMenuHidden={true}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={mutedColor} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Submit Button */}
      <Animated.View entering={FadeInDown.delay(600).duration(500)}>
        <AnimatedButton
          style={[styles.submitButton, { backgroundColor: btnBg }]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={btnText} />
          ) : (
            <>
              <Text style={[styles.submitButtonText, { color: btnText }]}>CREATE ACCOUNT</Text>
              <Ionicons name="arrow-forward" size={20} color={btnText} />
            </>
          )}
        </AnimatedButton>
      </Animated.View>

      {/* Terms */}
      <Animated.View style={styles.termsContainer} entering={FadeInDown.delay(700).duration(500)}>
        <Text style={[styles.termsText, { color: mutedColor }]}>
          By joining, you agree to our{' '}
          <Text style={[styles.termsLink, { color: primaryColor, textDecorationColor: primaryColor }]}>Terms</Text>
          {' '}and{' '}
          <Text style={[styles.termsLink, { color: primaryColor, textDecorationColor: primaryColor }]}>Privacy Policy</Text>
          .
        </Text>
      </Animated.View>
    </View>
  );
};
