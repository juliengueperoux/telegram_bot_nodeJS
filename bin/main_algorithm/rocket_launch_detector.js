const WithApi = require('../extern_api/with_api')
const BisectionAlgorithm = require('../../lib/bisection_algorithm/bisection_algorithm')

// All our strings used in the app
const strings = require('../utils/strings.json')

//Map with all our clients
const clients = require('../utils/clients')

// utils variables 
const utils = require('../utils/utils')

const log = require('../../lib/log')

/*
* RocketLaunchDetector class
* Contains the main algorithm
*/
class RocketLaunchDetector {

    constructor(telegram_bot, chat_id) {
        this.bisection_algorithm = null;
        this.telegram_bot = telegram_bot
        this.chat_id = chat_id;
        this.user_lost_timeout = null;
        this.with_api = null;
    }

    /**
    * Initialize the rocket launch detector, get video informations
    * @return {Boolean} Success of initialization
    */
    async init() {
        this.with_api = new WithApi(utils.WITH_API_VIDEO_URL);
        const video_informations = await this.with_api.getVideoInformations();
        if(!video_informations){
            return false;
        }
        this.bisection_algorithm = new BisectionAlgorithm(video_informations);
        // user lost timeout creation
        this.user_lost_timeout = setTimeout(this.destroy, utils.USER_LOST_TIMEOUT, this.chat_id);
        
        log.info(`RocketLaunchDetector init done (chat_id: ${this.chat_id})`);
        return true;
    }

    /**
    * Get the next video frame to send to the user
    *
    * @return {String} Url of the next image
    */
    getNextImageUrl() {
        return this.with_api.getVideoFrameUrl(this.bisection_algorithm.getMid());
    }

    /**
    * Do one step of the bisection algorithm
    *
    * @param  {Boolean} boolValue value answered by the user
    * @return {Object} bisection result
    */
    treatResult(boolValue) {
        log.info(`RocketLaunchDetector treatResult : ${boolValue} (chat_id: ${this.chat_id})`);
        return this.bisection_algorithm.treatValue(boolValue);
    }

    /*
    * Method called when we want to destory the object
    (we delete the only thing referencing the object)
    */
    destroy = function(chat_id){
        log.info(`RocketLaunchDetector destroy (chat_id: ${chat_id})`);
        clients.delete(chat_id)
    }

    /**
    * Method called when a '/start' message is received
    */
    async onStartMessage() {
        const init_success = await this.init();
        if(!init_success){
            log.error(`RocketLaunchDetector onStartMessage error init failed (chat_id: ${this.chat_id})`);
            this.errorOccured();
            return;
        }
        this.telegram_bot.sendPhoto(this.chat_id, this.getNextImageUrl());
        this.telegram_bot.sendMessage(this.chat_id, strings.question, {
            "reply_markup": {
                "keyboard": [[strings.yes, strings.no]]
            }
        });
    }

    /**
    * Method call when any message different of '/start' is received
    */
    onMessage(text) {

        this.resetUserLost();

        let result = null;
        if (text == strings.yes) {
            result = this.treatResult(true);
        }
        else if (text == strings.no) {
            result = this.treatResult(false);
        }
        else {
            log.info(`RocketLaunchDetector onMessage - Unknown message : ${text} (chat_id: ${this.chat_id})`);
            if (text != strings.start_command)
                this.telegram_bot.sendMessage(this.chat_id, strings.unknwon_answer, {
                    "reply_markup": {
                        "keyboard": [[strings.yes, strings.no]]
                    }
                });
            return;
        }
        if (result != null) {
            log.info(`RocketLaunchDetector onMessage - value found : ${result} (chat_id: ${this.chat_id})`);
            const url = this.getNextImageUrl();

            this.telegram_bot.sendMessage(this.chat_id, strings.foundValue +" "+ result);

            this.telegram_bot.sendPhoto(this.chat_id, url);
        }
        else {
            this.telegram_bot.sendPhoto(this.chat_id, this.getNextImageUrl());

            this.telegram_bot.sendMessage(this.chat_id, strings.question, {
                "reply_markup": {
                    "keyboard": [[strings.yes, strings.no]]
                }
            });
        }
    }

    errorOccured(){
        log.error(`RocketLaunchDetector errorOccured - (chat_id: ${this.chat_id})`);
        this.telegram_bot.sendMessage(this.chat_id, strings.abort_detection);
        this.destroy();
    }



    /*
    * Reset user_lost_timeout
    */
    resetUserLost(){
        clearTimeout(this.user_lost_timeout)
        this.user_lost_timeout = setTimeout(this.destroy, utils.USER_LOST_TIMEOUT, this.chat_id);
    }
}

module.exports = RocketLaunchDetector