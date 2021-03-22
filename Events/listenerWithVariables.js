const EventEmitter = require('events');


/*
  listener can change via variables in case you
  need dynamic insertion of something inside your listener
  works with classes as well, this.greeting
*/

const emitter1 = new EventEmitter();

let greeting = 'hello';

function func(message) {
    console.log(`this is ${greeting} ${message}`);
}

emitter1.on('event1', func);

greeting = 'goodbye';

emitter1.emit('event1', 'kyle');
