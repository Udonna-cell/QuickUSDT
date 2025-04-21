class Man {
    constructor(){
        if (!Man.instance) {
            this._name = "stanley"
            Man.instance = this
        }
        return Man.instance
    }
    set name(nickname) {
        this._name = nickname
    }
    get name() {
        return this._name
    }
}

const x = new Man()
x.name = "stabug6"
console.log(x.name);
const y = new Man()
console.log(x.name);

