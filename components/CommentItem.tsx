import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { formatDistance } from '@/utils/dateUtils';

type CommentItemProps = {
  comment: {
    _id: string;
    text: string;
    createdAt: string;
  };
  isRTL: boolean;
  language: string;
};

export default function CommentItem({ comment, isRTL, language }: CommentItemProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.commentText, isRTL && styles.rtlText]}>
        {comment.text}
      </Text>
      <Text style={[styles.timestamp, isRTL && styles.rtlText]}>
        {formatDistance(comment.createdAt, language)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  commentText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  rtlText: {
    textAlign: 'right',
    fontFamily: 'Tajawal-Regular',
    writingDirection: 'rtl',
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderRightColor: colors.secondary,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.textLight,
  },
});