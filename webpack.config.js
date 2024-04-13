const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const AutoPrefixer = require('autoprefixer');
const CssNano = require('cssnano');
const LoadablePlugin = require('@loadable/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const inlineSvgConfig = {
  test: /\.inline\.svg?$/,
  use: [
    {
      loader: '@svgr/webpack',
      options: {
        exportType: 'named'
      }
    }
  ],
  exclude: /node_modules/
};

const sassProdRules = [
  {
    test: /\.scss$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader', // importLoaders should be used with options object if needed
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [AutoPrefixer(), CssNano({ preset: 'default' })]
          }
        }
      },
      'sass-loader'
    ],
    exclude: /\.module\.scss$/
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.module\.scss$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: {
            mode: 'local',
            localIdentName: '[hash:base64]'
          }
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [AutoPrefixer(), CssNano({ preset: 'default' })]
          }
        }
      },
      'sass-loader'
    ]
  }
];

const clientCommon = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
      name: false
    }
  },

  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
        exclude: /node_modules/
      },
      inlineSvgConfig,
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|otf|ico)$/,
        exclude: /\.svg?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/'
          }
        }
      },
      ...sassProdRules
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new LoadablePlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'public/index.html'),
      inject: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new CopyPlugin({
      // Adding the plugin to copy all files under the 'public' folder to 'public' in the 'dist' directory
      patterns: [{ from: 'public', to: 'public' }]
    })
  ]
};

const clientProdConfig = merge(clientCommon, {
  mode: 'production',

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),

    new JavaScriptObfuscator({
      rotateUnicodeArray: true,
      debugProtection: true,
      debugProtectionInterval: 0,
      selfDefending: false,
      disableConsoleOutput: true,
      domainLock: ['.timebox.guru', 'timebox.guru']
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled'
    })
  ]
});

module.exports = clientProdConfig;
