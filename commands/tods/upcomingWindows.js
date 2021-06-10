const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const config = require("../../config.json");

exports.run = async (bot, db, message) => {
    try {
        const timeStamp = moment().add(24, 'hours');
        const rows = await db.query("SELECT t.name, t.windowStart, t.isBaggable, d1.killedBy, d2.killedBy AS 'lastKilledBy' FROM targets t LEFT JOIN tod d1 ON t.todId = d1.todId LEFT JOIN tod d2 ON d1.previousTodId = d2.todId WHERE t.windowStart <= ? AND t.windowStart > ? ORDER BY t.windowStart ASC;", [timeStamp.toDate(), new Date()]);
        if(rows.length > 0) {
            bot.channels.cache.get(config.windowsChannel).send("", {
                embed: {
                    color: "#0099ff",
                    title: "Mobs Entering Window In The Next 24 Hours\n",
                    author: {
                        name: 'MeanBot',
                        icon_url: 'https://i.imgur.com/tYfYIy3.png'
                    },
                    fields: rows.map((row) => {
                        return { 
                            name: `${row.killedBy == 'Seal Team' && row.lastKilledBy == 'Seal Team' && row.isBaggable ?  ':handbag:' : ':tractor:'} ${row.name}`, 
                            value: `\nOpens in: ${moment.utc(moment(row.windowStart,"DD/MM/YYYY HH:mm:ss").diff(moment(new Date(),"DD/MM/YYYY HH:mm:ss"))).format("HH [hours] mm [minutes] ss [seconds]")}` 
                        }
                    }),
                    timestamp: new Date(),
                    footer: {
                        text: "\nThese are entering window soon! Be prepared!"
                    }

                }
            });
        }
    } catch (error) {
        console.log(error)
    }
} 



