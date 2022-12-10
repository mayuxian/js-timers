// import "core-js/stable";
// import "regenerator-runtime/runtime";
// import "@babel/polyfill";

import { Timer } from './timer.js';
class HttpTimer {
  constructor() {
    this._timer = new Timer();
    this._timer.interval = 300;
    this._retryCount = 3;
    this._checkResponseCb = null;

    this._toString = Object.prototype.toString;
  }

  //尝试次数
  get retryCount() {
    return this._retryCount;
  }
  set retryCount(val) {
    this._retryCount = val;
  }

  //检查响应是否通过的回调函数
  //通过返回true,未通过返回异常或object将当错异常抛出
  get checkResponseCb() {
    return this._checkResponseCb;
  }
  set checkResponseCb(val) {
    this._checkResponseCb = val;
  }

  setOptions({ retryCount, checkResponseCb, interval }) {
    this._retryCount = retryCount || 3;
    this._checkResponseCb = checkResponseCb;
    this._timer.interval = interval;
  }

  async requestAsync(promise, ...args) {
    // new Promise((resolve,reject)=>{})
    let count = 0;
    try {
      const response = await this._request(promise, ...args);
      Promise.resolve(response); //请求不通过,会抛出异常
    } catch (err) {
      this._timer.tick = async () => {
        count++; //重试次数累加
        this._request(promise, ...args)
          .then((res) => {
            Promise.resolve(res); //请求不通过,会抛出异常
          })
          .catch((error) => {
            if (count >= this._retryCount) {
              this._timer.stop();
              this.tick = null;
              Promise.reject(error);
            }
          });
      };
      this._timer.start();
    }
  }

  // request(promise, args) {
  //   const _argsArr = Array.prototype.slice.call(arguments)
  //   const _promise = _argsArr.slice(0, 1);
  //   const _requestArgs = _argsArr.slice(1);
  //   const _request = function () {
  //     _requestArgs.push(...arguments)
  //     return _request;
  //   }
  //   _request.valueOf = function () {

  //   }
  //   return _request;
  // }

  //-------私有方法---------

  async _request(promise, ...args) {
    let isPass = true;
    try {
      const result = await promise(...args);
      if (this.isFunction(this.checkResponseCb)) {
        isPass = this.checkResponseCb(result);
      }
      if (isPass) {
        Promise.resolve(result);
      } else {
        //没通过,则callback({}),主要用于通信成功,后台业务逻辑错误
        Promise.reject(result);
      }
    } catch (err) {
      isPass = false;
      if (this.isFunction(this.checkResponseCb)) {
        isPass = this.checkResponseCb(err);
      }
      if (!isPass) {
        Promise.reject(err);
        return;
      }
    }
  }

  isPromise(val) {
    return val && this.isFunction(val.then) && this.isFunction(val.catch);
  }
  isFunction(val) {
    return val && this._toString.call(val) === '[object Function]';
  }
  isObject(val) {
    return val && this._toString.call(val) === '[object Object]';
  }
}

export { HttpTimer };
