const config = require("./config.json");
const Discord = require("discord.js");
const mysql = require("mysql");
const promiseDb = require('./helpers/promise-db');
const deleteFunc = (oldmsg, msg) => {msg.delete(); oldmsg.delete();};


const commands = require("./commands.json");

const bot = new Discord.Client();

let pool;

const db = new promiseDb({
  host: config.mysqlHost,
  user: config.mysqlUser,
  password: config.mysqlPass,
  database: config.mysqlDB,
  port: config.mysqlPort,
  timezone: config.timeZone,
  charset: "utf8mb4"

});

async function checkIfAuthorInRole(roleName, message) {
  const guild = await bot.guilds.fetch(config.guildId);
  const role = guild.roles.cache.find(role => role.name === roleName);
  const memberArray = Array.from(role.members, ([name, value]) => ({...value}));
  const memberInArray = memberArray.find(member => member.user.username == message.author.username);
  return memberInArray != undefined;
}

function twentyFourHourRunner() {
  const currentWindowDeleteMessagesAction = require('./commands/chat/chatDelete');
  currentWindowDeleteMessagesAction.run(bot, config.windowsChannel, config.messagesToDelete);
  currentWindowDeleteMessagesAction.run(bot, config.campCheckChannel, config.messagesToDelete);
  const currentWindowRunnerAction = require("./commands/tods/currentWindows");
  currentWindowRunnerAction.run(bot, db);
  const twentyFourHourWindowAction = require("./commands/tods/upcomingWindows");
  twentyFourHourWindowAction.run(bot, db);
  const currentCampsBeingHeldAction = require('./commands/utility/currentCamps');
  currentCampsBeingHeldAction.run(bot, db);
}

function fiveMinuteRunner() {
  const oneMinuteWindowAction = require("./commands/tods/scoutRollOverTod");
  oneMinuteWindowAction.run(bot, db);
}

setInterval(twentyFourHourRunner, 300000);
setInterval(fiveMinuteRunner, 300000);

bot.once("ready", () => {
    console.log("meanBot is ready!");
});

bot.on("message", async (message) => {
    if (message.channel.type != "text") {
      return;
    }
  
    if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) {
      return;
    }
    const command = message.content.split(" ");
    const args = command.slice(1, command.length).join(" ");
    const commandName = command[0].toLowerCase().slice(config.prefix.length);
    if (message.channel.id == config.meanBotChannel || (message.channel.id == config.todChannel && commandName == 'tod')) {
      if (commandName in commands) {
        if (commands[commandName].type === "dm") {
          return;
        }
        if(await checkIfAuthorInRole(commands[commandName].role, message)){
          let action = require("./commands/" + commands[commandName].action);
          await action.run(message, args, bot, db, commands[commandName].extra);
        }
        else {
          message.channel.send("You do not have the proper role to use this command!").then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
        }
        
      }
    } else {
      message.channel.send("Please use the meanbot channel.").then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
    }
    
});

bot.ws.on('INTERACTION_CREATE', async interaction => {
  const commandName = interaction.data.name;
  if (commandName in commands && commands[commandName].interaction) {
    let action = require("./commands/" + commands[commandName].action);
    action.interaction(interaction, bot, db);
  }
});

bot.login(config.token);

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});