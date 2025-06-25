import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import analysisSlice from './slices/analysisSlice';
import contentSlice from './slices/contentSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    analysis: analysisSlice,
    content: contentSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;