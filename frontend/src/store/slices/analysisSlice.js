import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apolloClient } from '../../services/apolloClient';
import { 
  ANALYZE_CONTENT_COMPREHENSIVE,
  ANALYZE_VIDEO,
  PROCESS_DOCUMENT,
  ANALYZE_SENTIMENT
} from '../../graphql/mutations';
import { GET_ANALYSIS_STATUS } from '../../graphql/queries';

// Async thunks for analysis operations
export const analyzeContentComprehensive = createAsyncThunk(
  'analysis/analyzeContentComprehensive',
  async ({ rawContent, options }, { rejectWithValue }) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: ANALYZE_CONTENT_COMPREHENSIVE,
        variables: { input: { rawContent, options } },
      });
      return data.analyzeContentComprehensive;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const analyzeVideo = createAsyncThunk(
  'analysis/analyzeVideo',
  async ({ videoContent, options }, { rejectWithValue }) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: ANALYZE_VIDEO,
        variables: { input: { videoContent, options } },
      });
      return data.analyzeVideo;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const processDocument = createAsyncThunk(
  'analysis/processDocument',
  async ({ documentContent, options }, { rejectWithValue }) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: PROCESS_DOCUMENT,
        variables: { input: { documentContent, options } },
      });
      return data.processDocument;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const analyzeSentiment = createAsyncThunk(
  'analysis/analyzeSentiment',
  async ({ content, options }, { rejectWithValue }) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: ANALYZE_SENTIMENT,
        variables: { input: { content, options } },
      });
      return data.analyzeSentiment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAnalysisStatus = createAsyncThunk(
  'analysis/getAnalysisStatus',
  async (workflowId, { rejectWithValue }) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_ANALYSIS_STATUS,
        variables: { workflowId },
        fetchPolicy: 'network-only',
      });
      return data.getAnalysisStatus;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentAnalysis: null,
  analysisHistory: [],
  analysisStatus: null,
  loading: false,
  error: null,
  analysisType: null, // 'comprehensive', 'video', 'document', 'sentiment'
  progress: 0,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAnalysis: (state) => {
      state.currentAnalysis = null;
      state.analysisType = null;
      state.progress = 0;
    },
    setAnalysisType: (state, action) => {
      state.analysisType = action.payload;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
    addToHistory: (state, action) => {
      state.analysisHistory.unshift(action.payload);
      // Keep only last 50 analyses
      if (state.analysisHistory.length > 50) {
        state.analysisHistory = state.analysisHistory.slice(0, 50);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Comprehensive analysis cases
      .addCase(analyzeContentComprehensive.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.analysisType = 'comprehensive';
        state.progress = 0;
      })
      .addCase(analyzeContentComprehensive.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload;
        state.progress = 100;
        state.analysisHistory.unshift({
          id: Date.now(),
          type: 'comprehensive',
          result: action.payload,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(analyzeContentComprehensive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.progress = 0;
      })
      // Video analysis cases
      .addCase(analyzeVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.analysisType = 'video';
        state.progress = 0;
      })
      .addCase(analyzeVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload;
        state.progress = 100;
        state.analysisHistory.unshift({
          id: Date.now(),
          type: 'video',
          result: action.payload,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(analyzeVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.progress = 0;
      })
      // Document processing cases
      .addCase(processDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.analysisType = 'document';
        state.progress = 0;
      })
      .addCase(processDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload;
        state.progress = 100;
        state.analysisHistory.unshift({
          id: Date.now(),
          type: 'document',
          result: action.payload,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(processDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.progress = 0;
      })
      // Sentiment analysis cases
      .addCase(analyzeSentiment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.analysisType = 'sentiment';
        state.progress = 0;
      })
      .addCase(analyzeSentiment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload;
        state.progress = 100;
        state.analysisHistory.unshift({
          id: Date.now(),
          type: 'sentiment',
          result: action.payload,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(analyzeSentiment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.progress = 0;
      })
      // Analysis status cases
      .addCase(getAnalysisStatus.fulfilled, (state, action) => {
        state.analysisStatus = action.payload;
        if (action.payload.progress) {
          state.progress = action.payload.progress;
        }
        if (action.payload.results) {
          state.currentAnalysis = action.payload.results;
        }
      })
      .addCase(getAnalysisStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentAnalysis, 
  setAnalysisType, 
  updateProgress, 
  addToHistory 
} = analysisSlice.actions;

export default analysisSlice.reducer;