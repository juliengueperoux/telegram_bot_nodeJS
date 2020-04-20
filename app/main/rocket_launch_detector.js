const WithApi = require('../extern_api/with_api')
const BisectionAlgorithm = require('../bisection_algorithm/bisection_algorithm')

class RocketLaunchDetector {
    constructor() { 
        this.bisection_algorithm = null;
        this.with_api = new WithApi();
    }

    async init() {
        const video_informations = await this.with_api.get_video_informations();
        this.bisection_algorithm = new BisectionAlgorithm(video_informations);
    }

    getNextImageUrl(){
        console.log("mid "+this.bisection_algorithm.mid)
        return this.with_api.get_video_frameUrl(this.bisection_algorithm.mid);
    }

    treatResult(boolValue){
        console.log("RocketLaunchDetector - treatResult")
        return this.bisection_algorithm.treat_value(boolValue);
    }
}

module.exports = RocketLaunchDetector