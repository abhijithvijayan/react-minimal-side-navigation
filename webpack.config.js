const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  devtool: false, // https://github.com/webpack/webpack/issues/1194#issuecomment-560382342

  stats: {
    all: false,
    builtAt: true,
    errors: true,
    hash: true,
  },

  mode: nodeEnv,

  entry: path.join(__dirname, 'source', 'index.ts'),

  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    // https://stackoverflow.com/a/57287049
    libraryTarget: 'umd',
    library: 'react-minimal-side-navigation',
    globalObject: 'this', // https://git.io/JTDXW
  },

  // https://git.io/JTDXB
  externals: ['react', 'tailwindcss', 'awesome-react-icons'],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: [
          {
            loader: 'babel-loader', // optimizes the JavaScript code
          },
          {
            loader: 'ts-loader', // keep this for declaration files generation
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // It creates a CSS file per JS file which contains CSS
          },
          {
            loader: 'css-loader', // Takes the CSS files and returns the CSS with imports and url(...) for Webpack
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader', // For autoprefixer
            options: {
              postcssOptions: {
                ident: 'postcss',
                // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
                plugins: [require('tailwindcss'), require('autoprefixer')],
              },
            },
          },
          'resolve-url-loader', // Rewrites relative paths in url() statements
          'sass-loader', // Takes the Sass/SCSS file and compiles to the CSS
        ],
      },
    ],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(), // run TSC on a separate thread
    // delete previous build files
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(process.cwd(), `lib`)],
      cleanStaleWebpackAssets: false,
      verbose: true,
    }),
    // write css file(s) to build folder
    new MiniCssExtractPlugin({filename: 'ReactNavSidebar.css'}),
  ],

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', {discardComments: {removeAll: true}}],
        },
      }),
    ],
  },
};
