const WithApi = require('../extern_api/with_api')
const BisectionAlgorithm = require('../../lib/bisection_algorithm/bisection_algorithm')

// All our strings used in the app
const strings = require('../utils/strings.json')

//Map with all our clients
const clients = require('../utils/clients')

const USER_LOST_TIMEOUT = 30000; // 30 seconds
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
    *
    */
    async init() {
        this.with_api = new WithApi();
        const video_informations = await this.with_api.getVideoInformations();
        this.bisection_algorithm = new BisectionAlgorithm(video_informations);
        // user lost timeout creation
        this.user_lost_timeout = setTimeout(this.onUserLost, USER_LOST_TIMEOUT, this.chat_id);

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
        return this.bisection_algorithm.treatValue(boolValue);
    }

    /*
    * Method called when we have lost the user
    */
    onUserLost = function(chat_id){
        clients.delete(chat_id)
    }

    /**
    * Method called when a '/start' message is received
    */
    async onStartMessage() {

        await this.init();
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
            if (text != strings.start_command)
                this.telegram_bot.sendMessage(this.chat_id, strings.unknwon_answer, {
                    "reply_markup": {
                        "keyboard": [[strings.yes, strings.no]]
                    }
                });
            return;
        }
        if (result != null) {
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

    /*
    * Reset user_lost_timeout
    */
    resetUserLost(){
        this.user_lost_timeout = setTimeout(this.onUserLost, USER_LOST_TIMEOUT, this.chat_id);
    }
}

module.exports = RocketLaunchDetector