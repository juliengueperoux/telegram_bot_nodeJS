const axios = require('axios');

const video_url = require('../utils/utils').with_api_video_url
/*
* Class interacting with the With Api
*/
class WithApi {
    constructor() {
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
            console.log(error)
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