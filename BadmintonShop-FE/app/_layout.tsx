import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '../controllers/AppProvider';
import { ThemeProvider as AppThemeProvider } from '../constants/ThemeContext';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { AppColors } from '../constants/colors';
import FloatingThemeToggle from '../components/FloatingThemeToggle';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  fonts: MD3LightTheme.fonts,
  roundness: 16,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    primary: AppColors.primary,
    background: '#161722',
    surface: '#161722',
    surfaceVariant: 'rgba(255, 255, 255, 0.05)',
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  fonts: MD3DarkTheme.fonts,
  roundness: 16,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    primary: AppColors.primary,
    background: '#161722',
    surface: '#161722',
    surfaceVariant: 'rgba(255, 255, 255, 0.05)',
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <ThemeProvider value={theme as any}>
          <AppThemeProvider>
            <AppProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <FloatingThemeToggle />
            </AppProvider>
          </AppThemeProvider>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
