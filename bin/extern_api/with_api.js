require('dotenv').config();

const axios = require('axios');
const querystring = require('querystring');

const base_url = `${process.env.WITH_API_BASE}video/${querystring.escape(process.env.WITH_VIDEO_NAME)}`

class WithApi {
    constructor() {
        this.base_url = base_url;
    }

    async getVideoInformations() {
        try {
            const response = await axios.get(this.base_url);
            return response.data;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    getVideoFrameUrl(frame_id) {
        return `${this.base_url}/frame/${frame_id}/`
    }
}

module.exports = WithApi