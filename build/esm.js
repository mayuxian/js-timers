const util = require('util')
const { ncp } = require('ncp')
const { promisify } = util

// const path = require('path')
// const typeFileExt = '.d.ts'
// console.log('process.env.PWD', process.env.PWD);
// console.log('process.cwd()', process.cwd());  //cwd()会根据不同的执行目录不同
// console.log('__dirname', __dirname);
// const rootDir = process.env.PWD || path.join(__dirname, '../')
// console.log('rootDir', rootDir);

(async () => {
  try {
    await promisify(ncp)('./types/', './dist')
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
  }
})()
