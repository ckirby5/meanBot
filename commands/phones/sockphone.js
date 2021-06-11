const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require('../../config.json');

exports.run = function(message, args, bot) {
    //const command = args.shift().toLowerCase();
    bot.channels.cache.get(config.sockphoneChannel).send(`<@&${config.raiderRole}> <@&${config.memberRole}> <@&${config.trialRaiderRole}> <@&${config.trialMemberRole}>` +args).then(function(message) {
        message.react("🧦");
        message.react("📣");
    });;
}

