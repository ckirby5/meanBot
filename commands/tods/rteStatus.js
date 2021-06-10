const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const config = require("../../config.json");
const currentWindowDeleteMessagesAction = require('../../commands/chat/chatDelete');

exports.run = async (bot, db, message) => {
    try {
        const results = await db.query("SELECT ro.name AS 'role', r.who, t.name AS 'name' FROM meanBot.rte r LEFT JOIN meanBot.targets t ON r.targetId = t.targetId LEFT JOIN meanBot.role ro ON r.roleId = ro.id WHERE completed IS null;");    
        if (results.length > 0) {
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
                    )).setTimestamp().setFooter("These are current RTE roles filled!")
                    bot.channels.cache.get(config.activeRteChannel).send(embed);

        }
    } catch (error) {
        console.log(error)
    }
}
