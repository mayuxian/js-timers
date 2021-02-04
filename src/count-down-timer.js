/**
 * 操作时间定时器
 * @desc 主要在交易页面根据用户是否操作的状态进行倒计时的处理。
 * @desc status 倒计时状态，CountDownTimeoutMode倒计时模式，CountDownTimer倒计时类
 * @param {double} remainingSeconds -页面倒计时剩余秒数
 * @param {double} timeoutSeconds - 页面设置的超时时间
 * @param {CountDownTimeoutMode} timeoutMode - 倒计时模式
 * @param {CountDownTimerStatus} timerStatus - 倒计时状态
 */

import Timer from './timer';

/**
 * 操作时间定时器的状态
 * @desc 标记操作时间总计时器当前的操作状态
 */
// const CountDownTimerStatus = Object.freeze({
//   started: Symbol(0),
//   stopped: Symbol(1),
//   paused: Symbol(1)
// })
const CountDownTimerStatus = Object.freeze({
  //启动
  started: 0,
  //停止
  stopped: 1,
  //暂停
  paused: 2
});

/**
 * 操作时间定时器的超时模式
 * @desc 指定操作超时是总是倒计时或输入则重置倒计时
 */
// const CountDownTimeoutMode = Object.freeze({
//   alawaysCountDown: Symbol(0),
//   resetOnActivity: Symbol(1)
// })
const CountDownTimeoutMode = Object.freeze({
  //总是倒计时
  alawaysCountDown: 0,
  //输入操作重置倒计时
  resetOnActivity: 1
});

const mainTimerInterval = 1000; //主要定时器时间间隔


/*倒计时类
 */
class CountDownTimer {
  constructor () {
    this._remainingSeconds = 0;
    this._timeoutSeconds = 0;
    this._timerStatus = CountDownTimerStatus.paused; //操作定时状态
    this._timeoutMode = CountDownTimeoutMode.alawaysCountDown; // 操作超时模式
    this.onTimeout = null;//超时触发器

    this.mainTimer = new Timer();
    this.mainTimer.isTimerLoop = false;
    this.mainTimer.interval = mainTimerInterval;
    this.mainTimer.tick = () => {
      this.mainTimerEvent();
    };
  }

  //超时剩余时间
  get remainingSeconds() {
    return this._remainingSeconds;
  }
  set remainingSeconds(seconds) {
    this._remainingSeconds = seconds;
  }

  //超时时间
  get timeoutSeconds() {
    return this._timeoutSeconds;
  }
  set timeoutSeconds(seconds) {
    this._timeoutSeconds = seconds;
  }

  //定时器状态
  get timerStatus() {
    return this._timerStatus;
  }

  //超时模式
  get timeoutMode() {
    return this._timeoutMode;
  }
  set timeoutMode(mode) {
    this._timeoutMode = mode;
  }

  /*--------设置操作时间超时------[公有方法]----------------*/
  setTimeout(seconds) {
    this.stop();
    this.timeoutSeconds = seconds;
    this.remainingSeconds = seconds;
  }

  //启动操作
  start() {
    // console.log(`CountDownTimer start: ${this.timeoutSeconds}s`);
    if (this._timeoutMode === CountDownTimeoutMode.resetOnActivity) {
      this.listenActiveEvent();
    }
    this.remainingSeconds = this.timeoutSeconds;
    this.mainTimer.start();
    this._timerStatus = CountDownTimerStatus.started;
  }
  //监听用户操作激活
  listenActiveEvent() {
    var body = document.querySelector('html');
    const activeFun = (event) => {
      body.removeEventListener("click", activeFun);
      body.removeEventListener("keydown", activeFun);
      body.removeEventListener("mousemove", activeFun);
      body.removeEventListener("mousewheel", activeFun)
      this.reset();
    }
    body.addEventListener("click", activeFun);
    body.addEventListener("keydown", activeFun);
    body.addEventListener("mousemove", activeFun);
    body.addEventListener("mousewheel", activeFun)
  }

  //停止操作
  stop() {
    this.mainTimer.stop();

    this.remainingSeconds = 0;
    this._timerStatus = CountDownTimerStatus.stopped;
  }

  //暂停操作
  pause() {
    if (this._timerStatus == CountDownTimerStatus.started) {
      this.mainTimer.stop();

      this._timerStatus = CountDownTimerStatus.paused;
    }
  }

  //恢复倒计时
  resume() {
    if (this._timerStatus != CountDownTimerStatus.paused) {
      return;
    }
    this.mainTimer.start();
    this._timerStatus = CountDownTimerStatus.started;
  }

  //重置倒计时
  reset() {
    if (this._timerStatus == CountDownTimerStatus.stopped) {
      return;
    }
    this.stop();
    this.start();
  }
  /*-----------------------------------------------*/
  /*----倒计时定时器触发事件------[私有方法]----------*/
  checkFunction(func) {
    return func && Object.prototype.toString.call(func) === '[object Function]'
  }
  countDownTimeout() {
    if (this.checkFunction(this.onTimeout)) {
      this.onTimeout();
    }
  }
  mainTimerEvent() {
    this.remainingSeconds--;
    // console.log(`timer id:${this.mainTimer.timer}`);
    if (this.remainingSeconds <= 0) {
      this.stop();
      this._timerStatus = CountDownTimerStatus.stopped;
      this.countDownTimeout();
      // EventManager.emit('onTimeout');
    } else {
      this.mainTimer.start();
    }
  }
}

export default {
  CountDownTimer,
  CountDownTimerStatus,
  CountDownTimeoutMode
};
