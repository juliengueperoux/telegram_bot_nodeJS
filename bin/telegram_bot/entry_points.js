const RocketLaunchDetector = require('../main_algorithm/rocket_launch_detector');
const strings = require('../utils/strings.json')

const clients = require('../utils/clients');

module.exports = function (telegram_bot) {


    /*
     * Method called when a suer do the /start command, we create a new RocketLaunchDetector and launch the discussion
     */
    telegram_bot.onText(/\/start/, async (msg) => {

        const rocket_launch_detector = new RocketLaunchDetector(telegram_bot, msg.chat.id);
        rocket_launch_detector.onStartMessage();

        clients.set(msg.chat.id, rocket_launch_detector)
    });


    /*
    * Method called when a message is sent to the bot, we take in consideration only if it's different of '/start'
    */
    telegram_bot.on('message', (msg) => {
        const text = msg.text.toString().toLowerCase();

        if (text != strings.start_command) {
            const rocket_launch_detector = clients.get(msg.chat.id);
            if (rocket_launch_detector) {
                console.log("message !!!")
                rocket_launch_detector.onMessage(text);
            }
            else {
                telegram_bot.sendMessage(msg.chat.id, strings.unknown_client, {
                    "reply_markup": {
                        "keyboard": [[strings.yes, strings.no]]
                    }
                });
            }
        }
    });
};