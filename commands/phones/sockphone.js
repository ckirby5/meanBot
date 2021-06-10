const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require('../../config.json');

exports.run = function(message, args, bot) {
    //const command = args.shift().toLowerCase();
    bot.channels.cache.get(config.sockphoneChannel).send(`<@&842186819386605568> <@&842322700650676224> ` +args).then(function(message) {
        message.react("🧦");
        message.react("📣");
    });;
}

