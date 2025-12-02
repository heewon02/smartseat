const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');


const defaultConfig = getDefaultConfig(__dirname);

const { assetExts, sourceExts } = defaultConfig.resolver;

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

process.env.NO_FLATTENED_PROJECT = '1';

module.exports = mergeConfig(defaultConfig, config);
