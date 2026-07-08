import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  inputBg: string;
  headerBg: string;
  statusBar: "dark-content" | "light-content";
  primary: string;
  primaryDark: string;
  gradientBtn: string[];
}

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
  colors: ThemeColors;
}

// Light theme: Trắng ngà xanh chuối (Ivory & Lime Green)
const lightColors: ThemeColors = {
  background: "#FAF9F5", // Trắng ngà
  card: "#ffffff",
  text: "#1C1C16",
  textSecondary: "#606050",
  border: "#E5E4DE",
  inputBg: "#ffffff",
  headerBg: "rgba(250, 249, 245, 0.95)",
  statusBar: "dark-content" as const,
  primary: "#65A30D", // Xanh chuối
  primaryDark: "#4D7C0F",
  gradientBtn: ["#84cc16", "#65a30d"],
};

// Dark theme: Đen cam (Black & Orange)
const darkColors: ThemeColors = {
  background: "#0A0A0A", // Đen sâu thẳm
  card: "#121212",
  text: "#F5F5F5",
  textSecondary: "#A0A0A0",
  border: "rgba(255, 255, 255, 0.08)",
  inputBg: "#1A1A1A",
  headerBg: "rgba(10, 10, 10, 0.95)",
  statusBar: "light-content" as const,
  primary: "#FF6B00", // Cam
  primaryDark: "#CC5200",
  gradientBtn: ["#FF7A00", "#FF4500"],
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
  colors: darkColors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("app_theme");
        if (savedTheme !== null) {
          setIsDark(savedTheme === "dark");
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      AsyncStorage.setItem("app_theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
    AsyncStorage.setItem("app_theme", dark ? "dark" : "light");
  };
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
