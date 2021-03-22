const bluebird = require('bluebird');

class Async {
    constructor() {

    }

    compose(...funcs) {
        funcs
    }
}


const async = new Async();


const add3 = async n => {
    await bluebird.delay(20);
    return n + 3;
}

const multiply5 = async n => {
    await bluebird.delay(20);
    return n * 5;
}
multiply5(5).then(res => console.log(res))

// const add3Multiply5 = async.compose(add3, multiply5);
// const a = add3Multiply5(1); // 15












