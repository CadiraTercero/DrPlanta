const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduce file watcher load
config.watchFolders = [];
config.resetCache = true;

module.exports = config;
