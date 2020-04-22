require('dotenv').config();
const querystring = require('querystring');

// user lost timeout value 30 seconds
exports.USER_LOST_TIMEOUT = 30000; 

// With Api base Url With video Name
exports.WITH_API_VIDEO_URL = `${process.env.WITH_API_BASE}video/${querystring.escape(process.env.WITH_VIDEO_NAME)}`; 