const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const config = require('../../config.json');

exports.run = async(bot, db, message) => {
    try {
        const timeStamp = moment().add(20, 'minutes');
        const betweenTimestamp = moment().add(21, 'minutes');
        const rows = await db.query("SELECT t.name, t.windowStart, t.isBaggable, t.concedes, d1.killedBy, d2.killedBy AS 'lastKilledBy' FROM meanBot.targets t LEFT JOIN meanBot.tod d1 ON t.todId = d1.todId LEFT JOIN meanBot.tod d2 ON d1.previousTodId = d2.todId WHERE t.windowStart <= ? AND t.windowStart > ? AND isSubscribable = 0 ORDER BY t.windowStart ASC;", [betweenTimestamp.toDate(), timeStamp.toDate()]);
        console.log("Twenty Minute Runner Rows: " + rows);
        if(rows.length > 0) {
            bot.channels.cache.get(config.sockphoneChannel).send(`<@&${config.raiderRole}> <@&${config.memberRole}> <@&${config.trialRaiderRole}> <@&${config.trialMemberRole}>`, {
                embed: {
                    color: "#0099ff",
                    title: "Mobs Entering Window in 20 minutes:\n",
                    fields: rows.map((row) => {
                        let title = row.name;
                        const areBagged =  row.killedBy == 'Seal Team' && row.lastKilledBy == 'Seal Team' && row.isBaggable;
                        const conceded = row.concedes > 0;
                        if(areBagged || conceded){
                          title = `${areBagged ? ':handbag:' : ''} ${conceded ? ':do_not_litter:' : ''} ${row.name} (Monitor for ToD)`
                        }
                        return {
                            name: title, 
                            value: `Window Opens: ${moment(row.windowStart).format('LLL')}`  
                        }
                    })
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
