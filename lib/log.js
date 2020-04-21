require('dotenv').config();

const opts = {
    errorEventName: 'error',
    logDirectory: './log_files', // NOTE: folder must exist and be writable...
    fileNamePattern: 'roll-<DATE>.log',
    dateFormat: 'YYYY.MM.DD'
};

const log = require('simple-node-logger').createRollingFileLogger(opts);

if (process.env.DEBUG == 1) {
    log.setLevel('debug')
}
else {
    log.setLevel('warn')
}

module.exports = log 