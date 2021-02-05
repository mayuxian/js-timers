const rollup = require('rollup')
const configFactory = require('./rollup.config')
const util = require('util')
const path = require('path')
const { ncp } = require('ncp')

const { promisify } = util

console.log('process.env.PWD', process.env.PWD);
 //cwd()会由于命令执行目录不同,而返回的路径也不一致,不可采用此种方式
console.log('process.cwd()', process.cwd()); 
const rootDir = process.env.PWD || path.join(__dirname, '../')
console.log('rootDir', rootDir); 

async function build(option) {
  const bundle = await rollup.rollup(option.input)
  await bundle.write(option.output)
}


(async () => {
  try {
    build(configFactory({
      input: './src/index.js',
      fileName: './index.min.js',
    }))

    await promisify(ncp)(path.join(rootDir,'./types'), './')

    // list locales
    // await listLocaleJson(locales)
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
  }
})()
