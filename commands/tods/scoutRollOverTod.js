const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment-timezone");
moment.tz.setDefault('America/New_York');
const config = require('../../config.json');
const deleteFunc = (oldmsg, msg) => {msg.delete(); oldmsg.delete();};

exports.run = async (bot, db) => {

    try {
        let modValue = 2;
        const aliasResult = await db.query("SELECT targetId, windowStart, variance, respawnTime, name FROM meanBot.targets WHERE isRollable = 1 AND name = 'Scout Charisa';");
        if (aliasResult[0] !== null && aliasResult[0] !== undefined) {
            const assumedTod = moment(aliasResult[0].windowStart);
            if (!assumedTod.isAfter()) {
                const newTod = assumedTod.toDate();
                const insertResult = await db.query("INSERT INTO tod (tod, targetId, killedBy, previousTodId, recordedBy) VALUES (?, ?, ?, ?, ?)", [newTod, aliasResult[0].targetId, "MeanBot", aliasResult[0].todId, "MeanBot"]);
                let killTimeStart = moment(aliasResult[0].windowStart);
                let killTimeEnd = moment(aliasResult[0].windowStart);
                const windowStart = moment(killTimeStart.add(aliasResult[0].respawnTime, 'hours').subtract(aliasResult[0].variance, 'minutes'));
                const windowEnd = moment(killTimeEnd.add(aliasResult[0].respawnTime, 'hours').add(aliasResult[0].variance, 'minutes'));

                const result = await db.query("UPDATE targets SET todId = ?, windowStart = ?, windowEnd = ?, tracker = null WHERE targetId = ?;", [insertResult.insertId, windowStart.toDate(), windowEnd.toDate(), aliasResult[0].targetId]);

                if(result.affectedRows == 1) {
                    bot.channels.cache.get(config.todChannel).send("", {
                        embed: {
                            color: "#0099ff",
                            title: `Automatically Updated ToD for ${aliasResult[0].name}`,
                            fields: [
                                {
                                    name: "New Time of Death",
                                    value: moment(newTod).format('LLL')
                                },
                                {
                                    name: "Updated By",
                                    value: "MeanBot"
                                }
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: "Thank you for keeping Seal Team up to date!"
                            }
                        }
                    });
                }
            }
        }
    } catch (e){
        console.log("Error rolling over ToD: " + e);
    }
}