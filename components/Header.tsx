import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, X, Share2, Globe } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useI18n } from '@/hooks/useI18n';

type HeaderProps = {
  title: string;
  leftIcon?: 'arrow-left' | 'x' | null;
  onLeftPress?: () => void;
  rightIcon?: 'share-2' | 'globe' | null;
  onRightPress?: () => void;
  showLanguageSwitch?: boolean;
};

export default function Header({
  title,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  showLanguageSwitch = false,
}: HeaderProps) {
  const { toggleLanguage, isRTL, currentLanguage } = useI18n();

  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    return (
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onLeftPress}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        {leftIcon === 'arrow-left' && <ArrowLeft size={24} color={colors.text} />}
        {leftIcon === 'x' && <X size={24} color={colors.text} />}
      </TouchableOpacity>
    );
  };

  const renderRightIcon = () => {
    if (showLanguageSwitch) {
      return (
        <TouchableOpacity
          style={styles.languageButton}
          onPress={toggleLanguage}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Globe size={20} color={colors.primary} />
          <Text style={styles.languageText}>
            {currentLanguage === 'en' ? 'العربية' : 'English'}
          </Text>
        </TouchableOpacity>
      );
    }

    if (!rightIcon) return null;

    return (
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onRightPress}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        {rightIcon === 'share-2' && <Share2 size={24} color={colors.text} />}
        {rightIcon === 'globe' && <Globe size={24} color={colors.text} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.header, isRTL && styles.headerRtl]}>
      <View style={[styles.leftContainer, isRTL && styles.rightAligned]}>
        {isRTL ? null : renderLeftIcon()}
      </View>
      
      <Text style={[styles.title, isRTL && styles.titleRtl]}>{title}</Text>
      
      <View style={[styles.rightContainer, isRTL && styles.leftAligned]}>
        {isRTL ? renderLeftIcon() : renderRightIcon()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightAligned: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    textAlign: 'center',
    flex: 2,
  },
  titleRtl: {
    fontFamily: 'Tajawal-Bold',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  leftAligned: {
    alignItems: 'flex-start', 
  },
  iconButton: {
    padding: 4,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
  },
  languageText: {
    color: colors.primary,
    marginLeft: 4,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
});