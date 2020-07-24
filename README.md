summaly
================================================================

fork of [summaly](https://github.com/syuilo/summaly)

オリジナルとの違いは
- 画像をData URIで添付する＆リサイズもするオプションを追加
- キャッシュの調整
- エラーメッセージの調整
- ~~Twitterのアカウント設定によりsensitiveフラグを付けるように~~ Merged
- リクエスト部分をマルチインスタンス対応
- `youtu.be`, `nicovideo.jp`などの不具合修正
- CORS対応
- faviconリクエストを削減
- faviconやthumbnailの相対URLの補完を修正
- サーバー動作では使用するプラグインを制限するように
- followRedirects無効でリダイレクトされた場合でもリダイレクト先URLを返すように
- 依存関係などを最新化

### Install and build
```
yarn install
yarn build
```

### Run as server
```
yarn server
```

### To use server
```
http://localhost:3030/?url=https://example.com
```

### Returns

A Promise of an Object that contains properties below:

#### Root

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

#### Player

| Property        | Type     | Description                              |
| :-------------- | :------- | :--------------------------------------- |
| **url**         | *string* | The url of the player                    |
| **width**       | *number* | The width of the player                  |
| **height**      | *number* | The height of the player                 |

License
----------------------------------------------------------------
[MIT](LICENSE)
