import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apolloClient } from '../../services/apolloClient';
import { 
  SCRAPE_INSTAGRAM,
  SCRAPE_TIKTOK,
  SCRAPE_TIKTOK_USER
} from '../../graphql/queries';

// Async thunks for content operations
export const scrapeInstagram = createAsyncThunk(
  'content/scrapeInstagram',
  async (tag, { rejectWithValue }) => {
    try {
      const { data } = await apolloClient.query({
        query: SCRAPE_INSTAGRAM,
        variables: { tag },
        fetchPolicy: 'network-only',
      });
      return data.scrapeInstagram;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const scrapeTikTok = createAsyncThunk(
  'content/scrapeTikTok',
  async ({ hashtag, limit }, { rejectWithValue }) => {
    try {
      const { data } = await apolloClient.query({
        query: SCRAPE_TIKTOK,
        variables: { hashtag, limit },
        fetchPolicy: 'network-only',
      });
      return data.scrapeTikTok;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const scrapeTikTokUser = createAsyncThunk(
  'content/scrapeTikTokUser',
  async (username, { rejectWithValue }) => {
    try {
      const { data } = await apolloClient.query({
        query: SCRAPE_TIKTOK_USER,
        variables: { username },
        fetchPolicy: 'network-only',
      });
      return data.scrapeTikTokUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  instagramData: null,
  tiktokData: null,
  selectedContent: null,
  contentHistory: [],
  loading: false,
  error: null,
  currentPlatform: null, // 'instagram' or 'tiktok'
  searchQuery: '',
  filters: {
    dateRange: null,
    engagementMin: 0,
    contentType: 'all', // 'all', 'video', 'image', 'text'
    sortBy: 'timestamp', // 'timestamp', 'engagement', 'likes'
    sortOrder: 'desc', // 'asc', 'desc'
  },
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearContent: (state) => {
      state.instagramData = null;
      state.tiktokData = null;
      state.selectedContent = null;
      state.currentPlatform = null;
    },
    setSelectedContent: (state, action) => {
      state.selectedContent = action.payload;
    },
    setCurrentPlatform: (state, action) => {
      state.currentPlatform = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    addToContentHistory: (state, action) => {
      const historyItem = {
        id: Date.now(),
        platform: action.payload.platform,
        query: action.payload.query,
        data: action.payload.data,
        timestamp: new Date().toISOString(),
      };
      state.contentHistory.unshift(historyItem);
      // Keep only last 20 searches
      if (state.contentHistory.length > 20) {
        state.contentHistory = state.contentHistory.slice(0, 20);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Instagram scraping cases
      .addCase(scrapeInstagram.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPlatform = 'instagram';
      })
      .addCase(scrapeInstagram.fulfilled, (state, action) => {
        state.loading = false;
        state.instagramData = action.payload;
        state.contentHistory.unshift({
          id: Date.now(),
          platform: 'instagram',
          query: action.payload.tag,
          data: action.payload,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(scrapeInstagram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // TikTok hashtag scraping cases
      .addCase(scrapeTikTok.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPlatform = 'tiktok';
      })
      .addCase(scrapeTikTok.fulfilled, (state, action) => {
        state.loading = false;
        state.tiktokData = action.payload;
        state.contentHistory.unshift({
          id: Date.now(),
          platform: 'tiktok',
          query: action.payload.hashtag,
          data: action.payload,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(scrapeTikTok.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // TikTok user scraping cases
      .addCase(scrapeTikTokUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPlatform = 'tiktok';
      })
      .addCase(scrapeTikTokUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tiktokData = action.payload;
        state.contentHistory.unshift({
          id: Date.now(),
          platform: 'tiktok',
          query: `@${action.payload.username}`,
          data: action.payload,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(scrapeTikTokUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearContent,
  setSelectedContent,
  setCurrentPlatform,
  setSearchQuery,
  updateFilters,
  resetFilters,
  addToContentHistory,
} = contentSlice.actions;

export default contentSlice.reducer;