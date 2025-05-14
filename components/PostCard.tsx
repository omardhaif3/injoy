import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageCircle, Vote } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import { useI18n } from '@/hooks/useI18n';
import { formatDistance } from '@/utils/dateUtils';

type PostCardProps = {
  post: {
    _id: string;
    question: string;
    options: Array<{ _id: string; text: string; votes: number }>;
    comments: Array<any>;
    createdAt: string;
  };
  onPress: () => void;
};

export default function PostCard({ post, onPress }: PostCardProps) {
  const { isRTL, t, currentLanguage } = useI18n();
  
  const totalVotes = post.options.reduce((sum, option) => sum + option.votes, 0);
  const commentCount = post.comments?.length || 0;

  // Calculate a gradient based on post id to give some visual variety
  const getRandomGradient = () => {
    // Use the last character of the post ID to determine gradient
    const lastChar = post._id.slice(-1);
    const code = lastChar.charCodeAt(0) % 4;
    
    switch (code) {
      case 0:
        return [colors.primaryGradient, colors.primary];
      case 1:
        return [colors.secondaryGradient, colors.secondary];
      case 2:
        return [colors.accentGradient, colors.accent];
      default:
        return [colors.successGradient, colors.success];
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={getRandomGradient()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.content}>
        <Text 
          style={[styles.question, isRTL && styles.rtlText]}
          numberOfLines={3}
        >
          {post.question}
        </Text>
        
        <View style={[styles.meta, isRTL && styles.metaRtl]}>
          <View style={[styles.metaItem, isRTL && styles.metaItemRtl]}>
            <Vote size={16} color={colors.textLight} />
            <Text style={styles.metaText}>
              {t('votes', { count: totalVotes })}
            </Text>
          </View>
          
          <View style={[styles.metaItem, isRTL && styles.metaItemRtl]}>
            <MessageCircle size={16} color={colors.textLight} />
            <Text style={styles.metaText}>
              {t('commentsCount', { count: commentCount })}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.date, isRTL && styles.rtlText]}>
          {formatDistance(post.createdAt, currentLanguage)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 6,
    height: '100%',
  },
  content: {
    padding: 16,
    paddingLeft: 20,
  },
  question: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 24,
  },
  rtlText: {
    textAlign: 'right',
    fontFamily: 'Tajawal-Medium',
    writingDirection: 'rtl',
  },
  meta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaRtl: {
    flexDirection: 'row-reverse',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaItemRtl: {
    flexDirection: 'row-reverse',
    marginRight: 0,
    marginLeft: 16,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.textLight,
    marginLeft: 4,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.textLight,
  },
});