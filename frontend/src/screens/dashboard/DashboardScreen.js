import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { setActiveTab, setRefreshing } from '../../store/slices/uiSlice';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { theme, refreshing } = useSelector(state => state.ui);
  const { analysisHistory } = useSelector(state => state.analysis);
  const { contentHistory } = useSelector(state => state.content);

  const isDark = theme === 'dark';
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    dispatch(setActiveTab('dashboard'));
    updateGreeting();
  }, [dispatch]);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  };

  const onRefresh = async () => {
    dispatch(setRefreshing(true));
    // Simulate refresh delay
    setTimeout(() => {
      dispatch(setRefreshing(false));
    }, 1000);
  };

  const quickActions = [
    {
      id: 'scrape-instagram',
      title: 'Instagram Analysis',
      subtitle: 'Analyze Instagram content',
      icon: 'photo-camera',
      color: '#E1306C',
      onPress: () => navigation.navigate('Content', { platform: 'instagram' }),
    },
    {
      id: 'scrape-tiktok',
      title: 'TikTok Analysis',
      subtitle: 'Analyze TikTok videos',
      icon: 'video-library',
      color: '#000000',
      onPress: () => navigation.navigate('Content', { platform: 'tiktok' }),
    },
    {
      id: 'sentiment-analysis',
      title: 'Sentiment Analysis',
      subtitle: 'Analyze text sentiment',
      icon: 'sentiment-satisfied',
      color: '#4CAF50',
      onPress: () => navigation.navigate('Analysis', { type: 'sentiment' }),
    },
    {
      id: 'document-processing',
      title: 'Document Processing',
      subtitle: 'Process documents',
      icon: 'description',
      color: '#FF9800',
      onPress: () => navigation.navigate('Analysis', { type: 'document' }),
    },
  ];

  const recentAnalyses = analysisHistory.slice(0, 3);
  const recentContent = contentHistory.slice(0, 3);

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.username}>{user?.username || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="person" size={24} color={styles.iconColor.color} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="analytics" size={24} color="#6200EE" />
            <Text style={styles.statNumber}>{analysisHistory.length}</Text>
            <Text style={styles.statLabel}>Analyses</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="video-library" size={24} color="#E1306C" />
            <Text style={styles.statNumber}>{contentHistory.length}</Text>
            <Text style={styles.statLabel}>Content Items</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Icon name={action.icon} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Analyses */}
        {recentAnalyses.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Analyses</Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {recentAnalyses.map((analysis, index) => (
              <TouchableOpacity
                key={analysis.id}
                style={styles.recentItem}
                onPress={() => navigation.navigate('AnalysisResult', { analysis })}
              >
                <View style={styles.recentItemIcon}>
                  <Icon
                    name={getAnalysisIcon(analysis.type)}
                    size={20}
                    color="#6200EE"
                  />
                </View>
                <View style={styles.recentItemContent}>
                  <Text style={styles.recentItemTitle}>
                    {getAnalysisTitle(analysis.type)}
                  </Text>
                  <Text style={styles.recentItemTime}>
                    {formatTime(analysis.timestamp)}
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={styles.iconColor.color} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Content */}
        {recentContent.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Content</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Content')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {recentContent.map((content, index) => (
              <TouchableOpacity
                key={content.id}
                style={styles.recentItem}
                onPress={() => navigation.navigate('ContentDetail', { content })}
              >
                <View style={styles.recentItemIcon}>
                  <Icon
                    name={content.platform === 'instagram' ? 'photo-camera' : 'video-library'}
                    size={20}
                    color={content.platform === 'instagram' ? '#E1306C' : '#000000'}
                  />
                </View>
                <View style={styles.recentItemContent}>
                  <Text style={styles.recentItemTitle}>
                    {content.platform.charAt(0).toUpperCase() + content.platform.slice(1)} - {content.query}
                  </Text>
                  <Text style={styles.recentItemTime}>
                    {formatTime(content.timestamp)}
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={styles.iconColor.color} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

const getStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
  },
  greeting: {
    fontSize: 16,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginTop: 4,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
  },
  seeAllText: {
    fontSize: 16,
    color: '#6200EE',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionCard: {
    width: (width - 56) / 2,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    textAlign: 'center',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recentItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 4,
  },
  recentItemTime: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  iconColor: {
    color: isDark ? '#CCCCCC' : '#666666',
  },
});