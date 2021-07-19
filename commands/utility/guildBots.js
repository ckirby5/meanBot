const Discord = require("discord.js");
const parse = require('../../helpers/argParser')
const moment = require("moment");
const config = require('../../config.json');

exports.run = async (message, args, bot, db) => {

    const params = parse(args);

    if(params.hasOwnProperty('default')) {
        message.reply( "No arguments specified");
        return;
    }

    try {
        if (message.member.roles.cache.has(config.raiderRole)) {
            if (params.hasOwnProperty('park') && params.park) {
                await db.query("UPDATE meanBot.guildBots SET location = ?, notes = ?, updatedBy = ? WHERE name = ?;", [params.location, params.notes, message.author.id, params.name]);
                message.reply(`Parked ${params.name} at ${params.location} with ${params.notes}`);
            } else if (params.hasOwnProperty('location') && params.location) {
                const rows = await db.query("SELECT gb.name, z.zoneName FROM meanBot.guildBots gb JOIN meanBot.zones z ON gb.location = z.zoneId;");
                if (rows.length > 0) {
                    console.log("$$$$$$$$$ Location: " + rows[0].zoneName);
                    const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle("Current Bot Locations\n")
                    .addFields(
                        rows.map((row) => {
                            return{
                                name: `${row.name}`,
                                value: `${row.zoneName}`
                            }
                        })
                    ).setTimestamp();
                        message.author.send(embed);
                }
            }
        } else if (message.member.roles.cache.has(config.leaderRole)) {
           
        } else {
            message.reply("you don't have the role");
        }
        
    } catch(ex) {
        console.log("Error with guildBots: " + ex);
    }
}
