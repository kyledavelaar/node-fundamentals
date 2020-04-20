import _ from 'lodash';

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
console.log(_.get(m, 'a', null));
// m.#b = 0; // error - private property cannot be modified outside class


console.log('hi ya doing my ma yes no I am changing')