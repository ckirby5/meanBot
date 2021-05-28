const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");

exports.run = function(message, args, bot, db) {
    const arguments = args.split(',')
    let mobName = ''
    let modValue = 0
    let killedByValue = "Seal Team"
    arguments.map((arg) => {
        const val = arg.trim();
        if(val.startsWith('-')){ modValue = val.replace('-','') }
        else if(val.startsWith('$')){ killedByValue = val.replace('$','') }
        else { mobName  = val }
    })
    console.log(mobName);
    console.log(modValue);
    
        db.query("SELECT t.todId, t.name, t.targetId, t.variance, t.respawnTime FROM meanBot.targets t JOIN meanBot.aliases a ON a.targetId = t.targetId LEFT JOIN meanBot.tod d ON t.todId = d.todId WHERE a.name = ?;", mobName.trim(),
        function(err, rows){
            if (err) {
                console.error("Invalid: " + err);
            }
            if (rows[0] !== null && rows[0] !== undefined) {
                const tod = moment().subtract(modValue, 'minutes');
                // INSERT INTO meanBot.tod (tod, targetId, bag, previousTodId) VALUES ('2021-05-27 16:16:57.829',2,'1',null);
                db.query("INSERT INTO meanBot.tod (tod, targetId, killedBy, previousTodId) VALUES (?, ?, ?, ?);", [tod.toDate(), rows[0].targetId, killedByValue, rows[0].todId],
                function(err, result) {
                    if (err) throw err 
                    console.log(result);
                    const windowStart = moment(moment().add(rows[0].respawnTime, 'hours').subtract(rows[0].variance, 'minutes')).subtract(modValue, 'minutes');
                    const windowEnd = moment(moment().add(rows[0].respawnTime, 'hours').add(rows[0].variance, 'minutes')).subtract(modValue, 'minutes');
                    db.query("UPDATE meanBot.targets SET todId = ?, windowStart = ?, windowEnd = ? WHERE targetId = ?;", [result.insertId, windowStart.toDate(), windowEnd.toDate(), rows[0].targetId],
                        function(err, result) {
                            if(result.affectedRows == 1) {
                                bot.channels.cache.get('842187750068191243').send("", {
                                    embed: {
                                        color: "#0099ff",
                                        title: "Mob Info Updated",
                                        author: {
                                            name: 'MeanBot',
                                            icon_url: 'https://i.imgur.com/HcURdiB.jpg'
                                        },
                                        description: rows[0].name,
                                        fields: [
                                            {
                                                name: "New Time of Death",
                                                value: moment(tod).format('LLL')
                                            },
                                            {
                                                name: "Killed By",
                                                value: killedByValue
                                            },
                                            {
                                                name: "Updated By",
                                                value: "<@" + message.author.id + ">"
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
                    )
                })
            } else {
                bot.channels.cache.get('833859329589379095').send("Invalid target specified! Fuck you!");
            }
        })
     } 

