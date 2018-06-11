![](./static/webpack.png)

## 学习webpack4的配置更改

> webpack作为一个模块打包器，主要用于前端工程中的依赖梳理和模块打包，将我们开发的具有高可读性和可维护性的代码文件打包成浏览器可以识别并正常运行的压缩代码，主要包括样式文件处理成`css`，各种新式的`JavaScript`转换成浏览器认识的写法等，也是前端工程师进阶的不二法门。

### webpack.config.js配置项简介

1. Entry：入口文件配置，Webpack 执行构建的第一步将从 Entry 开始，完成整个工程的打包。
2. Module：模块，在`Webpack`里一切皆模块，`Webpack`会从配置的`Entry`开始递归找出所有依赖的模块，最常用的是`rules`配置项，功能是匹配对应的后缀，从而针对代码文件完成格式转换和压缩合并等指定的操作。
3. Loader：模块转换器，用于把模块原内容按照需求转换成新内容，这个是配合`Module`模块中的`rules`中的配置项来使用。
4. Plugins：扩展插件，在`Webpack`构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。(插件`API`)
5. Output：输出结果，在`Webpack`经过一系列处理并得出最终想要的代码后输出结果，配置项用于指定输出文件夹，默认是`./dist`。
6. DevServer：用于配置开发过程中使用的本机服务器配置，属于`webpack-dev-server`这个插件的配置项。

### webpack打包流程简介

- 根据传入的参数模式(`development` | `production`)来加载对应的默认配置
- 在`entry`里配置的`module`开始递归解析`entry`所依赖的所有`module`
- 每一个`module`都会根据`rules`的配置项去寻找用到的`loader`,接受所配置的`loader`的处理
- 以`entry`中的配置对象为分组，每一个配置入口和其对应的依赖文件最后组成一个代码块文件(chunk)并输出
- 整个流程中`webpack`会在恰当的时机执行`plugin`的逻辑，来完成自定义的插件逻辑

### 基本的webpack配置搭建

首先通过以下的脚本命令来建立初始化文件：

```bash
npm init -y
npm i webpack webpack-cli -D // 针对webpack4的安装
mkdir src && cd src && touch index.html index.js
cd ../ && mkdir dist && mkdir static
touch webpack.config.js
npm i webpack-dev-server -D
```

修改生成的`package.json`文件，来引入`webpack`打包命令:

```
  "scripts": {
    "dev": "webpack-dev-server --config=build/webpack.dev.config.js",
    "build": "webpack --config=build/webpack.pro.config.js"
  }
```

对`webpack.config.js`文件加入一些基本配置`loader`，从而基本的`webpack4.x`的配置成型(以两个页面入口为例):

```
  {
    test: /\.js$/,
    use: "happypack/loader?id=babel",
    exclude: /node_modules/
  }


  {
    test: /\.vue$/,
    use: "vue-loader",
    // options: vueLoaderConfig,
    include: path.resolve(__dirname, "../src"),
  }
```

在命令行下用以下命令安装`loader`和依赖的插件，生成完全的`package.json`项目依赖树。

```bash
npm install extract-text-webpack-plugin@next -D
npm i style-loader css-loader postcss-loader -D
npm i less less-loader -D
npm i node-sass sass-loader -D
npm i stylus stylus-loader -D
npm i babel-core babel-loader babel-preset-env babel-preset-stage-0 -D
npm i file-loader url-loader -D

npm i html-webpack-plugin ---save-dev
npm i clean-webpack-plugin --save-dev
npm i copy-webpack-plugin --save-dev

npm run dev
```

默认打开的页面是`index.html`页面，打开页面看效果。

### 进阶的webpack4配置搭建

包含以下几个方面：
1. 针对`CSS`和`JS`的`TreeShaking`来减少无用代码，针对`JS`需要对已有的`uglifyjs`进行一些自定义的配置(生产环境配置)
2. 使用`HappyPack`进行`javascript`的多进程打包操作，提升打包速度，并增加打包时间显示。(生产和开发环境都需要)
3. 模块热替换，还需要在项目中增加一些配置，不过大型框架把这块都封装好了。(开发环境配置)
4. `webpack3`新增的作用域提升会默认在`production`模式下启用，不用特别配置，但只有在使用ES6模块才能生效。

补充安装插件的命令行：

```bash
npm i happypack@next -D             // 用于多进程打包js
npm i webpack-merge -D              // 优化配置代码的工具
npm i mini-css-extract-plugin -D    // 用于提取 CSS 文件
```

