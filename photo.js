const path = require('path')
const cheerio = require('cheerio')
const Request = require('axer').request
const file = require('axer').file
const config = require('./config')
const fs = require('fs')

async function getPhoto(album) {
  const cookieJarPath = path.resolve(config.storageDir, 'cookieJar.json')
  const request = new Request(cookieJarPath)

  const photoCount = album.photoCount

// http://comment.renren.com/comment/xoa2?limit=10&desc=true&offset=0&replaceUBBLarge=true&
//          type=album&entryId=909750576&entryOwnerId=280481951&&requestToken=465179088&_rtk=e77b102a
// http://photo.renren.com/photo/280481951/album-324303603/bypage/ajax/v7?page=3&pageSize=20&requestToken=465179088&_rtk=e77b102a
// http://photo.renren.com/photo/280481951/album-324303603/bypage/ajax/v7?page=4&pageSize=20&requestToken=465179088&_rtk=e77b102a

  // 获取相册内照片连接
  const albumResponse = await request.get(`http://photo.renren.com/photo/${album.ownerId}/album-${album.albumId}/v7`)

  const regex = /photo = ((.|\n)*|);\n;/g
  const m = regex.exec(albumResponse.body)
  const photoListContent = m && m[1]

  const photoListInfo = JSON.parse(photoListContent.replace(/'/g, '"')).photoList
  // console.log(JSON.stringify(photoListInfo, null, 2))

  var pageCount = 2
  while (photoListInfo.photoList.length < photoCount) {
    pageCount++
    const albumResponseNext = await request.get(`http://photo.renren.com/photo/${album.ownerId}/album-${album.albumId}/bypage/ajax/v7?page=${pageCount}&pageSize=20`)
    
    // console.log('------------------------------------------------')
    // console.log(pageCount)
    // console.log(albumResponseNext)    
    // console.log('------------------------------------------------')

    const photoListNext = JSON.parse(albumResponseNext.body.replace(/'/g, '"')).photoList

    // console.log('------------------------------------------------')
    // console.log(photoListNext)
    // console.log('------------------------------------------------')

    photoListInfo.photoList = photoListInfo.photoList.concat(photoListNext)

    // console.log('------------------------------------------------')
    // console.log(pageCount)
    // console.log(photoListInfo.photoList.length)    
    // console.log('------------------------------------------------')

    delete albumResponseNext
    delete photoListNext
  }

  // console.log('-----------------------------------------------------------------------------')
  // console.log(album.albumName)
  // console.log(album.photoCount)
  // console.log(photoListInfo.photoList.length)
  // console.log('-----------------------------------------------------------------------------')

  fs.appendFile(`log_${album.ownerId}`, "******************************\n", function (err) {
    if (err) throw err;
  });
  fs.appendFile(`log_${album.ownerId}`, "Album name: " + album.albumName + "\n\n", function (err) {
    if (err) throw err;
  });
  fs.appendFile(`log_${album.ownerId}`, "Photo count: " + photoCount + "\n", function (err) {
    if (err) throw err;
  });
  fs.appendFile(`log_${album.ownerId}`, "# captured : " + photoListInfo.photoList.length + "\n\n", function (err) {
    if (err) throw err;
  });


  for (let i = 0; i < photoListInfo.photoList.length; i++) {
    const photo = photoListInfo.photoList[i]
    // 创建相册目录
    const albumPath = path.resolve(config.storageDir, `${album.ownerId}`, album.albumName)
    await file.mkdir(albumPath)

    const hdPhotoUrl = photo.url

    var position = 0;
    while (hdPhotoUrl[position] != '/' || hdPhotoUrl[position+1] != '2' || hdPhotoUrl[position+2] != '0')
      position++

    var photoName = hdPhotoUrl.slice(position+1,position+9)+"_"+hdPhotoUrl.slice(position+10,position+14) + "_" + photo.photoId

    // console.log(hdPhotoUrl)
    // console.log(photoName)

    const originalPhotoUrl = hdPhotoUrl.replace('large', 'original')

    const photoSavePath = path.resolve(albumPath, `${photoName}.jpg`)
    // 下载照片
    try {
      await request.download(originalPhotoUrl, photoSavePath)
      const checkContent = await file.cat(photoSavePath)
      if (checkContent.indexOf('DOCTYPE') > 0) {
        console.log('不存在原图，开始下载高清图')
        await request.download(hdPhotoUrl, photoSavePath)
      }
    } catch (error) {
      console.log('下载出现错误，将再次尝试一次下载')
      await request.download(originalPhotoUrl, photoSavePath)
      const checkContent = await file.cat(photoSavePath)
      if (checkContent.indexOf('DOCTYPE') > 0) {
        console.log('不存在原图，开始下载高清图')
        await request.download(hdPhotoUrl, photoSavePath)
      }
    } 
  }
}

async function getAlbum(ownerId) {
  const cookieJarPath = path.resolve(config.storageDir, 'cookieJar.json')
  const request = new Request(cookieJarPath)

  fs.writeFile(`log_${ownerId}`, "Downloading photos of user: " + ownerId + "\n\n", function (err) {
    if (err) throw err;
  });

  // 获取相册详情
  const albumlistResponse = await request.get(`http://photo.renren.com/photo/${ownerId}/albumlist/v7`)
  const regex = /photo = ((.|\n)*|);\nnx/g
  const m = regex.exec(albumlistResponse.body)
  const albumlistContent = m && m[1]
  const albumlistInfo = JSON.parse(albumlistContent.replace(/'/g, '"'))
  // console.log(JSON.stringify(albumlistInfo, null, 2))

  for(let i = 0; i < albumlistInfo.albumList.albumList.length; i++) {
    const album = albumlistInfo.albumList.albumList[i]

    // 获取相册内到照片
    try {
      await getPhoto(album) 
    } catch (error) {
      console.log('获取照片失败', error)
    }
  }
}

// problem with variable nx
async function getSelfAlbum() {
  const cookieJarPath = path.resolve(config.storageDir, 'cookieJar.json')
  const request = new Request(cookieJarPath)

  const homeResponse = await request.get('http://www.renren.com')

  const $ = cheerio.load(homeResponse.body)
  // 运行脚本获取数据并删除污染变量
  let nxcontent = $('script').first().text()
  // console.log(homeResponse.body)
  eval(nxcontent)
  const user = nx.user
  delete nx
  console.log(user)

  await getAlbum(user.id)
}

exports.getSelfAlbum = getSelfAlbum
exports.getAlbum = getAlbum