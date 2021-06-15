const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const config = require("../../config.json");
const deleteFunc = (oldmsg, msg) => {msg.delete(); oldmsg.delete();};

exports.run = async (message, args, bot, db) => {
    try {
        const rows = await db.query("SELECT t.name FROM meanBot.targets t LEFT JOIN meanBot.tod d1 ON t.todId = d1.todId LEFT JOIN meanBot.tod d2 ON d1.previousTodId = d2.todId WHERE d1.killedBy = 'Seal Team' AND d2.killedBy = 'Seal Team' AND t.isBaggable = 1 AND t.respawnTime >= 72;");
        console.log(rows);
        if(rows.length > 0) {
            const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle("Current Bagged Mobs\n")
            .setAuthor("MeanBot", "https://i.imgur.com/tYfYIy3.png")
            .addFields({
                name: 'Bagged on',
                value: rows.map(row=> row.name).join(', ')
            }).setTimestamp().setFooter('Monitor for Time of Death');
                message.reply(embed).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
        } else {
            const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle("No Current Bags\n").setAuthor("MeanBot", "https://i.imgur.com/tYfYIy3.png").setTimestamp().setFooter('Enjoy no bags.');
            message.reply(embed).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
        }
    } catch (e) {
        console.log("Error getting bagged info: " + e);
    }
}