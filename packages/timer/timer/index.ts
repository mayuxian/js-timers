import { ITiming, TimerOptions } from './core';
import { RafTimer } from './raf-timer';
import { SetTimeoutTimer } from './settimeout-timer';
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
    this._timer = this._useRaf ? new RafTimer(options) : new SetTimeoutTimer(options);
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
