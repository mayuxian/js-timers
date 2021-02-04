const util = require('util')
const { promisify } = util
const { ncp } = require('ncp')

const path = require('path')
// const typeFileExt = '.d.ts'
console.log('process.env.PWD', process.env.PWD);
 //cwd()会由于命令执行目录不同,而返回的路径也不一致,不可采用此种方式
console.log('process.cwd()', process.cwd()); 
const rootDir = process.env.PWD || path.join(__dirname, '../')
console.log('rootDir', rootDir); 

(async () => {
  try {
    await promisify(ncp)(path.join(rootDir, './types'), './esm')
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
  }
})()
