import { ITiming, TimerOptions, TimerSatus } from "./core";
export class SetTimeoutTimer implements ITiming {
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
