// target = User, property = getFullName, descriptor = {value, writeable, enumerable, configurable}
function readOnly(target, property, descriptor) {
    descriptor.writable = false;
    return descriptor;
}

class User {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @readOnly
    getFullName() {
        return this.firstName + " " + this.lastName;
    }
}

User.prototype.getFullName = () => 'HACKED!';


const user1 = new User('kyle', 'davelaar');

console.log(user1.getFullName()); // without @readOnly 'HACKED' will be returned





