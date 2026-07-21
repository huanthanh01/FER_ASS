import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext';
import { useAppContext } from '../../controllers/useAppController';
import { AppColors } from '../../constants/colors';
import { styles } from '../../components/styles/profile/Profile.styles';
import { OrderHistory } from '../../components/profile/OrderHistory';
import { Switch } from 'react-native';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { currentUser, updateProfile, changePassword, handleLogout, isGlobalLoading, showAlert, setIsSignUp } = useAppContext();

  // Personal Info State
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullname(currentUser.fullname || '');
      setEmail(currentUser.email || '');
      setPhoneNumber(currentUser.phoneNumber || '');
    }
  }, [currentUser]);

  const handleUpdateInfo = async () => {
    if (!fullname || !email) {
      showAlert('Error', 'Please fill in all personal information fields', undefined, 'error');
      return;
    }
    
    setIsUpdatingInfo(true);
    const result = await updateProfile(fullname, email, phoneNumber);
    setIsUpdatingInfo(false);
    
    if (result.success) {
      showAlert('Success', 'Profile updated successfully!', undefined, 'success');
    } else {
      showAlert('Error', result.error || 'Failed to update profile', undefined, 'error');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert('Error', 'Please fill in all password fields', undefined, 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showAlert('Error', 'New passwords do not match', undefined, 'error');
      return;
    }

    setIsUpdatingPassword(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsUpdatingPassword(false);

    if (result.success) {
      showAlert('Success', 'Password changed successfully!', undefined, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showAlert('Error', result.error || 'Failed to change password', undefined, 'error');
    }
  };

  const confirmLogout = () => {
    showAlert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: handleLogout }
      ],
      'warning'
    );
  };

  const textColor = isDark ? AppColors.textDark : AppColors.textLight;
  const mutedColor = isDark ? AppColors.textMutedDark : AppColors.textMutedLight;
  const inputBorder = isDark ? AppColors.borderDark : AppColors.borderLight;
  const inputBg = isDark ? AppColors.bgDark : AppColors.bgLight;
  const btnBg = isDark ? AppColors.primaryOrange : AppColors.primaryLime;
  const btnText = isDark ? AppColors.primaryTextDark : AppColors.primaryTextLight;
  const cardBorder = isDark ? AppColors.borderDark : AppColors.borderLight;
  const cardBg = isDark ? AppColors.cardDark : AppColors.white;

  if (!currentUser) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="person-circle-outline" size={80} color={mutedColor} style={{ marginBottom: 16 }} />
          <Text style={{ color: textColor, fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Authentication Required
          </Text>
          <Text style={{ color: mutedColor, fontSize: 14, marginBottom: 24, textAlign: 'center' }}>
            You have to sign up or login to view your profile and manage your account.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: btnBg, flex: 1 }]}
              onPress={() => {
                setIsSignUp(false);
                const { router } = require('expo-router');
                router.push('/auth' as any);
              }}
            >
              <Text style={[styles.saveButtonText, { color: btnText }]}>Login</Text>
              <Ionicons name="log-in-outline" size={20} color={btnText} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: btnBg, flex: 1 }]}
              onPress={() => {
                setIsSignUp(true);
                const { router } = require('expo-router');
                router.push('/auth' as any);
              }}
            >
              <Text style={[styles.saveButtonText, { color: btnBg }]}>Sign Up</Text>
              <Ionicons name="person-add-outline" size={20} color={btnBg} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header section */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{currentUser.fullname.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={[styles.nameText, { color: textColor }]}>{currentUser.fullname}</Text>
          <Text style={[styles.roleText, { color: colors.primary }]}>
            {currentUser.role === 'admin' ? 'Administrator' : 'Premium Member'}
          </Text>
        </View>

        {/* Personal Information */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>Personal Information</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: mutedColor }]}>FULL NAME</Text>
            <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
              <Ionicons name="person-outline" size={20} color={mutedColor} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={fullname}
                onChangeText={setFullname}
                placeholderTextColor={mutedColor}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: mutedColor }]}>EMAIL ADDRESS</Text>
            <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
              <Ionicons name="mail-outline" size={20} color={mutedColor} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={mutedColor}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: mutedColor }]}>PHONE NUMBER</Text>
            <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
              <Ionicons name="call-outline" size={20} color={mutedColor} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="Enter your phone number"
                placeholderTextColor={mutedColor}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: btnBg }]}
            onPress={handleUpdateInfo}
            disabled={isUpdatingInfo || isGlobalLoading}
          >
            {isUpdatingInfo ? (
              <ActivityIndicator color={btnText} />
            ) : (
              <>
                <Text style={[styles.saveButtonText, { color: btnText }]}>Save Changes</Text>
                <Ionicons name="checkmark-circle-outline" size={20} color={btnText} />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Security / Password */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>Security</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: mutedColor }]}>CURRENT PASSWORD</Text>
            <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
              <Ionicons name="lock-closed-outline" size={20} color={mutedColor} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showPassword}
                placeholder="Enter current password"
                placeholderTextColor={mutedColor}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: mutedColor }]}>NEW PASSWORD</Text>
            <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
              <Ionicons name="key-outline" size={20} color={mutedColor} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                placeholder="Enter new password"
                placeholderTextColor={mutedColor}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: mutedColor }]}>CONFIRM NEW PASSWORD</Text>
            <View style={[styles.inputContainer, { borderColor: inputBorder, backgroundColor: inputBg }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={mutedColor} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                placeholder="Confirm new password"
                placeholderTextColor={mutedColor}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 8 }}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={mutedColor} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: btnBg }]}
            onPress={handleChangePassword}
            disabled={isUpdatingPassword || isGlobalLoading}
          >
            {isUpdatingPassword ? (
              <ActivityIndicator color={btnText} />
            ) : (
              <>
                <Text style={[styles.saveButtonText, { color: btnText }]}>Update Password</Text>
                <Ionicons name="lock-open-outline" size={20} color={btnText} />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Order History */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>Order History</Text>
        <OrderHistory />

        {/* App Settings */}
        <Text style={[styles.sectionTitle, { color: textColor, marginTop: 16 }]}>App Settings</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={isDark ? "moon-outline" : "sunny-outline"} size={24} color={mutedColor} style={{ marginRight: 12 }} />
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '500' }}>Dark Mode</Text>
          </View>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme}
            trackColor={{ false: '#d1d5db', true: btnBg }}
            thumbColor={'#ffffff'}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <Ionicons name="log-out-outline" size={20} color={AppColors.error} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
