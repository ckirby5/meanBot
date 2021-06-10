const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const config = require('../../config.json');

exports.run = async(bot, db, message) => {
    try {
        const timeStamp = moment().add(20, 'minutes');
        const betweenTimestamp = moment().add(21, 'minutes');
        const rows = await db.query("SELECT t.name, t.windowStart, t.isBaggable, d1.killedBy, d2.killedBy AS 'lastKilledBy' FROM meanBot.targets t LEFT JOIN meanBot.tod d1 ON t.todId = d1.todId LEFT JOIN meanBot.tod d2 ON d1.previousTodId = d2.todId WHERE t.windowStart <= ? AND t.windowStart > ? ORDER BY t.windowStart ASC;", [betweenTimestamp.toDate(), timeStamp.toDate()]);
        if(rows.length > 0) {
            console.log("Rows length: " + rows.length);
            bot.channels.cache.get(config.sockphoneChannel).send("<@&842186819386605568> <@&842322700650676224>", {
                embed: {
                    color: "#0099ff",
                    title: "Mobs Entering Window:\n",
                    author: {
                        name: 'MeanBot',
                        icon_url: 'https://i.imgur.com/tYfYIy3.png'
                    },
                    description: "In 20 minutes:",
                    fields: rows.map((row) => {
                        return { 
                            name: `${row.name}`, 
                            value: `Window Opens at: ${moment(row.windowStart).format('LLL')}\nWindow Opens in: ${moment.utc(moment(row.windowStart,"DD/MM/YYYY HH:mm:ss").diff(moment(new Date(),"DD/MM/YYYY HH:mm:ss"))).format("HH [hours] mm [minutes] ss [seconds]")}\nPreviously Killed By: ${row.killedBy ? row.killedBy : 'Unknown'}, ${row.lastKilledBy ? row.lastKilledBy : 'Unknown'}\n${row.killedBy == 'Seal Team' && row.lastKilledBy == 'Seal Team' && row.isBaggable ?  '(:handbag: monitor for ToD)' : ''}`  
                        }
                    }),
                    timestamp: new Date(),
                    footer: {
                        text: "\nThese are entering window soon! Be prepared!"
                    }

                }
            }).then(function(message){
                message.react("💩");
                message.react("🧦");
            });
        }
    } catch (error) {
        console.log(error)
    }
}
