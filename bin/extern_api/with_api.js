require('dotenv').config();

const axios = require('axios');
const querystring = require('querystring');

const base_url = `${process.env.WITH_API_BASE}video/${querystring.escape(process.env.WITH_VIDEO_NAME)}`

/*
* Class interacting with the With Api
*/
class WithApi {
    constructor() {
        this.base_url = base_url;
    }

    /*
    * Call to the With Api to retrieve informations about the video
    */
    async getVideoInformations() {
        try {
            const response = await axios.get(this.base_url);
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
        return `${this.base_url}/frame/${frame_id}/`
    }
}

module.exports = WithApi