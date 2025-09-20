const path = require('path');

module.exports = {
  // Extend or override your default config here
  module: {
    rules: [
      {
        test: /.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: ['source-map-loader'],
      },
        {
          test: /leaflet-src\.js$/,
          enforce: 'pre',
          use: [
            {
              loader: 'source-map-loader',
              options: {
                filterSourceMappingUrl: (url, resourcePath) => false,
              },
            },
          ],
          exclude: /node_modules/,
        },
    ],
  },
  ignoreWarnings: [
    {
      module: /maplibre-gl\.js/,
      message: /Failed to parse source map/,
    },
    {
      module: /mapbox-gl\.js/,
      message: /Failed to parse source map/,
    },
  ],
};
