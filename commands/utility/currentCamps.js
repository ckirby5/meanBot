const Discord = require("discord.js");
const config = require("../../config.json");
const bot = new Discord.Client();
const moment = require("moment");

exports.run = function(bot, db, message) {
    db.query('SELECT name, tracker FROM meanBot.targets WHERE isCamp = 1 AND tracker IS NOT null',
    function(err, rows){

        if (err) {
            console.log("Error getting current camps: " +err);
        }

        if (rows.length > 0) {
            const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle('Current Active Camps').setAuthor("MeanBot", "https://i.imgur.com/tYfYIy3.png")
            .addFields(
                rows.map((row) => {
                    return {
                        name: `${row.name}`,
                        value: `Camp Holder: ${row.tracker}`
                    }
                })
            ).setTimestamp().setFooter("\nCheck with current camp holder to be added to list");
            bot.channels.cache.get(config.campCheckChannel).send(embed);
        }
    });
}
