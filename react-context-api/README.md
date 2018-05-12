React Context APIについて

# React Context API

この記事では[`React Context API`](https://reactjs.org/docs/context.html)について見ていきたいと思います。

まずは、`React Context API`の背景についてお話ししたいと思います。

## 背景

* Reactでは、配下のコンポーネントにデータを渡すための手段として[`props`](https://reactjs.org/docs/components-and-props.html)という機能が提供されています。
* ところが、この`props`を使用すると、親コンポーネントから子コンポーネントへ、さらに孫コンポーネントへ、...、といった具合で、渡したいコンポーネントまで渡したいデータをバケツリレーのように延々と渡していかなければならない弱点がありました。これを`prop drilling`問題と言います。
* その問題を解消するべく、どのコンポーネントからでも特定のデータにアクセスできる仕組みが`react-redux`から提供されています。
* Reduxを使用したことのある人なら誰もが知っている[`Provider`](https://github.com/reduxjs/react-redux/blob/master/docs/api.md#provider-store)コンポーネントです。
* `Provider`コンポーネントは文字通り`Provider`コンポーネントでwrapした全てのコンポーネントに対して特定のデータを届けることを目的とするコンポーネントになります。
* ところがその後、Reactモジュールは、バージョンv16.3で、Reduxに喧嘩を売っているのか？とまさに耳を疑うような機能を追加してきました。
* `react-redux`の`Provider`とほぼ同様の機能で同名の`Provider`というコンポーネントをリリースしたんです。
* この記事では、React側でリリースされたこの`Provier`を含む[Context](https://reactjs.org/docs/context.html) APIについての紹介と、`Context API`を使用したアプリケーションの実践的な実装例について紹介したいと思います。

## Reactアプリケーションの作成

では、早速、Reactアプリケーションを作成しましょう。アプリケーションの名前は`counter`とします。

```bash
$ npm init react-app counter
```

そして、`counter`ディレクトリに移動します。

```bash
$ cd counter
```

念のため、`package.json`の中身を確認しておきましょう。

Reactのバージョンが`v16.3`以上でないと`React Context API`の動作確認ができないので確認します。

`react`のバージョンが`^16.3.2` となっているので問題ないです。

```javascript
{
  "name": "counter",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.3.2",
    "react-dom": "^16.3.2",
    "react-scripts": "1.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

続いてReactアプリケーションを起動します。ターミナルで`yarn start`と入力し、エンターキーを押します。

```bash
$ yarn start
```

`yarn start`を実行するとブラウザが自動的に起動されます。そして、`Welcome to React`のおなじみの画面が表示されます。

これが確認できたらエディターに戻って、ファイルを編集します。

## React Context APIを導入したカウンタアプリの例

では、これから、React Context APIを導入したカウンタアプリの実装を始めます。

まずはReactアプリケーションのトップレベルのファイルである`src/index.js`を編集していきます。

### 編集後の`src/index.js`

そして、`src/index.js`を以下のように書き換えます。

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import CounterContext from './contexts/counter'
import Counter from './components/counter'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.increment = this.increment.bind(this)
    this.decrement = this.decrement.bind(this)

    this.state = {
      count: 0,
      increment: this.increment,
      decrement: this.decrement
    }
  }

  increment() {
    this.setState({count: this.state.count + 1})
  }

  decrement() {
    this.setState({count: this.state.count - 1})
  }

  render() {
    return (
      <CounterContext.Provider value={this.state} >
        <Counter />
      </CounterContext.Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

以下の点がポイントになります。

* `import CounterContext from './contexts/counter'` コンテキストの作成はこの`src/index.js`ではやらず別ファイルに分離します。
    * このアプリケーションではコンテキストのファイルは`contexts`ディレクトリに集めたいと思います。
    * そして`CounterContext`というコンテキストを定義します。
    * この`src/index.js`では、その`CounterContext`を`import`して使用します。
    * コンテキストは`Provier`と`Consumer`のAPIを提供します。
* 今編集中の`src/index.js`で作成している`App`コンポーネントの役割は自身がもつカウンタの状態やカウンタの値をインクリメントしたりデクリメントする機能を有するstateを配下のコンポーネントに提供することです。
* そのstateの提供時に`Provider`コンポーネントで提供すれば良いです。
* また、今回のように小規模なアプリケーションだと問題にはならないですが、大規模なアプリケーションを想定するとおそらく今回のように別のファイルに分離しないと状態管理に関してカオスになってしまいます。
* というのも、contextは実質無限個作成できるからです。
* そういう理由からcontextは別のファイルに分離しました。
* componentも別ファイルに分離しました。
* これもcontextと同様の理由からですが、もはやこれはReactアプリケーションを書く人なら既に身についているであろう慣習です。
* 状態はReactの基本機能であるstateで管理します。
* 状態遷移についてもReactの`setState`で行います。
* なのでReduxで書くときとは違い、stateの変更とそれを誘発するイベントハンドラがコンポーネントにべったりな点は、Reduxアプリを書き慣れている人で何でもかんでも分離したがる潔癖症な人にとってはかなりキモいコードと感じてしまうかもしれませんが仕方ないです。
* importしたCounterContextに紐づく`CounterContext.Provider`というコンポーネントで渡したい状態を受け取るコンポーネントをwrapします。
* `Provider`ではなく`CounterContext.Provider`と表記しているのは、今回のケースでは、`Provider`でも良かったんですがContextは無数存在し得る物なのでどのProviderなのかを識別できるよう`CounterContext.`というプレフィックスにより名前空間を識別する習慣を付けないと後々アプリケーションが大規模になってきて複数のContextが入り乱れるようになってときにリファクタリングを強いられると思うのでそうしています。こういう将来起こりうる問題を予測しながら安全なコードを早い段階から意識してかけるように準備しておくことはプログラマーとしては非常に大事な習慣になると思います。
* ProvierでConsumerに渡したい状態を`value=`で渡しています。
* 状態は`this.state`で取得できます。

以上が`App`コンポーネントの説明になります。

### Counterコンポーネント

続いてCounterコンポーネントを作成します。　

```bash
$ mkdir src/components
$ touch src/components/counter.js
```

エディターで以下のように編集します。

```javascript
import React from 'react';
import CounterContext from '../contexts/counter'

const Counter = () => (
  <CounterContext.Consumer>
    {
      ({ count, increment, decrement }) =>  {
        return (
          <React.Fragment>
            <div>count: {count}</div>
            <button onClick={increment}>+1</button>
            <button onClick={decrement}>-1</button>
          </React.Fragment>
        )
      }
    }
  </CounterContext.Consumer>
)

export default Counter
```

では`Counter`コンポーネントについて説明していきます。

* まず、今からコンポーネントを作成しますので、`import React`を書きます。
    * もちろん、`form 'react'`になります。
* そして次に、`App`コンポーネントと同様に`CounterContext`を`import`します。
    * これは、`App`コンポーネント内の`CounterContext`の`Provider`が渡してくれる`value`を受けるためです。
    * そのvalueを受け取るには、CounterContextのConsumerコンポーネントが必要になります。
* 今から作成するコンポーネントをCounterコンポーネントとします。
    * このコンポーネント独自の状態はないため関数コンポーネントにします。
    * そしてこのCounterコンポーネントの子コンポーネントに`CounterContext`の`Consumer`コンポーネントを設置します。
    * `CounterContext.Consumer`と表記しているのは、`CounterContext.Provider`と表記しているのと同じ理由からです。(上述)
    * Consumerの内部は関数であり必須です。
    * 関数を書いてください。
    * Consumer内部の関数の引数で、Providerが渡してくれたvalueを受け取ることができます。
    * 今回のアプリケーションでは、Appコンポーネント側から渡した、カウンタの値、インクリメントの関数、デクリメントの関数を受け取ることができます。
    * 後はこの様に、受け取った値を適当な場所に表示させたり、受け取った処理を適当なイベントハンドラに渡したりすれば良いです。


以上が、Counterコンポーネントの実装になります。

### CounterContextの作成

最後にカウンタ専用の`CounterContext`を作成します。

```bash
$ mkdir src/contexts
$ touch src/contexts/counter.js
```

`src/contexts/counter.js`を以下のように編集します。

```javascript
import { createContext } from 'react';

const CounterContext = createContext()
export default CounterContext
```

* コンテキストとは即ちProviderとConsumer間で共有したいオブジェクトです。
* つまり、状態と処理です。
* createContextの引数にはデフォルト値を渡すことができます。
* ところが、今回のアプリケーションにおいてのデフォルト値の設定はAppコンポーネントで行っていますので、CounterContextでは何も設定しないというポリシーにしています。

## デモ画面

* 以上のコーディングが終われば、ブラウザにカウンタアプリが表示されると思います。
* +1ボタンを押したり、-1ボタンを押したりして動作確認をしてみてください。

![demo.gif](https://qiita-image-store.s3.amazonaws.com/0/9001/aa76ae77-c1b3-0381-25f9-09b462abdfe9.gif)

## ソースコード

* 今回の記事で扱った動作確認のとれているソースコードは[GitHub](https://github.com/ProgrammingSamurai/react-recipes)に公開しています。
* 書くのが面倒という方は下記コマンドで`git clone`をしてコードの確認や挙動の確認をしてみてください。

```bash
$ git clone git@github.com:ProgrammingSamurai/react-recipes.git
```

以上で、React バージョンv16.3のContext APIの紹介は終わります。今後も目が離せないReactですね。それではまた！

## おわりに

先日、Udemy講師デビューを果たしました。「[フロントエンドエンジニアのためのReact・Reduxアプリケーション開発入門](https://goo.gl/M1V3sD)」というコースを公開中です。これからReactをやってみようとお考えの方は是非始めてみてください！こちらの[リンク](https://goo.gl/M1V3sD)から95%オフで購入できます。ご質問も大歓迎です！ :)
