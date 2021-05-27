const config = require("./config.json");
const Discord = require("discord.js");
const mysql = require("mysql");

const commands = require("./commands.json");

const bot = new Discord.Client();

let pool;

const db = mysql.createConnection({
  host: config.mysqlHost,
  user: config.mysqlUser,
  password: config.mysqlPass,
  database: config.mysqlDB,
  charset: "utf8mb4"

});

db.connect(function(err){
  if (err) throw err;
  db.query("SELECT * FROM tods", function(err, result, fields){
    if (err) throw err;
    console.log(result);
  })
});

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
      action.run(message, args, bot, db, commands[commandName].extra);
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