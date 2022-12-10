import { ITiming, TimerOptions,TimerSatus } from "./core";
export class RafTimer implements ITiming {
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
  