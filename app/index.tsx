import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { usePosts } from 'hooks/usePosts';
import { useI18n } from 'hooks/useI18n';
import PostCard from 'components/PostCard';
import EmptyState from 'components/EmptyState';
import Header from 'components/Header';
import FAB from 'components/FAB';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from 'constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const { posts, loading, error, refreshPosts } = usePosts(searchQuery);

  const handleCreatePost = () => {
    router.push('/create');
  };

  const renderItem = ({ item }: { item: any }) => (
    <PostCard 
      post={item} 
      onPress={() => router.push(`/post/${item._id}`)} 
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />
      <View style={[styles.container, isRTL && styles.rtlContainer]}>
        <Header title={t('appName')} showLanguageSwitch />
        
        <TextInput
          style={[styles.searchInput, isRTL && styles.rtlText]}
          placeholder={t('searchPosts')}
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel={t('searchPosts')}
        />

        {error ? (
          <EmptyState 
            icon="alert-circle" 
            title={t('errorTitle')} 
            message={t('errorLoadingPosts')} 
            actionText={t('tryAgain')} 
            onAction={refreshPosts}
          />
        ) : (
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={loading} 
                onRefresh={refreshPosts}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              !loading ? (
                <EmptyState 
                  icon="message-square" 
                  title={t('noPostsTitle')} 
                  message={t('noPostsMessage')} 
                  actionText={t('createFirst')}
                  onAction={handleCreatePost}
                />
              ) : (
                <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
              )
            }
          />
        )}
        
        <FAB 
          icon="plus" 
          onPress={handleCreatePost} 
          accessibilityLabel={t('createPost')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  rtlContainer: {
    direction: 'rtl',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  loader: {
    marginTop: 40,
  },
  searchInput: {
    height: 40,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    color: colors.text,
    fontSize: 16,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
