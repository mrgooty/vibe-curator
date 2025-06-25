# Vibe Curator Frontend

A cross-platform React Native application for AI-powered content analysis of Instagram and TikTok content.

## Features

- **Cross-Platform Support**: Runs on Android, iOS, and Web
- **AI-Powered Analysis**: Comprehensive content analysis including sentiment, video, and document processing
- **Social Media Integration**: Instagram and TikTok content scraping and analysis
- **Real-time Updates**: Live analysis progress and results
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Responsive Design**: Optimized for mobile, tablet, and desktop screens

## Tech Stack

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **API Integration**: Apollo Client (GraphQL)
- **Navigation**: React Navigation 6
- **UI Components**: Custom components with Material Design icons
- **Storage**: AsyncStorage for local data persistence
- **Web Support**: React Native Web for browser compatibility

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Expo CLI (for development)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibe-curator/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally** (if not already installed)
   ```bash
   npm install -g @expo/cli
   ```

## Development

### Start the development server

```bash
npm start
```

This will start the Expo development server and show a QR code.

### Platform-specific development

**Android**
```bash
npm run android
```

**iOS**
```bash
npm run ios
```

**Web**
```bash
npm run web
```

### Environment Configuration

Create a `.env` file in the frontend directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:4000/graphql
EXPO_PUBLIC_WS_URL=ws://localhost:4000/graphql
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── dashboard/      # Dashboard screen
│   │   ├── content/        # Content-related screens
│   │   ├── analysis/       # Analysis screens
│   │   ├── history/        # History screen
│   │   └── profile/        # Profile screen
│   ├── navigation/         # Navigation configuration
│   ├── store/             # Redux store and slices
│   │   └── slices/        # Redux slices
│   ├── services/          # API services and utilities
│   ├── graphql/           # GraphQL queries and mutations
│   └── utils/             # Utility functions
├── web/                   # Web-specific configurations
├── assets/               # Static assets (images, fonts)
├── App.js               # Main application component
├── app.json             # Expo configuration
├── babel.config.js      # Babel configuration
├── metro.config.js      # Metro bundler configuration
└── package.json         # Dependencies and scripts
```

## Key Components

### Authentication
- **LoginScreen**: User login with email/password
- **RegisterScreen**: User registration with validation

### Main Features
- **DashboardScreen**: Overview with quick actions and recent activity
- **ContentScreen**: Instagram/TikTok content scraping interface
- **AnalysisScreen**: AI analysis configuration and execution
- **HistoryScreen**: Analysis and content history
- **ProfileScreen**: User profile and settings

### State Management
- **authSlice**: User authentication state
- **analysisSlice**: AI analysis state and results
- **contentSlice**: Social media content state
- **uiSlice**: UI state (theme, notifications, etc.)

## API Integration

The frontend integrates with the GraphQL backend API:

### Authentication
- `login`: User authentication
- `register`: User registration

### Content Analysis
- `analyzeContentComprehensive`: Full AI analysis
- `analyzeSentiment`: Sentiment analysis
- `analyzeVideo`: Video content analysis
- `processDocument`: Document processing

### Social Media
- `scrapeInstagram`: Instagram content scraping
- `scrapeTikTok`: TikTok content scraping
- `scrapeTikTokUser`: TikTok user content scraping

## Building for Production

### Web Build
```bash
npm run build:web
```

### Mobile Builds
```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for all platforms
eas build --platform all
```

## Deployment

### Web Deployment
The web build can be deployed to any static hosting service:

1. Build the web version: `npm run build:web`
2. Deploy the `web-build` directory to your hosting service

### Mobile App Stores
1. Build the app using EAS Build or Expo Build
2. Submit to Google Play Store (Android) and App Store (iOS)

## Configuration

### App Configuration (app.json)
- App name, version, and metadata
- Platform-specific settings
- Icon and splash screen configuration
- Permissions and capabilities

### Metro Configuration (metro.config.js)
- Web platform support
- Asset and file extension handling
- Module resolution for cross-platform compatibility

## Development Guidelines

### Code Style
- Use ESLint and Prettier for code formatting
- Follow React Native best practices
- Use TypeScript for type safety (optional but recommended)

### Component Structure
- Keep components small and focused
- Use custom hooks for shared logic
- Implement proper error boundaries

### State Management
- Use Redux Toolkit for complex state
- Keep local state for component-specific data
- Implement proper loading and error states

### Performance
- Use React.memo for expensive components
- Implement proper list virtualization for large datasets
- Optimize images and assets

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **iOS build issues**
   ```bash
   cd ios && pod install
   ```

3. **Android build issues**
   - Ensure Android SDK is properly configured
   - Check Java version compatibility

4. **Web compatibility issues**
   - Verify React Native Web aliases in metro.config.js
   - Check for platform-specific code usage

### Debug Mode
- Enable remote debugging in development
- Use React Native Debugger for advanced debugging
- Check network requests in browser dev tools (web)

## Contributing

1. Follow the existing code style and patterns
2. Add proper TypeScript types where applicable
3. Include tests for new features
4. Update documentation for significant changes

## License

This project is part of the Vibe Curator application suite.

## Support

For technical support and questions:
- Check the main project README
- Review the backend API documentation
- Create an issue in the project repository