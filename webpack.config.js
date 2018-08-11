module.exports = {
  // エントリーポイント(複数のjsファイルを集約したjsファイル)
  entry: './src/index.js',

  // ビルドされた実行ファイルの出力設定
  output: {
    // 出力ファイルのディレクトリ名
    path: `${__dirname}/dist`,
    // 出力ファイル名
    filename: 'bundle.js'
  }
}
