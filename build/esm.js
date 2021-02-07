const util = require('util')
const { promisify } = util
const { ncp } = require('ncp')

const path = require('path')
const rootDir = path.join(__dirname, '../');

(async () => {
  try {
    await promisify(ncp)(path.join(rootDir, './types'), './esm')
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
  }
})()
