const WithApi = require('../extern_api/with_api')
const BisectionAlgorithm = require('../../lib/bisection_algorithm/bisection_algorithm')

/*
* RocketLaunchDetector class
* Contains the main algorithm
*/
class RocketLaunchDetector {
    constructor() {
        this.bisection_algorithm = null;
        this.with_api = new WithApi();
    }

    /**
    * Initialize the rocket launch detector, get video informations
    *
    */
    async init() {
        const video_informations = await this.with_api.getVideoInformations();
        this.bisection_algorithm = new BisectionAlgorithm(video_informations);
    }

    /**
    * Get the next video frame to send to the user
    *
    * @return {String} Url of the next image
    */
    getNextImageUrl() {
        console.log("mid " + this.bisection_algorithm.getMid())
        return this.with_api.getVideoFrameUrl(this.bisection_algorithm.getMid());
    }

    /**
    * Do one step of the bisection algorithm
    *
    * @param  {Boolean} boolValue value answered by the user
    * @return {Object} bisection result
    */
    treatResult(boolValue) {
        console.log("RocketLaunchDetector - treatResult")
        return this.bisection_algorithm.treatValue(boolValue);
    }
}

module.exports = RocketLaunchDetector