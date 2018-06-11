process.env.NODE_ENV = "production";

const path = require("path");
const merge = require("webpack-merge");

const CleanWebpackPlugin = require("clean-webpack-plugin");               // 清空打包目录的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");          // CSS文件单独提取出来

const baseWebpackConfig = require("./webpack.base.config");

const proWebpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  devtool: "cheap-module-source-map",   // 开发环境 cheap-module-eval-source-map, 生产环境 cheap-module-source-map
  module: {
    rules: [
      // 如果使用 style-loader 将样式添加到 js 文件中, 在编写样式的时候可以享受热更新的效果, 但是如果使用
      // extract-text-webpack-plugin 和 mini-css-extract-plugin 将样式提取, 此组件并不支持热更新, 只会重新打包但是不会刷新页面
      // 因此建议在 开发环境 中关闭 MiniCssExtractPlugin 组件

      // css-loader
      {
        test: /\.css$/,
        // autoprefixer 和 postcss 连用, 用来为浏览器自动添加前缀
        use: [ MiniCssExtractPlugin.loader, "css-loader", "postcss-loader" ],
        include: path.resolve(__dirname, "../src")
      },
      // less-loader
      {
        test:/\.less$/,
        use: [ MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "less-loader" ],
        include: path.resolve(__dirname, "../src")
      },
      {
        test:/\.(sass|scss)$/,
        use: [ MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader" ],
        include: path.resolve(__dirname, "../src")
      },
      // stylus-loader
      {
        test:/\.styl/,
        use: [ MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "stylus-loader" ],
        include: path.resolve(__dirname, "../src")
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, "../dist")]),

    // 只用于打包生产环境，测试环境这样设置会影响 HMR(热重载)
    new MiniCssExtractPlugin({
      filename: "[name].[hash:8].css",
      chunkFilename: "[id].css"
    }),
  ],
});

module.exports = proWebpackConfig;