const EventEmitter = require('events');
const util = require('util');

/*
  one listener can call another emitter
  even if they both have the same event name
  they will be namespaced according to the emitter name
*/

const emitter1 = new EventEmitter();
const emitter2 = new EventEmitter();

emitter1.on('event1', message => {
    console.log('emitter1', message);
    emitter2.emit('event1', message);
})

emitter1.on('event1', message => {
    console.log('emitter1', message);
    emitter2.emit('event1', message);
})


emitter2.on('event1', message => {
    console.log('emitter2', message);
})

emitter1.emit('event1', 'hi there');

// get all listeners for event1 emitter
const listeners = emitter1.listeners('event1');

// call each of those manually if you want
listeners.forEach(l => {
    l('new message')
})

// const func = listeners[0]('new message');
// func.listener();
// console.log(listeners[0]);
// console.log(util.inspect(listeners));
