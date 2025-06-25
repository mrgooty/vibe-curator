import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ContentScreen from '../screens/content/ContentScreen';
import AnalysisScreen from '../screens/analysis/AnalysisScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ContentDetailScreen from '../screens/content/ContentDetailScreen';
import AnalysisResultScreen from '../screens/analysis/AnalysisResultScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for authenticated users
function MainTabNavigator() {
  const theme = useSelector(state => state.ui.theme);
  
  const tabBarOptions = {
    activeTintColor: theme === 'dark' ? '#BB86FC' : '#6200EE',
    inactiveTintColor: theme === 'dark' ? '#888' : '#666',
    style: {
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
      borderTopColor: theme === 'dark' ? '#333' : '#E0E0E0',
      height: Platform.OS === 'ios' ? 85 : 65,
      paddingBottom: Platform.OS === 'ios' ? 25 : 10,
      paddingTop: 10,
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: '500',
    },
    iconStyle: {
      marginBottom: 2,
    },
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Content':
              iconName = 'video-library';
              break;
            case 'Analysis':
              iconName = 'analytics';
              break;
            case 'History':
              iconName = 'history';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        ...tabBarOptions,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Content" 
        component={ContentScreen}
        options={{ title: 'Content' }}
      />
      <Tab.Screen 
        name="Analysis" 
        component={AnalysisScreen}
        options={{ title: 'Analysis' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{ title: 'History' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator
function AuthStackNavigator() {
  const theme = useSelector(state => state.ui.theme);
  
  const screenOptions = {
    headerStyle: {
      backgroundColor: theme === 'dark' ? '#121212' : '#6200EE',
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    cardStyle: {
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
    },
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ 
          title: 'Sign In',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ 
          title: 'Create Account',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const theme = useSelector(state => state.ui.theme);
  
  const screenOptions = {
    headerStyle: {
      backgroundColor: theme === 'dark' ? '#121212' : '#6200EE',
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    cardStyle: {
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
    },
  };

  if (!isAuthenticated) {
    return <AuthStackNavigator />;
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ContentDetail" 
        component={ContentDetailScreen}
        options={{ 
          title: 'Content Details',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="AnalysisResult" 
        component={AnalysisResultScreen}
        options={{ 
          title: 'Analysis Results',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}