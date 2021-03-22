//////////////////////////////////////////////////////////////////
//  Inheritance example with Abstract Class
//////////////////////////////////////////////////////////////////

class AssetAbstract {
    get name() {
        throw new Error('Not Implemented')
    }
    nameAndSize() {
        throw new Error('Not implemented')
    }
}

class BaseAsset extends AssetAbstract {
    constructor({ name = 'defaultName', size = '23kb'} = {}) {
        super();
        // const {name, size} = params;
        this._name = name;
        this.size = size;
    }
    get name() {
        return this._name;
    }
    nameAndSize() {
        return 'from baseAsset';
    }
}

class VideoAsset extends BaseAsset {
    constructor(params) {
        super(params)
        this.type = 'video';
    }

    nameAndSize() {
        if (this.name === 'defaultName') {
            return super.nameAndSize(); // returns 'from baseAsset'
        } else {
            return `${this._name} has a size of ${this.size} and is a ${this.type}`;
        }
    }
}

class ImageAsset extends BaseAsset {
    constructor(params) {
        super(params)
        this.type = 'image';
    }

    nameAndSize() {
        if (this.name === 'defaultName') {
            return super.nameAndSize(); // returns 'from baseAsset'
        } else {
            return `${this._name} has a size of ${this.size} and is a ${this.type}`;
        }
    }
}

const video = new VideoAsset({name: 'willy wonka', size: '100mb'});
const video1 = new ImageAsset({name: 'my image', size: '12mb'});
const video2 = new VideoAsset();

console.log(video.nameAndSize());
console.log(video1.nameAndSize());
console.log(video2.nameAndSize());


/////////////////////////////////////////////////////////////
//  PASSING VALUES TO SUPER
//////////////////////////////////////////////////////////////

class BaseBase {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}
class Base extends BaseBase {
    constructor(name, value) {
        super(name);
        this.value = value;
    }

    speak() {
        console.log(`${this.getName()} says ${this.value}`)
    }
}

class Kyle extends Base {
    constructor() {
        const name = 'kyle';
        const value = 'yep';
        // passing values into the super puts them into the base classes constructor
        super(name, value)
    }
}

const k = new Kyle();
k.speak(); // kyle says yep


//////////////////////////////////////////////////////////////////
//  only works with Node 13 and/or babel
//////////////////////////////////////////////////////////////////
// class ClassWithPrivateVariables {
//     a = 1;
//     #b = 2;         // .#b is private
//     static #c = 3;  // .#c is private and static

//     incB() {
//       this.#b++;
//     }
// }

// let m = new ClassWithPrivateVariables();

// m.incB(); // runs OK
// m.a = 3;
// console.log(m.a);
// m.#b = 0; // error - private property cannot be modified outside class



//////////////////////////////////////////////////////////////////
//  mixins
//////////////////////////////////////////////////////////////////

/*
    Mixins (abstract classes) are templates for classes
    A function with a superclass as input and a subclass extending that superclass
*/

// let calculatorMixin = Base => class extends Base {
//     calc() {}
// }

// class Foo { }
// class Bar extends calculatorMixin(calculatorMixin(Foo)) { }