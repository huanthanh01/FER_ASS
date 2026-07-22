import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AppColors } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { styles } from '../components/styles/auth/LoginForm.styles';
import { getApiUrl } from '../utils/database';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedButton } from '../components/ui/AnimatedButton';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const textColor = colors.text;
  const mutedColor = colors.textSecondary;
  const inputBorder = colors.border;
  const inputBg = colors.inputBg;
  const primaryBtn = colors.primary;
  const primaryBtnText = AppColors.white;
  const bgColor = colors.background;

  const handleVerify = async () => {
    if (!username || !phoneNumber) {
      setError('Please fill in both fields');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${getApiUrl()}/auth/verify-reset-password`, {
        username,
        phoneNumber
      });
      
      if (response.data.success) {
        setStep(2);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${getApiUrl()}/auth/reset-password`, {
        username,
        newPassword
      });
      
      if (response.data.success) {
        Alert.alert(
          "Success", 
          "Your password has been reset successfully.",
          [{ 
            text: "Go to Login", 
            onPress: () => {
              setStep(1);
              setUsername('');
              setPhoneNumber('');
              setNewPassword('');
              setConfirmPassword('');
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/auth');
              }
            }
          }]
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: bgColor, justifyContent: 'center' }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { padding: 24 }]}>
        <TouchableOpacity 
          style={{ position: 'absolute', top: 40, left: 24, zIndex: 10 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>

        <Animated.View style={styles.header} entering={FadeInDown.delay(100).duration(500)}>
          <Text style={[styles.title, { color: textColor, marginTop: 40 }]}>
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            {step === 1 ? 'Verify your identity to reset password.' : 'Enter your new password.'}
          </Text>
        </Animated.View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: AppColors.error }]}>{error}</Text>
          </View>
        ) : null}

        {step === 1 ? (
          <>
            <Animated.View style={styles.inputGroup} entering={FadeInDown.delay(200).duration(500)}>
              <Text style={[styles.inputLabel, { color: mutedColor }]}>USERNAME</Text>
              <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Enter username"
                  placeholderTextColor={mutedColor}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </Animated.View>

            <Animated.View style={styles.inputGroup} entering={FadeInDown.delay(300).duration(500)}>
              <Text style={[styles.inputLabel, { color: mutedColor }]}>PHONE NUMBER</Text>
              <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Enter phone number"
                  placeholderTextColor={mutedColor}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(500)}>
              <AnimatedButton
                style={[styles.submitButton, { backgroundColor: primaryBtn, marginTop: 24 }]}
                onPress={handleVerify}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={primaryBtnText} />
                ) : (
                  <Text style={[styles.submitButtonText, { color: primaryBtnText }]}>VERIFY</Text>
                )}
              </AnimatedButton>
            </Animated.View>
          </>
        ) : (
          <>
            <Animated.View style={styles.inputGroup} entering={FadeInDown.delay(200).duration(500)}>
              <Text style={[styles.inputLabel, { color: mutedColor }]}>NEW PASSWORD</Text>
              <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="••••••••"
                  placeholderTextColor={mutedColor}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={mutedColor} />
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View style={styles.inputGroup} entering={FadeInDown.delay(300).duration(500)}>
              <Text style={[styles.inputLabel, { color: mutedColor }]}>CONFIRM PASSWORD</Text>
              <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="••••••••"
                  placeholderTextColor={mutedColor}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(500)}>
              <AnimatedButton
                style={[styles.submitButton, { backgroundColor: primaryBtn, marginTop: 24 }]}
                onPress={handleReset}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={primaryBtnText} />
                ) : (
                  <Text style={[styles.submitButtonText, { color: primaryBtnText }]}>RESET PASSWORD</Text>
                )}
              </AnimatedButton>
            </Animated.View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
