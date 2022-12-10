export enum TimerSatus {
    none = 'none',
    //运行
    running = 'running',
    //停止
    stop = 'stop',
    //暂停
    pause = 'pause',
}
export interface ITiming {
    start: Function;
    pause: Function;
    stop: Function;
    tick?: Function;
}
export class TimerOptions {
    background?: boolean = false;
    /**
     * 间隔/秒
     */
    interval: number = 1000;
}
const isFunction = <T extends Function>(val: unknown): val is T => typeof val === 'function';
