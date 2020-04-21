const RocketLaunchDetector = require('./bin/main_algorithm/rocket_launch_detector');

const rocket_launch_detector = new RocketLaunchDetector();

const strings = require('../utils/strings.json')

module.exports = function (telegram_bot) {

    telegram_bot.onText(/\/start/, async (msg) => {
        await rocket_launch_detector.init();
        console.log(rocket_launch_detector.getNextImageUrl());
        telegram_bot.sendPhoto(msg.chat.id, rocket_launch_detector.getNextImageUrl());

        telegram_bot.sendMessage(msg.chat.id, strings.question, {
            "reply_markup": {
                "keyboard": [[strings.yes, strings.no]]
            }
        });

    });


    telegram_bot.on('message', (msg) => {
        const text = msg.text.toString().toLowerCase();
        let result = null;

        if (text == strings.yes) {
            result = rocket_launch_detector.treatResult(true);
        }
        else if (text == strings.no) {
            result = rocket_launch_detector.treatResult(false);
        }
        else {
            if (text != strings.start_command)
                telegram_bot.sendMessage(msg.chat.id, strings.unknwon_answer, {
                    "reply_markup": {
                        "keyboard": [[strings.yes, strings.no]]
                    }
                });
            return;
        }
        if (result != null) {
            const url = rocket_launch_detector.getNextImageUrl();

            telegram_bot.sendMessage(msg.chat.id, strings.foundValue + result);

            telegram_bot.sendPhoto(msg.chat.id, url);
        }
        else {
            telegram_bot.sendPhoto(msg.chat.id, rocket_launch_detector.getNextImageUrl());

            telegram_bot.sendMessage(msg.chat.id, strings.unknwon_answer, {
                "reply_markup": {
                    "keyboard": [[strings.yes, strings.no]]
                }
            });
        }
    });
};