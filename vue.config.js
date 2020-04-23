module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === "production" ? "/lucky-draw" : "/"
  // 输出文件目录
  outputDir: 'dist',
  configureWebpack: {
    devtool: 'source-map',
    externals: {
    }
  }
}
