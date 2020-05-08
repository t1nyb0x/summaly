summaly
================================================================

fork of summaly

- Attach the image as data-uri
- Flag on Twitter's sensitive

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
