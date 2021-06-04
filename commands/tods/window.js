const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");

exports.run = function(message, args, bot, db) {
    let arg = args.split(" ");
    let mobName = arg[0];
    let answer = arg.slice(1, arg.length).join(" ");
    db.query("SELECT id, name from meanBot.role;", 
    function(err, roles) {
        if (err) {
            console.log("Error getting roles from db: " + err);
        } 
        db.query("SELECT t.name, t.variance, t.windowStart, t.windowEnd, t.targetURL, t.RTERoles, d1.killedBy, d2.killedBy AS 'lastKilledBy', d1.tod FROM meanBot.targets t JOIN meanBot.aliases a ON a.targetId = t.targetId LEFT JOIN meanBot.tod d1 ON t.todId = d1.todId LEFT JOIN meanBot.tod d2 ON d1.previousTodId = d2.todId WHERE a.name = ?;", args,
        function(err, rows){
            if (err) {
                console.error("Invalid: " + err);
            }
            if (rows[0] !== null && rows[0] !== undefined) {
                bot.channels.cache.get('833859329589379095').send("", {
                    embed: {
                        color: "#0099ff",
                        title: rows[0].name,
                        url: rows[0].targetURL,
                        author: {
                            name: 'MeanBot',
                            icon_url: 'https://i.imgur.com/tYfYIy3.png'
                        },
                        description: "Window Info",
                        fields: [
                            {
                                name: "RTE Roles Available",
                                value: rows[0].RTERoles.split(',').map((roleId) => {
                                    return "*"+roles.find(r => r.id == roleId).name+"*"
                                })
                            },
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
                            },
                            {
                                name: "Last Killed By",
                                value: `${rows[0].killedBy ? rows[0].killedBy : 'Unknown'}`
                            },{
                                name: "Previously Killed By",
                                value: `${rows[0].lastKilledBy ? rows[0].lastKilledBy : 'Unknown'}`
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
                            icon_url: "https://i.imgur.com/tYfYIy3.png"
                        },
                        image: {
                            url: "https://i.imgur.com/HcURdiB.jpg"
                        },
                        timestamp: new Date()
                    }
                });
            }
        })
    })
} 



