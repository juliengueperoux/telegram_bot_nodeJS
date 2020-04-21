const bisectFunction = require('../../bin/utils/algorithms').bisectFunction

class BisectionAlgorithm {

    constructor(init_object) {
        this.left = 0;
        this.right = init_object.frames - 1;
        this.mid = Math.round((this.left + this.right) / 2);
    }

    getMid() {return this.mid;}

    treatValue(test) {
        const result = bisectFunction(this.left, this.right, this.mid, test);

        if (result.finish) {
            return result.value;
        }
        else {
            this.left = result.left;
            this.right = result.right;
            this.mid = Math.round((this.left + this.right) / 2);
            return null;
        }
    }
}

module.exports = BisectionAlgorithm;