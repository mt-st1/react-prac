const path = require('path');

module.exports = {
  // エントリーポイント(複数のjsファイルを集約したjsファイル)
  entry: './src/index.js',

  // ビルドされた実行ファイルの出力設定
  output: {
    // 出力ファイルのディレクトリ名
    path: path.resolve(__dirname, 'dist'),
    // 出力ファイル名
    filename: 'bundle.js'
  }

  module: {
    rules: [
      {
        // 拡張子.jsの場合
        test: /\.js$/,
        use: [
          {
            // Babelを利用
            loader: 'babel-loader',
            // Babelのオプションを指定
            options: {
              presets: [
                // envを指定することでES2018をES5に変換
                // {'modules': false}にしないとimport文が
                // BabelによってCommonJSに変換され、
                // webpackのTree Shaking(デッドコードを除去する機能)が使えない
                ['env', { 'modules': false }]
              ]
            }
          }
        ]
      }
    ]
  }
};
