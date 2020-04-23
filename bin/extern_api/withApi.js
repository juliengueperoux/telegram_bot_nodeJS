const axios = require('axios');
const log = require('../../lib/log')

/*
* Class interacting with the With Api
*/
class WithApi {
    constructor(videoUrl) {
        this.videoUrl = videoUrl;
    }

    /*
    * Call to the With Api to retrieve informations about the video
    */
    async getVideoInformations() {
        try {
            const response = await axios.get(this.videoUrl);
            return response.data;
        } catch (error) {
            log.warn("WithApi - getVideoInformations - Error: "+error)
            return null;
        }
    }

    /**
    * Retrieve the url to get the specified frame from the video
    *
    * @param  {Number} frameId frame identifier
    * @return {String} url to access at the frame
    */
    getVideoFrameUrl(frameId) {
        return `${this.videoUrl}/frame/${frameId}/`
    }
}

module.exports = WithApi