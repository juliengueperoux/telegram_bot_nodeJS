/*
Init File, containing all main dependencies and server initalization
*/
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const telegram_bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

require('./bin/telegram_bot/entry_points')(telegram_bot)
