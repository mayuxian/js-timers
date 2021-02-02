const rollup = require('rollup')
const configFactory = require('./rollup.config')
const util = require('util')
const path = require('path')
const { ncp } = require('ncp')

const { promisify } = util

console.log('process.env.PWD', process.env.PWD);
console.log('process.cwd()', process.cwd());  //cwd()会根据不同的执行目录不同
console.log('__dirname', __dirname);
const rootDir = process.env.PWD || path.join(__dirname, '../dist/')
console.log('rootDir', rootDir);

async function build(option) {
  const bundle = await rollup.rollup(option.input)
  await bundle.write(option.output)
}


(async () => {
  try {
    // build(configFactory({
    //   input: './src/count-down-timer.js',
    //   fileName: './count-down-timer.min.js',
    //   name: 'CountDownTimer'
    // }))

    build(configFactory({
      input: './src/index.js',
      fileName: './js-timers.min.js',
    }))

    await promisify(ncp)('./types/', './')

    // list locales
    // await listLocaleJson(locales)
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
  }
})()
