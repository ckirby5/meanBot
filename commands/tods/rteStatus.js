const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const config = require("../../config.json");

exports.run = function(bot, db, message) {
    const timeStamp = moment();

    db.query("SELECT ro.name AS 'role', r.who, t.name AS 'name' FROM meanBot.rte r LEFT JOIN meanBot.targets t ON r.targetId = t.targetId LEFT JOIN meanBot.role ro ON r.roleId = ro.id WHERE completed IS null;",
    function(err, results) {
        if (err) {
            console.log("Error with pulling rteStatus: ", err);
        }
        if (results.length > 0) {
            const currentWindowDeleteMessagesAction = require('../../commands/chat/chatDelete');
            currentWindowDeleteMessagesAction.run(bot, config.activeRteChannel, config.messagesToDelete);
            const rteMobs = [...new Set(results.map(rte => rte.name))];
                    const activeRte = rteMobs.map((mob) =>{
                        const rters = results.filter(rte => rte.name == mob);
                        return {
                            mob,
                            rters 
                        }
                    });

                    const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle("Current RTE\n")
                    .setAuthor("MeanBot", "https://i.imgur.com/tYfYIy3.png")
                    .addFields(
                        activeRte.map((rte) => {
                            return { 
                                name: rte.mob, 
                                value: rte.rters && rte.rters.length > 0 ? rte.rters.map(rter => `${rter.role} : ${rter.who}`) : 'No RTE currently set.'
                            }
                        }
                    )).setTimestamp().setFooter("/nThese are currently in RTE! Be prepared!")
                    bot.channels.cache.get(config.activeRteChannel).send(embed);

        }
    }
    )
}
