import { Timer } from './timer.js';

/**
 * Enum: Status
 */
const CountDownTimerStatus = Object.freeze({
  //运行
  running: 'running',
  //停止
  stop: 'stop',
  //暂停
  pause: 'pause'
});

/**
 * Enum: Mode
 */
// const CountDownTimeoutMode = Object.freeze({
//   loop: Symbol(0),
//   reset: Symbol(1)
// })
const CountDownTimeoutMode = Object.freeze({
  //Stop when the countdown is over
  once: 'once',
  //after the timer stop,restart
  loop: 'loop',
  //reset countdown after user operation
  reset: 'reset'
});

/*倒计时类
 */
class CountDownTimer {
  constructor () {
    this._remainingSeconds = 60;
    this._timeoutSeconds = 60;
    this._timerStatus = CountDownTimerStatus.pause; //操作定时状态
    this._timeoutMode = CountDownTimeoutMode.once; // 操作超时模式
    this.onTimeout = null;//超时触发器
    this.tick = null;//倒计时触发器

    this.mainTimer = new Timer();
    this.mainTimer.interval = 1000; //主要定时器时间间隔
    this.mainTimer.tick = () => {
      this.mainTimerEvent();
    };
  }

  //超时剩余时间
  get remainingSeconds() {
    return this._remainingSeconds;
  }
  // set remainingSeconds(seconds) {
  //   this._remainingSeconds = seconds;
  // }

  //超时时间
  get timeoutSeconds() {
    return this._timeoutSeconds;
  }
  set timeoutSeconds(seconds) {
    this._timeoutSeconds = seconds;
    this._remainingSeconds = seconds;
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
    this._timeoutSeconds = seconds;
    this._remainingSeconds = seconds;
  }

  //启动操作
  start() {
    // console.log(`CountDownTimer start: ${this.timeoutSeconds}s`);
    if (this._timeoutMode === CountDownTimeoutMode.reset) {
      this.listenActiveEvent();
    }
    this._remainingSeconds = this._timeoutSeconds;
    this._timerStatus = CountDownTimerStatus.running;
    this.mainTimer.start();
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
    this._remainingSeconds = 0;
    this._timerStatus = CountDownTimerStatus.stop;
    this.mainTimer.stop();
  }

  //暂停操作
  pause() {
    if (this._timerStatus == CountDownTimerStatus.running) {
      this._timerStatus = CountDownTimerStatus.pause;
      this.mainTimer.stop();
    }
  }

  //恢复倒计时
  resume() {
    if (this._timerStatus != CountDownTimerStatus.pause) {
      return;
    }
    this.mainTimer.start();
    this._timerStatus = CountDownTimerStatus.running;
  }

  //重置倒计时
  reset() {
    if (this._timerStatus === CountDownTimerStatus.stop) {
      return;
    }
    this.stop();
    this.start();
  }
  /*-----------------------------------------------*/
  /*----倒计时定时器触发事件------[私有方法]----------*/
  isFunction(func) {
    return func && Object.prototype.toString.call(func) === '[object Function]'
  }

  mainTimerEvent() {
    this._remainingSeconds--;
    if (this.isFunction(this.tick)) {
      if (this._remainingSeconds <= 0 && this._timeoutMode === CountDownTimeoutMode.loop) {
        this._remainingSeconds = this._timeoutSeconds;
      }
      //tick事件需在ontimeout之前触发
      this.tick(this._remainingSeconds)
    }
    if (this._remainingSeconds <= 0) {
      if (this._timeoutMode === CountDownTimeoutMode.once) {
        this._timerStatus = CountDownTimerStatus.stop;
        this.stop();
      } else if (this._timeoutMode === CountDownTimeoutMode.loop) {
        this.reset()
      }
      //loop模式,每次也应该触发超时事件
      if (this.isFunction(this.onTimeout)) {
        this.onTimeout();
      }
    }
  }
}

export {
  CountDownTimer,
  CountDownTimerStatus,
  CountDownTimeoutMode
};
