process.env.NODE_ENV = "development";

const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");                 // 生成 html 的插件, import 用 html-loader

const baseWebpackConfig = require("./webpack.base.config");               // 基础配置

const devWebpackConfig = merge(baseWebpackConfig, {
  /**
   * development 模式下默认启用这些插件
   * NamedChunksPlugin              // 使用 entry 名做标识
   * NamedModulesPlugin             // 使用模块的相对路径非自增 id 做标识
   * 以上两个模块均为解决hash固化的问题
   */

  mode: "development",
  devtool: "cheap-module-eval-source-map",              // 开发环境 cheap-module-eval-source-map, 生产环境 cheap-module-source-map
  devServer: {
    // contentBase: "./static",                         // 静态文件根目录
    port: 8080,                                         // 端口
    host: "localhost",                                  // 域名
    compress: true,                                     // 服务器返回浏览器的时候是否启动 gzip 压缩
    open: false,                                        // 自动打开窗口
    hot: true,                                          // 热加载
    overlay: {                                          // 在页面上全屏输出报错信息
      warnings: true,
      errors: true
    },
    quiet: true,                                        // 当它被设置为 true 的时候，控制台只输出第一次编译的信息
    // publicPath: "/",                                    // 引用路径
    // progress: true,                                     // 显示进度条
  },
  module: {
    rules: [
      // 如果使用 style-loader 将样式添加到 js 文件中, 在编写样式的时候可以享受热更新的效果, 但是如果使用
      // extract-text-webpack-plugin 和 mini-css-extract-plugin 将样式提取, 此组件并不支持热更新, 只会重新打包但是不会刷新页面
      // 因此建议在 开发环境 中关闭 MiniCssExtractPlugin 组件, 而使用 style-loader

      // css-loader
      // autoprefixer 和 postcss 连用, 用来为浏览器自动添加前缀
      {
        test: /\.css$/,
        use: [ "style-loader", "css-loader", "postcss-loader" ]
      },

      // less-loader
      {
        test:/\.less$/,
        use: [ "style-loader", "css-loader", "postcss-loader", "less-loader" ]
      },
      // sass-loader
      {
        test:/\.(sass|scss)$/,
        use: [ "style-loader", "css-loader", "postcss-loader", "sass-loader" ]
      },
      // stylus-loader
      {
        test: /\.styl/,
        use: [ "style-loader", "css-loader", "postcss-loader", "stylus-loader" ]
      },
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),           // HMR
    new HtmlWebpackPlugin({
      template: "./src/index.html",                     // 模版文件路径
      filename: "index.html",                           // 内存中生成的文件名, 文件写入路径，前面的路径与 devServer 中 contentBase 对应, 这里为根路径
      hash: true,                                       // 防止缓存
      inject: true,
    }),
  ],
});

module.exports = devWebpackConfig;