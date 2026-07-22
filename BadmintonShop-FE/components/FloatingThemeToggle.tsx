import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  PanResponder,
  Animated,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../constants/ThemeContext';

const BUTTON_SIZE = 56;
const MARGIN_X = 16;
const MARGIN_Y = 60; // Safe area margins

export default function FloatingThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Screen boundaries for clamping
  const minX = MARGIN_X;
  const maxX = screenWidth - BUTTON_SIZE - MARGIN_X;
  const minY = MARGIN_Y;
  const maxY = screenHeight - BUTTON_SIZE - MARGIN_Y;

  // Initialize position at bottom right
  const pan = useRef(new Animated.ValueXY({ x: maxX, y: maxY - 20 })).current;
  const currentPos = useRef({ x: maxX, y: maxY - 20 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Keep reference updated
    const listenerId = pan.addListener((value) => {
      currentPos.current = value;
    });

    const loadPosition = async () => {
      try {
        const savedX = await AsyncStorage.getItem('theme-toggle-x');
        const savedY = await AsyncStorage.getItem('theme-toggle-y');
        if (savedX !== null && savedY !== null) {
          const x = parseFloat(savedX);
          const y = parseFloat(savedY);
          if (!isNaN(x) && !isNaN(y)) {
            const boundX = Math.max(minX, Math.min(x, maxX));
            const boundY = Math.max(minY, Math.min(y, maxY));
            pan.setValue({ x: boundX, y: boundY });
            currentPos.current = { x: boundX, y: boundY };
          }
        }
      } catch (e) {
        console.error('Failed to load position of theme toggle', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadPosition();

    return () => {
      pan.removeListener(listenerId);
    };
  }, [screenWidth, screenHeight]);

  // Adjust/clamp position if screen orientation changes or layout updates
  useEffect(() => {
    if (isLoaded) {
      const boundX = Math.max(minX, Math.min(currentPos.current.x, maxX));
      const boundY = Math.max(minY, Math.min(currentPos.current.y, maxY));
      pan.setValue({ x: boundX, y: boundY });
      currentPos.current = { x: boundX, y: boundY };
    }
  }, [screenWidth, screenHeight]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: currentPos.current.x,
          y: currentPos.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: async (evt, gestureState) => {
        pan.flattenOffset();

        // Calculate drag distance
        const distance = Math.sqrt(
          gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy
        );
        
        // Tap threshold: 8 pixels
        if (distance < 8) {
          toggleTheme();
        }

        // Boundary constraint clamping
        let finalX = currentPos.current.x;
        let finalY = currentPos.current.y;

        if (finalX < minX) finalX = minX;
        if (finalX > maxX) finalX = maxX;
        if (finalY < minY) finalY = minY;
        if (finalY > maxY) finalY = maxY;

        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          friction: 7,
          tension: 40,
        }).start();

        // Save position for persistence
        try {
          await AsyncStorage.setItem('theme-toggle-x', finalX.toString());
          await AsyncStorage.setItem('theme-toggle-y', finalY.toString());
        } catch (e) {
          console.error('Failed to save position of theme toggle', e);
        }
      },
    })
  ).current;

  // Colors matching web version theme configuration
  const borderCol = isDark ? '#FF6B00' : '#84cc16';
  const iconCol = isDark ? '#FF6B00' : '#84cc16';
  const bgCol = isDark ? '#121212' : '#ffffff';

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: pan.getTranslateTransform(),
          borderColor: borderCol,
          backgroundColor: bgCol,
          shadowColor: borderCol,
          shadowOpacity: isDark ? 0.35 : 0.2,
        },
      ]}
    >
      <View style={styles.iconWrapper}>
        {isDark ? (
          <Ionicons name="moon" size={26} color={iconCol} />
        ) : (
          <Ionicons name="sunny" size={26} color={iconCol} />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999, // Floating on top of navigation & content
    elevation: 8,  // Android shadow
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  iconWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
