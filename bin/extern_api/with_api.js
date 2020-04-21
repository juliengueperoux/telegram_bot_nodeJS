const axios = require('axios');

const log = require('../../lib/log')

/*
* Class interacting with the With Api
*/
class WithApi {
    constructor(video_url) {
        this.video_url = video_url;
    }

    /*
    * Call to the With Api to retrieve informations about the video
    */
    async getVideoInformations() {
        try {
            const response = await axios.get(this.video_url);
            return response.data;
        } catch (error) {
            log.error("Error: "+error)
            console.log("Error: "+error)
            return null;
        }
    }

    /**
    * Retrieve the url to get the specified frame from the video
    *
    * @param  {Number} frame_id frame identifier
    * @return {String} url to access at the frame
    */
    getVideoFrameUrl(frame_id) {
        return `${this.video_url}/frame/${frame_id}/`
    }
}

module.exports = WithApi