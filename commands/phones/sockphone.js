const Discord = require("discord.js");
const bot = new Discord.Client();

exports.run = function(message, args, bot) {
    //const command = args.shift().toLowerCase();
    bot.channels.cache.get('842187257926516736').send(`<@&842186819386605568> <@&842322700650676224> ` +args);
}

