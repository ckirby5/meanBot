const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");


exports.run = function(message, args, bot, db) {
    const arguments = args.split(' ')
    let mobName = arguments[0];
    if (arguments.length < 2) {
        bot.channels.cache.get('833859329589379095').send("You forgot to add yourself! Moran!");
    } else {
        let trackerName = arguments[1];
        db.query("SELECT t.todId, t.name, t.targetId, t.variance, t.respawnTime, t.tracker FROM meanBot.targets t JOIN meanBot.aliases a ON a.targetId = t.targetId LEFT JOIN meanBot.tod d ON t.todId = d.todId WHERE a.name = ?;", mobName.trim(),
        function(err, rows){
            if (err) {
                console.error("Invalid: " + err);
            }
            if (rows[0] !== null && rows[0] !== undefined) {
                db.query("UPDATE meanBot.targets SET tracker = ? WHERE targetId = ?", [trackerName, rows[0].targetId],
                function(err, result) {
                    if(err) {
                        console.log(err);
                    }
                })
            } else {
                bot.channels.cache.get('833859329589379095').send("Invalid target specified! Fuck you!");
            }
        })
    }
    

}