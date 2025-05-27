const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project directories
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the project directory
config.watchFolders = [projectRoot];

// 2. Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// 3. Force Metro to resolve dependencies only from the nodeModulesPaths
config.resolver.disableHierarchicalLookup = true;

// 4. Add better error handling for module resolution
config.resolver.extraNodeModules = new Proxy({}, {
  get: (target, name) => {
    return path.join(projectRoot, `node_modules/${name}`);
  }
});

module.exports = config; 