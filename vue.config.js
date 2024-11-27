const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    entry: './produt-page/src/main.js'  // Adjust the path here
  }
});