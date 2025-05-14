import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  View,
  ViewStyle,
  Pressable,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import colors from '@/constants/colors';

type FABProps = {
  icon: string;
  onPress: () => void;
  style?: ViewStyle;
  accessibilityLabel: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FAB({
  icon,
  onPress,
  style,
  accessibilityLabel
}: FABProps) {
  const scale = useSharedValue(1);
  
  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={accessibilityLabel}
    >
      <Plus size={24} color={colors.white} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});