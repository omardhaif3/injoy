import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import colors from '@/constants/colors';
import { useI18n } from '@/hooks/useI18n';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle
}: ButtonProps) {
  const { isRTL } = useI18n();

  const getContainerStyle = () => {
    let variantStyle: ViewStyle = {};

    switch (variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: disabled ? colors.disabled : colors.primary,
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: disabled ? colors.disabled : colors.secondary,
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.disabled : colors.primary,
        };
        break;
    }

    let sizeStyle: ViewStyle = {};
    switch (size) {
      case 'small':
        sizeStyle = {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 12,
        };
        break;
      case 'medium':
        sizeStyle = {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 16,
        };
        break;
      case 'large':
        sizeStyle = {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 20,
        };
        break;
    }

    return {
      ...styles.container,
      ...variantStyle,
      ...sizeStyle,
      ...(fullWidth && styles.fullWidth),
      ...style,
    };
  };

  const getTextStyle = () => {
    let variantTextStyle: TextStyle = {};

    switch (variant) {
      case 'primary':
      case 'secondary':
        variantTextStyle = {
          color: colors.white,
        };
        break;
      case 'outline':
        variantTextStyle = {
          color: disabled ? colors.disabled : colors.primary,
        };
        break;
    }

    let sizeTextStyle: TextStyle = {};
    switch (size) {
      case 'small':
        sizeTextStyle = {
          fontSize: 14,
        };
        break;
      case 'medium':
        sizeTextStyle = {
          fontSize: 16,
        };
        break;
      case 'large':
        sizeTextStyle = {
          fontSize: 18,
        };
        break;
    }

    return {
      ...styles.text,
      ...variantTextStyle,
      ...sizeTextStyle,
      ...(isRTL && styles.rtlText),
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  rtlText: {
    fontFamily: 'Tajawal-Bold',
  },
});