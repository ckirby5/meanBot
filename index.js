const config = require("./config.json");
const Discord = require("discord.js");
const mysql = require("mysql");

const commands = require("./commands.json");

const bot = new Discord.Client();

bot.once("ready", () => {
    console.log("meanBot is ready!");
});

bot.on("message", (message) => {
    if (message.channel.type != "text") {
      return;
    }
  
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) {
      return;
    }
    const command = message.content.split(" ");
    const args = command.slice(1, command.length).join(" ");
    const commandName = command[0].toLowerCase().slice(config.prefix.length);
  
    if (commandName in commands) {
      if (commands[commandName].type === "dm") {
        return;
      }
      let action = require("./commands/" + commands[commandName].action);
      action.run(message, args, bot, commands[commandName].extra);
    }
});

bot.login(config.token);

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});