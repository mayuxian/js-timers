# js-timer


## Include modules

1. class : **Timer**

   **Timer** used in browser,More accurate than **setInterval**.

   Because JavaScript is a single thread,  **setInterval ** will be affected by the execution of other events in the process of running, resulting in the delay of timer, and the delay will gradually accumulate, resulting in larger timer deviation

   This module is realized through **setTimeout**, and the deviation is compensated and corrected

   For details, please refer to demo: https://github.com/mayuxian/js-timers/tree/main/demo

2. class : **CountDownTimer**

   It can set time interval to execute countdown, which is based on timer in this library.



## Installing

Using npm:

```bash
$ npm install js-timers
```

Using bower:

```bash
$ bower install js-timers
```

Using yarn:

```bash
$ yarn add js-timers
```

 	

###  Module : Timer

``` javascript
// import Timer
import { Timer } from 'js-timers'

// Example
function main(){
   this._timer = new Timer(); //create instance
   this._timer.interval = 1000 // default: 1000ms
   this._timer.missTickEnabled = false //deault:false, false:When the countdown error exceeds the time interval, false will be executed immediately. true:Otherwise, miss the tick event.
   this._timer.tick = () => {
       //Timer interval trigger event
   }
 }
```



###  Module : CountDownTimer

```javascript
// import Timer
import { CountDownTimer } from 'js-timers'

// Example
function main(){
   this._timer = new CountDownTimer(); //create instance
   this._timer.timeoutSeconds = 60 // default: 60s
   this._timer.missTickEnabled = false //deault:false, false:When the countdown error exceeds the time interval, false will be executed immediately. true:Otherwise, miss the tick event.
   this._timer.tick = (remainingSeconds) => {
       //remainingSeconds is remaining time
       //Timer interval trigger event
   }
 }
```



### Thx. Enjoy It !

