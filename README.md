summaly
================================================================

fork of [syuilo/summaly](https://github.com/syuilo/summaly)  
altanative of [misskey-dev/summaly](https://github.com/misskey-dev/summaly)  

dev-summalyとの違いは
- 速い

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

### リバースプロキシのサンプル

本アプリケーション自体にはcache及びcache-lock機構が含まれないため、公開Summaly Proxyを運用する場合は前段にnginx等を入れて対応することを推奨します。  
[nginxサンプル](/summaly.example.nginx)

## プラグイン

## twitter
公式埋め込みウィジェットの取得先を独自に叩いて、CDNキャッシュされたTweetエンティティのようなものを取得しています。  
必要によりsensitiveフラグを付与します。

## youtube
おすすめ。  
YouTubeの取得が高速化されます。  
公式のoEmbed endpointを叩いています。  
どうやら配信中のLiveの詳細が取得できるようになる模様。  
descriptionは取得出来なくなります。

## spotify
すごく微妙。  
Spotifyのプレビューが取得されます。  
公式のoEmbed endpointを叩いています。  
descriptionは取得出来なくなります。

## dlsite
必要によりsensitiveフラグを付与します。  
announce と work のURLの誤りを補正します。

## nijie
画像が補完されます。  
常にsensitiveになります。

## iwara
画像が補完されます。  
必要によりsensitiveフラグを付与します。

## komiflo
画像が補完されます。  
必要によりsensitiveフラグを付与します。

## Returns

A Promise of an Object that contains properties below:

### Root

| Property        | Type      | Description                              |
| :-------------- | :-------- | :--------------------------------------- |
| **description** | *string*  | The description of the web page          |
| **icon**        | *string*  | The url of the icon of the web page      |
| **sitename**    | *string*  | The name of the web site                 |
| **thumbnail**   | *string*  | The url of the thumbnail of the web page |
| **medias**      | *string[]*| 出来ればオリジナル画像の一覧を返す |
| **player**      | *Player*  | The player of the web page               |
| **title**       | *string*  | The title of the web page                |
| **url**         | *string*  | The url of the web page 最終リダイレクト先になります |
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
