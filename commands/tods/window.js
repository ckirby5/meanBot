const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");

exports.run = function(message, args, bot, db) {
    let arg = args.split(" ");
    let mobName = arg[0];
    let answer = arg.slice(1, arg.length).join(" ");
        db.query("SELECT t.name, t.tod, t.variance, t.windowStart, t.windowEnd FROM meanBot.tods t JOIN meanBot.aliases a ON a.targetId = t.targetId WHERE a.name = ?;", args,
        function(err, rows){
            if (err) {
                console.error("Invalid: " + err);
            }
            if (rows[0] !== null && rows[0] !== undefined) {
                bot.channels.cache.get('833859329589379095').send("", {
                    embed: {
                        color: "#0099ff",
                        title: "Mob Info",
                        author: {
                            name: 'MeanBot',
                            icon_url: 'https://i.imgur.com/HcURdiB.jpg'
                        },
                        description: rows[0].name,
                        fields: [
                            {
                                name: "Time of Death",
                                value: moment(rows[0].tod).format('LLL'),
                                inline: false,
                            },
                            {
                                name: "Enters Window",
                                value: moment(rows[0].windowStart).format('LLL')
                            },
                            {
                                name: "Window Ends",
                                value: moment(rows[0].windowEnd).format('LLL')
                            },
                            {
                                name: "Window Length",
                                value: `${rows[0].variance > 60 ? (rows[0].variance * 2)/60 : rows[0].variance * 2} ${rows[0].variance < 60 ? ' minutes' : ' hours'}`
                            }
                        ],
                        timestamp: new Date()
                        /*rows[0].name + " \nTime of Death: " +
                        moment(rows[0].tod).format('LLL') + "\n Enters Window: " + moment(rows[0].windowStart).format('LLL') +
                        "\nWindow Ends: " + moment(rows[0].windowEnd).format('LLL') +
                        `\nWindow Length: ${rows[0].variance > 60 ? (rows[0].variance * 2)/60 : rows[0].variance * 2} ${rows[0].variance < 60 ? ' minutes' : ' hours'}`*/
                    }
                });
            } else {
                bot.channels.cache.get('833859329589379095').send("", {
                    embed: {
                        color: "#0099ff",
                        title: "You specified an invalid target! Fuck you!",
                        author: {
                            name: "MeanBot",
                            icon_url: "https://i.imgur.com/HcURdiB.jpg"
                        },
                        image: {
                            url: "https://i.imgur.com/HcURdiB.jpg"
                        },
                        timestamp: new Date()
                    }
                });
            }
        })
     } 


