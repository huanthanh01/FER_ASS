export const AppColors = {
  // Shared
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Light Theme (Default/Lime Green)
  bgLight: '#ffffff',
  textLight: '#1f2937', // dark gray
  textMutedLight: '#6b7280',
  borderLight: '#e5e7eb',
  primaryLime: '#bbf7d0', // Lime green/yellow from image
  primaryTextLight: '#000000',

  // Dark Theme (Black/Orange)
  bgDark: '#000000', // Deep black
  textDark: '#f9fafb',
  textMutedDark: '#9ca3af',
  borderDark: '#374151',
  primaryOrange: '#f97316', // Orange
  primaryTextDark: '#000000',
  cardDark: '#1a1a1a',

  // States
  error: '#ef4444',
  success: '#22c55e',

  // Social
  socialGoogle: '#DB4437',
  socialApple: '#000000',
  socialAppleDark: '#ffffff',

  // Backward compatibility
  primary: '#ff073a',
  primaryDark: '#cc002c',
  gradientBtn: ['#ff073a', '#99001b'] as const,
  gradientOverlay: ['#ff073a', '#99001b'] as const,
};
