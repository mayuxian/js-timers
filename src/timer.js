/**
 * 时间定时器
 * @desc 时间定时器
 * @param {function} tick - 定时触发事件
 * @param {int} interval -事件间隔 - 事件
 * @param {boolean} _isTimerStop -定时器是否停止
 * @param {boolean} _isTimerLoop -定时器是否循环,默认循环
 */
export default class Timer {
  constructor () {
    this._interval = 1000; //时间间隔，默认1s
    this._tick; //定时器触发事件
    this._isTimerStop = false;//定时器是否停止事件
    this._isTimerLoop = true;
    this.timer = null;
  }
  checkFunction(func) {
    const _toString = Object.prototype.toString;
    return func && _toString.call(func) === '[object Function]'
  }

  ///时间间隔(单位毫秒ms)，默认1s
  get interval() {
    return this._interval;
  }
  set interval(seconds) {
    this._interval = seconds;
  }

  ///时间定时器定时执行函数
  get tick() {
    return this._tick();
  }
  set tick(func) {
    if (!this.checkFunction(func)) {
      throw new Error(`tick is not function.`);
    }
    this._tick = func;
  }

  ///定时器是否循环
  get isTimerLoop() {
    return this._isTimerLoop;
  }
  set isTimerLoop(isLoop) {
    this._isTimerLoop = isLoop;
  }

  ///获取定时器是否停止状态
  get isTimerStop() {
    return this._isTimerStop;
  }

  tickEvent() {
    if (!this.checkFunction(func)) {
      throw new Error(`tick:${this._tick},tick is not function.`);
    }
    if (!this._isTimerStop) {
      this._tick();
    }
  }

  start() {
    this._isTimerStop = false;
    if (this._isTimerLoop) {
      this.timer = setInterval(() => {
        this.tickEvent();
      }, this.interval);
    } else {
      this.timer = setTimeout(() => {
        this.tickEvent();
      }, this.interval);
    }
  }

  stop() {
    this._isTimerStop = true;
    if (this._isTimerLoop) {
      clearInterval(this.timer);
    } else {
      clearTimeout(this.timer);
    }
  }
};
