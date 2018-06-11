const path = require("path");

const HappyPack = require("happypack");                                   // 多线程打包, 提升打包速度
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");   // webpack 错误信息提示插件
const CopyWebpackPlugin = require("copy-webpack-plugin");                 // 复制静态资源的插件
const VueLoaderPlugin = require("vue-loader/lib/plugin");                 // vue-loader 插件

module.exports = {
  /*
  * 1. __dirname 为node全局对象，是当前文件所在目录
  * 2. context   为 查找 entry 和 部分插件的 前置路径
  */
  context: path.resolve(__dirname, "../"),              // 查找 entry 的前置路径, 在 entry 中就不用 path 了
  entry: {                                              // 入口文件, 可以配置多个
    main: "./src/main.js",                              // 因为已经有 context, 这里直接使用相对路径就好
    // vendor: ""                                       // 多个页面面所需的公共库文件, 防止重复打包带入
  },
  output: {
    publicPath: "/",                                    // 这里要放的是静态资源 CDN 地址
    path: path.resolve(__dirname, "../dist/"),          // 文件输出目录
  },
  resolve:{
    extensions: [".js",".css",".json", ".vue"],         // 自动解析确定的扩展名
    alias: {                                            // 配置别名可以加快 webpack 查找模块的速度
      components:  "./src/components/",
    }
  },
  module: {
    rules: [
      // 多个 loader 是有加载顺序要求的, 从右往左写, 因为转换的时候是从右往左转换的
      // babel-loader
      {
        test: /\.js$/,
        use: "happypack/loader?id=babel",
        exclude: /node_modules/
      },


      // vue-loader
      {
        test: /\.vue$/,
        use: "vue-loader",
        // options: vueLoaderConfig,
        include: path.resolve(__dirname, "../src"),
      },

      // file-loader 解决 css 等文件中引入图片路径的问题
      // url-loader 当图片较小的时候会把图片 BASE64 编码，大于 limit 参数的时候还是使用 file-loader 进行拷贝
      // (\?.*)? 匹配带 ? 资源路径，css字体配置中可能带版本信息
      {
        test: /\.(png|jpg|jpeg|gif|svg)(\?.*)?/,
        use: {
          loader: "url-loader",
          options: {
            name: "static/img/[name].[hash:7].[ext]",         // 为防止图片名重复, 为图片名添加一串哈希值, 最高 32 位
            limit: 3145728,
          }
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "static/fonts/[name].[hash:7].[ext]"
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "static/media/[name].[hash:7].[ext]"
        }
      },
    ]
  },
  plugins: [
    new HappyPack({
      id: "babel",                                      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      loaders: [ "babel-loader?cacheDirectory=true" ],  // 如何处理 .js 文件，用法和 Loader 配置中一样
    }),
    new HappyPack({
      id: "vue",
      loaders: [ "vue-loader" ],
    }),

    new VueLoaderPlugin(),                              // vue-loader 插件
    new FriendlyErrorsPlugin(),                         // 打包界面美化插件
    new CopyWebpackPlugin([                             // 复制静态资源的插件, 在开发模式下, 会将其写入内存
      {
        from: path.resolve(__dirname, "..", "static"),
        to: "static",
        ignore: [".*"]
      }
    ]),


  ],
};

