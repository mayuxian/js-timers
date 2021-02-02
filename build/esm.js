const util = require('util')
const { promisify } = util
const { ncp } = require('ncp')

const path = require('path')
const typeFileExt = '.d.ts'
console.log('process.env.PWD', process.env.PWD);
console.log('process.cwd()', process.cwd());  //cwd()会根据不同的执行目录不同
console.log('__dirname', __dirname);
const rootDir = process.env.PWD || path.join(__dirname, '../')
console.log('rootDir', rootDir);

(async () => {
  try {
    await promisify(ncp)(path.join(rootDir, './types/'), './esm')
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
  }
})()
