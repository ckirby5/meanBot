const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");

exports.run = function(bot, db) {
    const timeStamp = moment().add(24, 'hours');
        db.query("SELECT * FROM meanBot.tods WHERE windowStart <= ? AND windowStart > ?", [timeStamp.toDate(), new Date()],
        function(err, rows){
            const embed = new Discord.MessageEmbed();
            if (err) {
                console.error("Invalid: " + err);
            }
                bot.channels.cache.get('833859329589379095').send("", {
                    embed: {
                        color: "#0099ff",
                        title: "Mobs Entering Window: \n",
                        author: {
                            name: 'meanBot',
                        },
                        description: "Less than 24 hours:",
                        fields: [
                            {
                                name: rows.map((row) => {
                                    return `${row.name}\n\n`
                                    }).join('\n'),
                                value: rows.map((row) => {
                                    return `Window Opens\n ${moment.utc(moment(row.windowStart,"DD/MM/YYYY HH:mm:ss").diff(moment(new Date(),"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")}`
                                })
                            }
                        ],
                        image: {
                            url: 'https://i.imgur.com/wSTFkRM.png'
                        },
                        timestamp: new Date(),
                        footer: {
                            text: "These are entering window soon! Be prepared!"
                        }

                    }
                });
        })
     } 



