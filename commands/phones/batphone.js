const { prefix, token } = require('../../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
    name: 'bp',
    description: 'Sends a batphone',
    args: true,
    async execute(message, args) {
        if(message.content.startsWith(prefix) && !message.author.bot) {
            const args = message.content.slice(prefix.length).trim().split(/ +/).join(' ');
            //const command = args.shift().toLowerCase();
            client.channels.cache.get('842186451089358918').send("@everyone " +args);
        }
    }
}

client.login(token);