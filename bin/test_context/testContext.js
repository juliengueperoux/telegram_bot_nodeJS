const WithApi = require('../extern_api/withApi')
const BisectionAlgorithm = require('../../lib/bisection_algorithm/bisectionAlgorithm')

// All our strings used in the app
const strings = require('../utils/strings.json')

//Map with all our clients
const clients = require('../utils/clients')

// utils variables 
const utils = require('../utils/utils')

// logger instance
const log = require('../../lib/log')

/*
* TestContext class
* Contains the main algorithm
*/
class TestContext {

    constructor(eventBus, chatId) {
        this.bisectionAlgorithm = null;
        this.eventBus = eventBus
        this.chatId = chatId;
        this.withApi = null;
        this.numberTimeLost = 0;
        this.state = "init";
        this.userLostTimeout = null;
        this.initalized = false;
    }

    /**
    * Initialize the rocket launch detector, get video informations
    * @return {Boolean} Success of initialization
    */
    async init() {
        this.withApi = new WithApi(utils.WITH_API_VIDEO_URL);

        const videoInformations = await this.withApi.getVideoInformations();
        if (!videoInformations) {
            log.warn(`TestContext init error, no videoInformations(chatId: ${this.chatId})`);
            this.eventBus.emit("response", null, this.chatId, [{ type: "message", value: strings.abort_detection }])
            this.errorOccured();
            return false;
        }
        else {
            this.initalized = true;
            this.bisectionAlgorithm = new BisectionAlgorithm(videoInformations);
            log.debug(`TestContext init done (chatId: ${this.chatId})`);
            return true;
        }
    }

    isInitialized(){return this.initalized}

    /**
    * Get the next video frame to send to the user
    *
    * @return {String} Url of the next image
    */
    getNextImageUrl() {
        return this.withApi.getVideoFrameUrl(this.bisectionAlgorithm.getMid());
    }

    /**
    * Do one step of the bisection algorithm
    *
    * @param  {Boolean} boolValue value answered by the user
    * @return {Object} bisection result
    */
    treatResult(boolValue) {
        log.debug(`TestContext treatResult : ${boolValue} (chatId: ${this.chatId})`);
        return this.bisectionAlgorithm.treatValue(boolValue);
    }

    /*
    * Method called when we want to destroy the object
    (we delete the only thing referencing the object)
    */
    destroy(self) {
        log.debug(`TestContext destroy (chatId: ${self.chatId})`);
        self.eventBus.emit("response", null, self.chatId, [{ type: 'message', value: strings.destroy }])
        clients.delete(self.chatId)
    }

    /*
    * Method called when the user did not respond after USER_LOST_TIMEOUT milliseconds
    */
    onUserTimeout(self) {
        log.debug(`TestContext onUserTimeout (chatId: ${self.chatId})`);
        //First time the user is missing and not in init state
        if (self.state != "init" && self.numberTimeLost == 0) {
            self.eventBus.emit("response", null, self.chatId, [{ type: 'message', value: strings.user_lost }])
            self.numberTimeLost = self.numberTimeLost + 1;
            self.resetUserLost(self.numberTimeLost);
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
    onMessage(message) {
        this.resetUserLost(0)
        switch (this.state) {
            case "init":
                if (message != strings.go_command) {
                    this.onStartMessage();
                }
                else if (this.initalized) {
                    this.state = "onGoing";
                    this.onGoMessage();
                }
                break;
            case "onGoing":
                this.onOnGoingMessage(message);
                break;
        }
    }

    onStartMessage() {
        log.debug(`TestContext onStartMessage (chatId: ${this.chatId})`);
        this.eventBus.emit("response", null, this.chatId, [{ type: "message", value: strings.start_message }])
    }

    /**
    * Method called when a '/go' message is received
    */
    onGoMessage() {
        log.debug(`TestContext onGoMessage (chatId: ${this.chatId})`);
        const response = []
        response.push({
            type: "photo", value: this.getNextImageUrl(), options: {
                reply_markup: {
                    keyboard: [[strings.yes, strings.no]],
                    one_time_keyboard: true
                },
                caption: strings.question

            }
        });
        this.eventBus.emit("response", null, this.chatId, response)
    }

    /**
    * Method call when any message is received in state 'onGoing'
    */
    onOnGoingMessage(text) {
        log.debug(`TestContext onOnGoingMessage (chatId: ${this.chatId})`);
        const response = [];

        let result = null;
        if (text == strings.yes) {
            result = this.treatResult(true);
        }
        else if (text == strings.no) {
            result = this.treatResult(false);
        }
        else if(text == strings.cancel_command){
            this.destroy(this);
        }
        else {
            log.debug(`TestContext onMessage - Unknown message : ${text} (chatId: ${this.chatId})`);
            if (text != strings.start_command) {
                response.push({ type: "message", value: strings.unknwon_answer })
            }
            this.eventBus.emit("response", null, this.chatId, response)
            return;
        }
        let messageOptions = {};
        if (result != null) {
            log.debug(`TestContext onMessage - value found : ${result} (chatId: ${this.chatId})`);
            messageOptions = {
                caption: strings.found_value + ", image numéro " + result + "\n" + strings.terminated_test
            };
            this.bisectionAlgorithm.reset()
            this.state = "init";
        }
        else {
            messageOptions = {
                reply_markup: {
                    keyboard: [[strings.yes, strings.no]],
                    one_time_keyboard: true
                },
                caption: strings.question
            };
        }

        response.push({ type: "photo", value: this.getNextImageUrl(), options: messageOptions });
        this.eventBus.emit("response", null, this.chatId, response)
        return;
    }

    /*
    * Method called to destory testContext if an error occured
    */
    errorOccured() {
        log.warn(`TestContext errorOccured - (chatId: ${this.chatId})`);
        this.destroy(this);
    }

    /*
    * Reset user_lost_timeout
    */
    resetUserLost(numberTimeLost) {
        log.info(`TestContext resetUserLost - (chatId: ${this.chatId})`);
        clearTimeout(this.userLostTimeout)
        this.numberTimeLost = numberTimeLost;
        this.userLostTimeout = setTimeout(this.onUserTimeout, utils.USER_LOST_TIMEOUT, this);
    }
}

module.exports = TestContext