import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { logoutUser } from '../../store/slices/authSlice';
import { setActiveTab, setTheme, addNotification } from '../../store/slices/uiSlice';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { theme } = useSelector(state => state.ui);
  const { analysisHistory } = useSelector(state => state.analysis);
  const { contentHistory } = useSelector(state => state.content);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const isDark = theme === 'dark';

  React.useEffect(() => {
    dispatch(setActiveTab('profile'));
  }, [dispatch]);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
            dispatch(addNotification({
              type: 'info',
              title: 'Signed Out',
              message: 'You have been signed out successfully.',
            }));
          },
        },
      ]
    );
  };

  const handleThemeToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
    dispatch(addNotification({
      type: 'info',
      title: 'Theme Changed',
      message: `Switched to ${newTheme} mode`,
    }));
  };

  const profileStats = [
    {
      label: 'Analyses',
      value: analysisHistory.length,
      icon: 'analytics',
      color: '#6200EE',
    },
    {
      label: 'Content Items',
      value: contentHistory.length,
      icon: 'video-library',
      color: '#E1306C',
    },
    {
      label: 'Days Active',
      value: user ? Math.ceil((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : 0,
      icon: 'calendar-today',
      color: '#4CAF50',
    },
  ];

  const settingsOptions = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      subtitle: 'Receive analysis completion alerts',
      icon: 'notifications',
      type: 'switch',
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled,
    },
    {
      id: 'analytics',
      title: 'Usage Analytics',
      subtitle: 'Help improve the app with usage data',
      icon: 'bar-chart',
      type: 'switch',
      value: analyticsEnabled,
      onToggle: setAnalyticsEnabled,
    },
    {
      id: 'theme',
      title: 'Dark Mode',
      subtitle: 'Switch between light and dark themes',
      icon: 'brightness-6',
      type: 'switch',
      value: isDark,
      onToggle: handleThemeToggle,
    },
  ];

  const menuOptions = [
    {
      id: 'export-data',
      title: 'Export Data',
      subtitle: 'Download your analysis history',
      icon: 'download',
      onPress: () => {
        Alert.alert('Export Data', 'This feature will be available soon.');
      },
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'View our privacy policy',
      icon: 'privacy-tip',
      onPress: () => {
        Alert.alert('Privacy Policy', 'Privacy policy will be displayed here.');
      },
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      subtitle: 'View terms and conditions',
      icon: 'description',
      onPress: () => {
        Alert.alert('Terms of Service', 'Terms of service will be displayed here.');
      },
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help',
      onPress: () => {
        Alert.alert('Help & Support', 'Support options will be available here.');
      },
    },
    {
      id: 'about',
      title: 'About Vibe Curator',
      subtitle: 'Version 1.0.0',
      icon: 'info',
      onPress: () => {
        Alert.alert(
          'About Vibe Curator',
          'Vibe Curator v1.0.0\n\nAI-powered content analysis platform for Instagram and TikTok.\n\nBuilt with React Native and powered by advanced AI models.'
        );
      },
    },
  ];

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Icon name="person" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user?.username || 'User'}</Text>
              <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
              <Text style={styles.joinDate}>
                Joined {user ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {profileStats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Icon name={stat.icon} size={24} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsOptions.map((option) => (
            <View key={option.id} style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Icon name={option.icon} size={20} color={styles.iconColor.color} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{option.title}</Text>
                <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
              </View>
              <Switch
                value={option.value}
                onValueChange={option.onToggle}
                trackColor={{ false: isDark ? '#333333' : '#E0E0E0', true: '#6200EE' }}
                thumbColor={option.value ? '#FFFFFF' : (isDark ? '#CCCCCC' : '#F4F3F4')}
              />
            </View>
          ))}
        </View>

        {/* Menu Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          {menuOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.menuItem}
              onPress={option.onPress}
            >
              <View style={styles.menuIcon}>
                <Icon name={option.icon} size={20} color={styles.iconColor.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{option.title}</Text>
                <Text style={styles.menuSubtitle}>{option.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={styles.iconColor.color} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#FF5252" />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for content creators
          </Text>
          <Text style={styles.footerVersion}>
            Vibe Curator v1.0.0
          </Text>
        </View>
      </ScrollView>
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
  header: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333333' : '#E0E0E0',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: isDark ? '#CCCCCC' : '#666666',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: isDark ? '#888888' : '#999999',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#666666',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 16,
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5252',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  footerText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#666666',
    marginBottom: 8,
  },
  footerVersion: {
    fontSize: 12,
    color: isDark ? '#888888' : '#999999',
  },
  iconColor: {
    color: isDark ? '#CCCCCC' : '#666666',
  },
});