function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
* Class:  Timer
*/
export var Timer = /*#__PURE__*/function () {
  function Timer() {
    this._interval = 1000;
    this._initInterval = 1000;
    this._tick;
    this._isTimerStop = false; //Whether is the immediately stop

    this.timer = null;
    this._startTime = null;
    this._tickCount = 0;
    this.missTickEnabled = false; //若延迟误差超过了间隔时间,则忽略miss掉中间,还是追加补偿tick

    this._delta = 0; //由于补偿后,在执行setTimeout时,仍会消耗1-2 ms导致1-2 ms误差,若还需要差量补偿,可以更改这个参数
  } ///时间间隔(单位毫秒ms)，默认1s


  var _proto = Timer.prototype;

  // --------- public 方法------------
  _proto.start = function start() {
    this._isTimerStop = false;
    this._startTime = new Date().getTime();
    clearTimeout(this.timer);
    this.startSetTimeout();
  };

  _proto.stop = function stop() {
    this._isTimerStop = true;
    this._tickCount = 0;
    clearTimeout(this.timer);
  } ///获取定时器是否停止状态
  ;

  //----------------- private 方法---------------------
  _proto.isFunction = function isFunction(func) {
    return func && Object.prototype.toString.call(func) === '[object Function]';
  };

  _proto.startSetTimeout = function startSetTimeout() {
    var _this = this;

    this.timer = setTimeout(function () {
      _this.tickEvent();
    }, this._interval - this._delta);
  };

  _proto.tickEvent = function tickEvent() {
    if (!this.isFunction(this._tick)) {
      this.stop();
      throw new Error("tick:" + this._tick + ",tick is not function.");
    }

    if (!this._isTimerStop) {
      this._tickCount++;
      this.offsetDiff();
      this.startSetTimeout();

      this._tick();
    }
  };

  _proto.offsetDiff = function offsetDiff() {
    var offset = new Date().getTime() - (this._startTime + this._tickCount * this._initInterval); // console.log("误差：" + offset)  //由于补偿后,在执行setTimeout时,仍会消耗1-2 ms导致1-2 ms误差,


    var nextTime = this._initInterval - offset;

    if (nextTime < 0 && this._missTickEnabled) {
      //若小于0,表示误差大于间隔,已经错过了一次tick,若错过tick,则应该排除多余的tick做补偿
      this._interval = this._initInterval - Math.abs(nextTime) % this._initInterval;
    } else {
      this._interval = nextTime >= 0 ? nextTime : 0;
    }
  };

  _createClass(Timer, [{
    key: "interval",
    get: function get() {
      return this._initInterval;
    },
    set: function set(seconds) {
      this._interval = seconds;
      this._initInterval = seconds;
    } //差量,因为setTimeout的js执行也需要时间,所以可以设置差量,达到最小误差.

  }, {
    key: "delta",
    get: function get() {
      return this._delta;
    },
    set: function set(val) {
      this._delta = val;
    } ///时间定时器定时执行函数

  }, {
    key: "tick",
    get: function get() {
      return this._tick();
    },
    set: function set(func) {
      if (!this.isFunction(func)) {
        throw new Error("tick is not function.");
      }

      this._tick = func;
    }
  }, {
    key: "missTickEnabled",
    get: function get() {
      return this._missTickEnabled;
    },
    set: function set(val) {
      this._missTickEnabled = !!val;
    }
  }, {
    key: "isTimerStop",
    get: function get() {
      return this._isTimerStop;
    }
  }]);

  return Timer;
}();