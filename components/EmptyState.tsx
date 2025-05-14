import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleAlert as AlertCircle, MessageSquare, Plus } from 'lucide-react-native';
import Button from './Button';
import colors from '@/constants/colors';
import { useI18n } from '@/hooks/useI18n';

type EmptyStateProps = {
  icon: 'alert-circle' | 'message-square' | 'plus';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
};

export default function EmptyState({
  icon,
  title,
  message,
  actionText,
  onAction
}: EmptyStateProps) {
  const { isRTL } = useI18n();
  
  const renderIcon = () => {
    switch (icon) {
      case 'alert-circle':
        return <AlertCircle size={48} color={colors.error} />;
      case 'message-square':
        return <MessageSquare size={48} color={colors.primary} />;
      case 'plus':
        return <Plus size={48} color={colors.primary} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      
      <Text style={[styles.title, isRTL && styles.rtlText]}>
        {title}
      </Text>
      
      <Text style={[styles.message, isRTL && styles.rtlText]}>
        {message}
      </Text>
      
      {actionText && onAction && (
        <Button
          title={actionText}
          onPress={onAction}
          variant="primary"
          size="medium"
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
    fontFamily: 'Tajawal-Bold',
    writingDirection: 'rtl',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    marginTop: 8,
  },
});