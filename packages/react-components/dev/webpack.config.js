import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const webpackConfig = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './entry.js'),
  },
  devServer: {
    hot: false,
    host: '0.0.0.0',
    port: 8081,
    static: {
      directory: path.join(__dirname),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
    }),
  ],
  devtool: 'eval-source-map',
}

export default webpackConfig
