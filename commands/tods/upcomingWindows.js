const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");

exports.run = function(bot, db) {
    const timeStamp = moment().add(24, 'hours');
    console.log(timeStamp);
        db.query("SELECT * FROM meanBot.tods WHERE windowStart <= ? AND windowStart > ?", [timeStamp.toDate(), new Date()],
        function(err, rows){
            if (err) {
                console.error("Invalid: " + err);
            }
                bot.channels.cache.get('833859329589379095').send("", {
                    embed: {
                        title: "Coming in to window in 24 Hours: \n",
                        description:rows.map((row) => {
                            return `${row.name}\nComes into Window in: ${moment.utc(moment(row.windowStart,"DD/MM/YYYY HH:mm:ss").diff(moment(new Date(),"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")}`
                            }).join('\n')
                    }
                });
        })
     } 



