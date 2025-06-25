import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  analyzeContentComprehensive,
  analyzeVideo,
  processDocument,
  analyzeSentiment,
  clearError,
  clearCurrentAnalysis,
} from '../../store/slices/analysisSlice';
import { setActiveTab, addNotification } from '../../store/slices/uiSlice';

export default function AnalysisScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const {
    currentAnalysis,
    loading,
    error,
    analysisType,
    progress,
  } = useSelector(state => state.analysis);
  const { theme } = useSelector(state => state.ui);

  const [selectedAnalysisType, setSelectedAnalysisType] = useState('comprehensive');
  const [inputText, setInputText] = useState('');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [analysisOptions, setAnalysisOptions] = useState({
    contentType: 'text',
    platform: 'general',
    batchSize: 10,
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    dispatch(setActiveTab('analysis'));
    if (route.params?.type) {
      setSelectedAnalysisType(route.params.type);
    }
    if (route.params?.contentData) {
      // Pre-populate with content data from ContentScreen
      const contentData = route.params.contentData;
      const contentText = contentData.data
        .map(item => item.caption || item.text || '')
        .filter(text => text.length > 0)
        .join('\n\n');
      setInputText(contentText);
      setAnalysisOptions({
        ...analysisOptions,
        platform: route.params.platform || 'general',
        contentType: route.params.platform === 'tiktok' ? 'video' : 'image',
      });
    }
  }, [dispatch, route.params]);

  useEffect(() => {
    if (error) {
      Alert.alert('Analysis Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (currentAnalysis) {
      navigation.navigate('AnalysisResult', { analysis: currentAnalysis });
    }
  }, [currentAnalysis, navigation]);

  const analysisTypes = [
    {
      id: 'comprehensive',
      title: 'Comprehensive Analysis',
      subtitle: 'Full AI-powered content analysis',
      icon: 'analytics',
      color: '#6200EE',
    },
    {
      id: 'sentiment',
      title: 'Sentiment Analysis',
      subtitle: 'Analyze emotional tone and sentiment',
      icon: 'sentiment-satisfied',
      color: '#4CAF50',
    },
    {
      id: 'video',
      title: 'Video Analysis',
      subtitle: 'Analyze video content and engagement',
      icon: 'video-library',
      color: '#FF9800',
    },
    {
      id: 'document',
      title: 'Document Processing',
      subtitle: 'Process and analyze documents',
      icon: 'description',
      color: '#2196F3',
    },
  ];

  const handleAnalysis = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter content to analyze');
      return;
    }

    try {
      dispatch(clearCurrentAnalysis());
      
      const analysisInput = {
        options: analysisOptions,
      };

      switch (selectedAnalysisType) {
        case 'comprehensive':
          analysisInput.rawContent = inputText.trim();
          await dispatch(analyzeContentComprehensive(analysisInput)).unwrap();
          break;
        case 'sentiment':
          analysisInput.content = inputText.trim();
          await dispatch(analyzeSentiment(analysisInput)).unwrap();
          break;
        case 'video':
          analysisInput.videoContent = inputText.trim();
          await dispatch(analyzeVideo(analysisInput)).unwrap();
          break;
        case 'document':
          analysisInput.documentContent = inputText.trim();
          await dispatch(processDocument(analysisInput)).unwrap();
          break;
        default:
          throw new Error('Invalid analysis type');
      }

      dispatch(addNotification({
        type: 'success',
        title: 'Analysis Complete',
        message: `${getAnalysisTitle(selectedAnalysisType)} completed successfully`,
      }));
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const getAnalysisTitle = (type) => {
    const analysisType = analysisTypes.find(t => t.id === type);
    return analysisType?.title || 'Analysis';
  };

  const getAnalysisColor = (type) => {
    const analysisType = analysisTypes.find(t => t.id === type);
    return analysisType?.color || '#6200EE';
  };

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Analysis</Text>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={() => setShowOptionsModal(true)}
          >
            <Icon name="settings" size={24} color={styles.iconColor.color} />
          </TouchableOpacity>
        </View>

        {/* Analysis Type Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analysis Type</Text>
          <View style={styles.analysisTypesGrid}>
            {analysisTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.analysisTypeCard,
                  selectedAnalysisType === type.id && styles.analysisTypeCardActive,
                ]}
                onPress={() => setSelectedAnalysisType(type.id)}
              >
                <View style={[styles.analysisTypeIcon, { backgroundColor: type.color }]}>
                  <Icon name={type.icon} size={24} color="#FFFFFF" />
                </View>
                <Text style={[
                  styles.analysisTypeTitle,
                  selectedAnalysisType === type.id && styles.analysisTypeTextActive,
                ]}>
                  {type.title}
                </Text>
                <Text style={[
                  styles.analysisTypeSubtitle,
                  selectedAnalysisType === type.id && styles.analysisTypeTextActive,
                ]}>
                  {type.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Input</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={getInputPlaceholder(selectedAnalysisType)}
              placeholderTextColor={styles.placeholderColor.color}
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.inputFooter}>
              <Text style={styles.characterCount}>
                {inputText.length} characters
              </Text>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setInputText('')}
              >
                <Icon name="clear" size={16} color={styles.iconColor.color} />
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Analysis Progress */}
        {loading && (
          <View style={styles.section}>
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Analyzing Content...</Text>
                <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%`, backgroundColor: getAnalysisColor(selectedAnalysisType) },
                  ]}
                />
              </View>
              <ActivityIndicator
                size="large"
                color={getAnalysisColor(selectedAnalysisType)}
                style={styles.loadingIndicator}
              />
            </View>
          </View>
        )}

        {/* Action Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              { backgroundColor: getAnalysisColor(selectedAnalysisType) },
              loading && styles.analyzeButtonDisabled,
            ]}
            onPress={handleAnalysis}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Icon name="analytics" size={20} color="#FFFFFF" />
                <Text style={styles.analyzeButtonText}>
                  Start {getAnalysisTitle(selectedAnalysisType)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Analysis Options</Text>
            <TouchableOpacity onPress={() => setShowOptionsModal(false)}>
              <Icon name="close" size={24} color={styles.iconColor.color} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Content Type</Text>
              <View style={styles.optionButtons}>
                {['text', 'image', 'video', 'mixed'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      analysisOptions.contentType === type && styles.optionButtonActive,
                    ]}
                    onPress={() => setAnalysisOptions({
                      ...analysisOptions,
                      contentType: type,
                    })}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      analysisOptions.contentType === type && styles.optionButtonTextActive,
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Platform</Text>
              <View style={styles.optionButtons}>
                {['general', 'instagram', 'tiktok', 'twitter'].map((platform) => (
                  <TouchableOpacity
                    key={platform}
                    style={[
                      styles.optionButton,
                      analysisOptions.platform === platform && styles.optionButtonActive,
                    ]}
                    onPress={() => setAnalysisOptions({
                      ...analysisOptions,
                      platform: platform,
                    })}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      analysisOptions.platform === platform && styles.optionButtonTextActive,
                    ]}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Batch Size: {analysisOptions.batchSize}</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>1</Text>
                <View style={styles.slider}>
                  {/* Simple slider implementation */}
                  <TouchableOpacity
                    style={styles.sliderTrack}
                    onPress={(e) => {
                      const value = Math.round((e.nativeEvent.locationX / 200) * 49) + 1;
                      setAnalysisOptions({
                        ...analysisOptions,
                        batchSize: Math.max(1, Math.min(50, value)),
                      });
                    }}
                  >
                    <View
                      style={[
                        styles.sliderFill,
                        { width: `${(analysisOptions.batchSize - 1) * 2}%` },
                      ]}
                    />
                    <View
                      style={[
                        styles.sliderThumb,
                        { left: `${(analysisOptions.batchSize - 1) * 2}%` },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.sliderLabel}>50</Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const getInputPlaceholder = (type) => {
  switch (type) {
    case 'sentiment':
      return 'Enter text to analyze sentiment...';
    case 'video':
      return 'Enter video description or metadata...';
    case 'document':
      return 'Paste document content here...';
    case 'comprehensive':
    default:
      return 'Enter content for comprehensive analysis...';
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
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333333' : '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
  },
  optionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 16,
  },
  analysisTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analysisTypeCard: {
    width: '48%',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  analysisTypeCardActive: {
    borderColor: '#6200EE',
  },
  analysisTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  analysisTypeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  analysisTypeSubtitle: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
    textAlign: 'center',
  },
  analysisTypeTextActive: {
    color: '#6200EE',
  },
  inputContainer: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#333333' : '#E0E0E0',
  },
  textInput: {
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    padding: 16,
    minHeight: 120,
    maxHeight: 200,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#333333' : '#E0E0E0',
  },
  characterCount: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
    marginLeft: 4,
  },
  progressContainer: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  progressBar: {
    height: 8,
    backgroundColor: isDark ? '#333333' : '#E0E0E0',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  loadingIndicator: {
    marginTop: 8,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200EE',
    borderRadius: 12,
    padding: 16,
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333333' : '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  optionGroup: {
    marginBottom: 24,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 12,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? '#1E1E1E' : '#F0F0F0',
    borderWidth: 1,
    borderColor: isDark ? '#333333' : '#E0E0E0',
  },
  optionButtonActive: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
  },
  optionButtonText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderLabel: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  slider: {
    flex: 1,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: isDark ? '#333333' : '#E0E0E0',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#6200EE',
    borderRadius: 8,
    marginLeft: -8,
  },
  iconColor: {
    color: isDark ? '#CCCCCC' : '#666666',
  },
  placeholderColor: {
    color: isDark ? '#888888' : '#999999',
  },
});