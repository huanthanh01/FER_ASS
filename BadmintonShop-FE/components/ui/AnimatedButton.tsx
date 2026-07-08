import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleOnHover?: number;
  scaleOnPress?: number;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  style, 
  scaleOnHover = 1.02, 
  scaleOnPress = 0.95,
  ...props 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handleHoverIn = () => {
    if (Platform.OS === 'web') {
      scale.value = withSpring(scaleOnHover, { damping: 15, stiffness: 300 });
      opacity.value = withSpring(0.85, { damping: 15, stiffness: 300 });
    }
  };

  const handleHoverOut = () => {
    if (Platform.OS === 'web') {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  return (
    <AnimatedPressable
      {...props}
      onPressIn={(e) => {
        scale.value = withSpring(scaleOnPress, { damping: 15, stiffness: 300 });
        opacity.value = withSpring(0.7, { damping: 15, stiffness: 300 });
        props.onPressIn && props.onPressIn(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        opacity.value = withSpring(1, { damping: 15, stiffness: 300 });
        props.onPressOut && props.onPressOut(e);
      }}
      // @ts-ignore - React Native Web specific hover events
      onHoverIn={handleHoverIn}
      // @ts-ignore
      onHoverOut={handleHoverOut}
      // @ts-ignore - Standard DOM events for robust web support
      onMouseEnter={handleHoverIn}
      // @ts-ignore
      onMouseLeave={handleHoverOut}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
};
