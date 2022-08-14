const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './App/index.tsx',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js",
    publicPath: "/"
  },
  cache: {
    type: "filesystem"
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  module: {
    rules: [
      { test: /\.(ts|tsx)$/, loader: "ts-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ]
  },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'App/index.html'
      })
    ],
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: {
      rewrites: [
        { from: /\/dist/, to: `/dist` }
      ]
    },
    compress: true,
    port: 5000
  },
  experiments: {
    lazyCompilation: {
      entries: true,
      imports: true,
    },
    cacheUnaffected: true,
   
  }
}