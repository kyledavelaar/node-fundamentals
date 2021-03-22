const obj = {
    name: 'kyle',
    password: 'secret',
    rating: 12
}

const handler = {
    get: (obj, prop) => {
        if (prop === 'password') {
            throw new Error('You are not allowed to see passwords.')
        } else {
            return obj[prop];
        }
    },
    set: (obj, prop, value) => {
        if (prop === 'rating' && typeof value !== 'number') {
            throw new Error('Ratings must be numbers');
        } else {
            obj[prop] = value;
        }
    }
}

const proxiedObject = new Proxy(obj, handler);

console.log(proxiedObject.name);
// console.log(proxiedObject.password);
// proxiedObject.rating = 'a string';
proxiedObject.rating = 33;
console.log(proxiedObject.rating);