module.exports = {
  // 基本路径
<<<<<<< HEAD
  publicPath: '/',
=======
  publicPath: process.env.NODE_ENV === "production" ? "/lucky-draw" : "/"
>>>>>>> a55e483f8faeb74ecbdc18ae9d86bc0d62a7ec09
  // 输出文件目录
  outputDir: 'dist',
  configureWebpack: {
    devtool: 'source-map',
    externals: {
    }
  }
}
