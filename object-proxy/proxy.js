const log = v => { console.log(v) };

const target = {
    message1: 'hi',
    message2: 'doggy'
}

const handler = {
    get: (obj, prop) => {
        if (prop === 'message2') {
            return 'kitty';
        }
        return obj[prop]
        // return Reflect.get(...arguments);
    }
}

const p = new Proxy(target, handler);

log(p.message1);
log(p.message2);
log(target.message1);
log(target.message2);