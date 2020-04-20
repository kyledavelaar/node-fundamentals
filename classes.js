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
    constructor({ name = 'kyle', size = '23kb'} = {}) {
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
    }

    nameAndSize() {
        // return super.nameAndSize(); // returns 'from baseAsset'
        return `${this._name} has a size of ${this.size}`;
    }
}

const video = new VideoAsset({name: 'willy wonka', size: '100mb'});
const video2 = new VideoAsset();

console.log(video.nameAndSize());
console.log(video2.nameAndSize());


//////////////////////////////////////////////////////////////////
//  only works with Node 13 and/or babel
//////////////////////////////////////////////////////////////////
class ClassWithPrivateVariables {
    a = 1;
    #b = 2;         // .#b is private
    static #c = 3;  // .#c is private and static

    incB() {
      this.#b++;
    }
}

let m = new ClassWithPrivateVariables();

m.incB(); // runs OK
m.a = 3;
console.log(m.a);
m.#b = 0; // error - private property cannot be modified outside class