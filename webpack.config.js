const inlineSvgConfig = {
  test: /\.inline\.svg?$/,
  use: [
    {
      loader: '@svgr/webpack',
      options: {
        svgoConfig: {
          plugins: {
            removeViewBox: false,
            inlineStyles: {
              onlyMatchedOnce: false
            }
          }
        }
      }
    }
  ]
};

module.exports = {
  module: {
    rules: [
      {
        test: /\.inline\.svg?$/,
        use: [
          {
            loader: '@svgr/webpack'
          }
        ]
      },
      inlineSvgConfig
    ]
  }
};
