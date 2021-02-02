function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 时间定时器
 * @desc 时间定时器
 * @param {function} tick - 定时触发事件
 * @param {int} interval -事件间隔 - 事件
 * @param {boolean} _isTimerStop -定时器是否停止
 * @param {boolean} _isTimerLoop -定时器是否循环,默认循环
 */
var Timer = /*#__PURE__*/function () {
  function Timer() {
    this._interval = 1000; //时间间隔，默认1s

    this._tick; //定时器触发事件

    this._isTimerStop = false; //定时器是否停止事件

    this._isTimerLoop = true;
    this.timer = null;
  } ///时间间隔(单位毫秒ms)，默认1s


  var _proto = Timer.prototype;

  _proto.tickEvent = function tickEvent() {
    if (typeof this._tick != "function") {
      throw new Error("tick:" + this._tick + ",tick is not function.");
    }

    if (!this._isTimerStop) {
      this._tick();
    }
  };

  _proto.start = function start() {
    var _this = this;

    this._isTimerStop = false;

    if (this._isTimerLoop) {
      this.timer = setInterval(function () {
        _this.tickEvent();
      }, this.interval);
    } else {
      this.timer = setTimeout(function () {
        _this.tickEvent();
      }, this.interval);
    }
  };

  _proto.stop = function stop() {
    this._isTimerStop = true;

    if (this._isTimerLoop) {
      clearInterval(this.timer);
    } else {
      clearTimeout(this.timer);
    }
  };

  _createClass(Timer, [{
    key: "interval",
    get: function get() {
      return this._interval;
    },
    set: function set(seconds) {
      this._interval = seconds;
    } ///时间定时器定时执行函数

  }, {
    key: "tick",
    get: function get() {
      return this._tick();
    },
    set: function set(func) {
      this._tick = func;
    } ///定时器是否循环

  }, {
    key: "isTimerLoop",
    get: function get() {
      return this._isTimerLoop;
    },
    set: function set(isLoop) {
      this._isTimerLoop = isLoop;
    } ///获取定时器是否停止状态

  }, {
    key: "isTimerStop",
    get: function get() {
      return this._isTimerStop;
    }
  }]);

  return Timer;
}();

export { Timer as default };
;