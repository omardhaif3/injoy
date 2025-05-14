import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Share, 
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useI18n } from '@/hooks/useI18n';
import { usePost } from '@/hooks/usePost';
import Header from '@/components/Header';
import VoteOption from '@/components/VoteOption';
import CommentItem from '@/components/CommentItem';
import EmptyState from '@/components/EmptyState';
import { MessageCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { formatDistance } from '@/utils/dateUtils';

type Option = {
  _id: string;
  text: string;
  votes: number;
};

type Comment = {
  _id: string;
  text: string;
  createdAt: string;
};

type Post = {
  _id: string;
  question: string;
  options: Option[];
  comments: Comment[];
  createdAt: string;
} | null;

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  const postId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { t, isRTL, currentLanguage } = useI18n();
  
  const { 
    post, 
    loading, 
    error, 
    vote, 
    addComment, 
    refreshPost 
  } = usePost(postId);
  
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const typedPost = post as Post | null;

  const totalVotes = typedPost?.options?.reduce((sum, option) => sum + option.votes, 0) || 0;

  const handleShare = async () => {
    try {
      const baseUrl = typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://injoy.example.com';
      const url = `${baseUrl}/post/${postId}`;
      await Share.share({
        message: `${t('checkOutQuestion')}: ${typedPost?.question} - ${url}`,
        url
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleVote = async (optionId: string) => {
    if (selectedOptionId) {
      return;
    }
    
    try {
      setSelectedOptionId(optionId);
      await vote(optionId);
    } catch (error) {
      setSelectedOptionId(null);
      Alert.alert(t('error'), t('voteError'));
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      setCommentLoading(true);
      await addComment(comment);
      setComment('');
    } catch (error) {
      Alert.alert(t('error'), t('commentError'));
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading && !typedPost) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header 
          title={t('loading')}
          leftIcon="arrow-left"
          onLeftPress={() => router.back()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !typedPost) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header 
          title={t('error')}
          leftIcon="arrow-left"
          onLeftPress={() => router.back()}
        />
        <EmptyState 
          icon="alert-circle" 
          title={t('errorTitle')} 
          message={t('postNotFound')} 
          actionText={t('goBack')} 
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={[styles.container, isRTL && styles.rtlContainer]}>
          <Header 
            title={t('post')}
            leftIcon="arrow-left"
            onLeftPress={() => router.back()}
            rightIcon="share-2"
            onRightPress={handleShare}
          />

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
          >
            <Animated.View entering={FadeIn.duration(300)} style={styles.questionContainer}>
              <Text style={[styles.questionText, isRTL && styles.rtlText]}>
                {typedPost?.question}
              </Text>
              <Text style={[styles.metaText, isRTL && styles.rtlText]}>
                {formatDistance(typedPost?.createdAt, currentLanguage)}
              </Text>
            </Animated.View>

            <View style={styles.optionsContainer}>
              {typedPost?.options.map((option, index) => (
                <VoteOption
                  key={option._id}
                  option={option}
                  index={index}
                  selected={selectedOptionId === option._id}
                  totalVotes={totalVotes}
                  onPress={() => handleVote(option._id)}
                  isRTL={isRTL}
                />
              ))}
            </View>

            <View style={styles.commentsSection}>
              <View style={styles.commentHeader}>
                <MessageCircle size={20} color={colors.text} />
                <Text style={[styles.commentsTitle, isRTL && styles.rtlText]}>
                  {t('comments')} ({typedPost?.comments?.length || 0})
                </Text>
              </View>

              {typedPost?.comments?.length ? (
                <View style={styles.commentsList}>
                  {typedPost.comments.map(comment => (
                    <CommentItem 
                      key={comment._id} 
                      comment={comment} 
                      isRTL={isRTL}
                      language={currentLanguage}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.noComments}>
                  <Text style={[styles.noCommentsText, isRTL && styles.rtlText]}>
                    {t('noComments')}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.commentInputContainer}>
            <TextInput
              style={[
                styles.commentInput, 
                isRTL && styles.rtlText
              ]}
              placeholder={t('addComment')}
              placeholderTextColor={colors.textLight}
              value={comment}
              onChangeText={setComment}
              multiline
              maxLength={500}
              textAlign={isRTL ? 'right' : 'left'}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                !comment.trim() && styles.disabledButton
              ]}
              onPress={handleAddComment}
              disabled={!comment.trim() || commentLoading}
            >
              {commentLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.sendButtonText}>{t('send')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  rtlContainer: {
    direction: 'rtl',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  questionContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 26,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.textLight,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  commentsSection: {
    marginTop: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginLeft: 8,
  },
  commentsList: {
    gap: 12,
  },
  noComments: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  noCommentsText: {
    color: colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  sendButtonText: {
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
});
