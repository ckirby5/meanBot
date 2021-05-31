const Discord = require("discord.js");
const bot = new Discord.Client();

exports.run = function(message, args, bot) {
    //const command = args.shift().toLowerCase();
    bot.channels.cache.get('842186451089358918').send("@everyone " +args).then(function(message) {
        message.react("🧦");
        message.react("📣");
    });
}

