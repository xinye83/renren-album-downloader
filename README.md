# renren-album-downloader
A simple yet much needed web crawler to download all albums on your [renren.com](renren.com) account. I&apos;ve never used JavaScript before and __the codes are all based on the project [XueSeason/renren-album](https://github.com/XueSeason/renren-album)__, I only modified a little for some bug fixes and improvements.

### What&apos;s Updated
- The original downloader can only capture a maximum of 40 photos per album no matter how many more you have, this is due to dynamic loading of renren&apos;s webpage. The issue is fixed and now all photos will be downloaded.
- A quality of life update: added upload time of a photo to the file name, now the name has the format &quot;yyyymmdd_hhmm_photoid&quot;.

### How to Use It
I spent quite some time to get the original downloader running, here is a step-to-step guide for you to use it. My operating system is __Ubuntu 18.04 LTS__.
- Git clone this repository and cd to the local folder.
- You need node.js and a JavaScript package manager, they can be installed with

  ```sh
  $ apt update
  ```

  `$ apt install nodejs`

  `$ apt install npm`.
- Several JavaScript packages are needed, run the following commands

  `$ npm install commander`

  `$ npm install axer`

  `$ npm install cheerio`

  `$ npm install node-rsa`

  `$ npm install readline-sync`.
- Obtain your renren account login information

  `$ ./app.js -l -u yourusername -p yourpassword`.
- Type in the following command and it&apos;s time to get a drink and chill

  `$ ./app.js -d -i youruserid`.

### Misc
- Photos are downloaded to the folder &quot;locals/youruserid/&quot; and organized by their corresponding albums.
- Today is Jun. 1, 2018 and the tool works like magic, but it will fail once renren changes how data is sent or encrypts their urls, so don't hesitate to try it as soon as possible.
