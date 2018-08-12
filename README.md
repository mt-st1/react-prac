# react-prac

## 利用したバージョン
- node(nodenvでバージョン管理)  
`v8.11.1`
- yarn: JSパッケージマネージャー  
`v1.7.0`
- webpack: モジュールバンドラー(jsファイル(モジュール)やcss,画像といったアセットファイルを1つのJSファイルにまとめる)  
`4.16.5`
- eslint: JSやJSXの構文チェッカー  
`5.3.0`
- flow-bin: JSを型定義するためのもの  
`0.78.0`

## 手順

### プロジェクトの初期設定
- nodenvでバージョン指定したnode.jsをインストール  
```zsh
nodenv install 8.11.1
nodenv rehash
nodenv local 8.11.1
node -v
=> 8.11.1
```
- `yarn init`でプロジェクトの新規作成

### webpackの設定
- webpack関連の必要なパッケージをインストール
```zsh
yarn add -D webpack webpack-cli
```
- `webpack.config.js`(webpackの設定ファイル)を作成
```js
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
}
```
- webpackでバンドルしてみる
  - JavaScriptのモジュールを作る(`./src/index.js`, `./src/sub.js`)
  ```js
  // ./src/index.js
  import { hello } from './sub';
  hello();

  // ./src/sub.js
  export function hello() {
    alert('Hello World');
  }
  ```
  - `yarn run webpack`で実際にビルドする
    - `webpack.config.js`で`mode`(development, production, none)の指定により、webpackの実行オプションを変えることができる
    - 例えばデフォルトの`production`だと本番用に圧縮されたファイルが出力される
  - `webpack.config.js`の`output`に指定した`./dist/bundle.js`に出力される

### Babelの設定
#### Babel
ECMAScriptのトランスパイラ  
flowTypeやJSX, ECMAScript2015(ES6)などのソースコードをサポートしていないブラウザが存在するため、実行できるように取り除いたり、それ以前の記述に変換したりできる.  
このBabelにより変換された後にwebpackがバンドルする.

- Babel関連の必要なパッケージをインストール
```zsh
yarn add -D babel-core babel-loader babel-preset-env babel-preset-react
```
- `webpack.config.js`にBabelの設定追加
```js
module.exports = {
  ...

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
```

### Reactの設定
- React関連の必要なパッケージをインストール
```zsh
yarn add react react-dom
```
- `webpack.config.js`にreactの設定追加
```js
module.exports = {
  ...

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
                ['env', { 'modules': false }],
                // React の JSX を解釈
                'react'
              ]
            }
          }
        ],
        // node_modules は除外する
        exclude: /node_modules/,
      }
    ]
  }
};
```
- `./.babelrc`にBabelの設定をする
```js
{
  "presets": ["react"]
}
```
- 開発用ローカルサーバー立てるためにwebpack-dev-serverをインストール
```zsh
yarn add -D webpack-dev-server
```
- `webpack.config.js`にwebpackで起動させるサーバの設定をする
```js
module.exports = {
  entry: `./src/index.js`,

  ...

  devServer: {
    port: 3000,
    contentBase: 'dist'
  },

  module: {
    ...
  }
};
```
  - `yarn run webpack-dev-server`で`http://localhost:{指定したポート}/`が立ち上がる
- `./src/index.js`, `./src/sub.js`をreact使って変更、`./dist/index.html`を作成し、実際に表示させる
```js
// ./src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import HelloMessage from './sub';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello React!</h1>
        <HelloMessage
          message="with Babel & webpack"
        />
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('react-root'));

// ./src/sub.js
const HelloMessage = (props) => {
  <h3>{props.message}</h3>
};
export default HelloMessage;

// ./dist/index.html
<!doctype html>
<html lang="en">
  <body>
    <div id="react-root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>
```

### eslintの設定
- eslint関連の必要なパッケージをインストール
```zsh
yarn add -D eslint eslint-plugin-react
```
- `./.eslintrc`にチェック時のルールを設定
```js
// .eslintrc
{
  "parser": "babel-eslint",
  "plugins": [
    "flowtype",
    "react"
  ],
  "settings": {
    "flowtype": {
      "onlyFilesWithFlowAnnotation": true
    }
  },
  "parserOptions": {
    "sourceType": "module",
      "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "browser": true,
      "node": true
  },
  "rules": {
    "quotes": [2, "single"],
      "strict": [2, "never"],
      "react/jsx-uses-react": 2,
      "react/jsx-uses-vars": 2,
      "react/react-in-jsx-scope": 2
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:flowtype/recommended"
  ]
}
```

### flowの設定
- flow関連の必要なパッケージをインストール
```zsh
yarn add -D flow-bin
```
- flowを実行
```zsh
yarn run flow init
yarn run flow
```
- flowの基本設定をする
  - `./.flowconfig`にバージョンやチェック対象ファイルを指定
  ```js
  [ignore]
  .*/node_modules/.*

  [include]

  [libs]

  [lints]

  [options]

  [strict]

  [version]
  0.78.0
  ```
- トランスパイル時にflowにより型定義されたコードを取り除くようにする
  - Babelのパッケージをインストール
  ```zsh
  yarn add -D babel-plugin-transform-flow-strip-types
  ```
  - `./.babelrc`に設定を追加
  ```js
  {
    "presets": ["react", "flow"],
    "plugins": [
      "transform-flow-strip-types"
    ]
  }
  ```
- eslintに型定義されたコードを通すように(eslintとflow連携)
  - eslintのパッケージをインストール
  ```zsh
  yarn add -D eslint-plugin-flowtype babel-eslint
  ```
  - `./.eslintrc`に設定を追加
  ```js
  {
    "parser": "babel-eslint",
    "plugins": [
      "flowtype",
      "react"
    ],
    "settings": {
      "flowtype": {
        "onlyFilesWithFlowAnnotation": true
      }
    },
    …
  }
  ```
- JSファイル(`./src/sub.js`)に対しflowを使って型定義する
```js
import React from 'react';

type Props = {
  message: string
};

const HelloMessage = (props: Props) => {
  return <h3>{props.message}</h3>;
};
export default HelloMessage;
```
