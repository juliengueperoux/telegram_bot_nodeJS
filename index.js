/*
Init File, containing all main dependencies and server initalization
*/
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const telegram_bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const RocketLaunchDetector = require('./app/main/rocket_launch_detector');

const rocket_launch_detector = new RocketLaunchDetector();

telegram_bot.onText(/\/start/, async (msg) => {
    await rocket_launch_detector.init();
    console.log(rocket_launch_detector.getNextImageUrl());
    telegram_bot.sendPhoto(msg.chat.id, rocket_launch_detector.getNextImageUrl());

    telegram_bot.sendMessage(msg.chat.id, "c'est le décolage ?", {
        "reply_markup": {
            "keyboard": [["oui", "non"]]
        }
    });

});


telegram_bot.on('message', (msg) => {
    console.log("message !!!!!")
    const text = msg.text.toString().toLowerCase();
    let result = null;

    if (text == "oui") {
        result = rocket_launch_detector.treatResult(true);
    }
    else if (text == "non") {
        result = rocket_launch_detector.treatResult(false);
    }
    else {
        if (text != `/start`)
            telegram_bot.sendMessage(msg.chat.id, "commande inconnue ! Répondre par oui ou par non !", {
                "reply_markup": {
                    "keyboard": [["oui", "non"]]
                }
            });
        return;
    }
    console.log("reuslt !!! " + result)
    if (result != null) {
        console.log(" not null !")
        const message = "Nous avons trouvé !";
        const url = rocket_launch_detector.getNextImageUrl();
        console.log("url !!! " + url)


        telegram_bot.sendMessage(msg.chat.id, "Nous avons trouvé ! "+result);
        console.log("sendMessage !!! ")

        telegram_bot.sendPhoto(msg.chat.id, url);
    }
    else {
        console.log("null !")
        telegram_bot.sendPhoto(msg.chat.id, rocket_launch_detector.getNextImageUrl());

        telegram_bot.sendMessage(msg.chat.id, "c'est le décolage ?", {
            "reply_markup": {
                "keyboard": [["oui", "non"]]
            }
        });
    }
});