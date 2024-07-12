const { override, addLessLoader } = require('customize-cra');

module.exports = override(
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
    },
  }),
  (config) => {
    const oneOfRule = config.module.rules.find((rule) => rule.oneOf);
    if (oneOfRule) {
      oneOfRule.oneOf.forEach((rule) => {
        if (rule.test && rule.test.toString().includes('less')) {
          const postcssLoader = rule.use.find((loader) => loader.loader && loader.loader.includes('postcss-loader'));
          if (postcssLoader) {
            postcssLoader.options = {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')(),
                ],
              },
            };
          }
        }
      });
    }
    return config;
  }
);
