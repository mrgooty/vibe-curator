import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { setActiveTab, setRefreshing } from '../../store/slices/uiSlice';

export default function HistoryScreen({ navigation }) {
  const dispatch = useDispatch();
  const { analysisHistory } = useSelector(state => state.analysis);
  const { contentHistory } = useSelector(state => state.content);
  const { theme, refreshing } = useSelector(state => state.ui);
  const { user } = useSelector(state => state.auth);

  const [selectedTab, setSelectedTab] = useState('analysis');
  const [sortBy, setSortBy] = useState('timestamp');

  const isDark = theme === 'dark';

  useEffect(() => {
    dispatch(setActiveTab('history'));
  }, [dispatch]);

  const onRefresh = async () => {
    dispatch(setRefreshing(true));
    // Simulate refresh delay
    setTimeout(() => {
      dispatch(setRefreshing(false));
    }, 1000);
  };

  const getCurrentData = () => {
    const data = selectedTab === 'analysis' ? analysisHistory : contentHistory;
    return [...data].sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      return 0;
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  const getAnalysisIcon = (type) => {
    switch (type) {
      case 'sentiment': return 'sentiment-satisfied';
      case 'video': return 'video-library';
      case 'document': return 'description';
      case 'comprehensive': return 'analytics';
      default: return 'analytics';
    }
  };

  const getAnalysisTitle = (type) => {
    switch (type) {
      case 'sentiment': return 'Sentiment Analysis';
      case 'video': return 'Video Analysis';
      case 'document': return 'Document Processing';
      case 'comprehensive': return 'Comprehensive Analysis';
      default: return 'Analysis';
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram': return 'photo-camera';
      case 'tiktok': return 'video-library';
      default: return 'public';
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'instagram': return '#E1306C';
      case 'tiktok': return '#000000';
      default: return '#6200EE';
    }
  };

  const renderAnalysisItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigation.navigate('AnalysisResult', { analysis: item.result })}
    >
      <View style={styles.itemIcon}>
        <Icon
          name={getAnalysisIcon(item.type)}
          size={24}
          color="#6200EE"
        />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{getAnalysisTitle(item.type)}</Text>
        <Text style={styles.itemSubtitle} numberOfLines={2}>
          {item.result?.insights?.keyFindings?.[0] || 'Analysis completed'}
        </Text>
        <View style={styles.itemMeta}>
          <Text style={styles.itemTime}>{formatDate(item.timestamp)}</Text>
          {item.result?.metadata?.processingTime && (
            <Text style={styles.itemProcessingTime}>
              • {item.result.metadata.processingTime}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            Alert.alert(
              'Share Analysis',
              'Share this analysis result?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Share', onPress: () => console.log('Share analysis') },
              ]
            );
          }}
        >
          <Icon name="share" size={16} color={styles.iconColor.color} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            Alert.alert(
              'Delete Analysis',
              'Are you sure you want to delete this analysis?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete analysis') },
              ]
            );
          }}
        >
          <Icon name="delete" size={16} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderContentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigation.navigate('ContentDetail', { content: item.data })}
    >
      <View style={styles.itemIcon}>
        <Icon
          name={getPlatformIcon(item.platform)}
          size={24}
          color={getPlatformColor(item.platform)}
        />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>
          {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)} Content
        </Text>
        <Text style={styles.itemSubtitle} numberOfLines={2}>
          {item.query} • {item.data?.count || 0} posts
        </Text>
        <View style={styles.itemMeta}>
          <Text style={styles.itemTime}>{formatDate(item.timestamp)}</Text>
          {item.data?.scrapedAt && (
            <Text style={styles.itemProcessingTime}>
              • Scraped {formatDate(item.data.scrapedAt)}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Analysis', { 
            contentData: item.data,
            platform: item.platform 
          })}
        >
          <Icon name="analytics" size={16} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            Alert.alert(
              'Delete Content',
              'Are you sure you want to delete this content history?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete content') },
              ]
            );
          }}
        >
          <Icon name="delete" size={16} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const currentData = getCurrentData();

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            Alert.alert(
              'Sort Options',
              'Choose sorting option',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'By Date', onPress: () => setSortBy('timestamp') },
              ]
            );
          }}
        >
          <Icon name="sort" size={20} color={styles.iconColor.color} />
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'analysis' && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab('analysis')}
        >
          <Icon
            name="analytics"
            size={20}
            color={selectedTab === 'analysis' ? '#FFFFFF' : (isDark ? '#CCCCCC' : '#666666')}
          />
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'analysis' && styles.tabButtonTextActive,
            ]}
          >
            Analyses ({analysisHistory.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'content' && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab('content')}
        >
          <Icon
            name="video-library"
            size={20}
            color={selectedTab === 'content' ? '#FFFFFF' : (isDark ? '#CCCCCC' : '#666666')}
          />
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'content' && styles.tabButtonTextActive,
            ]}
          >
            Content ({contentHistory.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* History List */}
      <FlatList
        data={currentData}
        renderItem={selectedTab === 'analysis' ? renderAnalysisItem : renderContentItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.historyList}
        contentContainerStyle={styles.historyListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon
              name={selectedTab === 'analysis' ? 'analytics' : 'video-library'}
              size={64}
              color={styles.iconColor.color}
            />
            <Text style={styles.emptyStateTitle}>
              No {selectedTab === 'analysis' ? 'Analyses' : 'Content'} Yet
            </Text>
            <Text style={styles.emptyStateText}>
              {selectedTab === 'analysis'
                ? 'Start analyzing content to see your history here'
                : 'Search for content to see your history here'}
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => {
                if (selectedTab === 'analysis') {
                  navigation.navigate('Analysis');
                } else {
                  navigation.navigate('Content');
                }
              }}
            >
              <Text style={styles.emptyStateButtonText}>
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSelector: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  tabButton: {
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
  tabButtonActive: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
  },
  tabButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#CCCCCC' : '#666666',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  historyList: {
    flex: 1,
  },
  historyListContent: {
    padding: 20,
    paddingTop: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTime: {
    fontSize: 12,
    color: isDark ? '#888888' : '#999999',
  },
  itemProcessingTime: {
    fontSize: 12,
    color: isDark ? '#888888' : '#999999',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  iconColor: {
    color: isDark ? '#CCCCCC' : '#666666',
  },
});