interface ITiming {
  start: Function;
  pause: Function;
  stop: Function;
  tick?: Function;
}
enum TimerSatus {
  none = 'none',
  //运行
  running = 'running',
  //停止
  stop = 'stop',
  //暂停
  pause = 'pause',
}

class SetTimeoutTimer implements ITiming {
  private _status: TimerSatus = TimerSatus.none;
  private _timerHandler: any;
  private _startTime: number = 0;
  private _delta: number = 0; //由于补偿后,在执行setTime
  private _interval: number = 1000;

  tick?: Function;
  constructor(options?: TimerOptions) {
    if (options?.interval) {
      this._interval = options?.interval;
    }
  }

  //#region  props
  get status() {
    return this._status;
  }
  //#endregion
  public start(): void {
    clearTimeout(this._timerHandler);
    this._status = TimerSatus.running;
    //使用 Date.now 获取时间戳性能比使用 new Date().getTime 更高效
    this._startTime = Date.now();
    this.startSetTimeout();
  }
  public pause(): void {
    this._status = TimerSatus.pause;
  }
  public stop(): void {
    this._status = TimerSatus.stop;
    clearTimeout(this._timerHandler);
  }

  private startSetTimeout() {
    this._timerHandler = setTimeout(() => {
      this.timerTick();
    }, this._interval - this._delta);
  }
  private timerTick() {
    if (this._status === TimerSatus.running) {
      this.offsetDiff();
      this.startSetTimeout();
      this.tick?.();
    }
  }
  private offsetDiff() {
    const nextTime = this._interval - (Date.now() - this._startTime);
    if (nextTime < 0) {
      //若小于0,表示误差大于间隔,已经错过了一次tick,若错过tick,则应该排除多余的tick做补偿
      this._interval = this._interval - (Math.abs(nextTime) % this._interval);
    } else {
      this._interval = nextTime;
    }
  }
}
class AnimaltionFrameTimer implements ITiming {
  private _status: TimerSatus = TimerSatus.none;
  private _timerHandler: number = 0;
  private _startTime: number = 0;
  private _interval: number = 1000;

  tick?: Function;
  constructor(options?: TimerOptions) {
    if (options?.interval) {
      this._interval = options?.interval;
    }
    if (this._interval < 20) {
      //电脑默认为使用最低60Hz,判断是否小于16.67（防止误差太大，取值20）
      throw new Error('the interval value muest be greater than or equal to 20ms');
    }
  }

  public start() {
    this.cancelRaf();
    this._startTime = Date.now();
    this._status = TimerSatus.running;
    this.startRaf();
  }
  public pause() {
    this._status = TimerSatus.pause;
  }
  public stop() {
    this._status = TimerSatus.stop;
    this.cancelRaf();
  }

  private startRaf() {
    this._timerHandler = window.requestAnimationFrame((time: number) => {
      // console.log('requestAnimationFrame time:', time)
      if (this._status === TimerSatus.running) {
        //通过差值作为定时器tick标准，而不是判断前后两个的时间time%1000的值是否相等
        //因为只用作倒计时，不用做展示时间格式的倒计时方式（10:20:15）
        //推荐展示（剩余时间：10分30秒），当前时间格式的因为是获取客户端时间会不准确，所以不推荐使用。
        if (Date.now() - this._startTime >= this._interval) {
          this.tick?.();
          this._startTime = Date.now();
        }
      }
    });
  }

  private cancelRaf() {
    window.cancelAnimationFrame?.(this._timerHandler);
  }
}

export class TimerOptions {
  background?: boolean = false;
  /**
   * 间隔/秒
   */
  interval: number = 1000;
}
const isFunction = <T extends Function>(val: unknown): val is T => typeof val === 'function';
export class Timer implements ITiming {
  private _useRaf: boolean = true;
  private _timer: ITiming;

  //定时器触发器函数
  tick?: Function;

  constructor(options?: TimerOptions) {
    this.initRAF(); //先兼容浏览器统一初始化raf函数
    const inBrowser = typeof window !== 'undefined';
    //在浏览器中 && RAF的API存在 && 不是默认后台运行
    this._useRaf = inBrowser && !!window.requestAnimationFrame && !options?.background;
    this._timer = this._useRaf ? new AnimaltionFrameTimer(options) : new SetTimeoutTimer(options);
    this._timer.tick = this.tick;
  }

  public start() {
    this._timer.start();
  }
  public pause() {
    this._timer.pause();
  }
  public stop() {
    this._timer.stop();
  }

  private initRAF() {
    if (!!window.requestAnimationFrame) return;
    ['webkit', 'moz'].forEach((key: string) => {
      //@ts-ignore
      window.requestAnimationFrame = window[key + 'RequestAnimationFrame'];
      //@ts-ignore
      window.cancelAnimationFrame = window[key + 'CancelAnimationFrame'] || window[key + 'CancelRequestAnimationFrame'];
    });
  }
}
