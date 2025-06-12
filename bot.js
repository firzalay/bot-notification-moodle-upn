const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

async function sendMessage(text) {
  await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, text);
}

module.exports = { sendMessage };