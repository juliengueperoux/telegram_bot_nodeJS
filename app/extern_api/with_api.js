const axios = require('axios');
const querystring = require('querystring');

const baseUrl = `${process.env.WITH_API_BASE}video/${querystring.escape(process.env.WITH_VIDEO_NAME)}`

class WithApi {
    constructor() {
        this.baseUrl = baseUrl;
    }

    async get_video_informations() {

        try {
            const response = await axios.get(this.baseUrl);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    get_video_frameUrl(frameId) {
        console.log("get_video_frameUrl "+ `${this.baseUrl}/frame/${frameId}/`)
        return `${this.baseUrl}/frame/${frameId}/`
    }
}

module.exports = WithApi