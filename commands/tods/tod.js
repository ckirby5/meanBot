const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");

exports.run = function(message, args, bot, db) {
    const arguments = args.split('-')
    const mobName = arguments[0]
    let modValue = 0
    if(arguments.length > 1) {
        modValue = arguments[1]
    }
    console.log(mobName);
    console.log(modValue);
    
        db.query("SELECT t.name, t.targetId, t.variance, t.respawnTime FROM meanBot.tods t JOIN meanBot.aliases a ON a.targetId = t.targetId WHERE a.name = ?;", mobName.trim(),
        function(err, rows){
            if (err) {
                console.error("Invalid: " + err);
            }
            if (rows[0] !== null && rows[0] !== undefined) {
                const tod = moment().subtract(modValue, 'minutes');
                const windowStart = moment(moment().add(rows[0].respawnTime, 'hours').subtract(rows[0].variance, 'minutes')).subtract(modValue, 'minutes');
                const windowEnd = moment(moment().add(rows[0].respawnTime, 'hours').add(rows[0].variance, 'minutes')).subtract(modValue, 'minutes');
                db.query("UPDATE meanBot.tods SET tod = ?, windowStart = ?, windowEnd = ? WHERE targetId = ?;", [tod.toDate(), windowStart.toDate(), windowEnd.toDate(), rows[0].targetId],
                    function(err, result) {
                        if(result.affectedRows == 1) {
                            bot.channels.cache.get('842187750068191243').send("", {
                                embed: {
                                    title: "Mob Info Updated for: ",
                                    description:
                                    rows[0].name + " \nNew Time of Death is: " +
                                    moment(tod).format('LLL')
                                }
                            });
                        }
                    }
                )

            } else {
                bot.channels.cache.get('833859329589379095').send("Invalid target specified! Fuck you!");
            }
        })
     } 

