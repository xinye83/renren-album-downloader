# renren-album-downloader 人人网相册下载工具

A simple yet much needed web crawler to download all albums on your [renren.com](renren.com) account. I&apos;ve never used JavaScript before and __the codes are all based on the project [XueSeason/renren-album](https://github.com/XueSeason/renren-album)__, I only modified a little for some bug fixes and improvements.

### What&apos;s Updated
- The original downloader can only capture a maximum of 40 photos per album no matter how many more you have, this is due to dynamic loading of renren&apos;s webpage. The issue is fixed and now all photos will be downloaded.
- A quality of life update: added upload time of a photo to the file name, now the name has the format &quot;yyyymmdd_hhmm_photoid&quot;.

### Step-by-Step User Guide
My operating system is Ubuntu 18.04 LTS

我使用的操作系统是Ubuntu 18.04 LTS

- Git clone this repository and cd to the local folder
  
  下载所有文件并cd至本地文件夹内
  
- You need node.js and a JavaScript package manager, they can be installed with
  
  用下列命令安装node.js和JavaScript包管理器
  
  ```sh
  $ apt update
  $ apt install nodejs
  $ apt install npm
  ```

- Several JavaScript packages are needed, run the following commands
  
  用下列命令安装运行所需要的JavaScript组件

  ```sh
  $ npm install commander
  $ npm install axer
  $ npm install cheerio
  $ npm install node-rsa
  $ npm install readline-sync
  ```
  
- Obtain your renren account login information
  
  获取人人账号登录信息

  ```sh
  $ ./app.js -l -u yourusername -p yourpassword
  ```
  
- Type in the following command and it&apos;s time to get a drink and chill
  
  开始下载照片，等待的时候可以点杯饮料放松一下 :)

  ```sh
  $ ./app.js -d -i youruserid
  ```

### Misc
- Photos are downloaded to the folder &quot;locals/youruserid/&quot; and organized by their corresponding albums.
- Today is Jun. 1, 2018 and the tool works like magic, but it will fail once renren changes how data is sent or encrypts their urls, so don't hesitate to try it as soon as possible.
