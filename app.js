#!/usr/bin/env node

const path = require('path')

const package = require('./package.json')
const program = require('commander')

const login = require('./login')
const photo = require('./photo')
const keyword = require('./keyword')

program
.version(package.version)
.option('-l, --login', 'login renren')
.option('-d, --download', 'download album')
.option('-u, --username [string]', 'append username')
.option('-p, --password [string]', 'append password')
.option('-k, --keyword [string]', 'append keyword')
.option('-n, --number [number]', 'the number of keyword images you want to download, default 10')
.option('-i, --userid [string]', 'specify download someone\'s album by user id')
.parse(process.argv)

async function run() {
  if (program.login) {
    if (program.username === undefined) {
      console.log('必须输入用户名: 参考 -u')
    } else if (program.password === undefined) {
      console.log('必须输入密码: 参考 -p')
    } else {
      await login(program.username, program.password)
    }
  } else if (program.download) {
    if (program.userid === undefined) {
      await photo.getSelfAlbum()
    } else {
      await photo.getAlbum(program.userid)
    }
  } else if (program.keyword) {
    await keyword.getPhoto(program.keyword, program.number || 10)
  }
}

run()

process.on('unhandledRejection', err => {
  console.log('unhandledRejection', err)
})