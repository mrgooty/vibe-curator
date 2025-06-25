const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db'
);

// Add support for web platform
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configure web-specific settings
config.resolver.alias = {
  'react-native$': 'react-native-web',
  'react-native-vector-icons': 'react-native-vector-icons/dist',
};

// Add web-specific extensions
config.resolver.extensions = [
  '.web.tsx',
  '.web.ts',
  '.web.jsx',
  '.web.js',
  '.tsx',
  '.ts',
  '.jsx',
  '.js',
  '.json',
];

// Configure transformer for web compatibility
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Configure web-specific module resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;