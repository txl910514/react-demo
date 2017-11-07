let path = require('path')
let ExtractTextPlugin = require("extract-text-webpack-plugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var env = process.env.NODE_ENV === 'prod'
const utils = {
  assetsPath:function (_path) {
    return path.posix.join('static', _path)
  }
}
var pngUse = [
  {
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: utils.assetsPath('images/[name].[hash:7].[ext]')
    }
  }
]

if (env) {
  pngUse.push('image-webpack-loader'); // 压缩图片
}

console.log("当前的目录是", __dirname)
let HtmlWebpackPlugin = require('html-webpack-plugin');
let dist =path.resolve(__dirname,"dist")
let webpack = require('webpack')
let config = {
  entry: {
    babelPolyfill : 'babel-polyfill',
    main: './src/Main.jsx'
  },
  output:{
    path: dist,
    filename:utils.assetsPath('js/[name].[hash:7].js'),
    publicPath: "/"
  },
  devtool: env ? false : '#source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use:[{
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.css$/,
        exclude: /(node_modules|bower_components)/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: false
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif)$/i,
        exclude: /(node_modules|bower_components)/,
        use: pngUse
      },
      {
        test: /\.(ttf|eot|woff)$/,
        exclude: /(node_modules|bower_components)/,
        use:[{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }]
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: false
            }
          }, 'sass-loader']
        })
      },
      {
        test: /\.html/,
        exclude: /(node_modules|bower_components)/,
        use:[{
          loader: "html-loader" // creates style nodes from JS strings
        }]
      }
    ]
  },
  devServer: {
    contentBase: dist,
    publicPath: "/",
    compress: true,
    port: 9009,
    disableHostCheck: true,
    proxy: {
      '/mock': {
        target: 'http://127.0.0.1:3090',
        changeOrigin: true,
        pathRewrite: {
          '^/mock': '/mock'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title:"图谱",
      template: "index.html"
    }),
    new ExtractTextPlugin(utils.assetsPath('css/[name].[hash:7].css')),
    new OpenBrowserPlugin({url: 'http://localhost:9009/'}),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity,
    })
  ]
}
if (env) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    sourceMap: !env
  }))
}
module.exports = config