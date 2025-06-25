import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function AnalysisResultScreen({ navigation, route }) {
  const { analysis } = route.params;
  const { theme } = useSelector(state => state.ui);

  const [selectedTab, setSelectedTab] = useState('overview');

  const isDark = theme === 'dark';

  const handleShare = async () => {
    try {
      const shareContent = {
        title: 'Vibe Curator Analysis Results',
        message: `Analysis Results:\n\n${analysis.insights?.keyFindings?.slice(0, 3).join('\n') || 'Analysis completed successfully'}`,
      };
      await Share.share(shareContent);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleExport = () => {
    Alert.alert(
      'Export Analysis',
      'Choose export format',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'JSON', onPress: () => console.log('Export as JSON') },
        { text: 'PDF', onPress: () => console.log('Export as PDF') },
      ]
    );
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Summary Cards */}
      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Icon name="analytics" size={24} color="#6200EE" />
          <Text style={styles.summaryValue}>
            {analysis.insights?.performanceMetrics?.overallScore?.toFixed(1) || 'N/A'}
          </Text>
          <Text style={styles.summaryLabel}>Overall Score</Text>
        </View>
        <View style={styles.summaryCard}>
          <Icon name="trending-up" size={24} color="#4CAF50" />
          <Text style={styles.summaryValue}>
            {analysis.insights?.performanceMetrics?.viralPotential?.toFixed(1) || 'N/A'}
          </Text>
          <Text style={styles.summaryLabel}>Viral Potential</Text>
        </View>
        <View style={styles.summaryCard}>
          <Icon name="favorite" size={24} color="#E91E63" />
          <Text style={styles.summaryValue}>
            {analysis.insights?.performanceMetrics?.engagementPrediction?.toFixed(1) || 'N/A'}
          </Text>
          <Text style={styles.summaryLabel}>Engagement</Text>
        </View>
      </View>

      {/* Key Findings */}
      {analysis.insights?.keyFindings && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Findings</Text>
          {analysis.insights.keyFindings.map((finding, index) => (
            <View key={index} style={styles.findingItem}>
              <Icon name="lightbulb" size={16} color="#FF9800" />
              <Text style={styles.findingText}>{finding}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Content Overview */}
      {analysis.contentOverview && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Overview</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{analysis.contentOverview.totalHashtags}</Text>
              <Text style={styles.overviewLabel}>Hashtags</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{analysis.contentOverview.totalMentions}</Text>
              <Text style={styles.overviewLabel}>Mentions</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{analysis.contentOverview.mediaCount}</Text>
              <Text style={styles.overviewLabel}>Media Items</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{analysis.contentOverview.textPosts}</Text>
              <Text style={styles.overviewLabel}>Text Posts</Text>
            </View>
          </View>
        </View>
      )}

      {/* Recommendations */}
      {analysis.insights?.actionableRecommendations && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          
          {analysis.insights.actionableRecommendations.immediate && (
            <View style={styles.recommendationGroup}>
              <Text style={styles.recommendationTitle}>Immediate Actions</Text>
              {analysis.insights.actionableRecommendations.immediate.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Icon name="priority-high" size={16} color="#FF5252" />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}

          {analysis.insights.actionableRecommendations.shortTerm && (
            <View style={styles.recommendationGroup}>
              <Text style={styles.recommendationTitle}>Short-term Goals</Text>
              {analysis.insights.actionableRecommendations.shortTerm.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Icon name="schedule" size={16} color="#FF9800" />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}

          {analysis.insights.actionableRecommendations.longTerm && (
            <View style={styles.recommendationGroup}>
              <Text style={styles.recommendationTitle}>Long-term Strategy</Text>
              {analysis.insights.actionableRecommendations.longTerm.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Icon name="flag" size={16} color="#4CAF50" />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderSentiment = () => (
    <View style={styles.tabContent}>
      {analysis.analysis?.sentiment && (
        <>
          {/* Sentiment Distribution */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sentiment Distribution</Text>
            <View style={styles.sentimentBars}>
              <View style={styles.sentimentBar}>
                <Text style={styles.sentimentLabel}>Positive</Text>
                <View style={styles.sentimentBarContainer}>
                  <View
                    style={[
                      styles.sentimentBarFill,
                      {
                        width: `${(analysis.analysis.sentiment.sentimentDistribution.positive * 100)}%`,
                        backgroundColor: '#4CAF50',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.sentimentValue}>
                  {(analysis.analysis.sentiment.sentimentDistribution.positive * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.sentimentBar}>
                <Text style={styles.sentimentLabel}>Neutral</Text>
                <View style={styles.sentimentBarContainer}>
                  <View
                    style={[
                      styles.sentimentBarFill,
                      {
                        width: `${(analysis.analysis.sentiment.sentimentDistribution.neutral * 100)}%`,
                        backgroundColor: '#FF9800',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.sentimentValue}>
                  {(analysis.analysis.sentiment.sentimentDistribution.neutral * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.sentimentBar}>
                <Text style={styles.sentimentLabel}>Negative</Text>
                <View style={styles.sentimentBarContainer}>
                  <View
                    style={[
                      styles.sentimentBarFill,
                      {
                        width: `${(analysis.analysis.sentiment.sentimentDistribution.negative * 100)}%`,
                        backgroundColor: '#F44336',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.sentimentValue}>
                  {(analysis.analysis.sentiment.sentimentDistribution.negative * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Emotions */}
          {analysis.analysis.sentiment.emotions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Primary Emotions</Text>
              <View style={styles.emotionTags}>
                {analysis.analysis.sentiment.emotions.primary.map((emotion, index) => (
                  <View key={index} style={styles.emotionTag}>
                    <Text style={styles.emotionTagText}>{emotion}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Key Themes */}
          {analysis.analysis.sentiment.keyThemes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Themes</Text>
              {analysis.analysis.sentiment.keyThemes.map((theme, index) => (
                <View key={index} style={styles.themeItem}>
                  <Text style={styles.themeTitle}>{theme.theme}</Text>
                  <View style={styles.themeStats}>
                    <Text style={styles.themeStat}>
                      Sentiment: {theme.sentiment > 0 ? '+' : ''}{theme.sentiment.toFixed(2)}
                    </Text>
                    <Text style={styles.themeStat}>
                      Frequency: {(theme.frequency * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );

  const renderVideo = () => (
    <View style={styles.tabContent}>
      {analysis.analysis?.video && (
        <>
          {/* Content Analysis */}
          {analysis.analysis.video.contentAnalysis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Content Analysis</Text>
              <View style={styles.analysisGrid}>
                <View style={styles.analysisItem}>
                  <Text style={styles.analysisLabel}>Category</Text>
                  <Text style={styles.analysisValue}>
                    {analysis.analysis.video.contentAnalysis.primaryCategory}
                  </Text>
                </View>
                <View style={styles.analysisItem}>
                  <Text style={styles.analysisLabel}>Content Type</Text>
                  <Text style={styles.analysisValue}>
                    {analysis.analysis.video.contentAnalysis.contentType}
                  </Text>
                </View>
                <View style={styles.analysisItem}>
                  <Text style={styles.analysisLabel}>Visual Style</Text>
                  <Text style={styles.analysisValue}>
                    {analysis.analysis.video.contentAnalysis.visualStyle}
                  </Text>
                </View>
              </View>
              
              {analysis.analysis.video.contentAnalysis.themes && (
                <View style={styles.themesList}>
                  <Text style={styles.themesTitle}>Themes:</Text>
                  <View style={styles.themeTags}>
                    {analysis.analysis.video.contentAnalysis.themes.map((theme, index) => (
                      <View key={index} style={styles.themeTag}>
                        <Text style={styles.themeTagText}>{theme}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Viral Potential */}
          {analysis.analysis.video.viralPotential && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Viral Potential</Text>
              <View style={styles.viralScore}>
                <Text style={styles.viralScoreValue}>
                  {(analysis.analysis.video.viralPotential.score * 100).toFixed(1)}%
                </Text>
                <Text style={styles.viralScoreLabel}>Viral Score</Text>
              </View>
              
              {analysis.analysis.video.viralPotential.factors && (
                <View style={styles.viralFactors}>
                  {Object.entries(analysis.analysis.video.viralPotential.factors).map(([key, value]) => (
                    <View key={key} style={styles.viralFactor}>
                      <Text style={styles.viralFactorLabel}>
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                      <View style={styles.viralFactorBar}>
                        <View
                          style={[
                            styles.viralFactorFill,
                            { width: `${value * 100}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.viralFactorValue}>{(value * 100).toFixed(0)}%</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Hashtag Analysis */}
          {analysis.analysis.video.hashtagAnalysis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hashtag Analysis</Text>
              <View style={styles.hashtagStats}>
                <Text style={styles.hashtagStat}>
                  Effectiveness: {(analysis.analysis.video.hashtagAnalysis.effectiveness * 100).toFixed(1)}%
                </Text>
                <Text style={styles.hashtagStat}>
                  Reach Potential: {(analysis.analysis.video.hashtagAnalysis.hashtag_reach_potential * 100).toFixed(1)}%
                </Text>
              </View>
              
              {analysis.analysis.video.hashtagAnalysis.trending_hashtags && (
                <View style={styles.hashtagList}>
                  <Text style={styles.hashtagListTitle}>Trending Hashtags:</Text>
                  <View style={styles.hashtagTags}>
                    {analysis.analysis.video.hashtagAnalysis.trending_hashtags.map((hashtag, index) => (
                      <View key={index} style={styles.hashtagTag}>
                        <Text style={styles.hashtagTagText}>#{hashtag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );

  const renderDocument = () => (
    <View style={styles.tabContent}>
      {analysis.analysis?.document && (
        <>
          {/* Text Processing */}
          {analysis.analysis.document.textProcessing && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Text Processing</Text>
              <View style={styles.textStats}>
                <View style={styles.textStat}>
                  <Text style={styles.textStatValue}>
                    {analysis.analysis.document.textProcessing.word_count}
                  </Text>
                  <Text style={styles.textStatLabel}>Words</Text>
                </View>
                <View style={styles.textStat}>
                  <Text style={styles.textStatValue}>
                    {analysis.analysis.document.textProcessing.reading_time}
                  </Text>
                  <Text style={styles.textStatLabel}>Min Read</Text>
                </View>
                <View style={styles.textStat}>
                  <Text style={styles.textStatValue}>
                    {analysis.analysis.document.textProcessing.language}
                  </Text>
                  <Text style={styles.textStatLabel}>Language</Text>
                </View>
                <View style={styles.textStat}>
                  <Text style={styles.textStatValue}>
                    {(analysis.analysis.document.textProcessing.text_quality * 100).toFixed(0)}%
                  </Text>
                  <Text style={styles.textStatLabel}>Quality</Text>
                </View>
              </View>
            </View>
          )}

          {/* Content Summary */}
          {analysis.analysis.document.contentSummary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Content Summary</Text>
              <Text style={styles.summaryText}>
                {analysis.analysis.document.contentSummary.executive_summary}
              </Text>
              
              {analysis.analysis.document.contentSummary.key_points && (
                <View style={styles.keyPoints}>
                  <Text style={styles.keyPointsTitle}>Key Points:</Text>
                  {analysis.analysis.document.contentSummary.key_points.map((point, index) => (
                    <View key={index} style={styles.keyPoint}>
                      <Icon name="fiber-manual-record" size={6} color="#6200EE" />
                      <Text style={styles.keyPointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Keywords */}
          {analysis.analysis.document.keywordAnalysis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Keywords</Text>
              <Text style={styles.keywordDensity}>
                Keyword Density: {(analysis.analysis.document.keywordAnalysis.keyword_density * 100).toFixed(1)}%
              </Text>
              
              {analysis.analysis.document.keywordAnalysis.primary_keywords && (
                <View style={styles.keywordsList}>
                  {analysis.analysis.document.keywordAnalysis.primary_keywords.map((keyword, index) => (
                    <View key={index} style={styles.keywordItem}>
                      <Text style={styles.keywordText}>{keyword.keyword}</Text>
                      <Text style={styles.keywordImportance}>
                        {(keyword.importance * 100).toFixed(0)}%
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* SEO Analysis */}
          {analysis.analysis.document.seoAnalysis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SEO Analysis</Text>
              <View style={styles.seoScore}>
                <Text style={styles.seoScoreValue}>
                  {(analysis.analysis.document.seoAnalysis.seo_score * 100).toFixed(0)}
                </Text>
                <Text style={styles.seoScoreLabel}>SEO Score</Text>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );

  const tabs = [
    { id: 'overview', title: 'Overview', icon: 'dashboard' },
    { id: 'sentiment', title: 'Sentiment', icon: 'sentiment-satisfied' },
    { id: 'video', title: 'Video', icon: 'video-library' },
    { id: 'document', title: 'Document', icon: 'description' },
  ];

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={styles.iconColor.color} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction} onPress={handleShare}>
            <Icon name="share" size={20} color={styles.iconColor.color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction} onPress={handleExport}>
            <Icon name="download" size={20} color={styles.iconColor.color} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                selectedTab === tab.id && styles.tabActive,
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Icon
                name={tab.icon}
                size={16}
                color={selectedTab === tab.id ? '#FFFFFF' : (isDark ? '#CCCCCC' : '#666666')}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.scrollView}>
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'sentiment' && renderSentiment()}
        {selectedTab === 'video' && renderVideo()}
        {selectedTab === 'document' && renderDocument()}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333333' : '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabNavigation: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333333' : '#E0E0E0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: '#6200EE',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#CCCCCC' : '#666666',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 16,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  findingText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  overviewItem: {
    width: (width - 76) / 2,
    alignItems: 'center',
    padding: 12,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    borderRadius: 8,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  recommendationGroup: {
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  sentimentBars: {
    gap: 12,
  },
  sentimentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sentimentLabel: {
    fontSize: 14,
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    width: 60,
  },
  sentimentBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: isDark ? '#333333' : '#E0E0E0',
    borderRadius: 4,
  },
  sentimentBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  sentimentValue: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    width: 40,
    textAlign: 'right',
  },
  emotionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emotionTag: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  emotionTagText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  themeItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    borderRadius: 8,
  },
  themeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 4,
  },
  themeStats: {
    flexDirection: 'row',
    gap: 16,
  },
  themeStat: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  analysisItem: {
    width: (width - 76) / 2,
    padding: 12,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    borderRadius: 8,
  },
  analysisLabel: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
    marginBottom: 4,
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
  },
  themesList: {
    marginTop: 16,
  },
  themesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 8,
  },
  themeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeTag: {
    backgroundColor: isDark ? '#333333' : '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  themeTagText: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  viralScore: {
    alignItems: 'center',
    marginBottom: 16,
  },
  viralScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  viralScoreLabel: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  viralFactors: {
    gap: 12,
  },
  viralFactor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viralFactorLabel: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
    width: 80,
  },
  viralFactorBar: {
    flex: 1,
    height: 6,
    backgroundColor: isDark ? '#333333' : '#E0E0E0',
    borderRadius: 3,
  },
  viralFactorFill: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 3,
  },
  viralFactorValue: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
    width: 30,
    textAlign: 'right',
  },
  hashtagStats: {
    marginBottom: 16,
  },
  hashtagStat: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginBottom: 4,
  },
  hashtagList: {
    marginTop: 16,
  },
  hashtagListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 8,
  },
  hashtagTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtagTag: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hashtagTagText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textStats: {
    flexDirection: 'row',
    gap: 12,
  },
  textStat: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    borderRadius: 8,
  },
  textStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 4,
  },
  textStatLabel: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  summaryText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  keyPoints: {
    marginTop: 16,
  },
  keyPointsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 8,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  keyPointText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  keywordDensity: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginBottom: 12,
  },
  keywordsList: {
    gap: 8,
  },
  keywordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    borderRadius: 6,
  },
  keywordText: {
    fontSize: 14,
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    fontWeight: '600',
  },
  keywordImportance: {
    fontSize: 12,
    color: '#6200EE',
    fontWeight: '600',
  },
  seoScore: {
    alignItems: 'center',
  },
  seoScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  seoScoreLabel: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  iconColor: {
    color: isDark ? '#CCCCCC' : '#666666',
  },
});