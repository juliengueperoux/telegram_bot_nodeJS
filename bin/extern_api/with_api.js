const axios = require('axios');
const querystring = require('querystring');

const base_url = `${process.env.WITH_API_BASE}video/${querystring.escape(process.env.WITH_VIDEO_NAME)}`

class WithApi {
    constructor() {
        this.base_url = base_url;
    }

    async getVideoInformations() {
        try {
            const response = await axios.get(this.baseUrl);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    getVideoFrameUrl(frameId) {
        return `${this.baseUrl}/frame/${frameId}/`
    }
}

module.exports = WithApi