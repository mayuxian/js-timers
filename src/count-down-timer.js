import { Timer } from './timer.js';

/**
 * 操作时间定时器的状态
 * @desc 标记操作时间总计时器当前的操作状态
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
 * 操作时间定时器的超时模式
 * @desc 指定操作超时是总是倒计时或输入则重置倒计时
 */
// const CountDownTimeoutMode = Object.freeze({
//   always: Symbol(0),
//   reset: Symbol(1)
// })
const CountDownTimeoutMode = Object.freeze({
  //总是倒计时
  always: 'always',
  //输入操作重置倒计时
  reset: 'reset'
});

/*倒计时类
 */
class CountDownTimer {
  constructor () {
    this._remainingSeconds = 0;
    this._timeoutSeconds = 0;
    this._timerStatus = CountDownTimerStatus.pause; //操作定时状态
    this._timeoutMode = CountDownTimeoutMode.always; // 操作超时模式
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
    if (this._timerStatus == CountDownTimerStatus.stop) {
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

  mainTimerEvent() {
    this._remainingSeconds--;
    if (this.checkFunction(this.tick)) {
      this.tick(this._remainingSeconds)
    }
    if (this._remainingSeconds <= 0) {
      this._timerStatus = CountDownTimerStatus.stop;
      this.stop();
      if (this.checkFunction(this.onTimeout)) {
        this.onTimeout();
      }
      return
    }
  }
}

export  {
  CountDownTimer,
  CountDownTimerStatus,
  CountDownTimeoutMode
};
