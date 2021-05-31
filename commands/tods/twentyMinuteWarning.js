const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");

exports.run = function(bot, db, message) {
    const timeStamp = moment().add(20, 'minutes');
    const betweenTimestamp = moment().add(21, 'minutes');
        db.query("SELECT t.name, t.windowStart, d1.killedBy, d2.killedBy AS 'lastKilledBy' FROM meanBot.targets t LEFT JOIN meanBot.tod d1 ON t.todId = d1.todId LEFT JOIN meanBot.tod d2 ON d1.previousTodId = d2.todId WHERE t.windowStart <= ? AND t.windowStart > ? ORDER BY t.windowStart ASC;", [betweenTimestamp.toDate(), timeStamp.toDate()],
        function(err, rows){
            const embed = new Discord.MessageEmbed();
            if (err) {
                console.error("Invalid: " + err);
            }
            if(rows.length > 0) {
                bot.channels.cache.get('842187257926516736').send("<@&842186819386605568> <@&842322700650676224>", {
                    embed: {
                        color: "#0099ff",
                        title: "Mobs Entering Window:\n",
                        author: {
                            name: 'MeanBot',
                            icon_url: 'https://i.imgur.com/HcURdiB.jpg'
                        },
                        description: "In 20 minutes:",
                        fields: rows.map((row) => {
                            return { 
                                name: `${row.killedBy == 'Seal Team' && row.lastKilledBy == 'Seal Team' ?  '(Bagged)' : ''} ${row.name}`, 
                                value: `Window Opens at: ${moment(row.windowStart).format('LLL')}\nWindow Opens in: ${moment.utc(moment(row.windowStart,"DD/MM/YYYY HH:mm:ss").diff(moment(new Date(),"DD/MM/YYYY HH:mm:ss"))).format("HH [hours] mm [minutes] ss [seconds]")}\nPreviously Killed By: ${row.killedBy ? row.killedBy : 'Unknown'}, ${row.lastKilledBy ? row.lastKilledBy : 'Unknown'}` 
                            }
                        }),
                        image: {
                            url: 'https://i.imgur.com/HcURdiB.jpg'
                        },
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
        })
     } 
