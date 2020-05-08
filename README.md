summaly
================================================================

fork of summaly

- Attach the image as data-uri
- Flag on Twitter's sensitive

Installation
----------------------------------------------------------------
`$ npm install summaly`

Usage
----------------------------------------------------------------
``` javascript
summaly(url[, opts])
```

### Options

| Property            | Type                   | Description              | Default |
| :------------------ | :--------------------- | :----------------------- | :------ |
| **followRedirects** | *boolean*              | Whether follow redirects | `true`  |
| **plugins**         | *plugin[]* (see below) | Custom plugins           | `null`  |

#### Plugin

``` typescript
interface IPlugin {
	test: (url: URL.Url) => boolean;
	summarize: (url: URL.Url) => Promise<Summary>;
}
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

### Example

``` javascript
import summaly from 'summaly';

const summary = await summaly('https://www.youtube.com/watch?v=NMIEAhH_fTU');

console.log(summary); // will be ... ↓
/*
{
	title: '【楽曲試聴】「Stage Bye Stage」(歌：島村卯月、渋谷凛、本田未央)',
	icon: 'https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico',
	description: 'http://columbia.jp/idolmaster/ 2018年7月18日発売予定 THE IDOLM@STER CINDERELLA GIRLS CG STAR LIVE Stage Bye Stage 歌：島村卯月、渋谷凛、本田未央 COCC-17495［CD1枚組］ ￥1,200＋税 収録内容 Tr...',
	thumbnail: 'https://i.ytimg.com/vi/NMIEAhH_fTU/maxresdefault.jpg',
	player: {
		url: 'https://www.youtube.com/embed/NMIEAhH_fTU',
		width: 1280,
		height: 720
	},
	sitename: 'YouTube',
	url: 'https://www.youtube.com/watch?v=NMIEAhH_fTU',
	sensitive: false
}
*/
```

Testing
----------------------------------------------------------------
`npm run test`

License
----------------------------------------------------------------
[MIT](LICENSE)
