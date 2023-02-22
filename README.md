summaly
================================================================

fork of [summaly](https://github.com/syuilo/summaly)

オリジナルとの違いは

ほぼ全てが違う、バージョンはあてにならない。

## インストールとビルド
```
yarn install
yarn build
```

## サーバーとして動かす
```
yarn server
```

## サーバーとして使う
```
http://localhost:3030/url?url=https://example.com
```

### サーバーの詳細なコンフィグ

サーバーとして使用する場合に使用するプラグインを設定できます
```
cp server_config.example.yml server_config.yml
```

ファイル内の各プラグインの行をコメントアウトして有効にすることが出来ます。

## プラグイン

## twitter - 高速Twitterプラグイン
Twitterの取得が高速化されます
```
オリジナル: 1230ms
本プラグイン: 182ms (7倍速い)
```
公式埋め込みウィジェットの取得先を独自に叩いて、CDNキャッシュされたTweetエンティティのようなものを取得しています。  
非公式APIよりは将来的にブロックされる可能性は低いと思われる。

## youtube - 高速YouTubeプラグイン

YouTubeの取得が高速化されます
```
オリジナル: 2160ms
本プラグイン: 117ms (18倍速い)
```
公式のoEmbed endpointを叩いています。  
descriptionは取得出来なくなります。  
ただし、YouTubeの一覧ページでさえdescriptionは見れない状況のためさほどUX的な影響は少ないものと思われます。  
最近のYouTubeはタイトルが長めの傾向が強いため、表示時にタイトルを長めに表示出来るようにするといいかもしれません。

## Returns

A Promise of an Object that contains properties below:

### Root

| Property        | Type      | Description                              |
| :-------------- | :-------- | :--------------------------------------- |
| **description** | *string*  | The description of the web page          |
| **icon**        | *string*  | The url of the icon of the web page      |
| **sitename**    | *string*  | The name of the web site                 |
| **thumbnail**   | *string*  | The url of the thumbnail of the web page |
| **player**      | *Player*  | The player of the web page               |
| **title**       | *string*  | The title of the web page                |
| **url**         | *string*  | The url of the web page                  |
| **sensitive**   | *boolean* | The content is sensitive or not          |

### Player

| Property        | Type     | Description                              |
| :-------------- | :------- | :--------------------------------------- |
| **url**         | *string* | The url of the player                    |
| **width**       | *number* | The width of the player                  |
| **height**      | *number* | The height of the player                 |

License
----------------------------------------------------------------
[MIT](LICENSE)
