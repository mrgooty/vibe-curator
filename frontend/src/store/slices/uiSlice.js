import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light', // 'light' or 'dark'
  activeTab: 'dashboard', // 'dashboard', 'content', 'analysis', 'history', 'profile'
  isLoading: false,
  notifications: [],
  modals: {
    analysisModal: false,
    contentModal: false,
    settingsModal: false,
    helpModal: false,
  },
  bottomSheets: {
    filterSheet: false,
    shareSheet: false,
    optionsSheet: false,
  },
  alerts: [],
  networkStatus: 'online', // 'online', 'offline', 'poor'
  orientation: 'portrait', // 'portrait', 'landscape'
  platform: 'mobile', // 'mobile', 'tablet', 'web'
  screenSize: {
    width: 0,
    height: 0,
  },
  safeAreaInsets: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  keyboardVisible: false,
  refreshing: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.unshift(notification);
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
    },
    openBottomSheet: (state, action) => {
      state.bottomSheets[action.payload] = true;
    },
    closeBottomSheet: (state, action) => {
      state.bottomSheets[action.payload] = false;
    },
    closeAllBottomSheets: (state) => {
      Object.keys(state.bottomSheets).forEach(sheet => {
        state.bottomSheets[sheet] = false;
      });
    },
    addAlert: (state, action) => {
      const alert = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.alerts.push(alert);
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload;
    },
    setOrientation: (state, action) => {
      state.orientation = action.payload;
    },
    setPlatform: (state, action) => {
      state.platform = action.payload;
    },
    setScreenSize: (state, action) => {
      state.screenSize = action.payload;
    },
    setSafeAreaInsets: (state, action) => {
      state.safeAreaInsets = action.payload;
    },
    setKeyboardVisible: (state, action) => {
      state.keyboardVisible = action.payload;
    },
    setRefreshing: (state, action) => {
      state.refreshing = action.payload;
    },
  },
});

export const {
  setTheme,
  setActiveTab,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  markNotificationAsRead,
  openModal,
  closeModal,
  closeAllModals,
  openBottomSheet,
  closeBottomSheet,
  closeAllBottomSheets,
  addAlert,
  removeAlert,
  clearAlerts,
  setNetworkStatus,
  setOrientation,
  setPlatform,
  setScreenSize,
  setSafeAreaInsets,
  setKeyboardVisible,
  setRefreshing,
} = uiSlice.actions;

export default uiSlice.reducer;