const bisect = require('../utils/algorithms').bisect

class BisectionAlgorithm{

    constructor(initObject){
        this.left = 0;
        this.right = initObject.frames - 1;
        this.mid =Math.round((this.left + this.right) / 2);
    }

    treat_value(test){
        console.log("BisectionAlgorithm - treat_value")

        const result = bisect(this.left,this.right,this.mid,test);
        console.log("bisect :"+JSON.stringify(result))

        if(result.finish){
            return result.value;
        }
        else{
            this.left = result.left;
            this.right = result.right;
            this.mid =Math.round((this.left + this.right) / 2);
            return null;
        }
    }
}

module.exports = BisectionAlgorithm;