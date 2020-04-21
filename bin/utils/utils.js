require('dotenv').config();
const querystring = require('querystring');

// use lost timeout value 30 seconds
exports.USER_LOST_TIMEOUT = 30000; 

// With Api base Url With video Name
exports.with_api_video_url = `${process.env.WITH_API_BASE}video/${querystring.escape(process.env.WITH_VIDEO_NAME)}`; 