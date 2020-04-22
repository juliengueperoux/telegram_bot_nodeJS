const RocketLaunchDetector = require('../main_algorithm/rocket_launch_detector');
const strings = require('../utils/strings.json')

const clients = require('../utils/clients');

const telegram_bot_send_response_function = require('./utils').sendResponse

module.exports = function (telegram_bot) {

    /*
     * Method called when a suer do the /start command, we create a new RocketLaunchDetector and launch the discussion
     */
    telegram_bot.onText(/\/start/, async (msg) => {

        // Each user has his own RocketLaunchDetector
        const rocket_launch_detector = new RocketLaunchDetector(telegram_bot, msg.chat.id);
        clients.set(msg.chat.id, rocket_launch_detector)

        const response = await rocket_launch_detector.onStartMessage();
        telegram_bot_send_response_function(telegram_bot, msg.chat.id, response);

    });


    /*
    * Method called when a message is sent to the bot, we take in consideration only if it's different of '/start'
    */
    telegram_bot.on('message', (msg) => {
        const text = msg.text.toString().toLowerCase();

        // it only treats messages different of '/start'
        if (text != strings.start_command) {
            const rocket_launch_detector = clients.get(msg.chat.id);
            if (rocket_launch_detector) {
                const response = rocket_launch_detector.onMessage(text);
                telegram_bot_send_response_function(telegram_bot, msg.chat.id, response);
            }
            else {
                // the user did not start the test yet
                const response = [{ type: "message", value: strings.unknown_client }]
                telegram_bot_send_response_function(telegram_bot, msg.chat.id, response);
            }
        }
    });
};