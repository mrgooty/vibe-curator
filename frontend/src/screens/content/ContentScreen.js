import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  scrapeInstagram,
  scrapeTikTok,
  scrapeTikTokUser,
  setCurrentPlatform,
  setSearchQuery,
  clearError,
} from '../../store/slices/contentSlice';
import { setActiveTab, addNotification } from '../../store/slices/uiSlice';

export default function ContentScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const {
    instagramData,
    tiktokData,
    loading,
    error,
    currentPlatform,
    searchQuery,
  } = useSelector(state => state.content);
  const { theme, refreshing } = useSelector(state => state.ui);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [selectedPlatform, setSelectedPlatform] = useState(currentPlatform || 'instagram');

  const isDark = theme === 'dark';

  useEffect(() => {
    dispatch(setActiveTab('content'));
    if (route.params?.platform) {
      setSelectedPlatform(route.params.platform);
      dispatch(setCurrentPlatform(route.params.platform));
    }
  }, [dispatch, route.params]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = async () => {
    if (!localSearchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    dispatch(setSearchQuery(localSearchQuery.trim()));
    dispatch(setCurrentPlatform(selectedPlatform));

    try {
      if (selectedPlatform === 'instagram') {
        await dispatch(scrapeInstagram(localSearchQuery.trim())).unwrap();
        dispatch(addNotification({
          type: 'success',
          title: 'Instagram Content Retrieved',
          message: `Found content for hashtag: ${localSearchQuery}`,
        }));
      } else if (selectedPlatform === 'tiktok') {
        if (localSearchQuery.startsWith('@')) {
          // User search
          const username = localSearchQuery.substring(1);
          await dispatch(scrapeTikTokUser(username)).unwrap();
          dispatch(addNotification({
            type: 'success',
            title: 'TikTok User Content Retrieved',
            message: `Found content for user: @${username}`,
          }));
        } else {
          // Hashtag search
          await dispatch(scrapeTikTok({ hashtag: localSearchQuery.trim(), limit: 20 })).unwrap();
          dispatch(addNotification({
            type: 'success',
            title: 'TikTok Content Retrieved',
            message: `Found content for hashtag: ${localSearchQuery}`,
          }));
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const onRefresh = async () => {
    if (searchQuery) {
      await handleSearch();
    }
  };

  const getCurrentData = () => {
    return selectedPlatform === 'instagram' ? instagramData : tiktokData;
  };

  const renderInstagramPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('ContentDetail', { content: item, platform: 'instagram' })}
    >
      <Image source={{ uri: item.displayUrl }} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postCaption} numberOfLines={2}>
          {item.caption || 'No caption'}
        </Text>
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Icon name="favorite" size={16} color="#E91E63" />
            <Text style={styles.statText}>{formatNumber(item.likesCount)}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="comment" size={16} color="#2196F3" />
            <Text style={styles.statText}>{formatNumber(item.commentsCount)}</Text>
          </View>
        </View>
        <Text style={styles.postOwner}>@{item.ownerUsername}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTikTokPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('ContentDetail', { content: item, platform: 'tiktok' })}
    >
      <Image source={{ uri: item.covers?.default }} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postCaption} numberOfLines={2}>
          {item.text || 'No description'}
        </Text>
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Icon name="favorite" size={16} color="#E91E63" />
            <Text style={styles.statText}>{formatNumber(item.diggCount)}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="comment" size={16} color="#2196F3" />
            <Text style={styles.statText}>{formatNumber(item.commentCount)}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="share" size={16} color="#4CAF50" />
            <Text style={styles.statText}>{formatNumber(item.shareCount)}</Text>
          </View>
        </View>
        <Text style={styles.postOwner}>@{item.authorMeta?.name || 'Unknown'}</Text>
      </View>
    </TouchableOpacity>
  );

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const currentData = getCurrentData();
  const posts = currentData?.data || [];

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Content Explorer</Text>
      </View>

      {/* Platform Selector */}
      <View style={styles.platformSelector}>
        <TouchableOpacity
          style={[
            styles.platformButton,
            selectedPlatform === 'instagram' && styles.platformButtonActive,
          ]}
          onPress={() => setSelectedPlatform('instagram')}
        >
          <Icon
            name="photo-camera"
            size={20}
            color={selectedPlatform === 'instagram' ? '#FFFFFF' : (isDark ? '#CCCCCC' : '#666666')}
          />
          <Text
            style={[
              styles.platformButtonText,
              selectedPlatform === 'instagram' && styles.platformButtonTextActive,
            ]}
          >
            Instagram
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.platformButton,
            selectedPlatform === 'tiktok' && styles.platformButtonActive,
          ]}
          onPress={() => setSelectedPlatform('tiktok')}
        >
          <Icon
            name="video-library"
            size={20}
            color={selectedPlatform === 'tiktok' ? '#FFFFFF' : (isDark ? '#CCCCCC' : '#666666')}
          />
          <Text
            style={[
              styles.platformButtonText,
              selectedPlatform === 'tiktok' && styles.platformButtonTextActive,
            ]}
          >
            TikTok
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="search" size={20} color={styles.iconColor.color} />
          <TextInput
            style={styles.searchInput}
            placeholder={
              selectedPlatform === 'instagram'
                ? 'Enter hashtag (e.g., travel)'
                : 'Enter hashtag or @username'
            }
            placeholderTextColor={styles.placeholderColor.color}
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
            onSubmitEditing={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Icon name="search" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Results */}
      {currentData && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {currentData.count} posts found for "{currentData.tag || currentData.hashtag || currentData.username}"
          </Text>
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={() => navigation.navigate('Analysis', { 
              contentData: currentData,
              platform: selectedPlatform 
            })}
          >
            <Icon name="analytics" size={16} color="#FFFFFF" />
            <Text style={styles.analyzeButtonText}>Analyze</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Posts List */}
      <FlatList
        data={posts}
        renderItem={selectedPlatform === 'instagram' ? renderInstagramPost : renderTikTokPost}
        keyExtractor={(item) => item.id}
        style={styles.postsList}
        contentContainerStyle={styles.postsListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Icon name="search" size={64} color={styles.iconColor.color} />
              <Text style={styles.emptyStateTitle}>No Content Found</Text>
              <Text style={styles.emptyStateText}>
                {selectedPlatform === 'instagram'
                  ? 'Search for Instagram hashtags to get started'
                  : 'Search for TikTok hashtags or usernames to get started'}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const getStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333333' : '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
  },
  platformSelector: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  platformButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderWidth: 1,
    borderColor: isDark ? '#333333' : '#E0E0E0',
  },
  platformButtonActive: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
  },
  platformButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#CCCCCC' : '#666666',
  },
  platformButtonTextActive: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: isDark ? '#333333' : '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginLeft: 12,
    height: 48,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    flex: 1,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  postsList: {
    flex: 1,
  },
  postsListContent: {
    padding: 20,
    paddingTop: 0,
  },
  postCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
  },
  postContent: {
    padding: 16,
  },
  postCaption: {
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 12,
    lineHeight: 22,
  },
  postStats: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginLeft: 4,
  },
  postOwner: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: isDark ? '#CCCCCC' : '#666666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  iconColor: {
    color: isDark ? '#CCCCCC' : '#666666',
  },
  placeholderColor: {
    color: isDark ? '#888888' : '#999999',
  },
});