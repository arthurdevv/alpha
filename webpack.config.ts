import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { DefinePlugin, IgnorePlugin, ProvidePlugin } from 'webpack';

const isDev = process.env.NODE_ENV === 'development';

const externals = {};

const deps = [
  'node-pty',
  'native-reg',
  'native-process-working-directory',
  '@pyke/vibe'
];

deps.forEach(dep => {
  externals[dep] = `commonjs ${dep}`;
});

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
        cli: path.resolve(__dirname, 'cli/'),
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
      path: path.resolve(__dirname, 'target'),
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
            from: './lib/styles/fonts',
            to: './lib/styles/fonts',
          },
          {
            from: './app/settings/default.yaml',
            to: './app/settings/[name][ext]',
          },
          {
            from: './app/keymaps/default.yaml',
            to: './app/keymaps/[name][ext]',
          },
          {
            from: './app/utils/clink',
            to: './app/utils/clink',
          },
        ],
      }),
      process.platform !== 'darwin' &&
        new IgnorePlugin({
          resourceRegExp: /^fsevents$/,
        }),
    ],
    externals,
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
      path: path.resolve(__dirname, 'target'),
      filename: 'renderer/bundle.js',
      publicPath: './',
    },
    devServer: {
      contentBase: path.join(__dirname, 'target'),
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
    optimization: {
      minimize: !isDev,
      minimizer: [new TerserPlugin()],
    },
    externals,
  },
  {
    name: 'cli',
    target: 'node',
    devtool: false,
    mode: 'none',
    entry: path.resolve(__dirname, 'cli', 'index.ts'),
    resolve: {
      extensions: ['.js', '.ts'],
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    output: {
      path: path.join(__dirname, 'target'),
      filename: 'cli.js',
    },
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ],
    optimization: {
      minimize: !isDev,
      minimizer: [new TerserPlugin()],
    },
  },
];

export default config;
