const moment = require("moment");

exports.run = function(message, args, bot, db) {
    db.query("UPDATE meanBot.targets SET windowEnd = ?, windowEnd = ?, tracker = null WHERE isAffectedByQuake = 1;", [moment().toDate(), moment.toDate()],
        function(err, result) {
            if (err) {
                console.error("db error occured: " + err);
            }
            bot.channels.cache.get('833859329589379095').send("Quake started. All windows ended.");
    })
}