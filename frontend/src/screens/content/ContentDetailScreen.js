import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ContentDetailScreen({ navigation, route }) {
  const { content, platform } = route.params;
  const { theme } = useSelector(state => state.ui);

  const [imageError, setImageError] = useState(false);

  const isDark = theme === 'dark';

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = async () => {
    try {
      const shareContent = {
        title: platform === 'instagram' ? 'Instagram Post' : 'TikTok Video',
        message: `Check out this ${platform} content: ${content.caption || content.text || 'No description'}`,
        url: getContentUrl(),
      };
      await Share.share(shareContent);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleOpenOriginal = () => {
    const url = getContentUrl();
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Could not open the original content');
      });
    }
  };

  const getContentUrl = () => {
    if (platform === 'instagram') {
      return `https://instagram.com/p/${content.shortCode}`;
    } else if (platform === 'tiktok') {
      return content.webVideoUrl || content.videoUrl;
    }
    return null;
  };

  const handleAnalyze = () => {
    navigation.navigate('Analysis', {
      contentData: { data: [content] },
      platform: platform,
    });
  };

  const renderInstagramContent = () => (
    <>
      {/* Image */}
      <View style={styles.mediaContainer}>
        {!imageError ? (
          <Image
            source={{ uri: content.displayUrl }}
            style={styles.contentImage}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="image" size={48} color={styles.iconColor.color} />
            <Text style={styles.placeholderText}>Image not available</Text>
          </View>
        )}
      </View>

      {/* Content Info */}
      <View style={styles.contentInfo}>
        <View style={styles.authorInfo}>
          <View style={styles.authorAvatar}>
            <Icon name="person" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.authorName}>@{content.ownerUsername}</Text>
        </View>

        {content.caption && (
          <Text style={styles.caption}>{content.caption}</Text>
        )}

        {content.location && (
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={16} color={styles.iconColor.color} />
            <Text style={styles.locationText}>{content.location}</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="favorite" size={20} color="#E91E63" />
            <Text style={styles.statText}>{formatNumber(content.likesCount)} likes</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="comment" size={20} color="#2196F3" />
            <Text style={styles.statText}>{formatNumber(content.commentsCount)} comments</Text>
          </View>
        </View>

        {/* Hashtags */}
        {content.hashtags && content.hashtags.length > 0 && (
          <View style={styles.hashtagsContainer}>
            <Text style={styles.hashtagsTitle}>Hashtags:</Text>
            <View style={styles.hashtags}>
              {content.hashtags.map((hashtag, index) => (
                <Text key={index} style={styles.hashtag}>
                  #{hashtag}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataItem}>Type: {content.type}</Text>
          <Text style={styles.metadataItem}>Posted: {formatDate(content.timestamp)}</Text>
          <Text style={styles.metadataItem}>ID: {content.shortCode}</Text>
        </View>
      </View>
    </>
  );

  const renderTikTokContent = () => (
    <>
      {/* Video Thumbnail */}
      <View style={styles.mediaContainer}>
        {!imageError && content.covers?.default ? (
          <Image
            source={{ uri: content.covers.default }}
            style={styles.contentImage}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="play-circle-filled" size={48} color={styles.iconColor.color} />
            <Text style={styles.placeholderText}>Video thumbnail not available</Text>
          </View>
        )}
        <View style={styles.playButton}>
          <Icon name="play-arrow" size={32} color="#FFFFFF" />
        </View>
      </View>

      {/* Content Info */}
      <View style={styles.contentInfo}>
        <View style={styles.authorInfo}>
          <View style={styles.authorAvatar}>
            {content.authorMeta?.avatar ? (
              <Image
                source={{ uri: content.authorMeta.avatar }}
                style={styles.authorAvatarImage}
              />
            ) : (
              <Icon name="person" size={20} color="#FFFFFF" />
            )}
          </View>
          <View>
            <Text style={styles.authorName}>
              {content.authorMeta?.name || 'Unknown'}
            </Text>
            {content.authorMeta?.nickName && (
              <Text style={styles.authorNickname}>
                @{content.authorMeta.nickName}
              </Text>
            )}
          </View>
          {content.authorMeta?.verified && (
            <Icon name="verified" size={16} color="#2196F3" />
          )}
        </View>

        {content.text && (
          <Text style={styles.caption}>{content.text}</Text>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="favorite" size={20} color="#E91E63" />
            <Text style={styles.statText}>{formatNumber(content.diggCount)} likes</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="comment" size={20} color="#2196F3" />
            <Text style={styles.statText}>{formatNumber(content.commentCount)} comments</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="share" size={20} color="#4CAF50" />
            <Text style={styles.statText}>{formatNumber(content.shareCount)} shares</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="play-arrow" size={20} color="#FF9800" />
            <Text style={styles.statText}>{formatNumber(content.playCount)} plays</Text>
          </View>
        </View>

        {/* Music Info */}
        {content.musicMeta && (
          <View style={styles.musicContainer}>
            <Icon name="music-note" size={16} color={styles.iconColor.color} />
            <Text style={styles.musicText}>
              {content.musicMeta.musicName} - {content.musicMeta.musicAuthor}
            </Text>
          </View>
        )}

        {/* Video Info */}
        {content.videoMeta && (
          <View style={styles.videoInfo}>
            <Text style={styles.videoInfoText}>
              {content.videoMeta.width}x{content.videoMeta.height} • {content.videoMeta.duration}s
            </Text>
          </View>
        )}

        {/* Hashtags */}
        {content.hashtags && content.hashtags.length > 0 && (
          <View style={styles.hashtagsContainer}>
            <Text style={styles.hashtagsTitle}>Hashtags:</Text>
            <View style={styles.hashtags}>
              {content.hashtags.map((hashtag, index) => (
                <Text key={index} style={styles.hashtag}>
                  #{hashtag}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataItem}>Posted: {formatDate(content.createTime)}</Text>
          <Text style={styles.metadataItem}>ID: {content.id}</Text>
        </View>
      </View>
    </>
  );

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {platform === 'instagram' ? renderInstagramContent() : renderTikTokContent()}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Icon name="share" size={20} color={styles.iconColor.color} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleOpenOriginal}>
          <Icon name="open-in-new" size={20} color={styles.iconColor.color} />
          <Text style={styles.actionButtonText}>Open Original</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
          <Icon name="analytics" size={20} color="#FFFFFF" />
          <Text style={styles.analyzeButtonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  mediaContainer: {
    position: 'relative',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
  },
  contentImage: {
    width: '100%',
    height: 300,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginTop: 8,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentInfo: {
    padding: 20,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
  },
  authorNickname: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  caption: {
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    lineHeight: 22,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
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
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: isDark ? '#1E1E1E' : '#F0F0F0',
    borderRadius: 8,
  },
  musicText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginLeft: 8,
    flex: 1,
  },
  videoInfo: {
    marginBottom: 16,
  },
  videoInfoText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  hashtagsContainer: {
    marginBottom: 16,
  },
  hashtagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 8,
  },
  hashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtag: {
    fontSize: 14,
    color: '#6200EE',
    backgroundColor: isDark ? '#1E1E1E' : '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metadata: {
    borderTopWidth: 1,
    borderTopColor: isDark ? '#333333' : '#E0E0E0',
    paddingTop: 16,
  },
  metadataItem: {
    fontSize: 12,
    color: isDark ? '#888888' : '#999999',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: isDark ? '#333333' : '#E0E0E0',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#CCCCCC' : '#666666',
    marginLeft: 4,
  },
  analyzeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  analyzeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  iconColor: {
    color: isDark ? '#CCCCCC' : '#666666',
  },
});