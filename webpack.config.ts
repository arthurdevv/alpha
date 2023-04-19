import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { IgnorePlugin, ProvidePlugin } from 'webpack';

const isDev = process.env.NODE_ENV === 'development';

const config = [
  {
    name: 'main',
    target: 'electron-main',
    devtool: 'source-map',
    mode: process.env.NODE_ENV,
    entry: path.resolve(__dirname, 'app/window', 'index.ts'),
    resolve: {
      alias: {
        app: path.resolve(__dirname, 'app/'),
      },
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    },
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './*.json',
            to: '[name][ext]',
          },
          {
            from: './app/keymaps/default/*.yaml',
            to: './app/keymaps/default/[name][ext]',
          },
          {
            from: './app/settings/*.yaml',
            to: './app/settings/[name][ext]',
          },
          {
            from: './app/common/profiles/clink',
            to: './app/common/profiles/clink',
          },
          {
            from: './lib/styles/fonts',
            to: './lib/styles/fonts',
          },
        ],
      }),
    ],
  },
  {
    name: 'renderer',
    target: 'electron-renderer',
    devtool: 'source-map',
    mode: process.env.NODE_ENV,
    entry: path.resolve(__dirname, 'lib', 'index.tsx'),
    resolve: {
      alias: {
        app: path.resolve(__dirname, 'app/'),
        lib: path.resolve(__dirname, 'lib/'),
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
      },
      extensions: ['.ts', '.tsx', '.js'],
      mainFields: ['main', 'module', 'browser'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'renderer/bundle.js',
      publicPath: './',
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      historyApiFallback: true,
      compress: true,
      hot: true,
      port: 4000,
      publicPath: '/',
    },
    plugins: [
      process.platform !== 'darwin' &&
        new IgnorePlugin({
          resourceRegExp: /^fsevents$/,
        }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'app', 'index.html'),
      }),
      new ProvidePlugin({
        h: ['preact', 'h'],
      }),
    ].filter(Boolean),
    externals: {
      'node-pty': 'commonjs2 node-pty',
      'native-reg': 'commonjs2 native-reg',
    },
    optimization: {
      minimize: !isDev,
      minimizer: [new TerserPlugin()],
    },
  },
];

export default config;
