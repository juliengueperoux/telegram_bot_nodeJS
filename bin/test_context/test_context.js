const WithApi = require('../extern_api/with_api')
const BisectionAlgorithm = require('../../lib/bisection_algorithm/bisection_algorithm')

// All our strings used in the app
const strings = require('../utils/strings.json')

//Map with all our clients
const clients = require('../utils/clients')

// utils variables 
const utils = require('../utils/utils')

// logger instance
const log = require('../../lib/log')

const telegram_bot_send_response_function = require('../telegram_bot/utils').sendResponse

/*
* TestContext class
* Contains the main algorithm
*/
class TestContext {

    constructor(telegram_bot, chat_id) {
        this.bisection_algorithm = null;
        this.telegram_bot = telegram_bot
        this.chat_id = chat_id;
        this.with_api = null;
        this.number_time_lost = 0;
        this.state = "init";
        this.user_lost_timeout = null;
    }

    /**
    * Initialize the rocket launch detector, get video informations
    * @return {Boolean} Success of initialization
    */
    async init() {
        this.with_api = new WithApi(utils.WITH_API_VIDEO_URL);
        const video_informations = await this.with_api.getVideoInformations();
        if (!video_informations) {
            return false;
        }
        this.bisection_algorithm = new BisectionAlgorithm(video_informations);

        log.debug(`TestContext init done (chat_id: ${this.chat_id})`);
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
        log.debug(`TestContext treatResult : ${boolValue} (chat_id: ${this.chat_id})`);
        return this.bisection_algorithm.treatValue(boolValue);
    }

    /*
    * Method called when we want to destroy the object
    (we delete the only thing referencing the object)
    */
    destroy(self) {
        log.debug(`TestContext destroy (chat_id: ${self.chat_id})`);
        telegram_bot_send_response_function(self.telegram_bot, self.chat_id, [{ type: 'message', value: strings.destroy }])
        clients.delete(self.chat_id)
    }

    /*
    * Method called when the user did not respond after USER_LOST_TIMEOUT milliseconds
    */
    onUserTimeout(self) {
        log.debug(`TestContext onUserTimeout (chat_id: ${self.chat_id})`);
        //First time the user is missing and not in init state
        if (self.state != "init" && self.number_time_lost == 0) {
            telegram_bot_send_response_function(self.telegram_bot, self.chat_id, [{ type: 'message', value: strings.user_lost }])
            self.number_time_lost = self.number_time_lost + 1;
            self.resetUserLost(self.number_time_lost);
        }
        else {
            self.destroy(self);
        }
    }

    /*
    * First method called when a message is send to the testContext, it dispatch the message
    * depending of its content and the current state
    * 
    * @param  {String} boolValue value answered by the user
    * @return {Object} bisection result
    */
    async onMessage(message) {
        this.resetUserLost(0)
        switch (this.state) {
            case "init":
                if (message != strings.go_command) {
                    return this.onStartMessage();
                }
                else {
                    this.state = "onGoing";
                    return await this.onGoMessage();
                }
            case "onGoing":
                return this.onOnGoingMessage(message);
        }
    }

    onStartMessage() {
        log.debug(`TestContext onStartMessage (chat_id: ${this.chat_id})`);
        return [{ type: "message", value: strings.start_message }];
    }

    /**
    * Method called when a '/go' message is received
    */
    async onGoMessage() {
        log.debug(`TestContext onGoMessage (chat_id: ${this.chat_id})`);
        const response = []
        const init_success = await this.init();
        if (!init_success) {
            log.error(`TestContext onGoMessage error init failed (chat_id: ${this.chat_id})`);
            response.push({ type: "message", value: strings.abort_detection })
            this.errorOccured();
            return response;

        }
        //response.push({ type: "message", value: strings.question , options : )
        response.push({
            type: "photo", value: this.getNextImageUrl(), options: {
                reply_markup: {
                    keyboard: [[strings.yes, strings.no]],
                    one_time_keyboard: true
                },
                caption: strings.question

            }
        });

        return response;
    }

    /**
    * Method call when any message is received in state 'onGoing'
    */
    onOnGoingMessage(text) {
        log.debug(`TestContext onOnGoingMessage (chat_id: ${this.chat_id})`);
        const response = [];

        let result = null;
        if (text == strings.yes) {
            result = this.treatResult(true);
        }
        else if (text == strings.no) {
            result = this.treatResult(false);
        }
        else {
            log.debug(`TestContext onMessage - Unknown message : ${text} (chat_id: ${this.chat_id})`);
            if (text != strings.start_command) {
                response.push({ type: "message", value: strings.unknwon_answer })
            }
            return response;
        }
        let message_options = {};
        if (result != null) {
            log.debug(`TestContext onMessage - value found : ${result} (chat_id: ${this.chat_id})`);
            message_options = {
                caption: strings.found_value + ", image numéro " + result
            };

            this.state = "init";
        }
        else {
            message_options = {
                reply_markup: {
                    keyboard: [[strings.yes, strings.no]],
                    one_time_keyboard: true
                },
                caption: strings.question
            };
        }

        response.push({ type: "photo", value: this.getNextImageUrl(), options: message_options });
        return response;
    }

    /*
    * Method called to destory testContext if an error occured
    */
    errorOccured() {
        log.error(`TestContext errorOccured - (chat_id: ${this.chat_id})`);
        this.destroy(this);
    }

    /*
    * Reset user_lost_timeout
    */
    resetUserLost(number_time_lost) {
        log.info(`TestContext resetUserLost - (chat_id: ${this.chat_id})`);
        clearTimeout(this.user_lost_timeout)
        this.number_time_lost = number_time_lost;
        this.user_lost_timeout = setTimeout(this.onUserTimeout, utils.USER_LOST_TIMEOUT, this);
    }
}

module.exports = TestContext